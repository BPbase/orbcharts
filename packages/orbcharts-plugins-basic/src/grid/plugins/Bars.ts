import {
  Subject,
  Observable,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineGridPlugin } from '../../../lib/core'
import { DEFAULT_BARS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'
import { createBaseBars } from '../../base/BaseBars'

const pluginName = 'Bars'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_BARS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_BARS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      barWidth: {
        toBeTypes: ['number']
      },
      barPadding: {
        toBeTypes: ['number']
      },
      barGroupPadding: {
        toBeTypes: ['number']
      },
      barRadius: {
        toBeTypes: ['number', 'boolean']
      }
    })
    return result
  }
}

export const Bars = defineGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeBaseBars = createBaseBars(pluginName, {
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
    isSeriesSeprate$: observer.isSeriesSeprate$,
    event$: subject.event$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseBars()
  }
})
