import * as d3 from 'd3'
import {
  Observable,
  Subject,
  of,
  takeUntil,
  filter,
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

// series選取器，以起始座標位置為基準
export const seriesStartSelectionObservable = ({ selection, pluginName, seriesLabels$, seriesContainerPosition$ }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  seriesLabels$: Observable<string[]>
  seriesContainerPosition$: Observable<SeriesContainerPosition[]>
}) => {
  const seriesClassName = getClassName(pluginName, 'series')

  const seriesStartSelection$ = seriesLabels$.pipe(
    map((existSeriesLabels, i) => {
      return selection
        .selectAll<SVGGElement, string>(`g.${seriesClassName}`)
        .data(existSeriesLabels, d => d)
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
    switchMap(selection => combineLatest({
      seriesSelection: of(selection),
      seriesContainerPosition: seriesContainerPosition$                                                                                                                                                                                       
    })),
    map(data => {
      data.seriesSelection
        .transition()
        .attr('transform', (d, i) => {
          const seriesContainerPosition = data.seriesContainerPosition[i] ?? data.seriesContainerPosition[0]
          // const translate = seriesContainerPosition.translate
          return `translate(${seriesContainerPosition.startX}, ${seriesContainerPosition.startY})`
        })
      return data.seriesSelection
    }),
    shareReplay(1)
  )

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
  const seriesClassName = getClassName(pluginName, 'series')

  const seriesCenterSelection$ = combineLatest({
    seriesLabels: seriesLabels$,
    seriesSeparate: seriesSeparate$
  }).pipe(
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
    switchMap(selection => {
      return combineLatest({
        seriesSelection: of(selection),
        seriesContainerPosition: seriesContainerPosition$                                                                                                                                                                                       
      }).pipe(
        switchMap(async d => d)
      )
    }),
    map(data => {
      data.seriesSelection
        .transition()
        .attr('transform', (d, i) => {
          const seriesContainerPosition = data.seriesContainerPosition[i] ?? data.seriesContainerPosition[0]
          // const translate = seriesContainerPosition.translate
          return `translate(${seriesContainerPosition.centerX}, ${seriesContainerPosition.centerY})`
        })
      return data.seriesSelection
    }),
    shareReplay(1)
  )

  return {
    seriesCenterSelection$
  }
}

