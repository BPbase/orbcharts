import * as d3 from 'd3'
import {
  Subject,
  of,
  combineLatest,
  map,
  takeUntil
} from 'rxjs'
import type { CategoricalPlotCategoryAxisParams, CategoricalPlotPluginParams } from '../types'
import { DEFAULT_CATEGORICAL_PLOT_CATEGORY_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { CategoricalPlotExtendContext } from '../types'
import { createBaseCategoryAxis } from '../../../baseLayers/BaseCategoryAxis'

const pluginName = 'CategoricalPlot'
const layerName = 'CategoryAxis'

export const CategoryAxis = defineSVGLayer<CategoricalPlotExtendContext, CategoricalPlotPluginParams, CategoricalPlotCategoryAxisParams>({
  name: layerName,
  defaultParams: DEFAULT_CATEGORICAL_PLOT_CATEGORY_AXIS_PARAMS,
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

    // BaseCategoryAxis reads computedData[0][i].category for tick labels and
    // computedData[0].length for categoryMax. Build a fake grid-compatible view where
    // fakeData[0][i].category = categoryLabels[i] (= computedData[0][i].category)
    const fakeComputedData$ = combineLatest({
      computedData: context.computedData$,
      categoryLabels: context.categoryLabels$
    }).pipe(
      map(({ computedData, categoryLabels }) => {
        const firstSeries = computedData[0] ?? []
        const fakeRow = firstSeries.map((datum, idx) => ({
          id: `fake-${idx}`,
          seriesIndex: 0,
          series: '',
          categoryIndex: idx,
          category: categoryLabels[idx] ?? String(idx),
          value: null as number | null,
          color: '',
          visible: true,
          index: idx,
          seq: idx,
          modelType: 'series' as const,
          name: categoryLabels[idx] ?? String(idx),
          data: null as any,
          valueLabel: ''
        }))
        return [fakeRow]
      })
    )

    const unsubscribe = createBaseCategoryAxis({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: fakeComputedData$ as any,
      baseCategoryAxisParams$: layerParams$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridAxesReverseTransform$: context.gridAxesReverseTransform$,
      gridAxesSize$: context.gridAxesSize$,
      gridContainerPosition$: context.gridContainerPosition$,
      isSeriesSeprate$: of(false),
      fontSizePx$: context.fontSizePx$,
      categoryAxis$: context.zoomedCategoryAxis$,
      valueAxis$: pluginParams$.pipe(map(params => params.valueAxis)),
      styles$: pluginParams$.pipe(map(params => params.styles)),
      theme$: context.theme$
    })

    return () => {
      destroy$.next(undefined)
      unsubscribe()
    }
  }
})
