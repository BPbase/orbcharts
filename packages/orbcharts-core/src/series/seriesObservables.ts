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
  ComputedDataTypeMap } from '../types'
import { highlightObservable } from '../utils/observables'

// export const seriesHighlightObservable = ({ computedData$, fullChartParams$, event$ }: {
//   computedData$: Observable<ComputedDataTypeMap<'series'>>
//   fullChartParams$: Observable<ChartParams>
//   event$: Subject<any>
// }): Observable<string[]> => {
//   return highlightObservable ({ datumList$: computedData$, fullChartParams$, event$ })
// }