import {
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil,
  Subject,
  Observable } from 'rxjs'
import { defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_BAR_STACK_PARAMS } from '../defaults'
import { createBaseBarStack } from '../../base/BaseBarStack'

const pluginName = 'BarStack'


export const BarStack = defineGridPlugin(pluginName, DEFAULT_BAR_STACK_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const isSeriesSeprate$ = observer.fullDataFormatter$.pipe(
    takeUntil(destroy$),
    map(d => d.grid.separateSeries),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const unsubscribeBaseBars = createBaseBarStack(pluginName, {
    selection,
    computedData$: observer.computedData$,
    computedLayoutData$: observer.computedLayoutData$,
    visibleComputedData$: observer.visibleComputedData$,
    visibleComputedLayoutData$: observer.visibleComputedLayoutData$,
    seriesLabels$: observer.seriesLabels$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridGraphicReverseScale$: observer.gridGraphicReverseScale$,
    gridAxesSize$: observer.gridAxesSize$,
    gridHighlight$: observer.gridHighlight$,
    gridContainerPosition$: observer.gridContainerPosition$,
    isSeriesSeprate$,
    event$: subject.event$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})