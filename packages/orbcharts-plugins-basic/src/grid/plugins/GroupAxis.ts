import { 
  Subject,
  takeUntil,
  map,
  distinctUntilChanged,
  shareReplay
} from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineGridPlugin } from '../../../lib/core'
import { DEFAULT_GROUP_AXIS_PARAMS } from '../defaults'
import { createBaseGroupAxis } from '../../base/BaseGroupAxis'
import { LAYER_INDEX_OF_AXIS } from '../../const'

const pluginName = 'GroupAxis'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_GROUP_AXIS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_GROUP_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params) => {
    return {
      status: 'success',
      message: ''
    }
  }
}

export const GroupAxis = defineGridPlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
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