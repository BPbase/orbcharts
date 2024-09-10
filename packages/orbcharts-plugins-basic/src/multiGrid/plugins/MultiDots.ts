import * as d3 from 'd3'
import {
  takeUntil,
  Subject } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DEFAULT_MULTI_DOTS_PARAMS } from '../defaults'
import { createBaseDots } from '../../base/BaseDots'
import { multiGridPluginObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'

const pluginName = 'MultiDots'

const gridClassName = getClassName(pluginName, 'grid')

export const MultiDots = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_DOTS_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeFnArr: (() => void)[] = []

  const multiGridPlugin$ = multiGridPluginObservables(observer)

  multiGridPlugin$
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

          unsubscribeFnArr[i] = createBaseDots(pluginName, {
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
            event$: subject.event$ as Subject<any>,
          })
        })
    })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
