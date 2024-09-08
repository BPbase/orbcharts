import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable } from 'rxjs'
import type {
  ChartParams,
  ComputedDatumSeries,
  ComputedDataTypeMap,
  DataFormatterTypeMap,
  SeriesContainerPosition,
  Layout } from '../types'
import { calcSeriesContainerPosition } from '../utils/orbchartsUtils'

export const seriesLabelsObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTypeMap<'series'>> }) => {
  return computedData$.pipe(
    map(data => {
      return data
        .filter(series => series.length)
        .map(series => {
          return series[0].seriesLabel
        })
    }),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a).length === JSON.stringify(b).length
    }),
  )
}

export const computedLayoutDataObservable = ({ computedData$, fullDataFormatter$ }: { computedData$: Observable<ComputedDataTypeMap<'series'>>, fullDataFormatter$: Observable<DataFormatterTypeMap<'series'>> }) => {
  return combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      return data.fullDataFormatter.separateSeries
        // 有拆分的話每個series為一組
        ? data.computedData
          .map(series => {
            return series.sort((a, b) => a.seq - b.seq)
          })
        // 無拆分的話所有資料為一組
        : [
          data.computedData
            .flat()
            .sort((a, b) => a.seq - b.seq)
        ]
    })
  )
}
// 所有container位置（對應series）
export const seriesContainerPositionObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'series'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'series'>>
  layout$: Observable<Layout>
}): Observable<SeriesContainerPosition[]> => {

  const gridContainerPosition$ = combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$,
    layout: layout$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      
      if (data.fullDataFormatter.separateSeries) {
        // -- 依slotIndexes計算 --
        return data.computedData.map((seriesData, seriesIndex) => {
          const columnIndex = seriesIndex % data.fullDataFormatter.container.columnAmount
          const rowIndex = Math.floor(seriesIndex / data.fullDataFormatter.container.columnAmount)
          const { startX, startY, centerX, centerY, width, height } = calcSeriesContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
          return {
            slotIndex: seriesIndex,
            rowIndex,
            columnIndex,
            startX,
            startY,
            centerX,
            centerY,
            width,
            height,
          }
        })
      } else {
        // -- 無拆分 --
        const columnIndex = 0
        const rowIndex = 0
        return data.computedData.map((seriesData, seriesIndex) => {
          const { startX, startY, centerX, centerY, width, height } = calcSeriesContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
          return {
            slotIndex: 0,
            rowIndex,
            columnIndex,
            startX,
            startY,
            centerX,
            centerY,
            width,
            height,
          }
        })
      }
    })
  )

  return gridContainerPosition$
}