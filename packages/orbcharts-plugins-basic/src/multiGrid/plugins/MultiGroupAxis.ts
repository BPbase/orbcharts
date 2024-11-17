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
import { DEFAULT_MULTI_GROUP_AXIS_PARAMS } from '../defaults'
import { createBaseGroupAxis } from '../../base/BaseGroupAxis'
import { multiGridPluginDetailObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
import { LAYER_INDEX_OF_AXIS } from '../../const'

const pluginName = 'MultiGroupAxis'

const gridClassName = getClassName(pluginName, 'grid')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_MULTI_GROUP_AXIS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_MULTI_GROUP_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params) => {
    return {
      status: 'success',
      message: ''
    }
  }
}

export const MultiGroupAxis = defineMultiGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
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

          unsubscribeFnArr[i] = createBaseGroupAxis(pluginName, {
            selection: gridSelection,
            computedData$: d.computedData$,
            fullParams$: observer.fullParams$,
            fullDataFormatter$: d.dataFormatter$,
            fullChartParams$: observer.fullChartParams$,  
            gridAxesTransform$: d.gridAxesTransform$,
            gridAxesReverseTransform$: d.gridAxesReverseTransform$,
            gridAxesSize$: d.gridAxesSize$,
            gridContainerPosition$: d.gridContainerPosition$,
            isSeriesSeprate$,
            textSizePx$: observer.textSizePx$,
          })
        })
    })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
