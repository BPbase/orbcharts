import * as d3 from 'd3'
import {
  Subject,
  Observable,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { GridPlotPointParams, GridPlotPluginParams } from '../types'
import { DEFAULT_DOTS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC_COVER } from '../../../const/layerIndex'
import { createBasePoint } from '../../../baseLayers/BasePoint'
import { defineSVGLayer } from '@orbcharts/core'
import { GridPlotExtendContext } from '../types'
import { validateObject } from '@orbcharts/core'

const pluginName = 'GridPlot'
const layerName = 'Point'

export const Point = defineSVGLayer<GridPlotExtendContext, GridPlotPluginParams, GridPlotPointParams>({
  name: layerName,
  defaultParams: DEFAULT_DOTS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC_COVER,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      radius: {
        toBeTypes: ['number']
      },
      fillColorType: {
        toBeOption: 'ColorType',
      },
      strokeColorType: {
        toBeOption: 'ColorType',
      },
      strokeWidth: {
        toBeTypes: ['number']
      },
      // strokeWidthWhileHighlight: {
      //   toBeTypes: ['number']
      // },
      onlyShowHighlighted: {
        toBeTypes: ['boolean']
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

    const unsubscribeBaseDots = createBasePoint({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      // visibleComputedData$: context.visibleComputedData$,
      visibleComputedAxesData$: context.visibleComputedAxesData$,
      seriesLabels$: context.seriesLabels$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: context.CategoryDataMap$,
      basePointParams$: layerParams$,
      styles$: pluginParams$.pipe(
        map(params => params.styles),
      ),
      theme$: context.theme$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridGraphicTransform$: context.gridGraphicTransform$,
      gridGraphicReverseScale$: context.gridGraphicReverseScale$,
      gridAxesSize$: context.gridAxesSize$,
      gridHighlight$: context.gridHighlight$,
      gridContainerPosition$: context.gridContainerPosition$,
      // isSeriesSeprate$: context.isSeriesSeprate$,
      eventTrigger$: context.eventTrigger$,
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseDots()
    }
  }
})
