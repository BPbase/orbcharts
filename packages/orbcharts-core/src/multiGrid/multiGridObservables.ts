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
  ComputedDatumTypeMap,
  ContextObserverFn,
  DataTypeMap,
  DataFormatterTypeMap,
  DataFormatterGrid,
  DataFormatterContext,
  DataFormatterValueAxis,
  DataFormatterGroupAxis,
  EventGrid,
  HighlightTarget,
  Layout,
  TransformData } from '../types'
import { getMinAndMaxGrid, transposeData } from '../utils/orbchartsUtils'
import { createAxisLinearScale, createAxisPointScale, createAxisQuantizeScale } from '../utils/d3Utils'
import {
  highlightObservable,
  seriesDataMapObservable,
  groupDataMapObservable } from '../utils/observables'
import {
  gridAxesTransformObservable,
  gridGraphicTransformObservable,
  gridAxesOppositeTransformObservable,
  gridAxesSizeObservable,
  gridVisibleComputedDataObservable } from '../grid/gridObservables'

export const multiGridObservable = ({ fullDataFormatter$, computedData$, layout$, fullChartParams$, event$ }: {
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiGrid'>>
  computedData$: Observable<ComputedDataTypeMap<'multiGrid'>>
  layout$: Observable<Layout>
  fullChartParams$: Observable<ChartParams>
  event$: Subject<EventGrid>
}) => {
  const destroy$ = new Subject()

  return combineLatest({
    fullDataFormatter: fullDataFormatter$,
    computedData: computedData$,
  }).pipe(
    switchMap(async (d) => d),
    distinctUntilChanged((a, b) => {
      return a.fullDataFormatter.multiGrid.length === b.fullDataFormatter.multiGrid.length
        && a.computedData.length === b.computedData.length
    }),
    map(data => {
      // 每次重新計算時，清除之前的訂閱
      destroy$.next(undefined)

      return data.fullDataFormatter.multiGrid.map((gridDataFormatter, gridIndex) => {

        // -- 取得該grid的data和dataFormatter
        const gridDataFormatter$ = of(gridDataFormatter).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )
        const gridComputedData$ = of(data.computedData[gridIndex]).pipe(
          takeUntil(destroy$),
          shareReplay(1)
        )

        // -- Observables --

        const gridAxesTransform$ = gridAxesTransformObservable({
          fullDataFormatter$: gridDataFormatter$,
          layout$: layout$
        }).pipe(
          shareReplay(1)
        )
      
        const gridGraphicTransform$ = gridGraphicTransformObservable({
          computedData$: gridComputedData$,
          fullDataFormatter$: gridDataFormatter$,
          layout$: layout$
        }).pipe(
          shareReplay(1)
        )
      
        const gridAxesOppositeTransform$ = gridAxesOppositeTransformObservable({
          gridAxesTransform$
        }).pipe(
          shareReplay(1)
        )
      
        const gridAxesSize$ = gridAxesSizeObservable({
          fullDataFormatter$: gridDataFormatter$,
          layout$: layout$
        }).pipe(
          shareReplay(1)
        )
      
        const datumList$ = gridComputedData$.pipe(
          map(d => d.flat())
        ).pipe(
          shareReplay(1)
        )
      
        const gridHighlight$ = highlightObservable({
          datumList$,
          fullChartParams$: fullChartParams$,
          event$: event$
        }).pipe(
          shareReplay(1)
        )
      
        const SeriesDataMap$ = seriesDataMapObservable({
          datumList$: datumList$
        }).pipe(
          shareReplay(1)
        )
      
        const GroupDataMap$ = groupDataMapObservable({
          datumList$: datumList$
        }).pipe(
          shareReplay(1)
        )
      
        const visibleComputedData$ = gridVisibleComputedDataObservable({
          computedData$: gridComputedData$,
        }).pipe(
          shareReplay(1)
        )
      
        return {
          gridAxesTransform$,
          gridGraphicTransform$,
          gridAxesOppositeTransform$,
          gridAxesSize$,
          gridHighlight$,
          SeriesDataMap$,
          GroupDataMap$,
          visibleComputedData$
        }
      })
    })
  )
}