import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Subject,
  Observable
} from 'rxjs'
import type { EventData, ColorType, Theme } from '@orbcharts/core'
import type { ComputedDatumGrid } from '../types/ComputedData'
import type { ContainerPositionScaled, ContainerSize, GraphicStyles, Layout } from '../types'
import type { RankedPlotRankedBubbleParams } from '../plugins/RankedPlot/types'
import { createClassName, createUniID } from '../utils/orbchartsUtils'
import { getD3TransitionEase } from '../utils/d3Utils'

// ---- Internal types ----

interface BubbleValueDatum {
  categoryIndex: number
  x: number       // ordinalScale(categoryIndex) + ordinalPadding
  y: number       // rankingScale(seriesLabel)
  r: number
  opacity: number
  _refDatum: ComputedDatumGrid
}

interface BubbleSeriesDatum extends ComputedDatumGrid {
  graphicValue: BubbleValueDatum[]
}

type ClipPathDatum = {
  id: string
  width: number
  height: number
}

export interface BaseRankedBubbleContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedDatumGrid[][]>
  rankedSeriesData$: Observable<ComputedDatumGrid[][]>
  CategoryDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  fullParams$: Observable<RankedPlotRankedBubbleParams>
  styles$: Observable<GraphicStyles>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  rankingItemHeight$: Observable<number>
  rankingScaleList$: Observable<d3.ScalePoint<string>[]>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  layout$: Observable<Layout>
  ordinalScale$: Observable<d3.ScaleLinear<number, number>>
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

function renderGraphicG ({
  containerSelection,
  paddingGClassName,
  itemGClassName,
  bubbleData,
  transitionDuration,
  transitionEase
}: {
  containerSelection: d3.Selection<SVGGElement, any, any, any>
  paddingGClassName: string
  itemGClassName: string
  bubbleData: BubbleSeriesDatum[]
  transitionDuration: number
  transitionEase: string
}) {
  containerSelection
    .selectAll<SVGGElement, any>(`g.${paddingGClassName}`)
    .data([0])
    .join(
      enter => enter.append('g').attr('class', paddingGClassName),
      update => update,
      exit => exit.remove()
    )
    .selectAll<SVGGElement, BubbleSeriesDatum>(`g.${itemGClassName}`)
    .data(bubbleData, d => d.series)
    .join(
      enter => enter
        .append('g')
        .attr('class', itemGClassName)
        .attr('cursor', 'pointer')
        .attr('transform', d => `translate(0, ${d.graphicValue[0]?.y ?? 0})`),
      update => update
        .transition()
        .duration(transitionDuration)
        .ease(getD3TransitionEase(transitionEase))
        .attr('transform', d => `translate(0, ${d.graphicValue[0]?.y ?? 0})`),
      exit => exit.remove()
    )

  return containerSelection.selectAll<SVGGElement, BubbleSeriesDatum>(`g.${itemGClassName}`)
}

function renderBubbles ({
  graphicGSelection,
  bubbleValueClassName,
  transitionDuration
}: {
  graphicGSelection: d3.Selection<SVGGElement, BubbleSeriesDatum, any, any>
  bubbleValueClassName: string
  transitionDuration: number
}) {
  graphicGSelection.each((datum, i, g) => {
    d3.select(g[i])
      .selectAll<SVGCircleElement, BubbleValueDatum>(`circle.${bubbleValueClassName}`)
      .data(datum.graphicValue, d => String(d.categoryIndex))
      .join(
        enter => enter.append('circle').attr('class', bubbleValueClassName),
        update => update,
        exit => exit.remove()
      )
      .attr('fill', () => datum.color)
      .style('opacity', d => d.opacity)
      .transition()
      .duration(transitionDuration)
      .ease(d3.easeLinear)
      .attr('cx', d => d.x)
      .attr('r', d => d.r)
  })

  return graphicGSelection.selectAll<SVGCircleElement, BubbleValueDatum>(`circle.${bubbleValueClassName}`)
}

function highlightBubbles ({
  selection,
  ids,
  unhighlightedOpacity
}: {
  selection: d3.Selection<SVGCircleElement, BubbleValueDatum, any, any>
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
    const datum = d._refDatum
    d3.select<SVGCircleElement, BubbleValueDatum>(n[i])
      .style('opacity', ids.includes(datum.id) ? d.opacity : unhighlightedOpacity)
  })
}

// ---- Main export ----

