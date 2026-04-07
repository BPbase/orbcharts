import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { RacingPlotValueLabelParams, RacingPlotPluginParams } from '../types'
import { DEFAULT_RACING_PLOT_VALUE_LABEL_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_LABEL } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import type { RacingPlotExtendContext } from '../types'
import { createBaseRacingValueLabel } from '../../../baseLayers/BaseRacingValueLabel'

const pluginName = 'RacingPlot'
const layerName = 'ValueLabel'

export const ValueLabel = defineSVGLayer<RacingPlotExtendContext, RacingPlotPluginParams, RacingPlotValueLabelParams>({
  name: layerName,
  defaultParams: DEFAULT_RACING_PLOT_VALUE_LABEL_PARAMS,
  layerIndex: LAYER_INDEX_OF_LABEL,
  initShow: true,
  validator: (params) => {
    return { status: 'success', columnName: '', expectToBe: '' }
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject<void>()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseRacingValueLabel({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      racingRankedSeriesData$: context.racingRankedSeriesData$,
      currentFrameIndex$: context.currentFrameIndex$,
      fullParams$: layerParams$,
      styles$: pluginParams$.pipe(map(p => p.styles)),
      gridHighlight$: context.gridHighlight$,
      rankedScaleList$: context.rankedScaleList$,
      containerPosition$: context.gridContainerPosition$,
      containerSize$: context.containerSize$,
      xScale$: context.xScale$,
      theme$: context.theme$
    })

    return () => {
      destroy$.next()
      unsubscribe()
    }
  }
})
