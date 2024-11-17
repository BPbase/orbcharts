import {
  takeUntil,
  map,
  distinctUntilChanged,
  shareReplay,
  switchMap,
  iif,
  Observable,
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineGridPlugin } from '../../../lib/core'
import { DEFAULT_VALUE_STACK_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../const'
import { createBaseValueAxis } from '../../base/BaseValueAxis'

const pluginName = 'ValueStackAxis'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_VALUE_STACK_AXIS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_VALUE_STACK_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params) => {
    return {
      status: 'success',
      message: ''
    }
  }
}

export const ValueStackAxis = defineGridPlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
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