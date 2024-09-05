import * as d3 from 'd3'
import {
  Subject } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DEFAULT_MULTI_BARS_TRIANGLE_PARAMS } from '../defaults'
import { createBaseBarsTriangle } from '../../base/BaseBarsTriangle'
import { multiGridDetailObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'

const pluginName = 'MultiBarsTriangle'

const gridClassName = getClassName(pluginName, 'grid')

export const MultiBarsTriangle = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_BARS_TRIANGLE_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()
  
  const unsubscribeFnArr: (() => void)[] = []

  const multiGridPlugin$ = multiGridDetailObservables(observer)

  multiGridPlugin$.subscribe(data => {
    // 每次重新計算時，清除之前的訂閱
    unsubscribeFnArr.forEach(fn => fn())

    selection.selectAll(`g.${gridClassName}`)
      .data(data)
      .join('g')
      .attr('class', gridClassName)
      .each((d, i, g) => {

        const gridSelection = d3.select(g[i])

        unsubscribeFnArr[i] = createBaseBarsTriangle(pluginName, {
          selection: gridSelection,
          computedData$: d.gridComputedData$,
          visibleComputedData$: d.visibleComputedData$,
          computedLayoutData$: d.computedLayoutData$,
          visibleComputedLayoutData$: d.visibleComputedLayoutData$,
          existSeriesLabels$: d.existSeriesLabels$,
          SeriesDataMap$: d.SeriesDataMap$,
          GroupDataMap$: d.GroupDataMap$,
          fullParams$: observer.fullParams$,
          fullChartParams$: observer.fullChartParams$,
          gridAxesTransform$: d.gridAxesTransform$,
          gridGraphicTransform$: d.gridGraphicTransform$,
          gridAxesSize$: d.gridAxesSize$,
          gridHighlight$: d.gridHighlight$,
          gridContainer$: d.gridContainer$,
          isSeriesPositionSeprate$: d.isSeriesPositionSeprate$,
          event$: subject.event$ as Subject<any>,
        })
      })
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
