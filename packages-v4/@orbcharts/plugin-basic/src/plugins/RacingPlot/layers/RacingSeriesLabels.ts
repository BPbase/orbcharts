import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { RacingSeriesLabelsParams, RacingPlotPluginParams } from '../types'
import { DEFAULT_RACING_SERIES_LABELS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_LABEL } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import type { RacingPlotExtendContext } from '../types'
import { createBaseRacingSeriesLabels } from '../../../baseLayers/BaseRacingSeriesLabels'

const pluginName = 'RacingPlot'
const layerName = 'RacingSeriesLabels'

export const RacingSeriesLabels = defineSVGLayer<RacingPlotExtendContext, RacingPlotPluginParams, RacingSeriesLabelsParams>({
  name: layerName,
  defaultParams: DEFAULT_RACING_SERIES_LABELS_PARAMS,
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

    const unsubscribe = createBaseRacingSeriesLabels({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      racingRankedSeriesData$: context.racingRankedSeriesData$,
      currentFrameIndex$: context.currentFrameIndex$,
      xScale$: context.xScale$,
      fullParams$: layerParams$,
      styles$: pluginParams$.pipe(map(p => p.styles)),
      rankingAxisLabel$: pluginParams$.pipe(map(p => p.rankedAxis.label)),
      rankedScaleList$: context.rankedScaleList$,
      containerPosition$: context.gridContainerPosition$,
      containerSize$: context.containerSize$,
      theme$: context.theme$
    })

    return () => {
      destroy$.next()
      unsubscribe()
    }
  }
})
