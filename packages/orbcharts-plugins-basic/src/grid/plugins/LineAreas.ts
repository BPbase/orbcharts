import {
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_LINE_AREAS_PARAMS } from '../defaults'
import { createBaseLineAreas } from '../../base/BaseLineAreas'

const pluginName = 'LineAreas'

export const LineAreas = defineGridPlugin(pluginName, DEFAULT_LINE_AREAS_PARAMS)(({ selection, name, observer, subject }) => {

  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseLineAreas(pluginName, {
    selection,
    computedData$: observer.computedData$,
    existSeriesLabels$: observer.existSeriesLabels$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridHighlight$: observer.gridHighlight$,
    gridContainer$: observer.gridContainer$,
    layout$: observer.layout$,
    event$: subject.event$,
  })


  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})