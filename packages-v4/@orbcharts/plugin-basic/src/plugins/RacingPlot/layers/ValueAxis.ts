import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { ValueAxisParams, RacingPlotPluginParams } from '../types'
import { DEFAULT_VALUE_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import type { RacingPlotExtendContext } from '../types'
import { createBaseValueAxisRacing } from '../../../baseLayers/BaseValueAxisRacing'

const pluginName = 'RacingPlot'
const layerName = 'ValueAxis'

export const ValueAxis = defineSVGLayer<RacingPlotExtendContext, RacingPlotPluginParams, ValueAxisParams>({
  name: layerName,
  defaultParams: DEFAULT_VALUE_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  initShow: true,
  validator: (params) => {
    return { status: 'success', columnName: '', expectToBe: '' }
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject<void>()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseValueAxisRacing({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      fullParams$: layerParams$,
      position$: pluginParams$.pipe(map(p => p.valueAxis.position)),
      xScale$: context.xScale$,
      containerPosition$: context.gridContainerPosition$,
      containerSize$: context.containerSize$,
      theme$: context.theme$,
      transitionDuration$: pluginParams$.pipe(map(p => p.styles.transitionDuration))
    })

    return () => {
      destroy$.next()
      unsubscribe()
    }
  }
})
