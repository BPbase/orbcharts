import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  Observable,
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineMultiGridPlugin, mergeOptionsWithDefault } from '../../../lib/core'
import { DEFAULT_MULTI_GRID_LEGEND_PARAMS } from '../defaults'
import { createBaseLegend } from '../../base/BaseLegend'
import type { BaseLegendParams } from '../../../lib/plugins-basic-types'
import { LAYER_INDEX_OF_INFO } from '../../const'

const pluginName = 'MultiGridLegend'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_MULTI_GRID_LEGEND_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_MULTI_GRID_LEGEND_PARAMS,
  layerIndex: LAYER_INDEX_OF_INFO,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      placement: {
        toBe: '"top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end"',
        test: (value) => {
          return [
            'top', 'top-start', 'top-end',
            'bottom', 'bottom-start', 'bottom-end',
            'left', 'left-start', 'left-end',
            'right', 'right-start', 'right-end'
          ].includes(value)
        }
      },
      padding: {
        toBeTypes: ['number']
      },
      backgroundFill: {
        toBeOption: 'ColorType',
      },
      backgroundStroke: {
        toBeOption: 'ColorType',
      },
      gap: {
        toBeTypes: ['number']
      },
      listRectWidth: {
        toBeTypes: ['number']
      },
      listRectHeight: {
        toBeTypes: ['number']
      },
      listRectRadius: {
        toBeTypes: ['number']
      },
      gridList: {
        toBeTypes: ['object[]']
      },
      textColorType: {
        toBeOption: 'ColorType',
      }
    })
    if (params.gridList) {
      const gridListResult = params.gridList.map((grid, gridIndex) => {
        return validateColumns(grid, {
          listRectWidth: {
            toBeTypes: ['number']
          },
          listRectHeight: {
            toBeTypes: ['number']
          },
          listRectRadius: {
            toBeTypes: ['number']
          }
        })
      })
      const errorResult = gridListResult.find(r => r.status === 'error')
      if (errorResult) {
        return errorResult
      }
    }
    return result
  }
}

export const MultiGridLegend = defineMultiGridPlugin(pluginConfig)(({ selection, rootSelection, observer, subject }) => {
  
  const destroy$ = new Subject()

  // const seriesLabels$ = observer.multiGridEachDetail$.pipe(
  //   takeUntil(destroy$),
  //   map(multiGrid => {
  //     const seriesLabelsObservableArr = multiGrid.map((grid, gridIndex) => {
  //       return grid.SeriesDataMap$.pipe(
  //         // grid內的seriesLabels
  //         map(seriesDataMap => Array.from(seriesDataMap.keys()))
  //       )
  //     })
  //     return seriesLabelsObservableArr
  //   }),
  //   switchMap(seriesLabelsObservableArr => combineLatest(seriesLabelsObservableArr)),
  //   map(data => data.flat())
  // )

  const seriesLabels$ = observer.multiGridEachDetail$.pipe(
    map(multiGridEachDetail => multiGridEachDetail.map(grid => grid.seriesLabels$)),
    switchMap(d => {
      return combineLatest(d).pipe(
        switchMap(async d => d),
      )
    }),
    map(data => data.flat())
  )

  const seriesList$ = combineLatest({
    fullParams: observer.fullParams$,
    // multiGrid: observer.multiGridEachDetail$,
    computedData: observer.computedData$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      // grid
      return data.computedData
        .map((gridData, gridIndex) => {
          // 這個grid全部series要套用的圖例列點樣式
          const gridListStyle = mergeOptionsWithDefault(data.fullParams.gridList[gridIndex] ?? {}, {
            listRectWidth: data.fullParams.listRectWidth,
            listRectHeight: data.fullParams.listRectHeight,
            listRectRadius: data.fullParams.listRectRadius,
          })
          // series
          return gridData.map(d => gridListStyle)
        })
        .flat()

    })
  )

  const fullParams$: Observable<BaseLegendParams> = combineLatest({
    fullParams: observer.fullParams$,
    seriesList: seriesList$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(d => {
      return {
        ...d.fullParams,
        labelList: d.seriesList
      }
    })
  )

  const unsubscribeBaseLegend = createBaseLegend(pluginName, {
    rootSelection,
    legendLabels$: seriesLabels$,
    fullParams$,
    layout$: observer.layout$,
    fullChartParams$: observer.fullChartParams$,
    textSizePx$: observer.textSizePx$
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseLegend()
  }
})

