import * as d3 from 'd3'
import {
  of,
  map,
  switchMap,
  combineLatest,
  takeUntil,
  iif,
  Observable,
  Subject } from 'rxjs'
import type { ContextObserverMultiGrid, DataFormatterGrid } from '@orbcharts/core'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DEFAULT_OVERLAPPING_VALUE_AXES_PARAMS } from '../defaults'
import { createBaseValueAxis } from '../../base/BaseValueAxis'
import { multiGridDetailObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
// @Q@
import { gridAxesTransformObservable, gridAxesReverseTransformObservable, gridContainerObservable } from '@orbcharts/core/src/grid/gridObservables'

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
    secondGridIndex: secondGridIndex$
  }).pipe(
    takeUntil(destroy$),
    switchMap(data => {
      return observer.fullDataFormatter$.pipe(
        takeUntil(destroy$),
        map(fullDataFormatter => {
          if (!fullDataFormatter.gridList[data.secondGridIndex]) {
            fullDataFormatter.gridList[data.secondGridIndex] = Object.assign({}, fullDataFormatter.gridList[data.firstGridIndex])
          }
          // 反轉第二個valueAxis的位置
          let reversePosition = ''
          if (fullDataFormatter.gridList[data.firstGridIndex].valueAxis.position === 'left') {
            reversePosition = 'right'
          } else if (fullDataFormatter.gridList[data.firstGridIndex].valueAxis.position === 'bottom') {
            reversePosition = 'top'
          } else if (fullDataFormatter.gridList[data.firstGridIndex].valueAxis.position === 'top') {
            reversePosition = 'bottom'
          } else if (fullDataFormatter.gridList[data.firstGridIndex].valueAxis.position === 'right') {
            reversePosition = 'left'
          }
          console.log('reversePosition', reversePosition)
          return <DataFormatterGrid>{
            type: 'grid',
            grid: {
              ...fullDataFormatter.gridList[data.secondGridIndex],
              valueAxis: {
                ...fullDataFormatter.gridList[data.secondGridIndex].valueAxis,
                position: reversePosition
              }
            },
            container: {
              ...fullDataFormatter.container
            }
          }
        })
      )
    }),
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
    switchMap(observer => multiGridDetailObservables(observer)),
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
        const gridContainer$ = gridContainerObservable({
          computedData$: observables.gridComputedData$,
          fullDataFormatter$: secondGridDataFormatter$,
          fullChartParams$: observer.fullChartParams$,
          layout$: observer.layout$
        })
        return {
          ...observables,
          gridAxesTransform$,
          gridAxesReverseTransform$,
          gridContainer$,
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

        unsubscribeFnArr[i] = createBaseValueAxis(pluginName, {
          selection: gridSelection,
          computedData$: d.gridComputedData$,
          fullParams$: observer.fullParams$.pipe(
            map(fullParams => i === 0 ? fullParams.firstAxis : fullParams.secondAxis)
          ),
          fullDataFormatter$: d.gridDataFormatter$,
          fullChartParams$: observer.fullChartParams$,  
          gridAxesTransform$: d.gridAxesTransform$,
          gridAxesReverseTransform$: d.gridAxesReverseTransform$,
          gridAxesSize$: d.gridAxesSize$,
          gridContainer$: d.gridContainer$,
          isSeriesPositionSeprate$: d.isSeriesPositionSeprate$,
        })
      })
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
