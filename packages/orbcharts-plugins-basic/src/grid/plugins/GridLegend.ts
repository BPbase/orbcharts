import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  Observable,
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_GRID_LEGEND_PARAMS } from '../defaults'
import { createBaseLegend } from '../../base/BaseLegend'

const pluginName = 'GridLegend'

export const GridLegend = defineGridPlugin(pluginName, DEFAULT_GRID_LEGEND_PARAMS)(({ selection, rootSelection, observer, subject }) => {
  
  const destroy$ = new Subject()

  const seriesLabels$: Observable<string[]> = observer.SeriesDataMap$.pipe(
    takeUntil(destroy$),
    map(data => {
      return Array.from(data.keys())
    })
  )

  // 全部列點矩型使用相同樣式參數
  const fullParams$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(d => {
      const seriesList = [
        {
          listRectWidth: d.listRectWidth,
          listRectHeight: d.listRectHeight,
          listRectRadius: d.listRectRadius,
        }
      ]
      return {
        ...d,
        seriesList
      }
    })
  )

  const unsubscribeBaseLegend = createBaseLegend(pluginName, {
    rootSelection,
    seriesLabels$,
    fullParams$,
    layout$: observer.layout$,
    fullChartParams$: observer.fullChartParams$
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseLegend()
  }
})

