import {
  Subject,
  takeUntil,
  map,
  distinctUntilChanged,
  shareReplay
} from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_VALUE_AXIS_PARAMS } from '../defaults'

import { createBaseValueAxis } from '../../base/BaseValueAxis'

const pluginName = 'ValueAxis'

export const ValueAxis = defineGridPlugin(pluginName, DEFAULT_VALUE_AXIS_PARAMS)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const isSeriesSeprate$ = observer.fullDataFormatter$.pipe(
    takeUntil(destroy$),
    map(d => d.grid.separateSeries),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const unsubscribeBaseValueAxis = createBaseValueAxis(pluginName, {
    selection,
    computedData$: observer.computedData$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,  
    gridAxesTransform$: observer.gridAxesTransform$,
    gridAxesReverseTransform$: observer.gridAxesReverseTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridContainer$: observer.gridContainer$,
    isSeriesSeprate$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseValueAxis()
  }
})