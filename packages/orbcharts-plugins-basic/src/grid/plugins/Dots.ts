import {
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '../../../lib/core'
import type { DefinePluginConfig } from '../../../lib/core-types'
import { DEFAULT_DOTS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC_COVER } from '../../const'
import { createBaseDots } from '../../base/BaseDots'

const pluginName = 'Dots'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_DOTS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_DOTS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC_COVER,
  validator: (params) => {
    return {
      status: 'success',
      message: ''
    }
  }
}

export const Dots = defineGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseDots(pluginName, {
    selection,
    computedData$: observer.computedData$,
    computedLayoutData$: observer.computedLayoutData$,
    visibleComputedData$: observer.visibleComputedData$,
    visibleComputedLayoutData$: observer.visibleComputedLayoutData$,
    seriesLabels$: observer.seriesLabels$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridGraphicReverseScale$: observer.gridGraphicReverseScale$,
    gridAxesSize$: observer.gridAxesSize$,
    gridHighlight$: observer.gridHighlight$,
    gridContainerPosition$: observer.gridContainerPosition$,
    event$: subject.event$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})