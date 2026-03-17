import * as d3 from 'd3'
import { map, Subject } from 'rxjs'
import type { LinesParams, GridSeparableGraphicPluginParams } from '../types'
import { defineSVGLayer } from '../../../../../core/src'
import { GridSeparableGraphicExtendContext } from '../types'
import { validateObject } from '../../../../../core/src/utils'
import { DEFAULT_LINES_PARAMS } from '../defaults'
import { createBaseLines } from '../baseLayers/BaseLines'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'

const pluginName = 'GridSeparableGraphic'
const layerName = 'Lines'

export const Lines = defineSVGLayer<GridSeparableGraphicExtendContext, GridSeparableGraphicPluginParams, LinesParams>({
  name: layerName,
  defaultParams: DEFAULT_LINES_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params) => {
    const result = validateObject(params, {
      lineCurve: {
        toBeTypes: ['string']
      },
      lineWidth: {
        toBeTypes: ['number']
      },
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

    const destroy$ = new Subject()

    const unsubscribeBaseBars = createBaseLines({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      // computedAxesData$: context.computedAxesData$,
      // visibleComputedData$: context.visibleComputedData$,
      visibleComputedAxesData$: context.visibleComputedAxesData$,
      seriesLabels$: context.seriesLabels$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: context.CategoryDataMap$,
      baseLinesParams$: layerParams$,
      pluginParams$,
      styles$: pluginParams$.pipe(
        map(params => params.styles),
      ),
      gridAxesTransform$: context.gridAxesTransform$,
      gridGraphicTransform$: context.gridGraphicTransform$,
      gridAxesSize$: context.gridAxesSize$,
      gridHighlight$: context.gridHighlight$,
      gridContainerPosition$: context.gridContainerPosition$,
      allContainerPosition$: context.gridContainerPosition$,
      layout$: context.layout$,
      eventTrigger$: context.eventTrigger$
    })


    return () => {
      destroy$.next(undefined)
      unsubscribeBaseBars()
    }
  }
})