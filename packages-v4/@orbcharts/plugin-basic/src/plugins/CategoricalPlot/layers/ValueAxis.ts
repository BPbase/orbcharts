import * as d3 from 'd3'
import {
  Subject,
  of,
  map,
  takeUntil
} from 'rxjs'
import type { CategoricalPlotValueAxisParams, CategoricalPlotPluginParams } from '../types'
import { DEFAULT_CATEGORICAL_PLOT_VALUE_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { CategoricalPlotExtendContext } from '../types'
import { createBaseValueAxis } from '../../../baseLayers/BaseValueAxis'

const pluginName = 'CategoricalPlot'
const layerName = 'ValueAxis'

export const ValueAxis = defineSVGLayer<CategoricalPlotExtendContext, CategoricalPlotPluginParams, CategoricalPlotValueAxisParams>({
  name: layerName,
  defaultParams: DEFAULT_CATEGORICAL_PLOT_VALUE_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      labelOffset: {
        toBe: '[number, number]',
        test: (value: any) => Array.isArray(value) && value.length === 2
          && typeof value[0] === 'number' && typeof value[1] === 'number'
      },
      labelColorType: { toBeOption: 'ColorType' },
      axisLineVisible: { toBeTypes: ['boolean'] },
      axisLineColorType: { toBeOption: 'ColorType' },
      ticks: { toBeTypes: ['number', 'null'] },
      tickFormat: { toBeTypes: ['string', 'Function'] },
      tickLineVisible: { toBeTypes: ['boolean'] },
      tickPadding: { toBeTypes: ['number'] },
      tickFullLine: { toBeTypes: ['boolean'] },
      tickFullLineDasharray: { toBeTypes: ['string'] },
      tickColorType: { toBeOption: 'ColorType' },
      tickTextRotate: { toBeTypes: ['number'] },
      tickTextColorType: { toBeOption: 'ColorType' }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseValueAxis({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      filteredMinMaxValue$: context.filteredMinMaxValue$,
      baseValueAxisParams$: layerParams$,
      categoryAxis$: context.zoomedCategoryAxis$,
      // 'position' in pluginParams controls which side the value axis appears on (left or right)
      valueAxis$: pluginParams$.pipe(map(params => ({ ...params.valueAxis, position: params.position }))),
      theme$: context.theme$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridAxesReverseTransform$: context.gridAxesReverseTransform$,
      gridAxesSize$: context.gridAxesSize$,
      gridContainerPosition$: context.gridContainerPosition$,
      isSeriesSeprate$: of(false)
    })

    return () => {
      destroy$.next(undefined)
      unsubscribe()
    }
  }
})
