import * as d3 from 'd3'
import {
  combineLatest,
  distinctUntilChanged,
  debounceTime,
  iif,
  filter,
  map,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable
} from 'rxjs'
import type { ModelDataGrid } from '@orbcharts/core'
import type { ComputedDatumGrid } from '../../types/ComputedData'
import type { ComputedData } from '../../types/ComputedData'
import type { CategoryAxis } from '../../types/PluginParams'
import type { Layout, ContainerPositionScaled } from '../../types/PluginParams'
import type { ContainerSize, TransformData } from '../../types/Common'
import type { RankedPlotPluginParams } from './types'
import { createValueToAxisScale, createAxisToLabelIndexScale, createLabelToAxisScale } from '../../utils/d3Scale'
import { getMinMaxValue } from '../../utils/orbchartsUtils'
import { d3EventObservable } from '../../utils/observables'

// ---- grid 基礎 ----

export const gridComputedDataObservable = ({
  selectedGridData$,
  pluginParams$
}: {
  selectedGridData$: Observable<ModelDataGrid>
  pluginParams$: Observable<RankedPlotPluginParams>
}): Observable<ComputedDatumGrid[][]> => {
  return combineLatest({
    selectedGridData: selectedGridData$,
    pluginParams: pluginParams$
  }).pipe(
    debounceTime(0),
    map(({ selectedGridData, pluginParams }) => {
      return selectedGridData
        .map((data) => {
          return data.map((datum) => {
            const visibleFilter = pluginParams.visibleFilter
            return {
              ...datum,
              visible: visibleFilter ? visibleFilter(datum) : true,
            }
          })
        })
    })
  )
}

export const gridSeriesLabelsObservable = ({ computedData$ }: {
  computedData$: Observable<ComputedData<'grid'>>
}) => {
  return computedData$.pipe(
    map(data => {
      return data
        .filter(series => series.length)
        .map(series => series[0].series)
    }),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  )
}

export const gridVisibleComputedDataObservable = ({ computedData$ }: {
  computedData$: Observable<ComputedData<'grid'>>
}) => {
  return computedData$.pipe(
    map(data => {
      return data
        .map(d => d.filter(_d => _d.visible == true))
        .filter(d => d.length)
    })
  )
}

// RankedPlot always uses a single container (no separateSeries)
export const gridContainerPositionObservable = ({
  selectedGridData$,
  layout$
}: {
  selectedGridData$: Observable<ModelDataGrid>
  layout$: Observable<Layout>
}): Observable<ContainerPositionScaled[]> => {
  return selectedGridData$.pipe(
    debounceTime(0),
    map(selectedGridData => {
      const singlePos: ContainerPositionScaled = {
        slotIndex: 0,
        rowIndex: 0,
        columnIndex: 0,
        translate: [0, 0] as [number, number],
        scale: [1, 1] as [number, number]
      }
      if (selectedGridData.length === 0) {
        return [singlePos]
      }
      return selectedGridData.map(() => singlePos)
    })
  )
}

export const categoryScaleDomainValueObservable = ({
  selectedGridData$,
  categoryAxis$
}: {
  selectedGridData$: Observable<ModelDataGrid>
  categoryAxis$: Observable<CategoryAxis>
}): Observable<[number, number]> => {
  return combineLatest({
    selectedGridData: selectedGridData$,
    categoryAxis: categoryAxis$
  }).pipe(
    debounceTime(0),
    map(data => {
      const categoryAxis = data.categoryAxis
      const categoryMax = data.selectedGridData[0] ? data.selectedGridData[0].length - 1 : 0
      const categoryScaleDomainMin = categoryAxis.scaleDomain[0] - categoryAxis.scalePadding
      const categoryScaleDomainMax = categoryAxis.scaleDomain[1] === 'max'
        ? categoryMax + categoryAxis.scalePadding
        : categoryAxis.scaleDomain[1] as number + categoryAxis.scalePadding
      return [categoryScaleDomainMin, categoryScaleDomainMax] as [number, number]
    })
  )
}

// ---- ordinal scale (category index -> X pixel) ----

export const ordinalScaleObservable = ({
  computedData$,
  categoryScaleDomainValue$,
  layout$
}: {
  computedData$: Observable<ComputedDatumGrid[][]>
  categoryScaleDomainValue$: Observable<[number, number]>
  layout$: Observable<Layout>
}): Observable<d3.ScaleLinear<number, number>> => {
  return combineLatest({
    computedData: computedData$,
    categoryScaleDomainValue: categoryScaleDomainValue$,
    layout: layout$
  }).pipe(
    debounceTime(0),
    map(data => {
      const categoryEndIndex = data.computedData[0] ? data.computedData[0].length - 1 : 0
      return createValueToAxisScale({
        maxValue: categoryEndIndex,
        minValue: 0,
        axisWidth: data.layout.width,
        scaleDomain: data.categoryScaleDomainValue,
        scaleRange: [0, 1]
      })
    })
  )
}

