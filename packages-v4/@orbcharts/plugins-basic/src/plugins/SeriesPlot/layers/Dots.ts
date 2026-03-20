import * as d3 from 'd3'
import {
  Subject,
  Observable,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { DotsParams, SeriesPlotPluginParams } from '../types'
import { DEFAULT_DOTS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'
import { createBaseDots } from '../baseLayers/BaseDots'
import { defineSVGLayer } from '../../../../../core/src'
import { SeriesPlotExtendContext } from '../types'
import { validateObject } from '../../../../../core/src/utils'

const pluginName = 'SeriesPlot'
const layerName = 'Dots'

export const Dots = defineSVGLayer<SeriesPlotExtendContext, SeriesPlotPluginParams, DotsParams>({
  name: layerName,
  defaultParams: DEFAULT_DOTS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
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

    const unsubscribeBaseDots = createBaseDots({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      // visibleComputedData$: context.visibleComputedData$,
      visibleComputedAxesData$: context.visibleComputedAxesData$,
      seriesLabels$: context.seriesLabels$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: context.CategoryDataMap$,
      baseDotsParams$: layerParams$,
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
