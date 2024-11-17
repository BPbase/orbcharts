import * as d3 from 'd3'
import {
  Subject,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineMultiGridPlugin } from '../../../lib/core'
import { DEFAULT_MULTI_BARS_PARAMS } from '../defaults'
import { createBaseBars } from '../../base/BaseBars'
import { multiGridPluginDetailObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'

const pluginName = 'MultiBars'

const gridClassName = getClassName(pluginName, 'grid')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_MULTI_BARS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_MULTI_BARS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params) => {
    return {
      status: 'success',
      message: ''
    }
  }
}

export const MultiBars = defineMultiGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeFnArr: (() => void)[] = []

  const multiGridPluginDetail$ = multiGridPluginDetailObservables(observer)

  multiGridPluginDetail$
    .pipe(
      takeUntil(destroy$)
    )
    .subscribe(data => {
      // 每次重新計算時，清除之前的訂閱
      unsubscribeFnArr.forEach(fn => fn())

      selection.selectAll(`g.${gridClassName}`)
        .data(data)
        .join('g')
        .attr('class', gridClassName)
        .each((d, i, g) => {

          const gridSelection = d3.select(g[i])

          const isSeriesSeprate$ = d.dataFormatter$.pipe(
            takeUntil(destroy$),
            map(d => d.grid.separateSeries),
            distinctUntilChanged(),
            shareReplay(1)
          )

          unsubscribeFnArr[i] = createBaseBars(pluginName, {
            selection: gridSelection,
            computedData$: d.computedData$,
            visibleComputedData$: d.visibleComputedData$,
            computedLayoutData$: d.computedLayoutData$,
            visibleComputedLayoutData$: d.visibleComputedLayoutData$,
            seriesLabels$: d.seriesLabels$,
            SeriesDataMap$: d.SeriesDataMap$,
            GroupDataMap$: d.GroupDataMap$,
            fullParams$: observer.fullParams$,
            fullChartParams$: observer.fullChartParams$,
            gridAxesTransform$: d.gridAxesTransform$,
            gridGraphicTransform$: d.gridGraphicTransform$,
            gridGraphicReverseScale$: d.gridGraphicReverseScale$,
            gridAxesSize$: d.gridAxesSize$,
            gridHighlight$: d.gridHighlight$,
            gridContainerPosition$: d.gridContainerPosition$,
            isSeriesSeprate$,
            event$: subject.event$ as Subject<any>,
          })
        })
    })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
