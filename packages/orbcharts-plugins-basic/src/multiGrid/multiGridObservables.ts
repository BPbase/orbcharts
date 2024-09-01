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
import type { ContextObserverMultiGrid, ComputedDataGrid, DataFormatterGrid, ContextObserverGridDetail } from '@orbcharts/core'
// import { DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT } from '@orbcharts/core/src/defaults'

// interface GridPluginParams {
//   gridIndex: number
// }

// interface GridPluginObservables extends ContextObserverGridDetail {
//   gridComputedData$: Observable<ComputedDataGrid>
//   gridDataFormatter$: Observable<DataFormatterGrid>
// }

// // 對應grid資料的plugin所需Observable（必須有gridIndex）
// export const gridPluginObservables = (observer: ContextObserverMultiGrid<GridPluginParams>): GridPluginObservables => {
//   const gridIndex$ = observer.fullParams$.pipe(
//     map(fullParams => fullParams.gridIndex),
//     distinctUntilChanged(),
//     shareReplay(1)
//   )

//   const gridComputedData$: Observable<ComputedDataGrid> = combineLatest({
//     computedData: observer.computedData$,
//     gridIndex: gridIndex$,
//   }).pipe(
//     map((data) => {
//       return data.computedData[data.gridIndex] ?? data.computedData[0]
//     })
//   )

//   const gridDataFormatter$: Observable<DataFormatterGrid> = combineLatest({
//     fullDataFormatter: observer.fullDataFormatter$,
//     gridIndex: gridIndex$,
//   }).pipe(
//     map((data) => {
//       const defaultGrid = data.fullDataFormatter.gridList[0] // ?? DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT
      
//       return {
//         type: 'grid',
//         grid: {
//           ...data.fullDataFormatter.gridList[data.gridIndex] ?? defaultGrid
//         },
//         container: {
//           ...data.fullDataFormatter.container
//         }
//       }
//     })
//   )

//   const gridDetail$ = combineLatest({
//     multiGridEachDetail: observer.multiGridEachDetail$,
//     gridIndex: gridIndex$,
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       return data.multiGridEachDetail[data.gridIndex] ?? data.multiGridEachDetail[0]
//     }),
//     shareReplay(1)
//   )

//   const isSeriesPositionSeprate$ = gridDetail$.pipe(
//     switchMap(d => d.isSeriesPositionSeprate$)
//   )

//   const gridContainer$ = gridDetail$.pipe(
//     switchMap(d => d.gridContainer$)
//   )

//   const gridAxesTransform$ = gridDetail$.pipe(
//     switchMap(d => d.gridAxesTransform$)
//   )

//   const gridAxesReverseTransform$ = gridDetail$.pipe(
//     switchMap(d => d.gridAxesReverseTransform$)
//   )
  
//   const gridAxesSize$ = gridDetail$.pipe(
//     switchMap(d => d.gridAxesSize$)
//   )
  
//   const gridGraphicTransform$ = gridDetail$.pipe(
//     switchMap(d => d.gridGraphicTransform$)
//   )

//   const gridGraphicReverseScale$ = gridDetail$.pipe(
//     switchMap(d => d.gridGraphicReverseScale$)
//   )

//   const gridHighlight$ = gridDetail$.pipe(
//     switchMap(d => d.gridHighlight$)
//   )

//   const existSeriesLabels$ = gridDetail$.pipe(
//     switchMap(d => d.existSeriesLabels$)
//   )

//   const SeriesDataMap$ = gridDetail$.pipe(
//     switchMap(d => d.SeriesDataMap$)
//   )

//   const GroupDataMap$ = gridDetail$.pipe(
//     switchMap(d => d.GroupDataMap$)
//   )

//   const visibleComputedData$ = gridDetail$.pipe(
//     switchMap(d => d.visibleComputedData$)
//   )

  

