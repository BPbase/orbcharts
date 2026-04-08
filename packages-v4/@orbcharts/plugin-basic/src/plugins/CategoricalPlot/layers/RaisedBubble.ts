import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { CategoricalPlotRaisedBubblesParams, CategoricalPlotPluginParams } from '../types'
import { DEFAULT_CATEGORICAL_PLOT_RAISED_BUBBLES_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { CategoricalPlotExtendContext } from '../types'
import { createBaseRaisedBubble } from '../../../baseLayers/BaseRaisedBubble'

const pluginName = 'CategoricalPlot'
const layerName = 'RaisedBubble'

export const RaisedBubble = defineSVGLayer<CategoricalPlotExtendContext, CategoricalPlotPluginParams, CategoricalPlotRaisedBubblesParams>({
  name: layerName,
  defaultParams: DEFAULT_CATEGORICAL_PLOT_RAISED_BUBBLES_PARAMS,
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
      },
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseRaisedBubble({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      visibleComputedData$: context.visibleComputedData$,
      fullParams$: layerParams$,
      styles$: pluginParams$.pipe(map(params => params.styles)),
      gridHighlight$: context.gridHighlight$,
      containerPosition$: context.gridContainerPosition$,
      containerSize$: context.containerSize$,
      layout$: context.layout$,
      ordinalScale$: context.ordinalScale$,
      valueScale$: context.valueScale$,
      categoryScaleDomainValue$: context.categoryScaleDomainValue$,
      eventTrigger$: context.eventTrigger$
    })

    return () => {
      destroy$.next(undefined)
      unsubscribe()
    }
  }
})