// ---- gridAxesTransform (category always at bottom) ----

export const gridAxesSizeObservable = ({
  layout$
}: {
  layout$: Observable<Layout>
}): Observable<ContainerSize> => {
  return layout$.pipe(
    map(layout => ({ width: layout.width, height: layout.height })),
    distinctUntilChanged((a, b) => a.width === b.width && a.height === b.height)
  )
}

// Category axis position: 'top' | 'bottom'
export const gridAxesTransformObservable = ({
  layout$,
  categoryAxisPosition$
}: {
  layout$: Observable<Layout>
  categoryAxisPosition$: Observable<string>
}): Observable<TransformData> => {
  return combineLatest({ layout: layout$, position: categoryAxisPosition$ }).pipe(
    map(({ layout, position }) => {
      const translateX = 0
      const translateY = position === 'top' ? 0 : layout.height
      const rotateX = position === 'top' ? 0 : 180
      return {
        translate: [translateX, translateY] as [number, number],
        scale: [1, 1] as [number, number],
        rotate: 0,
        rotateX,
        rotateY: 0,
        value: `translate(${translateX}px, ${translateY}px) rotate(0deg) rotateX(${rotateX}deg) rotateY(0deg)`
      }
    })
  )
}

export const gridAxesReverseTransformObservable = ({
  gridAxesTransform$
}: {
  gridAxesTransform$: Observable<TransformData>
}): Observable<TransformData> => {
  return gridAxesTransform$.pipe(
    map(d => {
      const translate: [number, number] = [0, 0]
      const scale: [number, number] = [1, 1]
      const rotate = d.rotate * -1
      const rotateX = d.rotateX * -1
      const rotateY = d.rotateY * -1
      return {
        translate,
        scale,
        rotate,
        rotateX,
        rotateY,
        value: `translate(${translate[0]}px, ${translate[1]}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${rotate}deg)`
      }
    })
  )
}

// ---- ranking ----

// Sort series by sum of all category values, descending
export const rankedSeriesDataObservable = ({
  visibleComputedData$
}: {
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
}): Observable<ComputedDatumGrid[][]> => {
  return visibleComputedData$.pipe(
    map(computedData => {
      const seriesWithSum = computedData.map(seriesData => ({
        seriesData,
        sum: seriesData.reduce((acc, d) => acc + (d.value ?? 0), 0)
      }))
      seriesWithSum.sort((a, b) => b.sum - a.sum)
      return seriesWithSum.map(s => s.seriesData)
    })
  )
}

export const computedRankedAmountObservable = ({
  containerSize$,
  visibleComputedData$,
  fontSizePx$,
  limit$
}: {
  containerSize$: Observable<ContainerSize>
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  fontSizePx$: Observable<number>
  limit$: Observable<number | 'auto'>
}): Observable<number> => {
  const minLineHeight$ = fontSizePx$.pipe(
    map(textSizePx => textSizePx * 2),
    shareReplay(1)
  )

  const containerHeight$ = combineLatest({
    minLineHeight: minLineHeight$,
    containerSize: containerSize$
  }).pipe(
    switchMap(async d => d),
    map(data => data.containerSize.height > data.minLineHeight
      ? data.containerSize.height
      : data.minLineHeight),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const rankingAmountLimit$ = combineLatest({
    minLineHeight: minLineHeight$,
    containerHeight: containerHeight$
  }).pipe(
    switchMap(async d => d),
    map(data => Math.floor(data.containerHeight / data.minLineHeight)),
    distinctUntilChanged(),
    shareReplay(1)
  )

  return limit$.pipe(
    switchMap(limit => {
      return iif(
        () => limit === 'auto',
        combineLatest({
          visibleComputedData: visibleComputedData$,
          rankingAmountLimit: rankingAmountLimit$
        }).pipe(
          switchMap(async d => d),
          map(data => {
            const seriesCount = data.visibleComputedData.length
            return Math.min(data.rankingAmountLimit, seriesCount)
          })
        ),
        limit$ as Observable<number>
      )
    })
  )
}

export const rankedItemHeightObservable = ({
  containerSize$,
  fontSizePx$,
  computedRankedAmount$
}: {
  containerSize$: Observable<ContainerSize>
  fontSizePx$: Observable<number>
  computedRankedAmount$: Observable<number>
}): Observable<number> => {
  const minLineHeight$ = fontSizePx$.pipe(
    map(textSizePx => textSizePx * 2),
    shareReplay(1)
  )

  const containerHeight$ = combineLatest({
    minLineHeight: minLineHeight$,
    containerSize: containerSize$
  }).pipe(
    switchMap(async d => d),
    map(data => data.containerSize.height > data.minLineHeight
      ? data.containerSize.height
      : data.minLineHeight),
    distinctUntilChanged(),
    shareReplay(1)
  )

  return combineLatest({
    containerHeight: containerHeight$,
    computedRankedAmount: computedRankedAmount$
  }).pipe(
    switchMap(async d => d),
    map(data => data.containerHeight / Math.max(1, data.computedRankedAmount))
  )
}

// Returns array of ONE scalePoint (series label -> Y pixel)
export const rankedScaleListObservable = ({
  rankedSeriesData$,
  rankedItemHeight$
}: {
  rankedSeriesData$: Observable<ComputedDatumGrid[][]>
  rankedItemHeight$: Observable<number>
}): Observable<d3.ScalePoint<string>[]> => {
  return combineLatest({
    rankedSeriesData: rankedSeriesData$,
    rankedItemHeight: rankedItemHeight$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const seriesLabels = data.rankedSeriesData
        .map(seriesData => seriesData[0]?.series ?? '')
      const totalHeight = data.rankedItemHeight * seriesLabels.length
      const scale = createLabelToAxisScale({
        axisLabels: seriesLabels,
        axisWidth: totalHeight,
        padding: 0.5
      })
      return [scale]
    })
  )
}

