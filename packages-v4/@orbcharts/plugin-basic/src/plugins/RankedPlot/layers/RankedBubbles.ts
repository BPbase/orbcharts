import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { RankedBubblesParams, RankedPlotPluginParams } from '../types'
import { DEFAULT_RANKED_BUBBLES_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { RankedPlotExtendContext } from '../types'
import { createBaseRankedBubbles } from '../../../baseLayers/BaseRankedBubbles'

const pluginName = 'RankedPlot'
const layerName = 'RankedBubbles'

export const RankedBubbles = defineSVGLayer<RankedPlotExtendContext, RankedPlotPluginParams, RankedBubblesParams>({
  name: layerName,
  defaultParams: DEFAULT_RANKED_BUBBLES_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: true,
  validator: (params) => {
    return { status: 'success', columnName: '', expectToBe: '' }
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseRankedBubbles({
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
