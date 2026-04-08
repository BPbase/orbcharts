import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Subject,
  Observable,
  BehaviorSubject
} from 'rxjs'
import type { Theme } from '@orbcharts/core'
import type { ComputedDatumGrid } from '../types/ComputedData'
import type { ContainerPositionScaled, ContainerSize, GraphicStyles } from '../types'
import type { RacingPlotValueLabelParams } from '../plugins/RacingPlot/types'
import { createClassName, createUniID, getColor, getDatumColor } from '../utils/orbchartsUtils'
import { getD3TransitionEase, parseTickFormatValue } from '../utils/d3Utils'

type ClipPathDatum = {
  id: string
  width: number
  height: number
}

export interface BaseRacingValueLabelContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  racingRankedSeriesData$: Observable<ComputedDatumGrid[][]>
  currentFrameIndex$: BehaviorSubject<number>
  fullParams$: Observable<RacingPlotValueLabelParams>
  styles$: Observable<GraphicStyles>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  rankedScaleList$: Observable<d3.ScalePoint<string>[]>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  xScale$: Observable<(n: number) => number>
  theme$: Observable<Theme>
}

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
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', _d => _d.width)
        .attr('height', _d => _d.height)
    })
}

export function createBaseRacingValueLabel ({
  selection,
  pluginName,
  layerName,
  racingRankedSeriesData$,
  currentFrameIndex$,
  fullParams$,
  styles$,
  gridHighlight$,
  rankedScaleList$,
  containerPosition$,
  containerSize$,
  xScale$,
  theme$
}: BaseRacingValueLabelContext) {
  const destroy$ = new Subject<void>()

  const clipPathID = createUniID(pluginName, layerName, 'clipPath-box')
  const containerClassName = createClassName(pluginName, layerName, 'container')
  const valueLabelClassName = createClassName(pluginName, layerName, 'value-label')

  const containerG = selection
    .selectAll<SVGGElement, any>(`g.${containerClassName}`)
    .data([null])
    .join('g')
    .classed(containerClassName, true)
    .attr('clip-path', `url(#${clipPathID})`)

  const defsSelection = selection
    .selectAll<SVGDefsElement, any>('defs')
    .data([clipPathID])
    .join('defs')

  containerPosition$.pipe(takeUntil(destroy$)).subscribe(positions => {
    const pos = positions[0]
    if (pos) {
      containerG.attr('transform', `translate(${pos.translate[0]}, ${pos.translate[1]})`)
    }
  })

  containerSize$.pipe(takeUntil(destroy$)).subscribe(containerSize => {
    renderClipPath({
      defsSelection,
      clipPathData: [{ id: clipPathID, width: containerSize.width, height: containerSize.height }]
    })
  })

  const transitionDuration$ = styles$.pipe(
    takeUntil(destroy$),
    map(d => d.transitionDuration),
    distinctUntilChanged()
  )

  const transitionEase$ = styles$.pipe(
    takeUntil(destroy$),
    map(d => d.transitionEase),
    distinctUntilChanged()
  )

  type LabelGSelection = d3.Selection<SVGGElement, ComputedDatumGrid[], SVGGElement, unknown>

  const labelGSelection$: Observable<LabelGSelection> = combineLatest({
    racingRankedSeriesData: racingRankedSeriesData$,
    rankedScaleList: rankedScaleList$,
    transitionDuration: transitionDuration$,
    transitionEase: transitionEase$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const rankingScale = data.rankedScaleList[0]

      return containerG
        .selectAll<SVGGElement, ComputedDatumGrid[]>('g.label-g')
        .data(data.racingRankedSeriesData, d => d[0]?.series ?? '')
        .join(
          enter => enter
            .append('g')
            .attr('class', 'label-g')
            .attr('transform', d => {
              const y = rankingScale ? (rankingScale(d[0]?.series ?? '') ?? 0) : 0
              return `translate(0, ${y})`
            }),
          update => update
            .transition()
            .duration(data.transitionDuration)
            .ease(getD3TransitionEase(data.transitionEase))
            .attr('transform', d => {
              const y = rankingScale ? (rankingScale(d[0]?.series ?? '') ?? 0) : 0
              return `translate(0, ${y})`
            }),
          exit => exit.remove()
        ) as LabelGSelection
    }),
    shareReplay(1)
  )

  combineLatest({
    labelGSelection: labelGSelection$,
    currentFrameIndex: currentFrameIndex$,
    xScale: xScale$,
    transitionDuration: transitionDuration$,
    fullParams: fullParams$,
    theme: theme$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.labelGSelection
      .each((seriesData: ComputedDatumGrid[], _i: number, g: SVGGElement[]) => {
        const currentDatum = seriesData[data.currentFrameIndex]
        if (!currentDatum) return

        const prevFrameIndex = Math.max(0, data.currentFrameIndex - 1)
        const prevDatum = seriesData[prevFrameIndex]
        const prevValue = prevDatum?.value ?? 0
        const currentValue = currentDatum.value ?? 0

        d3.select<SVGGElement, ComputedDatumGrid[]>(g[_i])
          .selectAll<SVGTextElement, ComputedDatumGrid>(`text.${valueLabelClassName}`)
          .data([currentDatum], (d: ComputedDatumGrid) => d.series)
          .join(
            enter => enter
              .append('text')
              .attr('class', valueLabelClassName)
              .style('pointer-events', 'none')
              .attr('x', data.xScale(currentValue) + data.fullParams.padding)
              .attr('y', 0),
            update => update,
            exit => exit.remove()
          )
          .attr('text-anchor', 'start')
          .attr('dominant-baseline', 'middle')
          .style('fill', d => getDatumColor({
            datum: d,
            colorType: data.fullParams.colorType,
            theme: data.theme
          }))
          .transition()
          .duration(data.transitionDuration)
          .ease(d3.easeLinear)
          .attr('x', data.xScale(currentValue) + data.fullParams.padding)
          .textTween(() => {
            return (t: number) => {
              const tweenNumber = t === 1
                ? d3.interpolateNumber(prevValue, currentValue)(t)
                : d3.interpolateRound(prevValue, currentValue)(t)
              return parseTickFormatValue(tweenNumber, data.fullParams.format as any)
            }
          })
      })
  })

  combineLatest({
    labelGSelection: labelGSelection$,
    highlight: gridHighlight$.pipe(map(data => data.map(d => d.id))),
    styles: styles$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.labelGSelection.interrupt('highlight')
    if (!data.highlight.length) {
      data.labelGSelection.transition('highlight').duration(200).style('opacity', 1)
      return
    }
    data.labelGSelection.each((seriesData: ComputedDatumGrid[], _i: number, g: SVGGElement[]) => {
      const isHighlighted = data.highlight.some(id => seriesData.some(d => d.id === id))
      d3.select<SVGGElement, ComputedDatumGrid[]>(g[_i])
        .style('opacity', isHighlighted ? 1 : data.styles.unhighlightedOpacity)
    })
  })

  return () => {
    destroy$.next()
    destroy$.complete()
  }
}
