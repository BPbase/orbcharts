import {
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_LINES_PLUGIN_PARAMS } from '../defaults'
import { createBaseLines } from '../../base/BaseLines'

const pluginName = 'Lines'

export const Lines = defineGridPlugin(pluginName, DEFAULT_LINES_PLUGIN_PARAMS)(({ selection, name, observer, subject }) => {

  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseLines(pluginName, {
    selection,
    computedData$: observer.computedData$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridHighlight$: observer.gridHighlight$,
    event$: subject.event$,
  })


  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})