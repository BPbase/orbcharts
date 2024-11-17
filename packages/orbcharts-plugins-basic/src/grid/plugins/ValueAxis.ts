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
import { DEFAULT_VALUE_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../const'
import { createBaseValueAxis } from '../../base/BaseValueAxis'

const pluginName = 'ValueAxis'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_VALUE_AXIS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_VALUE_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params) => {
    return {
      status: 'success',
      message: ''
    }
  }
}

export const ValueAxis = defineGridPlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const unsubscribeBaseValueAxis = createBaseValueAxis(pluginName, {
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
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseValueAxis()
  }
})