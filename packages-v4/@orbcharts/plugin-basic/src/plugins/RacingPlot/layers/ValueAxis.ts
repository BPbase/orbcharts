import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { RacingPlotValueAxisParams, RacingPlotPluginParams } from '../types'
import { DEFAULT_RACING_PLOT_VALUE_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import type { RacingPlotExtendContext } from '../types'
import { createBaseValueAxisRacing } from '../../../baseLayers/BaseValueAxisRacing'
import { validateObject } from '@orbcharts/core'

const pluginName = 'RacingPlot'
const layerName = 'ValueAxis'

export const ValueAxis = defineSVGLayer<RacingPlotExtendContext, RacingPlotPluginParams, RacingPlotValueAxisParams>({
  name: layerName,
  defaultParams: DEFAULT_RACING_PLOT_VALUE_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      labelOffset: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      },
      labelColorType: {
        toBeOption: 'ColorType',
      },
      axisLineVisible: {
        toBeTypes: ['boolean']
      },
      axisLineColorType: {
        toBeOption: 'ColorType',
      },
      ticks: {
        toBeTypes: ['number', 'null']
      },
      tickFormat: {
        toBeTypes: ['string', 'Function']
      },
      tickLineVisible: {
        toBeTypes: ['boolean']
      },
      tickPadding: {
        toBeTypes: ['number']
      },
      tickFullLine: {
        toBeTypes: ['boolean']
      },
      tickFullLineDasharray: {
        toBeTypes: ['string']
      },
      tickColorType: {
        toBeOption: 'ColorType',
      },
      tickTextColorType: {
        toBeOption: 'ColorType',
      }
    })
    return result
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
