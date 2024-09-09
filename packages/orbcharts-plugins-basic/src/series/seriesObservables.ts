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
  SeriesContainerPosition } from '@orbcharts/core'
import { getClassName, getUniID } from '../utils/orbchartsUtils'

function createSeriesSelection ({ selection, pluginName, seriesSeparate$, seriesLabels$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  seriesSeparate$: Observable<boolean>
  seriesLabels$: Observable<string[]>
}) {
  const seriesClassName = getClassName(pluginName, 'series')
  
  return combineLatest({
    seriesLabels: seriesLabels$,
    seriesSeparate: seriesSeparate$
  }).pipe(
    switchMap(async d => d),
    map((data, i) => {
      const selectionData = data.seriesSeparate ? data.seriesLabels : [data.seriesLabels.join('')]
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
export const seriesStartSelectionObservable = ({ selection, pluginName, seriesSeparate$, seriesLabels$, seriesContainerPosition$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  seriesSeparate$: Observable<boolean>
  seriesLabels$: Observable<string[]>
  seriesContainerPosition$: Observable<SeriesContainerPosition[]>
}) => {
  
  const seriesStartSelection$ = createSeriesSelection({ selection, pluginName, seriesSeparate$, seriesLabels$ })

  combineLatest({
    seriesStartSelection: seriesStartSelection$,
    seriesContainerPosition: seriesContainerPosition$                                                                                                                                                                                       
  }).pipe(
    switchMap(async d => d),
    first() // 第一次執行不加transition，避免一開始會有偏移的效果
  ).subscribe(data => {
    data.seriesStartSelection
      .attr('transform', (d, i) => {
        const seriesContainerPosition = data.seriesContainerPosition[i] ?? data.seriesContainerPosition[0]
        // const translate = seriesContainerPosition.translate
        return `translate(${seriesContainerPosition.startX}, ${seriesContainerPosition.startY})`
      })

      seriesContainerPosition$.subscribe(seriesContainerPosition => {
        data.seriesStartSelection
          .transition()
          .attr('transform', (d, i) => {
            const _seriesContainerPosition = seriesContainerPosition[i] ?? seriesContainerPosition[0]
            // const translate = seriesContainerPosition.translate
            return `translate(${_seriesContainerPosition.startX}, ${_seriesContainerPosition.startY})`
          })
      })
  })

  return {
    seriesStartSelection$
  }
}

// series選取器，以中心座標位置為基準
export const seriesCenterSelectionObservable = ({ selection, pluginName, seriesSeparate$, seriesLabels$, seriesContainerPosition$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  seriesSeparate$: Observable<boolean>
  seriesLabels$: Observable<string[]>
  seriesContainerPosition$: Observable<SeriesContainerPosition[]>
}) => {
  
  const seriesCenterSelection$ = createSeriesSelection({ selection, pluginName, seriesSeparate$, seriesLabels$ })

  combineLatest({
    seriesCenterSelection: seriesCenterSelection$,
    seriesContainerPosition: seriesContainerPosition$                                                                                                                                                                                       
  }).pipe(
    switchMap(async d => d),
    first() // 第一次執行不加transition，避免一開始會有偏移的效果
  ).subscribe(data => {
    data.seriesCenterSelection
      .attr('transform', (d, i) => {
        const seriesContainerPosition = data.seriesContainerPosition[i] ?? data.seriesContainerPosition[0]
        // const translate = seriesContainerPosition.translate
        return `translate(${seriesContainerPosition.centerX}, ${seriesContainerPosition.centerY})`
      })

      seriesContainerPosition$.subscribe(seriesContainerPosition => {
        data.seriesCenterSelection
          .transition()
          .attr('transform', (d, i) => {
            const _seriesContainerPosition = seriesContainerPosition[i] ?? seriesContainerPosition[0]
            // const translate = seriesContainerPosition.translate
            return `translate(${_seriesContainerPosition.centerX}, ${_seriesContainerPosition.centerY})`
          })
      })
  })

  return {
    seriesCenterSelection$,
  }
}

