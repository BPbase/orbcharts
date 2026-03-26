import * as d3 from 'd3'
import {
  Subject,
  Observable,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { StackedValueAxisParams, SeriesPlotPluginParams } from '../types'
import { DEFAULT_STACKED_VALUE_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { defineSVGLayer } from '../../../../../core/src'
import { SeriesPlotExtendContext } from '../types'
import { validateObject } from '../../../../../core/src/utils'
import { createBaseValueAxis } from '../../../baseLayers/BaseValueAxis'

const pluginName = 'SeriesPlot'
const layerName = 'StackedValueAxis'

export const StackedValueAxis = defineSVGLayer<SeriesPlotExtendContext, SeriesPlotPluginParams, StackedValueAxisParams>({
  name: layerName,
  defaultParams: DEFAULT_STACKED_VALUE_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  initShow: false,
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
      tickTextRotate: {
        toBeTypes: ['number']
      },
      tickTextColorType: {
        toBeOption: 'ColorType',
      }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
  
    const destroy$ = new Subject()

    context.layout$
      .pipe(
        takeUntil(destroy$)
      )
      .subscribe(layout => {
        d3.select(svgG)
          .attr('transform', `translate(${layout.left}, ${layout.top})`)
      })

    const unsubscribeBaseValueAxis = createBaseValueAxis({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedStackedData$, // 計算疊加value的資料
      filteredMinMaxValue$: context.filteredStackedMinMaxValue$,
      baseValueAxisParams$: layerParams$,
      categoryAxis$: pluginParams$.pipe(map(params => params.categoryAxis)),
      valueAxis$: pluginParams$.pipe(map(params => params.valueAxis)),
      theme$: context.theme$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridAxesReverseTransform$: context.gridAxesReverseTransform$,
      gridAxesSize$: context.gridAxesSize$,
      gridContainerPosition$: context.gridContainerPosition$,
      isSeriesSeprate$: context.isSeriesSeprate$,
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseValueAxis()
    }
  }
})