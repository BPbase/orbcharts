import {
  Subject,
  Observable } from 'rxjs'
import { defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_BARS_TRIANGLE_PLUGIN_PARAMS } from '../defaults'
import { createBaseBarsTriangle } from '../../base/BaseBarsTriangle'

const pluginName = 'BarsTriangle'

export const BarsTriangle = defineGridPlugin(pluginName, DEFAULT_BARS_TRIANGLE_PLUGIN_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseBarsTriangle(pluginName, {
    selection,
    computedData$: observer.computedData$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
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