import * as d3 from 'd3'
import {
  Subject,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DEFAULT_MULTI_GROUP_AXIS_PARAMS } from '../defaults'
import { createBaseGroupAxis } from '../../base/BaseGroupAxis'
import { multiGridPluginDetailObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'

const pluginName = 'MultiGroupAxis'

const gridClassName = getClassName(pluginName, 'grid')

export const MultiGroupAxis = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_GROUP_AXIS_PARAMS)(({ selection, name, subject, observer }) => {
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
          })
        })
    })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
