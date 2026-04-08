import * as d3 from 'd3'
import {
  combineLatest,
  distinctUntilChanged,
  debounceTime,
  iif,
  map,
  shareReplay,
  switchMap,
  Observable,
  BehaviorSubject
} from 'rxjs'
import type { ModelDataGrid } from '@orbcharts/core'
import type { ComputedDatumGrid } from '../../types/ComputedData'
import type { ComputedData } from '../../types/ComputedData'
import type { Layout, ContainerPositionScaled } from '../../types/PluginParams'
import type { ContainerSize } from '../../types/Common'
import type { RacingPlotPluginParams } from './types'
import { createLabelToAxisScale } from '../../utils/d3Scale'

// ---- grid 基礎 ----

export const gridComputedDataObservable = ({
  selectedGridData$,
  pluginParams$
}: {
  selectedGridData$: Observable<ModelDataGrid>
  pluginParams$: Observable<RacingPlotPluginParams>
}): Observable<ComputedDatumGrid[][]> => {
  return combineLatest({
    selectedGridData: selectedGridData$,
    pluginParams: pluginParams$
  }).pipe(
    debounceTime(0),
    map(({ selectedGridData, pluginParams }) => {
      return selectedGridData.map((data) => {
        return data.map((datum) => {
          const visibleFilter = pluginParams.visibleFilter
          return {
            ...datum,
            visible: visibleFilter ? visibleFilter(datum) : true
          }
        })
      })
    })
  )
}

export const gridSeriesLabelsObservable = ({
  computedData$
}: {
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

export const gridVisibleComputedDataObservable = ({
  computedData$
}: {
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

// RacingPlot always uses a single container (no separateSeries)
export const gridContainerPositionObservable = ({
  selectedGridData$
}: {
  selectedGridData$: Observable<ModelDataGrid>
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

// ---- racing-specific ----

// Max frame index = number of categories - 1
export const maxFrameIndexObservable = ({
  computedData$
}: {
  computedData$: Observable<ComputedDatumGrid[][]>
}): Observable<number> => {
  return computedData$.pipe(
    map(data => {
      const seriesData = data[0]
      if (!seriesData || seriesData.length === 0) return 0
      return seriesData.length - 1
    }),
    distinctUntilChanged()
  )
}

// Current frame label = category label at currentFrameIndex
export const currentFrameLabelObservable = ({
  computedData$,
  currentFrameIndex$
}: {
  computedData$: Observable<ComputedDatumGrid[][]>
  currentFrameIndex$: BehaviorSubject<number>
}): Observable<string> => {
  return combineLatest({
    computedData: computedData$,
    currentFrameIndex: currentFrameIndex$
  }).pipe(
    map(({ computedData, currentFrameIndex }) => {
      const firstSeries = computedData[0]
      if (!firstSeries) return ''
      return firstSeries[currentFrameIndex]?.category ?? ''
    }),
    distinctUntilChanged()
  )
}

// xScale: value → pixel (linear, 0 → containerWidth)
// domain max follows current frame's ranked top value (dynamic)
export const xScaleObservable = ({
  racingRankedSeriesData$,
  currentFrameIndex$,
  containerSize$
}: {
  racingRankedSeriesData$: Observable<ComputedDatumGrid[][]>
  currentFrameIndex$: BehaviorSubject<number>
  containerSize$: Observable<ContainerSize>
}): Observable<(n: number) => number> => {
  return combineLatest({
    racingRankedSeriesData: racingRankedSeriesData$,
    currentFrameIndex: currentFrameIndex$,
    containerSize: containerSize$
  }).pipe(
    debounceTime(0),
    map(({ racingRankedSeriesData, currentFrameIndex, containerSize }) => {
      const currentMaxValue = Math.max(
        1,
        racingRankedSeriesData[0]?.[currentFrameIndex]?.value ?? 0
      )
      const axisMaxValue = Math.max(1, currentMaxValue / 0.9)
      return d3.scaleLinear<number>()
        .domain([0, axisMaxValue])
        .range([0, containerSize.width])
        .clamp(true)
    })
  )
}

// Ranked series data at current frame – sorted by current value descending
export const racingRankedSeriesDataObservable = ({
  visibleComputedData$,
  currentFrameIndex$
}: {
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  currentFrameIndex$: BehaviorSubject<number>
}): Observable<ComputedDatumGrid[][]> => {
  return combineLatest({
    visibleComputedData: visibleComputedData$,
    currentFrameIndex: currentFrameIndex$
  }).pipe(
    map(({ visibleComputedData, currentFrameIndex }) => {
      const seriesWithValue = visibleComputedData.map(seriesData => ({
        seriesData,
        currentValue: seriesData[currentFrameIndex]?.value ?? 0
      }))
      seriesWithValue.sort((a, b) => b.currentValue - a.currentValue)
      return seriesWithValue.map(s => s.seriesData)
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
    map(data =>
      data.containerSize.height > data.minLineHeight
        ? data.containerSize.height
        : data.minLineHeight
    ),
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
    map(data =>
      data.containerSize.height > data.minLineHeight
        ? data.containerSize.height
        : data.minLineHeight
    ),
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

// Returns an array of ONE ScalePoint: series label → Y pixel (in current ranking order)
export const rankedScaleListObservable = ({
  racingRankedSeriesData$,
  rankedItemHeight$
}: {
  racingRankedSeriesData$: Observable<ComputedDatumGrid[][]>
  rankedItemHeight$: Observable<number>
}): Observable<d3.ScalePoint<string>[]> => {
  return combineLatest({
    racingRankedSeriesData: racingRankedSeriesData$,
    rankedItemHeight: rankedItemHeight$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const seriesLabels = data.racingRankedSeriesData
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
