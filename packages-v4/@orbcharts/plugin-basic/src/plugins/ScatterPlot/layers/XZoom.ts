import * as d3 from 'd3'
import {
  map,
  Subject
} from 'rxjs'
import type { ScatterPlotPluginParams, ScatterPlotExtendContext, ScatterPlotXZoomParams, ComputedXYDataMultivariate } from '../types'
import { defineSVGLayer } from '@orbcharts/core'
// import { validateObject } from '@orbcharts/core'
import { DEFAULT_SCATTER_PLOT_X_ZOOM_PARAMS } from "../defaults"
import { LAYER_INDEX_OF_AUX, LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { createBaseXZoom } from '../../../baseLayers/BaseXZoom'

const pluginName = 'ScatterPlot'
const layerName = 'XZoom'

export const XZoom = defineSVGLayer<ScatterPlotExtendContext, ScatterPlotPluginParams, ScatterPlotXZoomParams>({
  name: layerName,
  defaultParams: DEFAULT_SCATTER_PLOT_X_ZOOM_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  initShow: false,
  validator: (params) => {
    return {
      status: 'success',
      columnName: '',
      expectToBe: ''
    }
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

    const destroy$ = new Subject()

    const unsubscribeBaseXZoom = createBaseXZoom({
      rootSelection: d3.select(context.svg),
      pluginName,
      layerName,
      initXAxis$: pluginParams$.pipe(map(params => params.xAxis)),
      initYAxis$: pluginParams$.pipe(map(params => params.yAxis)),
      xyMinMax$: context.xyMinMax$,
      layout$: context.layout$,
      eventTrigger$: context.eventTrigger$,
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseXZoom()
    }
  }
})