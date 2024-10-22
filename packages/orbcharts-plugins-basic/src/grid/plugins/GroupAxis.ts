import { 
  Subject,
  takeUntil,
  map,
  distinctUntilChanged,
  shareReplay
} from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_GROUP_AXIS_PARAMS } from '../defaults'
import { createBaseGroupAxis } from '../../base/BaseGroupAxis'

const pluginName = 'GroupAxis'

export const GroupAxis = defineGridPlugin(pluginName, DEFAULT_GROUP_AXIS_PARAMS)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const unsubscribeBaseGroupAxis = createBaseGroupAxis(pluginName, {
    selection,
    computedData$: observer.computedData$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,  
    gridAxesTransform$: observer.gridAxesTransform$,
    gridAxesReverseTransform$: observer.gridAxesReverseTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridContainerPosition$: observer.gridContainerPosition$,
    isSeriesSeprate$: observer.isSeriesSeprate$,
    textSizePx$: observer.textSizePx$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseGroupAxis()
  }
})