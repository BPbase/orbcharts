import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  Subject,
  Observable
} from 'rxjs'
import type { Theme } from '@orbcharts/core'
import type { ComputedDatumGrid } from '../types/ComputedData'
import type { ContainerPositionScaled, ContainerSize, GraphicStyles } from '../types'
import type { RankedPlotRankAxisParams } from '../plugins/RankedPlot/types'
import { getColor, createClassName, createUniID } from '../utils/orbchartsUtils'
import { getD3TransitionEase } from '../utils/d3Utils'

// ---- Types ----

type ClipPathDatum = {
  id: string
  width: number
  height: number
}

export interface BaseRankAxisContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedDatumGrid[][]>
  rankedSeriesData$: Observable<ComputedDatumGrid[][]>
  fullParams$: Observable<RankedPlotRankAxisParams>
  styles$: Observable<GraphicStyles>
  rankingAxisLabel$: Observable<string>
  rankingScaleList$: Observable<d3.ScalePoint<string>[]>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  theme$: Observable<Theme>
}

// ---- Render helpers ----

function renderClipPath ({
  defsSelection,
  clipPathData
}: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  clipPathData: ClipPathDatum[]
}) {
  defsSelection
    .selectAll<SVGClipPathElement, ClipPathDatum>('clipPath')
    .data(clipPathData)
    .join(
      enter => enter.append('clipPath'),
      update => update,
      exit => exit.remove()
    )
    .attr('id', d => d.id)
    .each((d, i, g) => {
      d3.select(g[i])
        .selectAll<SVGRectElement, ClipPathDatum>('rect')
        .data([d])
        .join(enter => enter.append('rect'), update => update, exit => exit.remove())
        .attr('x', _d => -_d.width)
        .attr('y', 0)
        .attr('width', _d => _d.width * 2)
        .attr('height', _d => _d.height)
    })
}

function renderAxisLabel ({
  labelSelection,
  axisLabel,
  fullParams,
  theme
}: {
  labelSelection: d3.Selection<SVGGElement, any, any, any>
  axisLabel: string
  fullParams: RankedPlotRankAxisParams
  containerSize: ContainerSize
  theme: Theme
}) {
  const offsetX = fullParams.axisLabel.offset[0]
  const offsetY = fullParams.axisLabel.offset[1]

  labelSelection
    .selectAll<SVGTextElement, string>('text.axis-label')
    .data([axisLabel])
    .join(
      enter => enter.append('text').attr('class', 'axis-label'),
      update => update,
      exit => exit.remove()
    )
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'auto')
    .attr('x', -offsetX)
    .attr('y', -offsetY)
    .style('fill', getColor(fullParams.axisLabel.colorType, theme))
    .text(d => d)
}

function renderSeriesLabels ({
  labelsSelection,
  seriesLabelClassName,
  rankingScale,
  rankedSeriesData,
  fullParams,
  transitionDuration,
  transitionEase,
  theme
}: {
  labelsSelection: d3.Selection<SVGGElement, any, any, any>
  seriesLabelClassName: string
  rankingScale: d3.ScalePoint<string>
  rankedSeriesData: ComputedDatumGrid[][]
  fullParams: RankedPlotRankAxisParams
  transitionDuration: number
  transitionEase: string
  theme: Theme
}) {
  const labelData = rankedSeriesData.map(categoryArr => categoryArr[0]).filter(Boolean)
  const padding = fullParams.seriesLabel.padding

  labelsSelection
    .selectAll<SVGTextElement, ComputedDatumGrid>(`text.${seriesLabelClassName}`)
    .data(labelData, d => d.series)
    .join(
      enter => enter
        .append('text')
        .attr('class', seriesLabelClassName)
        .style('pointer-events', 'none')
        .attr('x', -padding)
        .attr('y', d => rankingScale(d.series) ?? 0),
      update => update
        .transition()
        .duration(transitionDuration)
        .ease(getD3TransitionEase(transitionEase))
        .attr('y', d => rankingScale(d.series) ?? 0),
      exit => exit.remove()
    )
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .attr('x', -padding)
    .style('fill', () => getColor(fullParams.seriesLabel.colorType, theme))
    .text(d => d.series)
}

// ---- Main export ----

export function createBaseRankAxis ({
  selection,
  pluginName,
  layerName,
  rankedSeriesData$,
  fullParams$,
  styles$,
  rankingAxisLabel$,
  rankingScaleList$,
  containerPosition$,
  containerSize$,
  theme$
}: BaseRankAxisContext) {
  const destroy$ = new Subject<void>()

  const clipPathID = createUniID(pluginName, layerName, 'clipPath-box')
  const containerClassName = createClassName(pluginName, layerName, 'container')
  const seriesLabelClassName = createClassName(pluginName, layerName, 'series-label')
  const axisLabelClassName = createClassName(pluginName, layerName, 'axis-label-g')

  // ---- container selection (single container) ----
  const containerG = selection
    .selectAll<SVGGElement, any>(`g.${containerClassName}`)
    .data([null])
    .join('g')
    .classed(containerClassName, true)
    .attr('clip-path', `url(#${clipPathID})`)

  containerPosition$.pipe(takeUntil(destroy$)).subscribe(positions => {
    const pos = positions[0]
    if (pos) {
      containerG.attr('transform', `translate(${pos.translate[0]}, ${pos.translate[1]})`)
    }
  })

  // Sub-group selections
  const labelsG = containerG
    .selectAll<SVGGElement, any>('g.labels-g')
    .data([null])
    .join('g')
    .classed('labels-g', true)

  const axisLabelG = containerG
    .selectAll<SVGGElement, any>(`g.${axisLabelClassName}`)
    .data([null])
    .join('g')
    .classed(axisLabelClassName, true)

  // ---- clip path ----
  const defsSelection = selection
    .selectAll<SVGDefsElement, any>('defs')
    .data([clipPathID])
    .join('defs')

  containerSize$.pipe(takeUntil(destroy$)).subscribe(size => {
    renderClipPath({
      defsSelection,
      clipPathData: [{ id: clipPathID, width: size.width, height: size.height }]
    })
  })

  // ---- series labels ----
  combineLatest({
    rankedSeriesData: rankedSeriesData$,
    rankingScaleList: rankingScaleList$,
    fullParams: fullParams$,
    transitionDuration: styles$.pipe(map(d => d.transitionDuration), distinctUntilChanged()),
    transitionEase: styles$.pipe(map(d => d.transitionEase), distinctUntilChanged()),
    theme: theme$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    const rankingScale = data.rankingScaleList[0]
    if (!rankingScale) return

    renderSeriesLabels({
      labelsSelection: labelsG,
      seriesLabelClassName,
      rankingScale,
      rankedSeriesData: data.rankedSeriesData,
      fullParams: data.fullParams,
      transitionDuration: data.transitionDuration,
      transitionEase: data.transitionEase,
      theme: data.theme
    })
  })

  // ---- axis label ----
  combineLatest({
    axisLabel: rankingAxisLabel$,
    fullParams: fullParams$,
    containerSize: containerSize$,
    theme: theme$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    renderAxisLabel({
      labelSelection: axisLabelG,
      axisLabel: data.axisLabel,
      fullParams: data.fullParams,
      containerSize: data.containerSize,
      theme: data.theme
    })
  })

  return () => {
    destroy$.next()
    destroy$.complete()
  }
}
