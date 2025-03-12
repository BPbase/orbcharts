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
import type { DefinePluginConfig } from '../../../lib/core-types'
import type { ContextObserverMultiGrid, DataFormatterGrid, DataFormatterTypeMap, Layout } from '../../../lib/core-types'
import {
  defineMultiGridPlugin } from '../../../lib/core'
import { DEFAULT_OVERLAPPING_STACKED_VALUE_AXES_PARAMS } from '../defaults'
import { createBaseValueAxis } from '../../base/BaseValueAxis'
import { multiGridPluginDetailObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
import { gridAxesTransformObservable, gridAxesReverseTransformObservable, gridContainerPositionObservable } from '../../../lib/gridObservables'
// import { gridAxesTransformObservable, gridAxesReverseTransformObservable, gridContainerPositionObservable } from '@orbcharts/core/src'
import { LAYER_INDEX_OF_AXIS } from '../../const'

const pluginName = 'OverlappingStackedValueAxes'

const gridClassName = getClassName(pluginName, 'grid')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_OVERLAPPING_STACKED_VALUE_AXES_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_OVERLAPPING_STACKED_VALUE_AXES_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      firstAxis: {
        toBeTypes: ['object']
      },
      secondAxis: {
        toBeTypes: ['object']
      },
      gridIndexes: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value) && value.length === 2
        }
      }
    })
    if (params.firstAxis) {
      const firstAxisResult = validateColumns(params.firstAxis, {
        labelOffset: {
          toBe: '[number, number]',
          test: (value: any) => {
            return Array.isArray(value)
              && value.length === 2
              && typeof value[0] === 'number'
              && typeof value[1] === 'number'
          }
        },
        labelColorType: {
          toBeOption: 'ColorType',
        },
        axisLineVisible: {
          toBeTypes: ['boolean']
        },
        axisLineColorType: {
          toBeOption: 'ColorType',
        },
        ticks: {
          toBeTypes: ['number']
        },
        tickFormat: {
          toBeTypes: ['string', 'Function']
        },
        tickLineVisible: {
          toBeTypes: ['boolean']
        },
        tickPadding: {
          toBeTypes: ['number']
        },
        tickFullLine: {
          toBeTypes: ['boolean']
        },
        tickFullLineDasharray: {
          toBeTypes: ['string']
        },
        tickColorType: {
          toBeOption: 'ColorType',
        },
        tickTextRotate: {
          toBeTypes: ['number']
        },
        tickTextColorType: {
          toBeOption: 'ColorType',
        }
      })
      if (firstAxisResult.status === 'error') {
        return firstAxisResult
      }
    }
    if (params.secondAxis) {
      const secondAxisResult = validateColumns(params.secondAxis, {
        labelOffset: {
          toBe: '[number, number]',
          test: (value: any) => {
            return Array.isArray(value)
              && value.length === 2
              && typeof value[0] === 'number'
              && typeof value[1] === 'number'
          }
        },
        labelColorType: {
          toBeOption: 'ColorType',
        },
        axisLineVisible: {
          toBeTypes: ['boolean']
        },
        axisLineColorType: {
          toBeOption: 'ColorType',
        },
        ticks: {
          toBeTypes: ['number']
        },
        tickFormat: {
          toBeTypes: ['string', 'Function']
        },
        tickLineVisible: {
          toBeTypes: ['boolean']
        },
        tickPadding: {
          toBeTypes: ['number']
        },
        tickFullLine: {
          toBeTypes: ['boolean']
        },
        tickFullLineDasharray: {
          toBeTypes: ['string']
        },
        tickColorType: {
          toBeOption: 'ColorType',
        },
        tickTextRotate: {
          toBeTypes: ['number']
        },
        tickTextColorType: {
          toBeOption: 'ColorType',
        }
      })
      if (secondAxisResult.status === 'error') {
        return secondAxisResult
      }
    }
    return result
  }
}

// 第一個圖軸使用堆疊的資料，第二個圖軸使用原始資料
export const OverlappingStackedValueAxes = defineMultiGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
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
      const position = data.fullDataFormatter.gridList[data.firstGridIndex].valueAxis.position
      // 反轉第二個valueAxis的位置
      let reversePosition = position
      if (position === 'left') {
        reversePosition = 'right'
      } else if (position === 'bottom') {
        reversePosition = 'top'
      } else if (position === 'top') {
        reversePosition = 'bottom'
      } else if (position === 'right') {
        reversePosition = 'left'
      }
      return <DataFormatterGrid>{
        type: 'grid',
        visibleFilter: data.fullDataFormatter.visibleFilter as any,
        // grid: {
          ...data.fullDataFormatter.gridList[data.secondGridIndex],
          valueAxis: {
            ...data.fullDataFormatter.gridList[data.secondGridIndex].valueAxis,
            position: reversePosition
          },
        // },
        container: {
          ...data.fullDataFormatter.container
        }
      }
    })
  )

  const multiGridPluginDetail$ = of(observer).pipe(
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
    switchMap(observer => multiGridPluginDetailObservables(observer)),
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
          dataFormatter$: secondGridDataFormatter$,
          gridAxesTransform$,
          gridAxesReverseTransform$,
          gridContainerPosition$,
        }
      })
    })
  )

  multiGridPluginDetail$
    .pipe(
      takeUntil(destroy$)
    )
    .subscribe(data => {
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
            computedData$: i === 0 ? d.computedStackedData$ : d.computedData$, // 第一個圖軸計算疊加value的資料
            filteredMinMaxValue$: d.filteredMinMaxValue$,
            fullParams$: observer.fullParams$.pipe(
              map(fullParams => i === 0 ? fullParams.firstAxis : fullParams.secondAxis)
            ),
            fullDataFormatter$: d.dataFormatter$,
            fullChartParams$: observer.fullChartParams$,  
            gridAxesTransform$: d.gridAxesTransform$,
            gridAxesReverseTransform$: d.gridAxesReverseTransform$,
            gridAxesSize$: d.gridAxesSize$,
            gridContainerPosition$: d.gridContainerPosition$,
            isSeriesSeprate$: d.isSeriesSeprate$,
          })
        })
    })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
