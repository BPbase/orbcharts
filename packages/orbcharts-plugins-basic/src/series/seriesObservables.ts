import * as d3 from 'd3'
import {
  Observable,
  Subject,
  of,
  takeUntil,
  filter,
  first,
  map,
  switchMap,
  combineLatest,
  merge,
  shareReplay,
  distinctUntilChanged
} from 'rxjs'
import type {
  SeriesContainerPosition } from '../../lib/core-types'
import { getClassName, getUniID } from '../utils/orbchartsUtils'

function createSeriesSelection ({ selection, pluginName, separateSeries$, seriesLabels$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  separateSeries$: Observable<boolean>
  seriesLabels$: Observable<string[]>
}) {
  const seriesClassName = getClassName(pluginName, 'series')
  
  return combineLatest({
    seriesLabels: seriesLabels$,
    separateSeries: separateSeries$
  }).pipe(
    switchMap(async d => d),
    map((data, i) => {
      const selectionData = data.separateSeries ? data.seriesLabels : [data.seriesLabels.join('')]
      return selection
        .selectAll<SVGGElement, string>(`g.${seriesClassName}`)
        .data(selectionData, d => d)
        .join(
          enter => {
            return enter
              .append('g')
              .classed(seriesClassName, true)
          },
          update => update,
          exit => exit.remove()
        )
    }),
    shareReplay(1)
  )
}

// series選取器，以起始座標位置為基準
export const seriesStartSelectionObservable = ({ selection, pluginName, separateSeries$, seriesLabels$, seriesContainerPosition$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  separateSeries$: Observable<boolean>
  seriesLabels$: Observable<string[]>
  seriesContainerPosition$: Observable<SeriesContainerPosition[]>
}) => {
  
  const seriesStartSelection$ = createSeriesSelection({ selection, pluginName, separateSeries$, seriesLabels$ })

  combineLatest({
    seriesStartSelection: seriesStartSelection$,
    seriesContainerPosition: seriesContainerPosition$                                                                                                                                                                                       
  }).pipe(
    switchMap(async d => d),
    // selection數量相同的時候才執行
    distinctUntilChanged((a, b) => a.seriesContainerPosition.length === b.seriesContainerPosition.length)
  ).subscribe(data => {
    // 無transition動畫
    data.seriesStartSelection
      .attr('transform', (d, i) => {
        const seriesContainerPosition = data.seriesContainerPosition[i] ?? data.seriesContainerPosition[0]
        return `translate(${seriesContainerPosition.startX}, ${seriesContainerPosition.startY})`
      })
  })

  combineLatest({
    seriesStartSelection: seriesStartSelection$,
    seriesContainerPosition: seriesContainerPosition$                                                                                                                                                                                       
  }).pipe(
    switchMap(async d => d),
  ).subscribe(data => {
    // 有transition動畫
    data.seriesStartSelection
      .transition()
      .attr('transform', (d, i) => {
        const seriesContainerPosition = data.seriesContainerPosition[i] ?? data.seriesContainerPosition[0]
        return `translate(${seriesContainerPosition.startX}, ${seriesContainerPosition.startY})`
      })
  })

  return {
    seriesStartSelection$
  }
}

// series選取器，以中心座標位置為基準
export const seriesCenterSelectionObservable = ({ selection, pluginName, separateSeries$, seriesLabels$, seriesContainerPosition$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  separateSeries$: Observable<boolean>
  seriesLabels$: Observable<string[]>
  seriesContainerPosition$: Observable<SeriesContainerPosition[]>
}) => {
  
  const seriesCenterSelection$ = createSeriesSelection({ selection, pluginName, separateSeries$, seriesLabels$ })

  combineLatest({
    seriesCenterSelection: seriesCenterSelection$,
    seriesContainerPosition: seriesContainerPosition$                                                                                                                                                                                       
  }).pipe(
    switchMap(async d => d),
    // selection數量相同的時候才執行
    distinctUntilChanged((a, b) => a.seriesContainerPosition.length === b.seriesContainerPosition.length)
  ).subscribe(data => {
    // 無transition動畫
    data.seriesCenterSelection
      .attr('transform', (d, i) => {
        const seriesContainerPosition = data.seriesContainerPosition[i] ?? data.seriesContainerPosition[0]
        return `translate(${seriesContainerPosition.centerX}, ${seriesContainerPosition.centerY})`
      })
  })

  combineLatest({
    seriesCenterSelection: seriesCenterSelection$,
    seriesContainerPosition: seriesContainerPosition$                                                                                                                                                                                       
  }).pipe(
    switchMap(async d => d),
  ).subscribe(data => {
    // 有transition動畫
    data.seriesCenterSelection
      .transition()
      .attr('transform', (d, i) => {
        const seriesContainerPosition = data.seriesContainerPosition[i] ?? data.seriesContainerPosition[0]
        return `translate(${seriesContainerPosition.centerX}, ${seriesContainerPosition.centerY})`
      })
  })

  return {
    seriesCenterSelection$,
  }
}

