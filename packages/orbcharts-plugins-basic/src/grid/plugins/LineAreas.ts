import {
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineGridPlugin } from '../../../lib/core'
import { DEFAULT_LINE_AREAS_PARAMS } from '../defaults'
import { createBaseLineAreas } from '../../base/BaseLineAreas'
import { LAYER_INDEX_OF_GRAPHIC_GROUND } from '../../const'

const pluginName = 'LineAreas'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_LINE_AREAS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_LINE_AREAS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC_GROUND,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      lineCurve: {
        toBeTypes: ['string']
      },
      linearGradientOpacity: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      },
    })
    return result
  }
}

export const LineAreas = defineGridPlugin(pluginConfig)(({ selection, name, observer, subject }) => {

  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseLineAreas(pluginName, {
    selection,
    computedData$: observer.computedData$,
    visibleComputedData$: observer.visibleComputedData$,
    computedAxesData$: observer.computedAxesData$,
    visibleComputedAxesData$: observer.visibleComputedAxesData$,
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