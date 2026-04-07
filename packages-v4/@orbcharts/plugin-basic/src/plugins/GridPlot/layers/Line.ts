import * as d3 from 'd3'
import { map, Subject, takeUntil } from 'rxjs'
import type { GridPlotLineParams, GridPlotPluginParams } from '../types'
import { defineSVGLayer } from '@orbcharts/core'
import { GridPlotExtendContext } from '../types'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_LINES_PARAMS } from '../defaults'
import { createBaseLine } from '../../../baseLayers/BaseLine'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'

const pluginName = 'GridPlot'
const layerName = 'Line'

export const Line = defineSVGLayer<GridPlotExtendContext, GridPlotPluginParams, GridPlotLineParams>({
  name: layerName,
  defaultParams: DEFAULT_LINES_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: false,
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

    context.layout$
      .pipe(
        takeUntil(destroy$)
      )
      .subscribe(layout => {
        d3.select(svgG)
          .attr('transform', `translate(${layout.left}, ${layout.top})`)
      })

    const unsubscribeBaseBars = createBaseLine({
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
      baseLineParams$: layerParams$,
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