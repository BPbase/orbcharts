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
  Layout } from '../../lib/core-types'
import { calcSeriesContainerLayout } from '../utils/orbchartsUtils'

export const separateSeriesObservable = ({ fullDataFormatter$ }: { fullDataFormatter$: Observable<DataFormatterTypeMap<'series'>> }) => {
  return fullDataFormatter$.pipe(
    map(data => data.separateSeries),
    distinctUntilChanged(),
  )
}

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

export const visibleComputedDataObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTypeMap<'series'>> }) => {
  return computedData$.pipe(
    map(data => {
      return data.map(series => {
        return series.filter(datum => datum.visible != false)
      })
    })
  )
}

export const computedLayoutDataObservable = ({ computedData$, fullDataFormatter$ }: {
  computedData$: Observable<ComputedDataTypeMap<'series'>>,
  fullDataFormatter$: Observable<DataFormatterTypeMap<'series'>>
}) => {
  return combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      const sumData: ComputedDatumSeries[][] = data.fullDataFormatter.sumSeries == true
        ? data.computedData.map(d => {
            return [
              // 加總為一筆資料
              d.reduce((acc, current) => {
                if (acc == null) {
                  return current // 取得第一筆資料
                }
                acc.value = acc.value + current.value
                return acc
              }, null)
            ]
          })
        : data.computedData
      
      return data.fullDataFormatter.separateSeries == true
        // 有拆分的話每個series為一組
        ? sumData
          .map(series => {
            return series.sort((a, b) => a.seq - b.seq)
          })
        // 無拆分的話所有資料為一組
        : [
          sumData
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
        return calcSeriesContainerLayout(data.layout, data.fullDataFormatter.container, data.computedData.length)
        // return data.computedData.map((seriesData, seriesIndex) => {
        //   const columnIndex = seriesIndex % data.fullDataFormatter.container.columnAmount
        //   const rowIndex = Math.floor(seriesIndex / data.fullDataFormatter.container.columnAmount)
        //   const { startX, startY, centerX, centerY, width, height } = calcSeriesContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
        //   return {
        //     slotIndex: seriesIndex,
        //     rowIndex,
        //     columnIndex,
        //     startX,
        //     startY,
        //     centerX,
        //     centerY,
        //     width,
        //     height,
        //   }
        // })
      } else {
        // -- 無拆分 --
        return calcSeriesContainerLayout(data.layout, data.fullDataFormatter.container, 1)
        // const columnIndex = 0
        // const rowIndex = 0
        // return data.computedData.map((seriesData, seriesIndex) => {
        //   const { startX, startY, centerX, centerY, width, height } = calcSeriesContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
        //   return {
        //     slotIndex: 0,
        //     rowIndex,
        //     columnIndex,
        //     startX,
        //     startY,
        //     centerX,
        //     centerY,
        //     width,
        //     height,
        //   }
        // })
      }
    })
  )

  return gridContainerPosition$
}

export const seriesContainerPositionMapObservable = ({ seriesContainerPosition$, seriesLabels$, separateSeries$ }: {
  seriesContainerPosition$: Observable<SeriesContainerPosition[]>
  seriesLabels$: Observable<string[]>
  separateSeries$: Observable<boolean>
}) => {
  return combineLatest({
    seriesContainerPosition: seriesContainerPosition$,
    seriesLabels: seriesLabels$,
    separateSeries: separateSeries$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      return data.separateSeries
        ? new Map<string, SeriesContainerPosition>(data.seriesLabels.map((seriesLabel, seriesIndex) => {
          return [seriesLabel, data.seriesContainerPosition[seriesIndex] ?? data.seriesContainerPosition[0]]
        }))
        : new Map<string, SeriesContainerPosition>(data.seriesLabels.map((seriesLabel, seriesIndex) => {
          return [seriesLabel, data.seriesContainerPosition[0]]
        }))
    })
  )
}