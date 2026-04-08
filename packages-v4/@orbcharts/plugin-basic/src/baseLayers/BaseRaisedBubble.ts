import * as d3 from 'd3'
import {
  combineLatest,
  map,
  debounceTime,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Subject,
  Observable
} from 'rxjs'
import type { EventData } from '@orbcharts/core'
import type { ComputedDatumSeries } from '../types/ComputedData'
import type { ContainerPositionScaled, ContainerSize, GraphicStyles, Layout } from '../types'
import type { CategoricalPlotRaisedBubblesParams } from '../plugins/CategoricalPlot/types'
import { createClassName, createUniID } from '../utils/orbchartsUtils'
import { getD3TransitionEase } from '../utils/d3Utils'

// ---- Internal types ----

interface BubbleDatum {
  x: number       // ordinalScale(seriesIndex)
  y: number       // valueScale(value)
  r: number
  opacity: number
  color: string
  _refDatum: ComputedDatumSeries
}

type ClipPathDatum = {
  id: string
  width: number
  height: number
}

export interface BaseRaisedBubbleContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedDatumSeries[][]>
  visibleComputedData$: Observable<ComputedDatumSeries[][]>
  fullParams$: Observable<CategoricalPlotRaisedBubblesParams>
  styles$: Observable<GraphicStyles>
  gridHighlight$: Observable<ComputedDatumSeries[]>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  layout$: Observable<Layout>
  ordinalScale$: Observable<d3.ScaleLinear<number, number>>
  valueScale$: Observable<d3.ScaleLinear<number, number>>
  categoryScaleDomainValue$: Observable<[number, number]>
  eventTrigger$: Subject<EventData<'series'>>
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

function renderBubbles ({
  containerSelection,
  bubbleClassName,
  bubbleData,
  transitionDuration,
  transitionEase
}: {
  containerSelection: d3.Selection<SVGGElement, any, any, any>
  bubbleClassName: string
  bubbleData: BubbleDatum[]
  transitionDuration: number
  transitionEase: string
}) {
  // Sort by r descending: larger bubbles rendered first (sit below smaller ones)
  const sortedData = [...bubbleData].sort((a, b) => b.r - a.r)

  containerSelection
    .selectAll<SVGCircleElement, BubbleDatum>(`circle.${bubbleClassName}`)
    .data(sortedData, d => d._refDatum.id)
    .join(
      enter => enter
        .append('circle')
        .attr('class', bubbleClassName)
        .attr('cursor', 'pointer'),
      update => update,
      exit => exit.remove()
    )
    .attr('fill', d => d.color)
    .style('opacity', d => d.opacity)
    .transition()
    .duration(transitionDuration)
    .ease(getD3TransitionEase(transitionEase))
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r)

  return containerSelection.selectAll<SVGCircleElement, BubbleDatum>(`circle.${bubbleClassName}`)
}

function highlightBubbles ({
  selection,
  ids,
  unhighlightedOpacity
}: {
  selection: d3.Selection<SVGCircleElement, BubbleDatum, any, any>
  ids: string[]
  unhighlightedOpacity: number
}) {
  selection.interrupt('highlight')

  if (!ids.length) {
    selection.transition('highlight').duration(200)
      .style('opacity', d => d.opacity)
    return
  }

  selection.each((d, i, n) => {
    d3.select<SVGCircleElement, BubbleDatum>(n[i])
      .style('opacity', ids.includes(d._refDatum.id) ? d.opacity : unhighlightedOpacity)
  })
}

// ---- Main export ----

