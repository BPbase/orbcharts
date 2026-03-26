import * as d3 from 'd3'
import {
  combineLatest,
  of,
  map,
  switchMap,
  debounceTime,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject,
  iif
} from 'rxjs'
import type { ScatterPlotPluginParams, ScatterPlotExtendContext, XYAxesParams, ComputedXYDataMultivariate } from '../types'
import { defineSVGLayer } from "../../../../../core/src"
import { validateObject } from '../../../../../core/src/utils'
import { DEFAULT_X_Y_AUX_PARAMS, DEFAULT_X_Y_AXES_PARAMS } from "../defaults"
import { LAYER_INDEX_OF_AUX, LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { createBaseXAxis } from '../../../baseLayers/BaseXAxis'
import { createBaseYAxis } from '../../../baseLayers/BaseYAxis'

const pluginName = 'ScatterPlot'
const layerName = 'XYAxes'

export const XYAxes = defineSVGLayer<ScatterPlotExtendContext, ScatterPlotPluginParams, XYAxesParams>({
  name: layerName,
  defaultParams: DEFAULT_X_Y_AXES_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      xAxis: {
        toBeTypes: ['object']
      },
      yAxis: {
        toBeTypes: ['object']
      }
    })
    if (params.xAxis) {
      const forceResult = validateObject(params.xAxis, {
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
      if (forceResult.status === 'error') {
        return forceResult
      }
    }
    if (params.yAxis) {
      const forceResult = validateObject(params.yAxis, {
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
      if (forceResult.status === 'error') {
        return forceResult
      }
    }
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

    const xAxisFullParams$ = layerParams$.pipe(
      takeUntil(destroy$),
      map(layerParams => layerParams.xAxis),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    )

    const yAxisFullParams$ = layerParams$.pipe(
      takeUntil(destroy$),
      map(layerParams => layerParams.yAxis),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    )

    const unsubscribeBaseXAxis = createBaseXAxis({
      selection: d3.select(svgG),
      pluginName,
      layerName: `${layerName}-x`,
      position$: of('bottom'),
      transitionDuration$: of(100),
      computedData$: context.computedData$,
      layerParams$: xAxisFullParams$,
      theme$: context.theme$,
      xAxis$: context.zoomedXAxis$,
      isSeriesSeprate$: context.isSeriesSeprate$,
      containerPosition$: context.containerPosition$,
      // layout$: context.layout$,
      containerSize$: context.containerSize$,
      xScale$: context.xScale$,
      // filteredXYMinMaxData$: context.filteredXYMinMaxData$,
      // xyMinMax$: context.xyMinMax$,
    })

    const unsubscribeBaseYAxis = createBaseYAxis({
      selection: d3.select(svgG),
      pluginName,
      layerName: `${layerName}-y`,
      computedData$: context.computedData$,
      layerParams$: yAxisFullParams$,
      theme$: context.theme$,
      yAxis$: context.yAxis$,
      isSeriesSeprate$: context.isSeriesSeprate$,
      containerPosition$: context.containerPosition$,
      containerSize$: context.containerSize$,
      yScale$: context.yScale$,
      // filteredXYMinMaxData$: context.filteredXYMinMaxData$,
      // xyMinMax$: context.xyMinMax$,
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseXAxis()
      unsubscribeBaseYAxis()
    }
  }
})