import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { RankedSeriesAxisParams, RankedPlotPluginParams } from '../types'
import { DEFAULT_RANKED_SERIES_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { RankedPlotExtendContext } from '../types'
import { createBaseRankedSeriesAxis } from '../../../baseLayers/BaseRankedSeriesAxis'

const pluginName = 'RankedPlot'
const layerName = 'RankedSeriesAxis'

export const RankedSeriesAxis = defineSVGLayer<RankedPlotExtendContext, RankedPlotPluginParams, RankedSeriesAxisParams>({
  name: layerName,
  defaultParams: DEFAULT_RANKED_SERIES_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  initShow: true,
  validator: (params) => {
    return { status: 'success', columnName: '', expectToBe: '' }
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseRankedSeriesAxis({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      rankedSeriesData$: context.rankedSeriesData$,
      fullParams$: layerParams$,
      styles$: pluginParams$.pipe(map(params => params.styles)),
      rankingAxisLabel$: pluginParams$.pipe(map(params => params.rankedAxis.label)),
      rankingScaleList$: context.rankedScaleList$,
      containerPosition$: context.gridContainerPosition$,
      containerSize$: context.containerSize$,
      theme$: context.theme$
    })

    return () => {
      destroy$.next(undefined)
      unsubscribe()
    }
  }
})