export function createBaseRaisedBubble ({
  selection,
  pluginName,
  layerName,
  computedData$,
  visibleComputedData$,
  fullParams$,
  styles$,
  gridHighlight$,
  containerPosition$,
  containerSize$,
  layout$,
  ordinalScale$,
  valueScale$,
  categoryScaleDomainValue$,
  eventTrigger$
}: BaseRaisedBubbleContext) {
  const destroy$ = new Subject<void>()

  const clipPathID = createUniID(pluginName, layerName, 'clipPath-box')
  const containerClassName = createClassName(pluginName, layerName, 'container')
  const bubbleClassName = createClassName(pluginName, layerName, 'bubble')

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

  // ---- clip path ----
  const defsSelection = selection
    .selectAll<SVGDefsElement, any>('defs')
    .data([clipPathID])
    .join('defs')

  combineLatest({ size: containerSize$, layout: layout$ })
    .pipe(takeUntil(destroy$))
    .subscribe(({ size, layout }) => {
      renderClipPath({
        defsSelection,
        clipPathData: [{ id: clipPathID, width: size.width, height: size.height }]
      })
    })

  // ---- derived scales ----

  // Max radius based on category step width in the current view (zoom-aware).
  // ordinalScale maps categoryIndex → pixel, so the step per category = ordinalScale(1) - ordinalScale(0).
  // When zoomed in, fewer categories span the same pixel width, giving a larger step and thus larger bubbles.
  const maxRadius$ = combineLatest({
    sizeAdjust: fullParams$.pipe(map(p => p.sizeAdjust), distinctUntilChanged()),
    ordinalScale: ordinalScale$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(d => {
      const stepWidth = Math.abs(d.ordinalScale(1) - d.ordinalScale(0))
      return (stepWidth * d.sizeAdjust) / 2
    }),
    distinctUntilChanged(),
    shareReplay(1)
  )

  // Filter to only data within the current zoom domain so radius/opacity scales
  // are recalculated relative to the visible categories after a CategoryZoom.
  const minMaxValue$ = combineLatest({
    visibleComputedData: visibleComputedData$,
    categoryScaleDomainValue: categoryScaleDomainValue$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      const allValues = data.visibleComputedData
        .flat()
        .filter(d =>
          d.categoryIndex >= data.categoryScaleDomainValue[0] &&
          d.categoryIndex <= data.categoryScaleDomainValue[1]
        )
        .map(d => d.value ?? 0)
      const min = Math.min(0, ...allValues)
      const max = Math.max(0, ...allValues)
      return [min, max] as [number, number]
    }),
    distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1]),
    shareReplay(1)
  )

  const opacityScale$ = combineLatest({
    minMaxValue: minMaxValue$,
    fullParams: fullParams$
  }).pipe(
    takeUntil(destroy$),
    map(data => d3.scaleLinear<number>()
      .domain(data.minMaxValue)
      .range(data.fullParams.valueLinearOpacity)
    ),
    shareReplay(1)
  )

  const radiusScale$ = combineLatest({
    maxRadius: maxRadius$,
    minMaxValue: minMaxValue$,
    arcScaleType: fullParams$.pipe(map(p => p.arcScaleType), distinctUntilChanged())
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(data => d3.scalePow<number>()
      .domain([0, Math.max(data.minMaxValue[1], 1)])
      .range([2, data.maxRadius])
      .exponent(data.arcScaleType === 'area' ? 0.5 : 1)
    ),
    shareReplay(1)
  )

  // ---- bubble data with positions ----
  const bubbleData$: Observable<BubbleDatum[]> = combineLatest({
    visibleComputedData: visibleComputedData$,
    radiusScale: radiusScale$,
    ordinalScale: ordinalScale$,
    valueScale: valueScale$,
    opacityScale: opacityScale$,
    showZeroValue: fullParams$.pipe(map(p => p.showZeroValue), distinctUntilChanged())
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(data => {
      const bubbles: BubbleDatum[] = []

      data.visibleComputedData.forEach(seriesData => {
        seriesData
          .filter(datum => data.showZeroValue || (datum.value !== null && datum.value !== 0))
          .forEach(datum => {
            const value = datum.value ?? 0
            bubbles.push({
              x: data.ordinalScale(datum.categoryIndex),
              y: data.valueScale(value),
              r: data.radiusScale(Math.abs(value)),
              opacity: data.opacityScale(value),
              color: datum.color,
              _refDatum: datum
            })
          })
      })

      return bubbles
    })
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

  // ---- render ----
  const graphicSelection$ = combineLatest({
    bubbleData: bubbleData$,
    transitionDuration: transitionDuration$,
    transitionEase: transitionEase$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(data => renderBubbles({
      containerSelection: containerG,
      bubbleClassName,
      bubbleData: data.bubbleData,
      transitionDuration: data.transitionDuration,
      transitionEase: data.transitionEase
    })),
    shareReplay(1)
  )

  // ---- events ----
  combineLatest({
    graphicSelection: graphicSelection$,
    computedData: computedData$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0)
  ).subscribe(data => {
    data.graphicSelection
      .on('mouseover', (event: MouseEvent, d: BubbleDatum) => {
        eventTrigger$.next({
          eventName: 'mouseover',
          pluginName,
          layerName,
          target: d._refDatum,
          event
        })
      })
      .on('mousemove', (event: MouseEvent, d: BubbleDatum) => {
        eventTrigger$.next({
          eventName: 'mousemove',
          pluginName,
          layerName,
          target: d._refDatum,
          event
        })
      })
      .on('mouseout', (event: MouseEvent, d: BubbleDatum) => {
        eventTrigger$.next({
          eventName: 'mouseout',
          pluginName,
          layerName,
          target: d._refDatum,
          event
        })
      })
      .on('click', (event: MouseEvent, d: BubbleDatum) => {
        eventTrigger$.next({
          eventName: 'click',
          pluginName,
          layerName,
          target: d._refDatum,
          event
        })
      })
  })

  // ---- highlight ----
  combineLatest({
    graphicSelection: graphicSelection$,
    highlight: gridHighlight$.pipe(map(d => d.map(x => x.id))),
    styles: styles$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0)
  ).subscribe(data => {
    highlightBubbles({
      selection: data.graphicSelection,
      ids: data.highlight,
      unhighlightedOpacity: data.styles.unhighlightedOpacity
    })
  })

  return () => {
    destroy$.next()
    destroy$.complete()
  }
}
