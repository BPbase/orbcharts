import * as d3 from 'd3'
import {
  Subject,
  Observable,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { GridLegendParams, SeriesPlotPluginParams } from '../types'
import { DEFAULT_GRID_LEGEND_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_INFO } from '../../../const/layerIndex'
import { createBaseLegend } from '../../../baseLayers/BaseLegend'
import { defineSVGLayer } from '../../../../../core/src'
import { SeriesPlotExtendContext } from '../types'
import { validateObject } from '../../../../../core/src/utils'

const pluginName = 'SeriesPlot'
const layerName = 'GridLegend'

export const GridLegend = defineSVGLayer<SeriesPlotExtendContext, SeriesPlotPluginParams, GridLegendParams>({
  name: layerName,
  defaultParams: DEFAULT_GRID_LEGEND_PARAMS,
  layerIndex: LAYER_INDEX_OF_INFO,
  validator: (params) => {
    const result = validateObject(params, {
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
      textColorType: {
        toBeOption: 'ColorType',
      }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    // 全部列點矩型使用相同樣式參數
    const baseLegendParams$ = layerParams$.pipe(
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
          labelList: seriesList
        }
      })
    )

    // const rootSelection = d3.select(`svg.orbcharts-${pluginName}__svg`)
    const rootSelection = d3.select(svgG.parentElement)

    const unsubscribeBaseLegend = createBaseLegend({
      rootSelection,
      pluginName,
      layerName,
      legendLabels$: context.seriesLabels$,
      baseLegendParams$,
      layout$: context.layout$,
      theme$: context.theme$,
      fontSizePx$: context.fontSizePx$,
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseLegend()
    }
  }
})
