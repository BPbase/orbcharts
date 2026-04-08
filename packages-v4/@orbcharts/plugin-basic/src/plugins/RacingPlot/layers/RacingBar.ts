import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { RacingPlotRacingBarParams, RacingPlotPluginParams } from '../types'
import { DEFAULT_RACING_PLOT_RACING_BAR_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import type { RacingPlotExtendContext } from '../types'
import { createBaseRacingBar } from '../../../baseLayers/BaseRacingBar'
import { validateObject } from '@orbcharts/core'

const pluginName = 'RacingPlot'
const layerName = 'RacingBar'

export const RacingBar = defineSVGLayer<RacingPlotExtendContext, RacingPlotPluginParams, RacingPlotRacingBarParams>({
  name: layerName,
  defaultParams: DEFAULT_RACING_PLOT_RACING_BAR_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      barWidth: {
        toBeTypes: ['number', 'null']
      },
      barPadding: {
        toBeTypes: ['number']
      },
      barRadius: {
        toBeTypes: ['number', 'boolean']
      }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject<void>()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseRacingBar({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      racingRankedSeriesData$: context.racingRankedSeriesData$,
      currentFrameIndex$: context.currentFrameIndex$,
      fullParams$: layerParams$,
      styles$: pluginParams$.pipe(map(p => p.styles)),
      gridHighlight$: context.gridHighlight$,
      rankedItemHeight$: context.rankedItemHeight$,
      rankedScaleList$: context.rankedScaleList$,
      containerPosition$: context.gridContainerPosition$,
      containerSize$: context.containerSize$,
      layout$: context.layout$,
      xScale$: context.xScale$,
      theme$: context.theme$,
      eventTrigger$: context.eventTrigger$
    })

    return () => {
      destroy$.next()
      unsubscribe()
    }
  }
})
