import {
  combineLatest,
  distinctUntilChanged,
  debounceTime,
  filter,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable
} from 'rxjs'
import type {
  ModelDatumSeries,
  ModelDataSeries,
  // DataFormatterTypeMap,
  // ContainerPosition,
  // Layout
} from '../../../../core/src/types'
import type { SeriesSeparableGraphicPluginParams } from './types'
import type { Layout, ContainerPosition } from '../../types/PluginParams'
import type { ComputedDatumSeries } from '../../types/ComputedData'
import { calcContainerPosition } from '../../utils/orbchartsUtils'

export const seriesComputedDataObservable = ({ selectedSeriesData$, pluginParams$ }: {
  selectedSeriesData$: Observable<ModelDataSeries>
  pluginParams$: Observable<SeriesSeparableGraphicPluginParams>
}): Observable<ComputedDatumSeries[][]> => {
  return combineLatest({
    selectedSeriesData: selectedSeriesData$,
    pluginParams: pluginParams$
  }).pipe(
    debounceTime(0),
    map(({ selectedSeriesData, pluginParams }) => {
      return selectedSeriesData
          // 攤為一維陣列
          .flat()
          // 排序後給 seq
          .sort(pluginParams.sort ?? undefined)
          .map((datum, index) => {
            const visibleFilter = pluginParams.visibleFilter
            return {
              ...datum,
              visible: visibleFilter ? visibleFilter(datum) : true,
              seq: index
            }
          })
          // 恢復原排序
          .sort((a, b) => a.index - b.index)
          // 依seriesIndex分組（二維陣列）
          .reduce((acc, datum) => {
            if (!acc[datum.seriesIndex]) {
              acc[datum.seriesIndex] = []
            }
            acc[datum.seriesIndex].push(datum)
            return acc
          }, [])
      })
  )
}

export const datumLabelsObservable = ({ selectedSeriesData$ }: { selectedSeriesData$: Observable<ModelDataSeries> }) => {
  const DatumLabels = new Set<string>()
  return selectedSeriesData$.pipe(
    map(selectedSeriesData => {
      selectedSeriesData.forEach(series => {
        series.forEach(datum => {
          DatumLabels.add(datum.name)
        })
      })
      return Array.from(DatumLabels)
    }),
  )
}

export const separateSeriesObservable = ({ pluginParams$ }: { pluginParams$: Observable<SeriesSeparableGraphicPluginParams> }) => {
  return pluginParams$.pipe(
    map(data => data.separateSeries),
    distinctUntilChanged(),
  )
}

export const separateNameObservable = ({ pluginParams$ }: { pluginParams$: Observable<SeriesSeparableGraphicPluginParams> }) => {
  return pluginParams$.pipe(
    map(data => data.separateName),
    distinctUntilChanged(),
  )
}

// export const sumSeriesObservable = ({ pluginParams$ }: { pluginParams$: Observable<SeriesSeparableGraphicPluginParams> }) => {
//   return pluginParams$.pipe(
//     map(data => data.sumSeries),
//     distinctUntilChanged(),
//   )
// }

export const seriesLabelsObservable = ({ selectedSeriesData$ }: { selectedSeriesData$: Observable<ModelDataSeries> }) => {
  return selectedSeriesData$.pipe(
    map(data => {
      const seriesLabels = data
        .filter(series => series.length)
        .map(series => {
          return series[0].series
        })
      return Array.from(new Set(seriesLabels))
    }),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a) === JSON.stringify(b)
    }),
  )
}

export const seriesVisibleComputedDataObservable = ({ seriesComputedData$ }: { seriesComputedData$: Observable<ComputedDatumSeries[][]> }) => {
  return seriesComputedData$.pipe(
    map(data => {
      return data.map(series => {
        return series.filter(datum => datum.visible != false)
      })
    })
  )
}

export const seriesComputedSortedDataObservable = ({ seriesComputedData$, separateSeries$, separateName$, datumLabels$ }: {
  seriesComputedData$: Observable<ComputedDatumSeries[][]>,
  separateSeries$: Observable<boolean>,
  separateName$: Observable<boolean>,
  // sumSeries$: Observable<boolean>,
  datumLabels$: Observable<string[]>
}) => {
  return combineLatest({
    seriesComputedData: seriesComputedData$,
    separateSeries: separateSeries$,
    separateName: separateName$,
    // sumSeries: sumSeries$,
    datumLabels: datumLabels$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // // sum series
      // const sumData: ComputedDatumSeries[][] = data.sumSeries == true
      //   ? data.seriesComputedData.map(d => {
      //       return [
      //         // 加總為一筆資料
      //         d.reduce((acc, current) => {
      //           if (acc == null) {
      //             // * 取得第一筆資料
      //             return current
      //           }
      //           // 加總 value
      //           acc.value = acc.value + current.value
      //           return acc
      //         }, null)
      //       ]
      //     })
      //   : data.seriesComputedData
      
      // separate series
      const separateSeriesData: ComputedDatumSeries[][] = data.separateSeries == true
        // 有拆分的話每個series為一組
        ? data.seriesComputedData
        // 無拆分的話所有資料為一組
        : [data.seriesComputedData.flat()]

      // separate label
      const separateNameData: ComputedDatumSeries[][] = data.separateName == true
        // 有拆分的話每個label為一組
        ? (() => {
          // datumLabel 的 index 對應
          const datumLabelIndexMap = data.datumLabels.reduce((acc, datumLabel, index) => {
            acc[datumLabel] = index
            return acc
          }, {} as { [key: string]: number })
          
          return separateSeriesData
            .map(series => {
              return series.reduce((acc, current) => {
                const index = datumLabelIndexMap[current.name]
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
      
      return data.separateSeries == true && data.separateName == true
        // 全部拆分時全部一起排序
        ? separateNameData
            .sort((a, b) => a[0].seq - b[0].seq)
        // 依各個 container 排序
        : separateNameData
            .map(series => {
              return series.sort((a, b) => a.seq - b.seq)
            })
    })
  )
}


// 所有container位置（對應series）
export const seriesContainerPositionObservable = ({ computedSortedData$, pluginParams$, layout$ }: {
  computedSortedData$: Observable<ModelDatumSeries[][]>
  pluginParams$: Observable<SeriesSeparableGraphicPluginParams>
  layout$: Observable<Layout>
}): Observable<ContainerPosition[]> => {

  const gridContainerPosition$ = combineLatest({
    computedSortedData: computedSortedData$,
    pluginParams: pluginParams$,
    layout: layout$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {
      // 已分類資料的分類數量
      const amount = data.computedSortedData.length

      return calcContainerPosition(data.layout, data.pluginParams.container, amount)
    })
  )

  return gridContainerPosition$
}

export const datumContainerPositionMapObservable = ({ seriesContainerPosition$, computedSortedData$ }: {
  seriesContainerPosition$: Observable<ContainerPosition[]>
  computedSortedData$: Observable<ModelDatumSeries[][]>
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