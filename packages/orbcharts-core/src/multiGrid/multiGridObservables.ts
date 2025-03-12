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
  ContextObserverMultiGridDetail,
  ContainerSize,
  DataTypeMap,
  DataFormatterTypeMap,
  DataFormatterGrid,
  DataFormatterMultiGridContainer,
  EventMultiGrid,
  ContainerPositionScaled,
  HighlightTarget,
  Layout,
  TransformData } from '../../lib/core-types'
import {
  highlightObservable,
  seriesDataMapObservable,
  groupDataMapObservable } from '../utils/observables'
import {
  gridComputedAxesDataObservable,
  gridAxesSizeObservable,
  gridAxesContainerSizeObservable,
  gridSeriesLabelsObservable,
  gridVisibleComputedDataObservable,
  gridVisibleComputedAxesDataObservable,
  // isSeriesSeprateObservable,
  gridContainerPositionObservable,
  computedStackedDataObservables,
  groupScaleDomainValueObservable,
  filteredMinMaxValueObservable,
  gridAxesTransformObservable,
  gridAxesReverseTransformObservable,
  gridGraphicTransformObservable,
  gridGraphicReverseScaleObservable,
} from '../grid/gridObservables'
import { DEFAULT_DATA_FORMATTER_MULTI_GRID_GRID } from '../defaults'
import { calcContainerPositionScaled } from '../utils/orbchartsUtils'

