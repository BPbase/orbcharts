import {
  of,
  Subject,
  Observable } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_BARS_PARAMS } from '../defaults'
import { createBaseBars } from '../../base/BaseBars'

const pluginName = 'BarsPN'

export const BarsPN = defineGridPlugin(pluginName, DEFAULT_BARS_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseBars(pluginName, {
    selection,
    computedData$: observer.computedData$,
    computedLayoutData$: observer.computedLayoutData$,
    visibleComputedData$: observer.visibleComputedData$,
    visibleComputedLayoutData$: observer.visibleComputedLayoutData$,
    seriesLabels$: observer.seriesLabels$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridGraphicReverseScale$: observer.gridGraphicReverseScale$,
    gridAxesSize$: observer.gridAxesSize$,
    gridHighlight$: observer.gridHighlight$,
    gridContainerPosition$: observer.gridContainerPosition$,
    // isSeriesSeprate$: observer.isSeriesSeprate$,
    isSeriesSeprate$: of(true), // hack: 永遠為true，可以強制讓每組series的bars的x位置都是一樣的
    event$: subject.event$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})