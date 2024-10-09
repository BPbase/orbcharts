import * as d3 from 'd3'
import {
  map,
  takeUntil,
  Subject } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'

import { DEFAULT_MULTI_LINES_PARAMS } from '../defaults'
import { createBaseLines } from '../../base/BaseLines'
import { multiGridPluginDetailObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'

const pluginName = 'MultiLines'

const gridClassName = getClassName(pluginName, 'grid')

export const MultiLines = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_LINES_PARAMS)(({ selection, rootSelection, name, subject, observer }) => {
  const destroy$ = new Subject()
  
  const unsubscribeFnArr: (() => void)[] = []

  // 攤平所有grid的containerPosition
  const allContainerPosition$ = observer.multiGridContainerPosition$.pipe(
    takeUntil(destroy$),
    map(data => {
      return data.flat()
    })
  )

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

          unsubscribeFnArr[i] = createBaseLines(pluginName, {
            selection: gridSelection,
            computedData$: d.computedData$,
            computedLayoutData$: d.computedLayoutData$,
            visibleComputedData$: d.visibleComputedData$,
            visibleComputedLayoutData$: d.visibleComputedLayoutData$,
            seriesLabels$: d.seriesLabels$,
            SeriesDataMap$: d.SeriesDataMap$,
            GroupDataMap$: d.GroupDataMap$,
            fullDataFormatter$: d.dataFormatter$,
            fullParams$: observer.fullParams$,
            fullChartParams$: observer.fullChartParams$,
            gridAxesTransform$: d.gridAxesTransform$,
            gridGraphicTransform$: d.gridGraphicTransform$,
            gridAxesSize$: d.gridAxesSize$,
            gridHighlight$: d.gridHighlight$,
            gridContainerPosition$: d.gridContainerPosition$,
            allContainerPosition$,
            layout$: observer.layout$,
            event$: subject.event$ as Subject<any>,
          })
        })
    })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
