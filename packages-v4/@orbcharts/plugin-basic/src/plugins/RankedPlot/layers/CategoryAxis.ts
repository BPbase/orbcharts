import * as d3 from 'd3'
import {
  Subject,
  of,
  map,
  takeUntil
} from 'rxjs'
import type { RankedPlotCategoryAxisParams, RankedPlotPluginParams } from '../types'
import { DEFAULT_RANKED_PLOT_CATEGORY_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { RankedPlotExtendContext } from '../types'
import { createBaseCategoryAxis } from '../../../baseLayers/BaseCategoryAxis'

const pluginName = 'RankedPlot'
const layerName = 'CategoryAxis'

export const CategoryAxis = defineSVGLayer<RankedPlotExtendContext, RankedPlotPluginParams, RankedPlotCategoryAxisParams>({
  name: layerName,
  defaultParams: DEFAULT_RANKED_PLOT_CATEGORY_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      labelOffset: {
        toBe: '[number, number]',
        test: (value: any) => Array.isArray(value) && value.length === 2
          && typeof value[0] === 'number' && typeof value[1] === 'number'
      },
      labelColorType: { toBeOption: 'ColorType' },
      axisLineVisible: { toBeTypes: ['boolean'] },
      axisLineColorType: { toBeOption: 'ColorType' },
      ticks: {
        toBe: 'number | null | "all"',
        test: (value: any) => value === null || value === 'all' || typeof value === 'number'
      }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseCategoryAxis({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      baseCategoryAxisParams$: layerParams$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridAxesReverseTransform$: context.gridAxesReverseTransform$,
      gridAxesSize$: context.gridAxesSize$,
      gridContainerPosition$: context.gridContainerPosition$,
      isSeriesSeprate$: of(false),
      fontSizePx$: context.fontSizePx$,
      categoryAxis$: context.zoomedCategoryAxis$,
      valueAxis$: pluginParams$.pipe(map(params => params.rankedAxis as any)),
      styles$: pluginParams$.pipe(map(params => params.styles)),
      theme$: context.theme$
    })

    return () => {
      destroy$.next(undefined)
      unsubscribe()
    }
  }
})
