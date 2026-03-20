import * as d3 from 'd3'
import {
  Subject,
  Observable,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { GridTooltipParams, SeriesPlotPluginParams } from '../types'
import { DEFAULT_GRID_TOOLTIP_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_TOOLTIP } from '../../../const/layerIndex'
import { createBaseTooltip } from '../../../baseLayers/BaseTooltip'
import { defineSVGLayer } from '../../../../../core/src'
import { SeriesPlotExtendContext } from '../types'
import { validateObject } from '../../../../../core/src/utils'

const pluginName = 'SeriesPlot'
const layerName = 'GridTooltip'

export const GridTooltip = defineSVGLayer<SeriesPlotExtendContext, SeriesPlotPluginParams, GridTooltipParams>({
  name: layerName,
  defaultParams: DEFAULT_GRID_TOOLTIP_PARAMS,
  layerIndex: LAYER_INDEX_OF_TOOLTIP,
  validator: (params) => {
    const result = validateObject(params, {
      backgroundColorType: {
        toBeOption: 'ColorType',
      },
      backgroundOpacity: {
        toBeTypes: ['number']
      },
      strokeColorType: {
        toBeOption: 'ColorType',
      },
      offset: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      },
      padding: {
        toBeTypes: ['number']
      },
      textColorType: {
        toBeOption: 'ColorType',
      },
      renderFn: {
        toBeTypes: ['Function']
      },
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    // const rootSelection = d3.select(`svg.orbcharts-${pluginName}__svg`)
    const rootSelection = d3.select(svgG.parentElement)

    const unsubscribeBaseTooltip = createBaseTooltip({
      rootSelection,
      pluginName,
      layerName,
      layout$: context.layout$,
      theme$: context.theme$,
      eventTrigger$: context.eventTrigger$,
      baseTooltipParams$: layerParams$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: context.CategoryDataMap$,
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseTooltip()
    }
  }
})
