import {
  combineLatest,
  distinctUntilChanged,
  filter,
  of,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable, 
  combineLatestAll} from 'rxjs'
import type {
  AxisPosition,
  ChartType,
  ChartParams,
  ComputedDataTypeMap,
  ComputedDataGrid,
  DataTypeMap,
  DataFormatterTypeMap,
  DataFormatterGrid,
  DataFormatterMultiGridContainer,
  EventMultiGrid,
  HighlightTarget,
  Layout,
  TransformData } from '../types'
import type { ContextObserverGridDetail, ContextObserverMultiGridDetail } from '../types'
import {
  highlightObservable,
  seriesDataMapObservable,
  groupDataMapObservable } from '../utils/observables'
import {
  gridAxesTransformObservable,
  gridGraphicTransformObservable,
  gridGraphicReverseScaleObservable,
  gridAxesReverseTransformObservable,
  gridAxesSizeObservable,
  existSeriesLabelsObservable,
  gridComputedLayoutDataObservable,
  gridVisibleComputedDataObservable,
  gridVisibleComputedLayoutDataObservable,
  isSeriesPositionSeprateObservable,
  gridContainerObservable } from '../grid/gridObservables'
import { DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT } from '../defaults'
import { calcGridContainerPosition } from '../utils/orbchartsUtils'

