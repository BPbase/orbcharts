import {
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '../../../lib/core'
import { DEFAULT_LINE_AREAS_PARAMS } from '../defaults'
import { createBaseLineAreas } from '../../base/BaseLineAreas'

const pluginName = 'LineAreas'

export const LineAreas = defineGridPlugin(pluginName, DEFAULT_LINE_AREAS_PARAMS)(({ selection, name, observer, subject }) => {

  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseLineAreas(pluginName, {
    selection,
    computedData$: observer.computedData$,
    visibleComputedData$: observer.visibleComputedData$,
    computedLayoutData$: observer.computedLayoutData$,
    visibleComputedLayoutData$: observer.visibleComputedLayoutData$,
    seriesLabels$: observer.seriesLabels$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridHighlight$: observer.gridHighlight$,
    gridContainerPosition$: observer.gridContainerPosition$,
    allContainerPosition$: observer.gridContainerPosition$,
    layout$: observer.layout$,
    event$: subject.event$,
  })


  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})