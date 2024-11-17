import {
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineGridPlugin } from '../../../lib/core'
import { DEFAULT_LINES_PARAMS } from '../defaults'
import { createBaseLines } from '../../base/BaseLines'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'

const pluginName = 'Lines'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_LINES_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_LINES_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params) => {
    return {
      status: 'success',
      message: ''
    }
  }
}

export const Lines = defineGridPlugin(pluginConfig)(({ selection, rootSelection, name, observer, subject }) => {

  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseLines(pluginName, {
    selection,
    computedData$: observer.computedData$,
    computedLayoutData$: observer.computedLayoutData$,
    visibleComputedData$: observer.visibleComputedData$,
    visibleComputedLayoutData$: observer.visibleComputedLayoutData$,
    seriesLabels$: observer.seriesLabels$,
    SeriesDataMap$: observer.SeriesDataMap$,
    GroupDataMap$: observer.GroupDataMap$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridHighlight$: observer.gridHighlight$,
    gridContainerPosition$: observer.gridContainerPosition$,
    allContainerPosition$: observer.gridContainerPosition$,
    layout$: observer.layout$,
    event$: subject.event$,
  })


  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})