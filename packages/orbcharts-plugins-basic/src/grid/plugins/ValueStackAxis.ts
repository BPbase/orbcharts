import {
  takeUntil,
  map,
  distinctUntilChanged,
  shareReplay,
  switchMap,
  iif,
  Observable,
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '../../../lib/core'
import { DEFAULT_VALUE_STACK_AXIS_PARAMS } from '../defaults'
import { createBaseValueAxis } from '../../base/BaseValueAxis'

const pluginName = 'ValueStackAxis'

export const ValueStackAxis = defineGridPlugin(pluginName, DEFAULT_VALUE_STACK_AXIS_PARAMS)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const unsubscribeBaseValueAxis = createBaseValueAxis(pluginName, {
    selection,
    computedData$: observer.computedStackedData$, // 計算疊加value的資料
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,  
    gridAxesTransform$: observer.gridAxesTransform$,
    gridAxesReverseTransform$: observer.gridAxesReverseTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridContainerPosition$: observer.gridContainerPosition$,
    isSeriesSeprate$: observer.isSeriesSeprate$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseValueAxis()
  }
})