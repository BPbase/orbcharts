import type { Observable } from 'rxjs'
import {
  Subject,
  takeUntil,
  of,
  map,
  reduce,
  switchMap,
  combineLatest,
  distinctUntilChanged,
  shareReplay
} from 'rxjs'
import type {
  ContextObserverMultiGrid,
  ComputedDataGrid,
  DataFormatterGrid,
  ContextObserverGridDetail,
  ContextObserverMultiGridDetail } from '../../lib/core-types'

// 可設定多個gridIndex的params
interface MultiGridPluginParams {
  gridIndexes: number[] | 'all'
}

// 對應grid資料的plugin所需Observable（必須有gridIndexes）
export const multiGridPluginDetailObservables = (observer: ContextObserverMultiGrid<MultiGridPluginParams>): Observable<ContextObserverMultiGridDetail[]> => {
  const gridIndexes$ = observer.fullParams$.pipe(
    map(fullParams => fullParams.gridIndexes),
    distinctUntilChanged(),
    shareReplay(1)
  )

  return combineLatest({
    multiGridEachDetail: observer.multiGridEachDetail$,
    gridIndexes: gridIndexes$,
  }).pipe(
    switchMap(async d => d),
    map(data => {
      // 對應所有grid
      if (data.gridIndexes === 'all') {
        return data.multiGridEachDetail
      }
      // 自訂對應grid
      return data.gridIndexes.map(gridIndex => {
        return data.multiGridEachDetail[gridIndex] ?? data.multiGridEachDetail[0]
      })
    })
  )
}