// 每一個grid計算出來的所有Observable
export const multiGridEachDetailObservable = ({ fullDataFormatter$, computedData$, layout$, fullChartParams$, event$, containerSize$ }: {
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiGrid'>>
  computedData$: Observable<ComputedDataTypeMap<'multiGrid'>>
  layout$: Observable<Layout>
  fullChartParams$: Observable<ChartParams>
  event$: Subject<EventMultiGrid>
  containerSize$: Observable<ContainerSize>
}): Observable<ContextObserverMultiGridDetail[]> => {

  const destroy$ = new Subject()

  // // highlight全部grid
  // const allGridHighlight$ = highlightObservable({
  //   datumList$: computedData$.pipe(
  //     map(d => d.flat().flat()),
  //     shareReplay(1)
  //   ),
  //   fullChartParams$: fullChartParams$,
  //   event$: event$
  // }).pipe(
  //   shareReplay(1)
  // )

  const multiGridContainer$ = multiGridContainerObservable({
    computedData$: computedData$,
    fullDataFormatter$: fullDataFormatter$,
    layout$: layout$,
  }).pipe(
    shareReplay(1)
  )

  return combineLatest({
    fullDataFormatter: fullDataFormatter$,
    computedData: computedData$,
    multiGridContainer: multiGridContainer$
  }).pipe(
    switchMap(async (d) => d),
    // distinctUntilChanged((a, b) => {
    //   // 只有當computedData的長度改變時，才重新計算
    //   return a.computedData.length === b.computedData.length
    // }),
    map(data => {
      // 每次重新計算時，清除之前的訂閱
      destroy$.next(undefined)

      const defaultGrid = data.fullDataFormatter.gridList[0] ?? DEFAULT_DATA_FORMATTER_MULTI_GRID_GRID

      return data.computedData.map((gridComputedData, gridIndex) => {

        // -- 取得該grid的data和dataFormatter
        const grid = data.fullDataFormatter.gridList[gridIndex] ?? defaultGrid
        const gridDataFormatter: DataFormatterGrid = {
          type: 'grid',
          visibleFilter: data.fullDataFormatter.visibleFilter as any,
          // grid: {
            ...grid,
          // },
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

        // const isSeriesSeprate$ = isSeriesSeprateObservable({
        //   computedData$: gridComputedData$,
        //   fullDataFormatter$: gridDataFormatter$,
        // }).pipe(
        //   takeUntil(destroy$),
        //   shareReplay(1)
        // )
      
        // const gridContainerPosition$ = gridContainerPositionObservable({
        //   computedData$: gridComputedData$,
        //   fullDataFormatter$: gridDataFormatter$,
        //   layout$
        // }).pipe(
        //   shareReplay(1)
        // )

        const isSeriesSeprate$ = gridDataFormatter$.pipe(
          map(d => d.separateSeries),
          distinctUntilChanged(),
          shareReplay(1)
        )

        const gridContainerPosition$ = of(data.multiGridContainer[gridIndex]).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )

        const gridAxesSize$ = gridAxesSizeObservable({
          fullDataFormatter$: gridDataFormatter$,
          layout$: layout$
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
        
        const gridAxesContainerSize$ = gridAxesContainerSizeObservable({
          fullDataFormatter$: gridDataFormatter$,
          containerSize$: containerSize$
        }).pipe(
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
    
        const seriesLabels$ = gridSeriesLabelsObservable({
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

        const computedAxesData$ = gridComputedAxesDataObservable({
          computedData$: gridComputedData$,
          fullDataFormatter$: gridDataFormatter$,
          layout$: layout$,
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        const visibleComputedAxesData$ = gridVisibleComputedAxesDataObservable({
          computedAxesData$: computedAxesData$,
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )

        const computedStackedData$ = computedStackedDataObservables({
          computedData$: gridComputedData$,
          isSeriesSeprate$: isSeriesSeprate$
        }).pipe(
          shareReplay(1)
        )

        const groupScaleDomainValue$ = groupScaleDomainValueObservable({
          computedData$: gridComputedData$,
          fullDataFormatter$: gridDataFormatter$,
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )

        const filteredMinMaxValue$ = filteredMinMaxValueObservable({
          computedData$: gridComputedData$,
          groupScaleDomainValue$: groupScaleDomainValue$,
        }).pipe(
          takeUntil(destroy$),
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
          groupScaleDomainValue$: groupScaleDomainValue$,
          filteredMinMaxValue$: filteredMinMaxValue$,
          fullDataFormatter$: gridDataFormatter$,
          layout$: layout$
        }).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
    
        const gridGraphicReverseScale$ = gridGraphicReverseScaleObservable({
          gridContainerPosition$: gridContainerPosition$,
          gridAxesTransform$: gridAxesTransform$,
          gridGraphicTransform$: gridGraphicTransform$,
        })

        return {
          isSeriesSeprate$,
          gridContainerPosition$,
          gridAxesSize$,
          gridAxesContainerSize$,
          // gridHighlight$: allGridHighlight$,
          seriesLabels$,
          SeriesDataMap$,
          GroupDataMap$,
          dataFormatter$: gridDataFormatter$,
          computedData$: gridComputedData$,
          computedAxesData$,
          visibleComputedData$,
          visibleComputedAxesData$,
          computedStackedData$,
          groupScaleDomainValue$,
          filteredMinMaxValue$,
          gridAxesTransform$,
          gridAxesReverseTransform$,
          gridGraphicTransform$,
          gridGraphicReverseScale$,
        }
      })
    })
  )
}


// 所有container位置（對應series）
export const multiGridContainerObservable = ({ computedData$, fullDataFormatter$, layout$ }: {
  computedData$: Observable<ComputedDataTypeMap<'multiGrid'>>
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiGrid'>>
  layout$: Observable<Layout>
}): Observable<ContainerPositionScaled[][]> => {

  return combineLatest({
    computedData: computedData$,
    fullDataFormatter: fullDataFormatter$,
    layout: layout$,
  }).pipe(
    switchMap(async (d) => d),
    map(data => {

      const defaultGrid = data.fullDataFormatter.gridList[0] ?? DEFAULT_DATA_FORMATTER_MULTI_GRID_GRID
      const slotAmount = data.computedData.reduce((acc, gridData, gridIndex) => {
        const grid = data.fullDataFormatter.gridList[gridIndex] ?? defaultGrid
        const gridSlotAmount = grid.separateSeries
          ? gridData.length
          : data.fullDataFormatter.separateGrid
            ? 1
            : 0 // 如果grid和series都不分開，則slotAmount不增加（在相同的slot）
        return acc + gridSlotAmount
      }, 0) || 1

      const gridContainerLayout = calcContainerPositionScaled(data.layout, data.fullDataFormatter.container, slotAmount)

      let accGridSlotIndex = 0
      const gridContainerPositionArr = data.computedData.map((gridData, gridIndex) => {
        const grid = data.fullDataFormatter.gridList[gridIndex] ?? defaultGrid
        const seriesContainerArr = gridData.map((seriesData, seriesIndex) => {
          const container = gridContainerLayout[accGridSlotIndex]
          if (grid.separateSeries) {
            accGridSlotIndex += 1
          }
          return container
        })
        if (!grid.separateSeries && data.fullDataFormatter.separateGrid) {
          accGridSlotIndex += 1
        }
        return seriesContainerArr
      })
      // console.log('gridContainerPositionArr', gridContainerPositionArr)

      // let accGridSlotIndex = 0

      // const gridContainerPositionArr = data.computedData.map((gridData, gridIndex) => {
      //   const grid = data.fullDataFormatter.gridList[gridIndex] ?? defaultGrid
        
      //   if (grid.separateSeries) {
      //     // -- 依seriesSlotIndexes計算 --
      //     const seriesContainerArr = gridData.map((seriesData, seriesIndex) => {
      //       const currentSlotIndex = accGridSlotIndex + seriesIndex
      //       const columnIndex = currentSlotIndex % data.fullDataFormatter.container.columnAmount
      //       const rowIndex = Math.floor(currentSlotIndex / data.fullDataFormatter.container.columnAmount)
      //       const { translate, scale } = calcGridContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
      //       return {
      //         slotIndex: currentSlotIndex,
      //         rowIndex,
      //         columnIndex,
      //         translate,
      //         scale,
      //       }
      //     })
      //     accGridSlotIndex += seriesContainerArr.length
      //     return seriesContainerArr
      //   } else {
      //     // -- 依grid的slotIndex計算 --
      //     const columnIndex = accGridSlotIndex % data.fullDataFormatter.container.columnAmount
      //     const rowIndex = Math.floor(accGridSlotIndex / data.fullDataFormatter.container.columnAmount)
      //     const seriesContainerArr = gridData.map((seriesData, seriesIndex) => {
      //       const { translate, scale } = calcGridContainerPosition(data.layout, data.fullDataFormatter.container, rowIndex, columnIndex)
      //       return {
      //         slotIndex: accGridSlotIndex,
      //         rowIndex,
      //         columnIndex,
      //         translate,
      //         scale,
      //       }
      //     })
      //     if (data.fullDataFormatter.separateGrid) {
      //       accGridSlotIndex += 1
      //     }
      //     return seriesContainerArr
      //   }
      // })

      return gridContainerPositionArr
    }),
  )
}