//   return {
//     gridComputedData$,
//     gridDataFormatter$,
//     gridAxesTransform$,
//     gridGraphicTransform$,
//     gridGraphicReverseScale$,
//     gridAxesReverseTransform$,
//     gridAxesSize$,
//     gridHighlight$,
//     existSeriesLabels$,
//     SeriesDataMap$,
//     GroupDataMap$,
//     visibleComputedData$,
//     isSeriesPositionSeprate$,
//     gridContainer$
//   }
// }

// 可設定多個gridIndex的params
interface MultiGridPluginParams {
  gridIndexes: number[]
}

interface MultiGridDetailObservables extends ContextObserverGridDetail {
  gridComputedData$: Observable<ComputedDataGrid>
  gridDataFormatter$: Observable<DataFormatterGrid>
}


// 對應grid資料的plugin所需Observable（必須有gridIndexes）
export const multiGridDetailObservables = (observer: ContextObserverMultiGrid<MultiGridPluginParams>): Observable<MultiGridDetailObservables[]> => {
  const gridIndexes$ = observer.fullParams$.pipe(
    map(fullParams => fullParams.gridIndexes),
    distinctUntilChanged(),
    shareReplay(1)
  )
  const destroy$ = new Subject()

  // 合併所有gridHighlight$
  const gridHighlight$ = observer.multiGridEachDetail$.pipe(
    // switchMap(data => concat(...data.map(d => d.gridHighlight$))),
    switchMap(data => {
      return combineLatest(data.map(d => d.gridHighlight$))
    }),
    map(d => d.flat()),
    shareReplay(1)
  )

  return gridIndexes$.pipe(
    map(gridIndexes => {
      return gridIndexes.map(gridIndex => {
        // 每次重新計算時，清除之前的訂閱
        destroy$.next(undefined)

        const gridIndex$ = of(gridIndex).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )

        const gridComputedData$: Observable<ComputedDataGrid> = combineLatest({
          computedData: observer.computedData$,
          gridIndex: gridIndex$,
        }).pipe(
          takeUntil(destroy$),
          map((data) => {
            return data.computedData[data.gridIndex] ?? data.computedData[0]
          })
        )
      
        const gridDataFormatter$: Observable<DataFormatterGrid> = combineLatest({
          fullDataFormatter: observer.fullDataFormatter$,
          gridIndex: gridIndex$,
        }).pipe(
          takeUntil(destroy$),
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
          takeUntil(destroy$),
          switchMap(async d => d),
          map(data => {
            return data.multiGridEachDetail[data.gridIndex] ?? data.multiGridEachDetail[0]
          }),
          shareReplay(1)
        )
      
        const isSeriesPositionSeprate$ = gridDetail$.pipe(
          switchMap(d => d.isSeriesPositionSeprate$)
        )
      
        const gridContainer$ = gridDetail$.pipe(
          switchMap(d => d.gridContainer$)
        )
      
        const gridAxesTransform$ = gridDetail$.pipe(
          switchMap(d => d.gridAxesTransform$)
        )
      
        const gridAxesReverseTransform$ = gridDetail$.pipe(
          switchMap(d => d.gridAxesReverseTransform$)
        )
        
        const gridAxesSize$ = gridDetail$.pipe(
          switchMap(d => d.gridAxesSize$)
        )
        
        const gridGraphicTransform$ = gridDetail$.pipe(
          switchMap(d => d.gridGraphicTransform$)
        )
      
        const gridGraphicReverseScale$ = gridDetail$.pipe(
          switchMap(d => d.gridGraphicReverseScale$)
        )
      
        // const gridHighlight$ = gridDetail$.pipe(
        //   switchMap(d => d.gridHighlight$)
        // )
      
        const existSeriesLabels$ = gridDetail$.pipe(
          switchMap(d => d.existSeriesLabels$)
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
      
        return {
          gridComputedData$,
          gridDataFormatter$,
          gridAxesTransform$,
          gridGraphicTransform$,
          gridGraphicReverseScale$,
          gridAxesReverseTransform$,
          gridAxesSize$,
          gridHighlight$,
          existSeriesLabels$,
          SeriesDataMap$,
          GroupDataMap$,
          visibleComputedData$,
          isSeriesPositionSeprate$,
          gridContainer$
        }
      })
    })
  )
}