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
import type { EventData, Theme } from '@orbcharts/core'
import type { ComputedDatumGrid } from '../types/ComputedData'
import type { ContainerPositionScaled, ContainerSize, GraphicStyles, Layout } from '../types'
import type { RacingPlotRacingBarParams } from '../plugins/RacingPlot/types'
import { createClassName, createUniID, getColor } from '../utils/orbchartsUtils'
import { getD3TransitionEase } from '../utils/d3Utils'

// ---- Types ----

type ClipPathDatum = {
  id: string
  width: number
  height: number
}

export interface BaseRacingBarsContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedDatumGrid[][]>
  racingRankedSeriesData$: Observable<ComputedDatumGrid[][]>
  currentFrameIndex$: BehaviorSubject<number>
  fullParams$: Observable<RacingPlotRacingBarParams>
  styles$: Observable<GraphicStyles>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  rankedItemHeight$: Observable<number>
  rankedScaleList$: Observable<d3.ScalePoint<string>[]>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  layout$: Observable<Layout>
  xScale$: Observable<(n: number) => number>
  theme$: Observable<Theme>
  eventTrigger$: Subject<EventData<'grid'>>
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
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', _d => _d.width)
        .attr('height', _d => _d.height)
    })
}

// ---- Main export ----

export function createBaseRacingBar ({
  selection,
  pluginName,
  layerName,
  computedData$,
  racingRankedSeriesData$,
  currentFrameIndex$,
  fullParams$,
  styles$,
  gridHighlight$,
  rankedItemHeight$,
  rankedScaleList$,
  containerPosition$,
  containerSize$,
  layout$,
  xScale$,
  theme$,
  eventTrigger$
}: BaseRacingBarsContext) {
  const destroy$ = new Subject<void>()

  const clipPathID = createUniID(pluginName, layerName, 'clipPath-box')
  const containerClassName = createClassName(pluginName, layerName, 'container')
  const barClassName = createClassName(pluginName, layerName, 'bar')

  // ---- single container G ----
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

  // ---- derived ----
  const barWidth$ = combineLatest({
    fullParams: fullParams$,
    rankedItemHeight: rankedItemHeight$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      if (data.fullParams.barWidth != null) {
        return data.fullParams.barWidth
      }
      return Math.max(1, data.rankedItemHeight - data.fullParams.barPadding)
    }),
    distinctUntilChanged()
  )

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

  // ---- bar G (one per series, keyed by series name) ----
  type BarGSelection = d3.Selection<SVGGElement, ComputedDatumGrid[], SVGGElement, unknown>

  const barGSelection$: Observable<BarGSelection> = combineLatest({
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
        .selectAll<SVGGElement, ComputedDatumGrid[]>('g.bar-g')
        .data(data.racingRankedSeriesData, d => d[0]?.series ?? '')
        .join(
          enter => enter
            .append('g')
            .attr('class', 'bar-g')
            .attr('cursor', 'pointer')
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
        ) as BarGSelection
    }),
    shareReplay(1)
  )

  // ---- bars (rect) ----
  const barRectSelection$: Observable<d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, ComputedDatumGrid[]>> = combineLatest({
    barGSelection: barGSelection$,
    currentFrameIndex: currentFrameIndex$,
    xScale: xScale$,
    barWidth: barWidth$,
    transitionDuration: transitionDuration$,
    transitionEase: transitionEase$,
    fullParams: fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const barHalfWidth = data.barWidth / 2
      const radius = data.fullParams.barRadius === true ? barHalfWidth
        : data.fullParams.barRadius === false ? 0
        : typeof data.fullParams.barRadius === 'number' ? data.fullParams.barRadius
        : 0

      data.barGSelection.each((seriesData: ComputedDatumGrid[], _i: number, g: SVGGElement[]) => {
        const currentDatum = seriesData[data.currentFrameIndex]
        if (!currentDatum) return

        d3.select<SVGGElement, ComputedDatumGrid[]>(g[_i])
          .selectAll<SVGRectElement, ComputedDatumGrid>(`rect.${barClassName}`)
          .data([currentDatum], (d: ComputedDatumGrid) => d.series)
          .join(
            enter => enter
              .append('rect')
              .attr('class', barClassName)
              .attr('transform', `translate(0, ${-barHalfWidth})`)
              .attr('height', data.barWidth)
              .attr('width', d => Math.max(1, data.xScale(d.value ?? 0)))
              .attr('fill', d => d.color)
              .attr('rx', radius)
              .attr('ry', radius),
            update => update
              .attr('fill', d => d.color)
              .attr('rx', radius)
              .attr('ry', radius)
              .transition()
              .duration(data.transitionDuration)
              .ease(d3.easeLinear)
              .attr('transform', `translate(0, ${-barHalfWidth})`)
              .attr('height', data.barWidth)
              .attr('width', d => Math.max(1, data.xScale(d.value ?? 0))),
            exit => exit.remove()
          )
      })

      return data.barGSelection
        .selectAll<SVGRectElement, ComputedDatumGrid>(`rect.${barClassName}`)
    }),
    shareReplay(1)
  )

  // ---- events ----
  combineLatest({
    barRectSelection: barRectSelection$,
    computedData: computedData$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.barRectSelection
      .on('mouseover', (event: MouseEvent, datum: ComputedDatumGrid) => {
        eventTrigger$.next({
          eventName: 'mouseover',
          pluginName,
          layerName,
          target: datum,
          event
        })
      })
      .on('mousemove', (event: MouseEvent, datum: ComputedDatumGrid) => {
        eventTrigger$.next({
          eventName: 'mousemove',
          pluginName,
          layerName,
          target: datum,
          event
        })
      })
      .on('mouseout', (event: MouseEvent, datum: ComputedDatumGrid) => {
        eventTrigger$.next({
          eventName: 'mouseout',
          pluginName,
          layerName,
          target: datum,
          event
        })
      })
      .on('click', (event: MouseEvent, datum: ComputedDatumGrid) => {
        eventTrigger$.next({
          eventName: 'click',
          pluginName,
          layerName,
          target: datum,
          event
        })
      })
  })

  // ---- highlight ----
  combineLatest({
    barGSelection: barGSelection$,
    highlight: gridHighlight$.pipe(map(data => data.map(d => d.id))),
    styles: styles$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.barGSelection.interrupt('highlight')
    if (!data.highlight.length) {
      data.barGSelection.transition('highlight').duration(200).style('opacity', 1)
      return
    }
    data.barGSelection.each((seriesData: ComputedDatumGrid[], _i: number, g: SVGGElement[]) => {
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