// 每一個grid計算出來的所有Observable
export const multiGridEachDetailObservable = ({ fullDataFormatter$, computedData$, layout$, fullChartParams$, event$ }: {
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiGrid'>>
  computedData$: Observable<ComputedDataTypeMap<'multiGrid'>>
  layout$: Observable<Layout>
  fullChartParams$: Observable<ChartParams>
  event$: Subject<EventMultiGrid>
}): Observable<ContextObserverMultiGridDetail[]> => {

  const destroy$ = new Subject()

  // highlight全部grid
  const allGridHighlight$ = highlightObservable({
    datumList$: computedData$.pipe(
      map(d => d.flat().flat()),
      shareReplay(1)
    ),
    fullChartParams$: fullChartParams$,
    event$: event$
  }).pipe(
    shareReplay(1)
  )


  return combineLatest({
    fullDataFormatter: fullDataFormatter$,
    computedData: computedData$,
  }).pipe(
    switchMap(async (d) => d),
    // distinctUntilChanged((a, b) => {
    //   // 只有當computedData的長度改變時，才重新計算
    //   return a.computedData.length === b.computedData.length
    // }),
    map(data => {
      // 每次重新計算時，清除之前的訂閱
      destroy$.next(undefined)

      const defaultGrid = data.fullDataFormatter.gridList[0] ?? DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT

      return data.computedData.map((gridComputedData, gridIndex) => {

        // -- 取得該grid的data和dataFormatter
        const grid = data.fullDataFormatter.gridList[gridIndex] ?? defaultGrid
        const gridDataFormatter: DataFormatterGrid = {
          type: 'grid',
          visibleFilter: data.fullDataFormatter.visibleFilter as any,
          grid: {
            ...grid
          },
          container: {
            ...data.fullDataFormatter.container
          }
        }
        const gridDataFormatter$ = of(gridDataFormatter).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
        const gridComputedData$ = of(gridComputedData).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )

        const isSeriesPositionSeprate$ = isSeriesPositionSeprateObservable({
          computedData$: gridComputedData$,
          fullDataFormatter$: gridDataFormatter$,
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
      
        const gridContainer$ = gridContainerObservable({
          computedData$: gridComputedData$,
          fullDataFormatter$: gridDataFormatter$,
          fullChartParams$,
          layout$
        }).pipe(
          shareReplay(1)
        )
        
        const gridAxesTransform$ = gridAxesTransformObservable({
          fullDataFormatter$: gridDataFormatter$,
          layout$: layout$
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        
        const gridAxesReverseTransform$ = gridAxesReverseTransformObservable({
          gridAxesTransform$
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
        
        const gridGraphicTransform$ = gridGraphicTransformObservable({
          computedData$: gridComputedData$,
          fullDataFormatter$: gridDataFormatter$,
          layout$: layout$
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        const gridGraphicReverseScale$ = gridGraphicReverseScaleObservable({
          gridContainer$: gridContainer$,
          gridAxesTransform$: gridAxesTransform$,
          gridGraphicTransform$: gridGraphicTransform$,
        })
    
        const gridAxesSize$ = gridAxesSizeObservable({
          fullDataFormatter$: gridDataFormatter$,
          layout$: layout$
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        const datumList$ = gridComputedData$.pipe(
          map(d => d.flat())
        ).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        // const gridHighlight$ = highlightObservable({
        //   datumList$,
        //   fullChartParams$: fullChartParams$,
        //   event$: event$
        // }).pipe(
        //   shareReplay(1)
        // )
    
        const existSeriesLabels$ = existSeriesLabelsObservable({
          computedData$: gridComputedData$,
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        const SeriesDataMap$ = seriesDataMapObservable({
          datumList$: datumList$
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        const GroupDataMap$ = groupDataMapObservable({
          datumList$: datumList$
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        const visibleComputedData$ = gridVisibleComputedDataObservable({
          computedData$: gridComputedData$,
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        const computedLayoutData$ = gridComputedLayoutDataObservable({
          computedData$: gridComputedData$,
          fullDataFormatter$: gridDataFormatter$,
          layout$: layout$,
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        const visibleComputedLayoutData$ = gridVisibleComputedLayoutDataObservable({
          computedLayoutData$: computedLayoutData$,
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )

        return <ContextObserverMultiGridDetail>{
          gridContainer$,
          gridAxesTransform$,
          gridAxesReverseTransform$,
          gridGraphicTransform$,
          gridGraphicReverseScale$,
          gridAxesSize$,
          gridHighlight$: allGridHighlight$,
          existSeriesLabels$,
          SeriesDataMap$,
          GroupDataMap$,
          dataFormatter$: gridDataFormatter$,
          computedData$: gridComputedData$,
          computedLayoutData$,
          visibleComputedData$,
          visibleComputedLayoutData$,
          isSeriesPositionSeprate$
        }
      })
    })
  )
}


// 所有container位置（對應series）
export const multiGridContainerObservable = ({ computedData$, fullDataFormatter$, fullChartParams$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiGrid'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiGrid'>>
  fullChartParams$: Observable<ChartParams>
  layout$: Observable<Layout>
}) => {

  const multiGridContainer$ = combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$,
    fullChartParams: fullChartParams$,
    layout: layout$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {

      const defaultGrid = data.fullDataFormatter.gridList[0] ?? DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT
      
      const boxArr = data.computedData.map((gridData, gridIndex) => {
        const grid = data.fullDataFormatter.gridList[gridIndex] ?? defaultGrid
        
        // 有設定series定位
        const hasSeriesPosition = grid.seriesSlotIndexes && grid.seriesSlotIndexes.length === gridData.length
          ? true
          : false
        
        if (hasSeriesPosition) {
          // -- 依seriesSlotIndexes計算 --
          return gridData.map((seriesData, seriesIndex) => {
            const columnIndex = grid.seriesSlotIndexes[seriesIndex] % data.fullDataFormatter.container.columnAmount
            const rowIndex = Math.floor(grid.seriesSlotIndexes[seriesIndex] / data.fullDataFormatter.container.columnAmount)
            const { translate, scale } = calcGridContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
            return {
              slotIndex: grid.seriesSlotIndexes[seriesIndex],
              rowIndex,
              columnIndex,
              translate,
              scale,
            }
          })
        } else {
          // -- 依grid的slotIndex計算 --
          const columnIndex = grid.slotIndex % data.fullDataFormatter.container.columnAmount
          const rowIndex = Math.floor(grid.slotIndex / data.fullDataFormatter.container.columnAmount)
          return gridData.map((seriesData, seriesIndex) => {
            const { translate, scale } = calcGridContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
            return {
              slotIndex: grid.slotIndex,
              rowIndex,
              columnIndex,
              translate,
              scale,
            }
          })
        }

      })
      return boxArr
    }),
  )

  return multiGridContainer$
}