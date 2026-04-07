import * as d3 from 'd3'
import {
  Subject,
  Observable,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { GridPlotValueAxisParams, GridPlotPluginParams } from '../types'
import { DEFAULT_VALUE_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import { GridPlotExtendContext } from '../types'
import { validateObject } from '@orbcharts/core'
import { createBaseValueAxis } from '../../../baseLayers/BaseValueAxis'

const pluginName = 'GridPlot'
const layerName = 'ValueAxis'

export const ValueAxis = defineSVGLayer<GridPlotExtendContext, GridPlotPluginParams, GridPlotValueAxisParams>({
  name: layerName,
  defaultParams: DEFAULT_VALUE_AXIS_PARAMS,
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
      computedData$: context.computedData$,
      filteredMinMaxValue$: context.filteredMinMaxValue$,
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