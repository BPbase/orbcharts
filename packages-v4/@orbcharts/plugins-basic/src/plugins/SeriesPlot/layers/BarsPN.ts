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
import type { BarsParams, SeriesPlotPluginParams } from '../types'
import { DEFAULT_BARS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'
import { createBaseBars } from '../baseLayers/BaseBars'
import { defineSVGLayer } from '../../../../../core/src'
import { SeriesPlotExtendContext } from '../types'
import { validateObject } from '../../../../../core/src/utils'

const pluginName = 'SeriesPlot'
const layerName = 'BarsPN'

export const Bars = defineSVGLayer<SeriesPlotExtendContext, SeriesPlotPluginParams, BarsParams>({
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

    const unsubscribeBaseBars = createBaseBars({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      visibleComputedData$: context.visibleComputedData$,
      visibleComputedAxesData$: context.visibleComputedAxesData$,
      seriesLabels$: context.seriesLabels$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: context.CategoryDataMap$,
      baseBarsParams$: layerParams$,
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
