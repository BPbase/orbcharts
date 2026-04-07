import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { RankedPlotRankedBubbleParams, RankedPlotPluginParams } from '../types'
import { DEFAULT_RANKED_PLOT_RANKED_BUBBLE_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { RankedPlotExtendContext } from '../types'
import { createBaseRankedBubble } from '../../../baseLayers/BaseRankedBubble'

const pluginName = 'RankedPlot'
const layerName = 'RankedBubble'

export const RankedBubble = defineSVGLayer<RankedPlotExtendContext, RankedPlotPluginParams, RankedPlotRankedBubbleParams>({
  name: layerName,
  defaultParams: DEFAULT_RANKED_PLOT_RANKED_BUBBLE_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      sizeAdjust: {
        toBeTypes: ['number']
      },
      arcScaleType: {
        toBe: '"area" | "radius"',
        test: (value: any) => {
          return value === 'area' || value === 'radius'
        }
      },
      valueLinearOpacity: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      },
      showZeroValue: {
        toBeTypes: ['boolean']
      }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseRankedBubble({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      rankedSeriesData$: context.rankedSeriesData$,
      CategoryDataMap$: context.CategoryDataMap$,
      fullParams$: layerParams$,
      styles$: pluginParams$.pipe(map(params => params.styles)),
      gridHighlight$: context.gridHighlight$,
      rankingItemHeight$: context.rankedItemHeight$,
      rankingScaleList$: context.rankedScaleList$,
      containerPosition$: context.gridContainerPosition$,
      containerSize$: context.containerSize$,
      layout$: context.layout$,
      ordinalScale$: context.ordinalScale$,
      eventTrigger$: context.eventTrigger$
    })

    return () => {
      destroy$.next(undefined)
      unsubscribe()
    }
  }
})
