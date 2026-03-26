import * as d3 from 'd3'
import { map, Subject, takeUntil } from 'rxjs'
import type { LineAreasParams, SeriesPlotPluginParams } from '../types'
import { defineSVGLayer } from '../../../../../core/src'
import { SeriesPlotExtendContext } from '../types'
import { validateObject } from '../../../../../core/src/utils'
import { DEFAULT_LINE_AREAS_PARAMS } from '../defaults'
import { createBaseLineAreas } from '../../../baseLayers/BaseLineAreas'
import { LAYER_INDEX_OF_GRAPHIC_GROUND } from '../../../const/layerIndex'

const pluginName = 'SeriesPlot'
const layerName = 'LineAreas'


export const LineAreas = defineSVGLayer<SeriesPlotExtendContext, SeriesPlotPluginParams, LineAreasParams>({
  name: layerName,
  defaultParams: DEFAULT_LINE_AREAS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC_GROUND,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      lineCurve: {
        toBeTypes: ['string']
      },
      linearGradientOpacity: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
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

    const unsubscribeBaseBars = createBaseLineAreas({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      // visibleComputedData$: context.visibleComputedData$,
      // computedAxesData$: context.computedAxesData$,
      visibleComputedAxesData$: context.visibleComputedAxesData$,
      seriesLabels$: context.seriesLabels$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: context.CategoryDataMap$,
      baseLineAreasParams$: layerParams$,
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
      eventTrigger$: context.eventTrigger$,
    })


    return () => {
      destroy$.next(undefined)
      unsubscribeBaseBars()
    }
  }
})