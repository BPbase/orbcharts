import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  Observable,
  Subject } from 'rxjs'
import {
  defineSeriesPlugin } from '@orbcharts/core'
import { DEFAULT_SERIES_LEGEND_PARAMS } from '../defaults'
import { createBaseLegend } from '../../base/BaseLegend'

const pluginName = 'SeriesLegend'

export const SeriesLegend = defineSeriesPlugin(pluginName, DEFAULT_SERIES_LEGEND_PARAMS)(({ selection, rootSelection, observer, subject }) => {
  
  const destroy$ = new Subject()

  const seriesLabels$: Observable<string[]> = observer.SeriesDataMap$.pipe(
    takeUntil(destroy$),
    map(data => {
      return Array.from(data.keys())
    })
  )

  const unsubscribeBaseLegend = createBaseLegend(pluginName, {
    rootSelection,
    seriesLabels$,
    fullParams$: observer.fullParams$,
    layout$: observer.layout$,
    fullChartParams$: observer.fullChartParams$
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseLegend()
  }
})

