import * as d3 from 'd3'
import {
  of,
  map,
  switchMap,
  combineLatest,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  iif,
  Observable,
  Subject } from 'rxjs'
import type { ContextObserverMultiGrid, DataFormatterGrid, DataFormatterTypeMap, Layout } from '@orbcharts/core'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DEFAULT_OVERLAPPING_VALUE_AXES_PARAMS } from '../defaults'
import { createBaseValueAxis } from '../../base/BaseValueAxis'
import { multiGridPluginObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
import { gridAxesTransformObservable, gridAxesReverseTransformObservable, gridContainerPositionObservable } from '@orbcharts/core/src/grid/gridObservables'

const pluginName = 'OverlappingValueAxes'

const gridClassName = getClassName(pluginName, 'grid')

export const OverlappingValueAxes = defineMultiGridPlugin(pluginName, DEFAULT_OVERLAPPING_VALUE_AXES_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeFnArr: (() => void)[] = []

  const firstGridIndex$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(fullParams => fullParams.gridIndexes[0])
  )

  const secondGridIndex$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(fullParams => fullParams.gridIndexes[1])
  )

  // 為了要反轉第二個valueAxis的位置所以要重新計算
  const secondGridDataFormatter$: Observable<DataFormatterGrid> = combineLatest({
    firstGridIndex: firstGridIndex$,
    secondGridIndex: secondGridIndex$,
    fullDataFormatter: observer.fullDataFormatter$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      if (!data.fullDataFormatter.gridList[data.secondGridIndex]) {
        data.fullDataFormatter.gridList[data.secondGridIndex] = Object.assign({}, data.fullDataFormatter.gridList[data.firstGridIndex])
      }
      // 反轉第二個valueAxis的位置
      let reversePosition = ''
      if (data.fullDataFormatter.gridList[data.firstGridIndex].valueAxis.position === 'left') {
        reversePosition = 'right'
      } else if (data.fullDataFormatter.gridList[data.firstGridIndex].valueAxis.position === 'bottom') {
        reversePosition = 'top'
      } else if (data.fullDataFormatter.gridList[data.firstGridIndex].valueAxis.position === 'top') {
        reversePosition = 'bottom'
      } else if (data.fullDataFormatter.gridList[data.firstGridIndex].valueAxis.position === 'right') {
        reversePosition = 'left'
      }
      return <DataFormatterGrid>{
        type: 'grid',
        visibleFilter: data.fullDataFormatter.visibleFilter as any,
        grid: {
          ...data.fullDataFormatter.gridList[data.secondGridIndex],
          valueAxis: {
            ...data.fullDataFormatter.gridList[data.secondGridIndex].valueAxis,
            position: reversePosition
          }
        },
        container: {
          ...data.fullDataFormatter.container
        }
      }
    })
  )

  const multiGridPlugin$ = of(observer).pipe(
    takeUntil(destroy$),
    map(observer => {
      // 將observer的gridIndexes限制在2個
      return {
        ...observer,
        fullParams$: observer.fullParams$.pipe(
          map(fullParams => {
            if (fullParams.gridIndexes.length > 2) {
              fullParams.gridIndexes.length = 2
            }
            return fullParams
          })
        )
      }
    }),
    switchMap(observer => multiGridPluginObservables(observer)),
    map(data => {
      return data.map((observables, index) => {
        if (index === 0) {
          return observables
        }
        // index === 1，將跟第二個valueAxis有關的observables全部重新計算
        const gridAxesTransform$ = gridAxesTransformObservable({
          fullDataFormatter$: secondGridDataFormatter$,
          layout$: observer.layout$
        })
        const gridAxesReverseTransform$ = gridAxesReverseTransformObservable({
          gridAxesTransform$
        })
        const gridContainerPosition$ = gridContainerPositionObservable({
          computedData$: observables.computedData$,
          fullDataFormatter$: secondGridDataFormatter$,
          layout$: observer.layout$
        })
        return {
          ...observables,
          gridAxesTransform$,
          gridAxesReverseTransform$,
          gridContainerPosition$,
        }
      })
    })
  )

  multiGridPlugin$.subscribe(data => {
    // 每次重新計算時，清除之前的訂閱
    unsubscribeFnArr.forEach(fn => fn())

    selection.selectAll(`g.${gridClassName}`)
      .data(data)
      .join('g')
      .attr('class', gridClassName)
      .each((d, i, g) => {
        if (i > 1) {
          return
        }

        const gridSelection = d3.select(g[i])

        const isSeriesSeprate$ = d.dataFormatter$.pipe(
          takeUntil(destroy$),
          map(d => d.grid.separateSeries),
          distinctUntilChanged(),
          shareReplay(1)
        )

        unsubscribeFnArr[i] = createBaseValueAxis(pluginName, {
          selection: gridSelection,
          computedData$: d.computedData$,
          fullParams$: observer.fullParams$.pipe(
            map(fullParams => i === 0 ? fullParams.firstAxis : fullParams.secondAxis)
          ),
          fullDataFormatter$: d.dataFormatter$,
          fullChartParams$: observer.fullChartParams$,  
          gridAxesTransform$: d.gridAxesTransform$,
          gridAxesReverseTransform$: d.gridAxesReverseTransform$,
          gridAxesSize$: d.gridAxesSize$,
          gridContainerPosition$: d.gridContainerPosition$,
          isSeriesSeprate$,
        })
      })
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