export function createBaseRankedBubble ({
  selection,
  pluginName,
  layerName,
  computedData$,
  rankedSeriesData$,
  CategoryDataMap$,
  fullParams$,
  styles$,
  gridHighlight$,
  rankingItemHeight$,
  rankingScaleList$,
  containerPosition$,
  containerSize$,
  layout$,
  ordinalScale$,
  eventTrigger$
}: BaseRankedBubbleContext) {
  const destroy$ = new Subject<void>()

  const clipPathID = createUniID(pluginName, layerName, 'clipPath-box')
  const containerClassName = createClassName(pluginName, layerName, 'container')
  const paddingGClassName = createClassName(pluginName, layerName, 'padding-g')
  const itemGClassName = createClassName(pluginName, layerName, 'item-g')
  const bubbleValueClassName = createClassName(pluginName, layerName, 'bubble')

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

  combineLatest({ size: containerSize$, layout: layout$ }).pipe(takeUntil(destroy$)).subscribe(({ size, layout }) => {
    renderClipPath({
      defsSelection,
      clipPathData: [{ id: clipPathID, width: size.width + layout.right, height: size.height }]
    })
  })

  // ---- derived scales ----
  const maxRadius$ = combineLatest({
    sizeAdjust: fullParams$.pipe(map(p => p.bubble.sizeAdjust), distinctUntilChanged()),
    rankingItemHeight: rankingItemHeight$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(d => (d.rankingItemHeight * d.sizeAdjust) / 2),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const minMaxValue$ = rankedSeriesData$.pipe(
    takeUntil(destroy$),
    map(rankedData => {
      const allValues = rankedData.flat().map(d => d.value ?? 0)
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
      .range(data.fullParams.bubble.valueLinearOpacity)
    ),
    shareReplay(1)
  )

  const radiusScale$ = combineLatest({
    maxRadius: maxRadius$,
    minMaxValue: minMaxValue$,
    arcScaleType: fullParams$.pipe(map(p => p.bubble.arcScaleType), distinctUntilChanged())
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => d3.scalePow<number>()
      .domain([0, Math.max(data.minMaxValue[1], 1)])
      .range([2, data.maxRadius])
      .exponent(data.arcScaleType === 'area' ? 0.5 : 1)
    ),
    shareReplay(1)
  )

  // ---- bubble data with positions ----
  const bubbleData$: Observable<BubbleSeriesDatum[]> = combineLatest({
    rankedSeriesData: rankedSeriesData$,
    radiusScale: radiusScale$,
    rankingScaleList: rankingScaleList$,
    ordinalScale: ordinalScale$,
    opacityScale: opacityScale$,
    showZeroValue: fullParams$.pipe(map(p => p.bubble.showZeroValue), distinctUntilChanged())
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const rankingScale = data.rankingScaleList[0]
      if (!rankingScale) return []

      return data.rankedSeriesData.map((seriesCategoryData) => {
        const firstDatum = seriesCategoryData[0]
        if (!firstDatum) return null as any

        const yPos = rankingScale(firstDatum.series) ?? 0

        const graphicValue: BubbleValueDatum[] = seriesCategoryData
          .filter(categoryDatum => data.showZeroValue || (categoryDatum.value !== null && categoryDatum.value !== 0))
          .map((categoryDatum) => ({
            categoryIndex: categoryDatum.categoryIndex,
            x: data.ordinalScale(categoryDatum.categoryIndex),
            y: yPos,
            r: data.radiusScale(categoryDatum.value ?? 0),
            opacity: data.opacityScale(categoryDatum.value ?? 0),
            _refDatum: categoryDatum
          }))

        const bubbleSeriesDatum: BubbleSeriesDatum = {
          ...firstDatum,
          graphicValue
        }

        return bubbleSeriesDatum
      }).filter(Boolean)
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
  const graphicGSelection$ = combineLatest({
    bubbleData: bubbleData$,
    transitionDuration: transitionDuration$,
    transitionEase: transitionEase$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => renderGraphicG({
      containerSelection: containerG,
      paddingGClassName,
      itemGClassName,
      bubbleData: data.bubbleData,
      transitionDuration: data.transitionDuration,
      transitionEase: data.transitionEase
    }))
  )

  const graphicSelection$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    transitionDuration: transitionDuration$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => renderBubbles({
      graphicGSelection: data.graphicGSelection,
      bubbleValueClassName,
      transitionDuration: data.transitionDuration
    })),
    shareReplay(1)
  )

  // ---- events ----
  combineLatest({
    graphicSelection: graphicSelection$,
    computedData: computedData$,
    CategoryDataMap: CategoryDataMap$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.graphicSelection
      .on('mouseover', (event: MouseEvent, valueDatum: BubbleValueDatum) => {
        eventTrigger$.next({
          eventName: 'mouseover',
          pluginName,
          layerName,
          target: valueDatum._refDatum,
          event
        })
      })
      .on('mousemove', (event: MouseEvent, valueDatum: BubbleValueDatum) => {
        eventTrigger$.next({
          eventName: 'mousemove',
          pluginName,
          layerName,
          target: valueDatum._refDatum,
          event
        })
      })
      .on('mouseout', (event: MouseEvent, valueDatum: BubbleValueDatum) => {
        eventTrigger$.next({
          eventName: 'mouseout',
          pluginName,
          layerName,
          target: valueDatum._refDatum,
          event
        })
      })
      .on('click', (event: MouseEvent, valueDatum: BubbleValueDatum) => {
        eventTrigger$.next({
          eventName: 'click',
          pluginName,
          layerName,
          target: valueDatum._refDatum,
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
    switchMap(async d => d)
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
