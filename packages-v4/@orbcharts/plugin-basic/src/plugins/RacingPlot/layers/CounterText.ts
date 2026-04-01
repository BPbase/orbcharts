import * as d3 from 'd3'
import {
  Subject,
  takeUntil
} from 'rxjs'
import type { CounterTextParams, RacingPlotPluginParams } from '../types'
import { DEFAULT_COUNTER_TEXT_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_LABEL } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import type { RacingPlotExtendContext } from '../types'
import { createBaseCounterText } from '../../../baseLayers/BaseCounterText'

const pluginName = 'RacingPlot'
const layerName = 'CounterText'

export const CounterText = defineSVGLayer<RacingPlotExtendContext, RacingPlotPluginParams, CounterTextParams>({
  name: layerName,
  defaultParams: DEFAULT_COUNTER_TEXT_PARAMS,
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

    const unsubscribe = createBaseCounterText({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      currentFrameIndex$: context.currentFrameIndex$,
      currentFrameLabel$: context.currentFrameLabel$,
      fullParams$: layerParams$,
      containerPosition$: context.gridContainerPosition$,
      containerSize$: context.containerSize$
    })

    return () => {
      destroy$.next()
      unsubscribe()
    }
  }
})
