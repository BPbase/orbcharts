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
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      radius: {
        toBeTypes: ['number']
      },
      fillColorType: {
        toBeOption: 'ColorType',
      },
      strokeColorType: {
        toBeOption: 'ColorType',
      },
      strokeWidth: {
        toBeTypes: ['number']
      },
      // strokeWidthWhileHighlight: {
      //   toBeTypes: ['number']
      // },
      onlyShowHighlighted: {
        toBeTypes: ['boolean']
      }
    })
    return result
  }
}

export const Dots = defineGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseDots(pluginName, {
    selection,
    computedData$: observer.computedData$,
    computedAxesData$: observer.computedAxesData$,
    visibleComputedData$: observer.visibleComputedData$,
    visibleComputedAxesData$: observer.visibleComputedAxesData$,
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