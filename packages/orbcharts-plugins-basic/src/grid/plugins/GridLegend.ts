import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  Observable,
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '../../../lib/core'
import type { DefinePluginConfig } from '../../../lib/core-types'
import { DEFAULT_GRID_LEGEND_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_INFO } from '../../const'
import { createBaseLegend } from '../../base/BaseLegend'

const pluginName = 'GridLegend'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_GRID_LEGEND_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_GRID_LEGEND_PARAMS,
  layerIndex: LAYER_INDEX_OF_INFO,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
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
      textColorType: {
        toBeOption: 'ColorType',
      }
    })
    return result
  }
}

export const GridLegend = defineGridPlugin(pluginConfig)(({ selection, rootSelection, observer, subject }) => {
  
  const destroy$ = new Subject()

  const seriesLabels$: Observable<string[]> = observer.SeriesDataMap$.pipe(
    takeUntil(destroy$),
    map(data => {
      return Array.from(data.keys())
    })
  )

  // 全部列點矩型使用相同樣式參數
  const fullParams$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(d => {
      const seriesList = [
        {
          listRectWidth: d.listRectWidth,
          listRectHeight: d.listRectHeight,
          listRectRadius: d.listRectRadius,
        }
      ]
      return {
        ...d,
        seriesList
      }
    })
  )

  const unsubscribeBaseLegend = createBaseLegend(pluginName, {
    rootSelection,
    seriesLabels$,
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

