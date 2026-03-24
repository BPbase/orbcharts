import * as d3 from 'd3'
import {
  Subject,
  Observable,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { CategoryAxisParams, SeriesPlotPluginParams } from '../types'
import { DEFAULT_CATEGORY_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_INFO } from '../../../const/layerIndex'
import { defineSVGLayer } from '../../../../../core/src'
import { SeriesPlotExtendContext } from '../types'
import { validateObject } from '../../../../../core/src/utils'
import { createBaseCategoryAxis } from '../baseLayers/BaseCategoryAxis'

const pluginName = 'SeriesPlot'
const layerName = 'CategoryAxis'

export const CategoryAxis = defineSVGLayer<SeriesPlotExtendContext, SeriesPlotPluginParams, CategoryAxisParams>({
  name: layerName,
  defaultParams: DEFAULT_CATEGORY_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_INFO,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      labelOffset: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      },
      labelColorType: {
        toBeOption: 'ColorType',
      },
      axisLineVisible: {
        toBeTypes: ['boolean']
      },
      axisLineColorType: {
        toBeOption: 'ColorType',
      },
      ticks: {
        toBe: 'number | null | "all"',
        test: (value: any) => {
          return value === null || value === 'all' || typeof value === 'number'
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

    const unsubscribeBaseGroupAxis = createBaseCategoryAxis({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      baseCategoryAxisParams$: layerParams$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridAxesReverseTransform$: context.gridAxesReverseTransform$,
      gridAxesSize$: context.gridAxesSize$,
      gridContainerPosition$: context.gridContainerPosition$,
      isSeriesSeprate$: context.isSeriesSeprate$,
      fontSizePx$: context.fontSizePx$,
      categoryAxis$: pluginParams$.pipe(map(params => params.categoryAxis)),
      valueAxis$: pluginParams$.pipe(map(params => params.valueAxis)),
      styles$: pluginParams$.pipe(
        map(params => params.styles),
      ),
      theme$: context.theme$,
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseGroupAxis()
    }
  }
})