// ---- category position observable for CategoryAux ----

export const rankedCategoryPositionObservable = ({
  rootSelection,
  pluginParams$,
  computedData$,
  layout$,
  gridContainerPosition$
}: {
  rootSelection: d3.Selection<any, unknown, any, unknown>
  pluginParams$: Observable<RankedPlotPluginParams>
  computedData$: Observable<ComputedDatumGrid[][]>
  layout$: Observable<Layout>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
}): Observable<{ categoryIndex: number; categoryLabel: string }> => {
  const rootMousemove$ = d3EventObservable(rootSelection, 'mousemove')

  const categoryScaleDomain$ = combineLatest({
    pluginParams: pluginParams$,
    computedData: computedData$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const categoryMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      const categoryScaleDomainMin = data.pluginParams.categoryAxis.scaleDomain[0]
        - data.pluginParams.categoryAxis.scalePadding
      const categoryScaleDomainMax = data.pluginParams.categoryAxis.scaleDomain[1] === 'max'
        ? categoryMax + data.pluginParams.categoryAxis.scalePadding
        : data.pluginParams.categoryAxis.scaleDomain[1] as number + data.pluginParams.categoryAxis.scalePadding
      return [categoryScaleDomainMin, categoryScaleDomainMax]
    }),
    shareReplay(1)
  )

  const categoryLabels$ = computedData$.pipe(
    map(data => (data[0] ?? []).map(d => d.category))
  )

  const scaleRangeCategoryLabels$ = combineLatest({
    categoryScaleDomain: categoryScaleDomain$,
    categoryLabels: categoryLabels$
  }).pipe(
    switchMap(async d => d),
    map(data => data.categoryLabels.filter((_, i) =>
      i >= data.categoryScaleDomain[0] && i <= data.categoryScaleDomain[1]
    ))
  )

  const xIndexScale$ = combineLatest({
    scaleRangeCategoryLabels: scaleRangeCategoryLabels$,
    pluginParams: pluginParams$,
    layout: layout$
  }).pipe(
    switchMap(async d => d),
    map(data => createAxisToLabelIndexScale({
      axisLabels: data.scaleRangeCategoryLabels,
      axisWidth: data.layout.width,
      padding: data.pluginParams.categoryAxis.scalePadding,
      reverse: false
    }))
  )

  const axisValue$ = combineLatest({
    rootMousemove: rootMousemove$,
    gridContainerPosition: gridContainerPosition$,
    layout: layout$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      let x = data.rootMousemove.offsetX
      const rangeArr = data.gridContainerPosition
        .map((d, i) => [d.translate[0], data.gridContainerPosition[i + 1]?.translate[0] ?? data.layout.rootWidth])
        .filter(d => d[0] < d[1])
      const range = rangeArr.find(d => x >= d[0] && x <= d[1])
      if (range) { x = x - range[0] }
      return x - data.layout.left
    })
  )

  const categoryIndex$ = combineLatest({
    xIndexScale: xIndexScale$,
    axisValue: axisValue$,
    categoryScaleDomain: categoryScaleDomain$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const xIndex = data.xIndexScale(data.axisValue)
      const currentxIndexStart = Math.ceil(data.categoryScaleDomain[0])
      return xIndex + currentxIndexStart
    })
  )

  return combineLatest({
    categoryIndex: categoryIndex$,
    categoryLabels: categoryLabels$
  }).pipe(
    switchMap(async d => d),
    map(data => ({
      categoryIndex: data.categoryIndex,
      categoryLabel: data.categoryLabels[data.categoryIndex] ?? ''
    }))
  )
}
