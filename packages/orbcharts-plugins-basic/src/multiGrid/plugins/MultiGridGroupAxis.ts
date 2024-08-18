import * as d3 from 'd3'
import {
  Subject } from 'rxjs'
import {
  defineMultiGridPlugin } from '@orbcharts/core'
import { DEFAULT_MULTI_GRID_GROUP_AXIS_PARAMS } from '../defaults'
import { createBaseGroupAxis } from '../../base/BaseGroupAxis'
import { multiGridDetailObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'

const pluginName = 'MultiGridGroupAxis'

const gridClassName = getClassName(pluginName, 'grid')

export const MultiGridGroupAxis = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_GRID_GROUP_AXIS_PARAMS)(({ selection, name, subject, observer }) => {
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

        unsubscribeFnArr[i] = createBaseGroupAxis(pluginName, {
          selection: gridSelection,
          computedData$: d.gridComputedData$,
          fullParams$: observer.fullParams$,
          fullDataFormatter$: d.gridDataFormatter$,
          fullChartParams$: observer.fullChartParams$,  
          gridAxesTransform$: d.gridAxesTransform$,
          gridAxesReverseTransform$: d.gridAxesReverseTransform$,
          gridAxesSize$: d.gridAxesSize$,
          gridContainer$: d.gridContainer$,
          isSeriesPositionSeprate$: d.isSeriesPositionSeprate$,
        })
      })
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
