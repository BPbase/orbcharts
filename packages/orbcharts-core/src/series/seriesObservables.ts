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
  ContainerPosition,
  Layout } from '../../lib/core-types'
import { calcContainerPosition } from '../utils/orbchartsUtils'

export const datumLabelsObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTypeMap<'series'>> }) => {
  const DatumLabels = new Set<string>()
  return computedData$.pipe(
    map(data => {
      data.forEach(series => {
        series.forEach(datum => {
          DatumLabels.add(datum.label)
        })
      })
      return Array.from(DatumLabels)
    }),
  )
}

export const separateSeriesObservable = ({ fullDataFormatter$ }: { fullDataFormatter$: Observable<DataFormatterTypeMap<'series'>> }) => {
  return fullDataFormatter$.pipe(
    map(data => data.separateSeries),
    distinctUntilChanged(),
  )
}

export const separateLabelObservable = ({ fullDataFormatter$ }: { fullDataFormatter$: Observable<DataFormatterTypeMap<'series'>> }) => {
  return fullDataFormatter$.pipe(
    map(data => data.separateLabel),
    distinctUntilChanged(),
  )
}

export const sumSeriesObservable = ({ fullDataFormatter$ }: { fullDataFormatter$: Observable<DataFormatterTypeMap<'series'>> }) => {
  return fullDataFormatter$.pipe(
    map(data => data.sumSeries),
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
      return JSON.stringify(a) === JSON.stringify(b)
    }),
  )
}

export const seriesVisibleComputedDataObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTypeMap<'series'>> }) => {
  return computedData$.pipe(
    map(data => {
      return data.map(series => {
        return series.filter(datum => datum.visible != false)
      })
    })
  )
}

export const seriesComputedSortedDataObservable = ({ computedData$, separateSeries$, separateLabel$, sumSeries$, datumLabels$ }: {
  computedData$: Observable<ComputedDataTypeMap<'series'>>,
  separateSeries$: Observable<boolean>,
  separateLabel$: Observable<boolean>,
  sumSeries$: Observable<boolean>,
  datumLabels$: Observable<string[]>
}) => {
  return combineLatest({
    computedData: computedData$,
    separateSeries: separateSeries$,
    separateLabel: separateLabel$,
    sumSeries: sumSeries$,
    datumLabels: datumLabels$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // separate series
      const sumData: ComputedDatumSeries[][] = data.sumSeries == true
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
      
      // separate series
      const separateSeriesData: ComputedDatumSeries[][] = data.separateSeries == true
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

      // separate label
      const separateLabelData: ComputedDatumSeries[][] = data.separateLabel == true
        // 有拆分的話每個label為一組
        ? (() => {
          const datumIndexMap = data.datumLabels.reduce((acc, datumLabel, index) => {
            acc[datumLabel] = index
            return acc
          }, {} as { [key: string]: number })
          
          return separateSeriesData
            .map(series => {
              return series.reduce((acc, current) => {
                const index = datumIndexMap[current.label]
                if (acc[index] == null) {
                  acc[index] = []
                }
                acc[index].push(current)
                return acc
              }, [] as ComputedDatumSeries[][])
            })
            .flat()
        })()
        // 無拆分
        : separateSeriesData
      
      return separateLabelData
    })
  )
}


// 所有container位置（對應series）
export const seriesContainerPositionObservable = ({ computedSortedData$, fullDataFormatter$, layout$ }: {
  computedSortedData$: Observable<ComputedDatumSeries[][]>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'series'>>
  layout$: Observable<Layout>
}): Observable<ContainerPosition[]> => {

  const gridContainerPosition$ = combineLatest({
    computedSortedData: computedSortedData$,
    fullDataFormatter: fullDataFormatter$,
    layout: layout$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {

      // 已分類資料的分類數量
      const amount = data.computedSortedData.length

      return calcContainerPosition(data.layout, data.fullDataFormatter.container, amount)
    })
  )

  return gridContainerPosition$
}

export const datumContainerPositionMapObservable = ({ seriesContainerPosition$, computedSortedData$ }: {
  seriesContainerPosition$: Observable<ContainerPosition[]>
  computedSortedData$: Observable<ComputedDatumSeries[][]>
}) => {
  return combineLatest({
    seriesContainerPosition: seriesContainerPosition$,
    computedSortedData: computedSortedData$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      return new Map<string, ContainerPosition>(
        data.computedSortedData
          .map((series, seriesIndex) => {
            return series.map(datum => {
              const m: [string, ContainerPosition] = [datum.id, data.seriesContainerPosition[seriesIndex]]
              return m
            })
          })
          .flat()
      )
    })
  )
}