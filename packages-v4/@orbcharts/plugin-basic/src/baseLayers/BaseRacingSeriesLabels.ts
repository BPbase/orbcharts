import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  Subject,
  Observable
} from 'rxjs'
import type { Theme } from '@orbcharts/core'
import type { ComputedDatumGrid } from '../types/ComputedData'
import type { ContainerPositionScaled, ContainerSize, GraphicStyles } from '../types'
import type { RacingSeriesLabelsParams } from '../plugins/RacingPlot/types'
import { createClassName, createUniID, getColor } from '../utils/orbchartsUtils'
import { getD3TransitionEase } from '../utils/d3Utils'

// ---- Types ----

type ClipPathDatum = {
  id: string
  width: number
  height: number
}

export interface BaseRacingSeriesLabelsContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  racingRankedSeriesData$: Observable<ComputedDatumGrid[][]>
  currentFrameIndex$: Observable<number>
  xScale$: Observable<(n: number) => number>
  fullParams$: Observable<RacingSeriesLabelsParams>
  styles$: Observable<GraphicStyles>
  rankingAxisLabel$: Observable<string>
  rankedScaleList$: Observable<d3.ScalePoint<string>[]>
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
  containerSize,
  theme
}: {
  labelSelection: d3.Selection<SVGGElement, any, any, any>
  axisLabel: string
  fullParams: RacingSeriesLabelsParams
  containerSize: ContainerSize
  theme: Theme
}) {
  const offsetX = fullParams.axisLabel.offset[0]
  const offsetY = fullParams.axisLabel.offset[1]

  labelSelection
    .attr('transform', `translate(0, ${containerSize.height})`)
    .selectAll<SVGTextElement, string>('text.axis-label')
    .data([axisLabel])
    .join(
      enter => enter.append('text').attr('class', 'axis-label').style('font-weight', 'bold'),
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
  labelsG,
  seriesLabelClassName,
  rankingScale,
  rankedSeriesData,
  currentFrameIndex,
  xScale,
  fullParams,
  transitionDuration,
  transitionEase,
  theme
}: {
  labelsG: d3.Selection<SVGGElement, any, any, any>
  seriesLabelClassName: string
  rankingScale: d3.ScalePoint<string>
  rankedSeriesData: ComputedDatumGrid[][]
  currentFrameIndex: number
  xScale: (n: number) => number
  fullParams: RacingSeriesLabelsParams
  transitionDuration: number
  transitionEase: string
  theme: Theme
}) {
  const labelData = rankedSeriesData
    .map(seriesData => seriesData[currentFrameIndex])
    .filter(Boolean) as ComputedDatumGrid[]
  const padding = fullParams.seriesLabel.padding
  const position = fullParams.seriesLabel.position

  const getX = (d: ComputedDatumGrid) => {
    if (position === 'outside') {
      return -padding
    }
    if (position === 'inside-right') {
      return Math.max(padding, xScale(d.value ?? 0) - padding)
    }
    return padding
  }

  const textAnchor = position === 'outside' || position === 'inside-right' ? 'end' : 'start'

  const textSelection = labelsG
    .selectAll<SVGTextElement, ComputedDatumGrid>(`text.${seriesLabelClassName}`)
    .data(labelData, d => d.series)
    .join(
      enter => enter
        .append('text')
        .attr('class', seriesLabelClassName)
        .style('pointer-events', 'none')
        .attr('x', d => getX(d))
        .attr('y', d => rankingScale(d.series) ?? 0),
      update => update,
      exit => exit.remove()
    )

  textSelection
    .attr('text-anchor', textAnchor)
    .attr('dominant-baseline', 'middle')
    .style('fill', getColor(fullParams.seriesLabel.colorType, theme))
    .text(d => d.series)

  textSelection
    .transition()
    .duration(transitionDuration)
    .ease(getD3TransitionEase(transitionEase))
    .attr('x', d => getX(d))
    .attr('y', d => rankingScale(d.series) ?? 0)
}

// ---- Main export ----

export function createBaseRacingSeriesLabels ({
  selection,
  pluginName,
  layerName,
  racingRankedSeriesData$,
  currentFrameIndex$,
  xScale$,
  fullParams$,
  styles$,
  rankingAxisLabel$,
  rankedScaleList$,
  containerPosition$,
  containerSize$,
  theme$
}: BaseRacingSeriesLabelsContext) {
  const destroy$ = new Subject<void>()

  const clipPathID = createUniID(pluginName, layerName, 'clipPath-box')
  const containerClassName = createClassName(pluginName, layerName, 'container')
  const seriesLabelClassName = createClassName(pluginName, layerName, 'series-label')
  const axisLabelClassName = createClassName(pluginName, layerName, 'axis-label-g')

  // ---- single container ----
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

  containerSize$.pipe(takeUntil(destroy$)).subscribe(containerSize => {
    renderClipPath({
      defsSelection,
      clipPathData: [{ id: clipPathID, width: containerSize.width, height: containerSize.height }]
    })
  })

  // ---- series labels ----
  combineLatest({
    racingRankedSeriesData: racingRankedSeriesData$,
    currentFrameIndex: currentFrameIndex$,
    xScale: xScale$,
    fullParams: fullParams$,
    rankedScaleList: rankedScaleList$,
    transitionDuration: styles$.pipe(map(d => d.transitionDuration)),
    transitionEase: styles$.pipe(map(d => d.transitionEase)),
    theme: theme$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    const rankingScale = data.rankedScaleList[0]
    if (!rankingScale) return

    renderSeriesLabels({
      labelsG,
      seriesLabelClassName,
      rankingScale,
      rankedSeriesData: data.racingRankedSeriesData,
      currentFrameIndex: data.currentFrameIndex,
      xScale: data.xScale,
      fullParams: data.fullParams,
      transitionDuration: data.transitionDuration,
      transitionEase: data.transitionEase,
      theme: data.theme
    })
  })

  // ---- axis label ----
  combineLatest({
    rankingAxisLabel: rankingAxisLabel$,
    fullParams: fullParams$,
    containerSize: containerSize$,
    theme: theme$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    renderAxisLabel({
      labelSelection: axisLabelG,
      axisLabel: data.rankingAxisLabel,
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
