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
import { DEFAULT_MULTI_BARS_PARAMS } from '../defaults'
import { createBaseBars } from '../../base/BaseBars'
import { multiGridPluginObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'

const pluginName = 'MultiBars'

const gridClassName = getClassName(pluginName, 'grid')

export const MultiBars = defineMultiGridPlugin(pluginName, DEFAULT_MULTI_BARS_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const unsubscribeFnArr: (() => void)[] = []

  const multiGridPlugin$ = multiGridPluginObservables(observer)

  multiGridPlugin$.subscribe(data => {
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
