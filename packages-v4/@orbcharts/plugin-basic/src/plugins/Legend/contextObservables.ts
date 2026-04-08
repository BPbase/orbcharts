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
  ModelDataSeries,
} from '@orbcharts/core'
import type { LegendPluginParams } from './types'
import type { ComputedDatumSeries } from '../../types/ComputedData'

export const seriesComputedDataObservable = ({ selectedSeriesData$, pluginParams$ }: {
  selectedSeriesData$: Observable<ModelDataSeries>
  pluginParams$: Observable<LegendPluginParams>
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
