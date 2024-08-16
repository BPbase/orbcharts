import type { Observable } from 'rxjs'
import {
  takeUntil,
  map,
  switchMap,
  combineLatest,
  distinctUntilChanged,
  shareReplay
} from 'rxjs'
import type { ContextObserverMultiGrid, ComputedDataGrid, DataFormatterGrid } from '@orbcharts/core'
// import { DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT } from '@orbcharts/core/src/defaults'

interface GridPluginParams {
  gridIndex: number
}

// 對應grid資料的plugin所需Observable（必須有gridIndex）
export const gridPluginObservables = (observer: ContextObserverMultiGrid<GridPluginParams>) => {
  const gridIndex$ = observer.fullParams$.pipe(
    map(fullParams => fullParams.gridIndex),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const gridComputedData$: Observable<ComputedDataGrid> = combineLatest({
    computedData: observer.computedData$,
    gridIndex: gridIndex$,
  }).pipe(
    map((data) => {
      return data.computedData[data.gridIndex] ?? data.computedData[0]
    })
  )

  const gridDataFormatter$: Observable<DataFormatterGrid> = combineLatest({
    fullDataFormatter: observer.fullDataFormatter$,
    gridIndex: gridIndex$,
  }).pipe(
    map((data) => {
      const defaultGrid = data.fullDataFormatter.gridList[0] // ?? DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT
      
      return {
        type: 'grid',
        grid: {
          ...data.fullDataFormatter.gridList[data.gridIndex] ?? defaultGrid
        },
        container: {
          ...data.fullDataFormatter.container
        }
      }
    })
  )

  const gridDetail$ = combineLatest({
    multiGridEachDetail: observer.multiGridEachDetail$,
    gridIndex: gridIndex$,
  }).pipe(
    switchMap(async d => d),
    map(data => {
      return data.multiGridEachDetail[data.gridIndex] ?? data.multiGridEachDetail[0]
    }),
    shareReplay(1)
  )

  const gridAxesTransform$ = gridDetail$.pipe(
    switchMap(d => d.gridAxesTransform$)
  )

  const gridGraphicTransform$ = gridDetail$.pipe(
    switchMap(d => d.gridGraphicTransform$)
  )

  const gridAxesOppositeTransform$ = gridDetail$.pipe(
    switchMap(d => d.gridAxesOppositeTransform$)
  )

  const gridAxesSize$ = gridDetail$.pipe(
    switchMap(d => d.gridAxesSize$)
  )

  const gridHighlight$ = gridDetail$.pipe(
    switchMap(d => d.gridHighlight$)
  )

  const SeriesDataMap$ = gridDetail$.pipe(
    switchMap(d => d.SeriesDataMap$)
  )

  const GroupDataMap$ = gridDetail$.pipe(
    switchMap(d => d.GroupDataMap$)
  )

  const visibleComputedData$ = gridDetail$.pipe(
    switchMap(d => d.visibleComputedData$)
  )

  const isSeriesPositionSeprate$ = gridDetail$.pipe(
    switchMap(d => d.isSeriesPositionSeprate$)
  )

  const gridContainer$ = gridDetail$.pipe(
    switchMap(d => d.gridContainer$)
  )

  return {
    gridComputedData$,
    gridDataFormatter$,
    gridAxesTransform$,
    gridGraphicTransform$,
    gridAxesOppositeTransform$,
    gridAxesSize$,
    gridHighlight$,
    SeriesDataMap$,
    GroupDataMap$,
    visibleComputedData$,
    isSeriesPositionSeprate$,
    gridContainer$
  }
}