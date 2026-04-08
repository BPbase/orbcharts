import * as d3 from 'd3'
import {
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil,
  Subject,
  Observable } from 'rxjs'
import type { GridPlotPluginParams, GridPlotStackedBarParams } from '../types'
import { DEFAULT_STACKED_BARS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'
import { createBaseStackedBar } from '../../../baseLayers/BaseStackedBar'
import { defineSVGLayer } from '@orbcharts/core'
import { GridPlotExtendContext } from '../types'
import { validateObject } from '@orbcharts/core'

const pluginName = 'GridPlot'
const layerName = 'StackedBar'

export const StackedBar = defineSVGLayer<GridPlotExtendContext, GridPlotPluginParams, GridPlotStackedBarParams>({
  name: layerName,
  defaultParams: DEFAULT_STACKED_BARS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      barWidth: {
        toBeTypes: ['number']
      },
      barGroupPadding: {
        toBeTypes: ['number']
      },
      barRadius: {
        toBeTypes: ['number', 'boolean']
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

    const unsubscribeBaseBars = createBaseStackedBar({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      computedAxesData$: context.computedAxesData$,
      visibleComputedData$: context.visibleComputedData$,
      visibleComputedAxesData$: context.visibleComputedAxesData$,
      filteredMinMaxValue$: context.filteredMinMaxValue$,
      filteredStackedMinMaxValue$: context.filteredStackedMinMaxValue$,
      seriesLabels$: context.seriesLabels$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: context.CategoryDataMap$,
      baseStackedBarParams$: layerParams$,
      pluginParams$,
      styles$: pluginParams$.pipe(
        map(params => params.styles),
      ),
      gridAxesTransform$: context.gridAxesTransform$,
      gridGraphicTransform$: context.gridGraphicTransform$,
      gridGraphicReverseScale$: context.gridGraphicReverseScale$,
      gridAxesSize$: context.gridAxesSize$,
      gridHighlight$: context.gridHighlight$,
      gridContainerPosition$: context.gridContainerPosition$,
      isSeriesSeprate$: context.isSeriesSeprate$,
      eventTrigger$: context.eventTrigger$,
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseBars()
    }
  }
})