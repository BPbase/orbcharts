import * as d3 from 'd3'
import {
  Subject,
  Observable,
  of,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { GridPlotBarParams, GridPlotPluginParams } from '../types'
import { DEFAULT_BARS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'
import { createBaseBar } from '../../../baseLayers/BaseBar'
import { defineSVGLayer } from '@orbcharts/core'
import { GridPlotExtendContext } from '../types'
import { validateObject } from '@orbcharts/core'

const pluginName = 'GridPlot'
const layerName = 'BarsPN'

export const Bars = defineSVGLayer<GridPlotExtendContext, GridPlotPluginParams, GridPlotBarParams>({
  name: layerName,
  defaultParams: DEFAULT_BARS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      barWidth: {
        toBeTypes: ['number']
      },
      barPadding: {
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

    const unsubscribeBaseBars = createBaseBar({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      visibleComputedData$: context.visibleComputedData$,
      visibleComputedAxesData$: context.visibleComputedAxesData$,
      seriesLabels$: context.seriesLabels$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: context.CategoryDataMap$,
      baseBarParams$: layerParams$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridGraphicTransform$: context.gridGraphicTransform$,
      gridGraphicReverseScale$: context.gridGraphicReverseScale$,
      gridAxesSize$: context.gridAxesSize$,
      gridHighlight$: context.gridHighlight$,
      gridContainerPosition$: context.gridContainerPosition$,
      isSeriesSeprate$: of(true), // hack: 永遠為true，可以強制讓每組series的bars的x位置都是一樣的
      styles$: pluginParams$.pipe(
        map(params => params.styles),
      ),
      eventTrigger$: context.eventTrigger$
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseBars()
    }
  }
})
