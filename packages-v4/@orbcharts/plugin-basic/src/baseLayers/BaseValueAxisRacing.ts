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
import type { ContainerPositionScaled, ContainerSize } from '../types'
import type { ValueAxisParams } from '../plugins/RacingPlot/types'
import { createClassName, createUniID, getColor } from '../utils/orbchartsUtils'
import { parseTickFormatValue } from '../utils/d3Utils'

// ---- Types ----

export interface BaseValueAxisRacingContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  fullParams$: Observable<ValueAxisParams>
  position$: Observable<'top' | 'bottom'>
  xScale$: Observable<(n: number) => number>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  theme$: Observable<Theme>
  transitionDuration$: Observable<number>
}

const defaultTickSize = 6

// ---- Main export ----

export function createBaseValueAxisRacing ({
  selection,
  pluginName,
  layerName,
  fullParams$,
  position$,
  xScale$,
  containerPosition$,
  containerSize$,
  theme$,
  transitionDuration$
}: BaseValueAxisRacingContext) {
  const destroy$ = new Subject<void>()

  const containerClassName = createClassName(pluginName, layerName, 'container')
  const axisClassName = createClassName(pluginName, layerName, 'axis')
  const labelClassName = createClassName(pluginName, layerName, 'label')

  // ---- single container ----
  const containerG = selection
    .selectAll<SVGGElement, any>(`g.${containerClassName}`)
    .data([null])
    .join('g')
    .classed(containerClassName, true)

  containerPosition$.pipe(takeUntil(destroy$)).subscribe(positions => {
    const pos = positions[0]
    if (pos) {
      containerG.attr('transform', `translate(${pos.translate[0]}, ${pos.translate[1]})`)
    }
  })

  const axisG = containerG
    .selectAll<SVGGElement, any>(`g.${axisClassName}`)
    .data([null])
    .join('g')
    .classed(axisClassName, true)

  const labelG = containerG
    .selectAll<SVGGElement, any>(`g.${labelClassName}`)
    .data([null])
    .join('g')
    .classed(labelClassName, true)

  // ---- render ----
  combineLatest({
    fullParams: fullParams$,
    position: position$,
    xScale: xScale$,
    containerSize: containerSize$,
    theme: theme$,
    transitionDuration: transitionDuration$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    const { fullParams, position, xScale, containerSize, theme, transitionDuration } = data

    // Cast to typed d3 scale for axis
    const scale = d3.scaleLinear()
      .domain((xScale as d3.ScaleLinear<number, number>).domain
        ? (xScale as d3.ScaleLinear<number, number>).domain()
        : [0, 1])
      .range([0, containerSize.width])

    const d3Axis = position === 'bottom' ? d3.axisBottom(scale) : d3.axisTop(scale)
    if (fullParams.ticks != null) {
      d3Axis.ticks(fullParams.ticks)
    }
    d3Axis
      .tickFormat(d => parseTickFormatValue(d, fullParams.tickFormat as any))
      .tickSize(fullParams.tickFullLine
        ? -containerSize.height
        : defaultTickSize)
      .tickSizeOuter(0)
      .tickPadding(fullParams.tickPadding)

    // position by plugin param
    axisG.attr('transform', `translate(0, ${position === 'bottom' ? containerSize.height : 0})`)

    axisG
      .transition()
      .duration(transitionDuration)
      .ease(d3.easeLinear)
      .call(d3Axis)

    axisG.selectAll('line')
      .style('fill', 'none')
      .style('stroke', fullParams.tickLineVisible
        ? getColor(fullParams.tickColorType, theme)
        : 'none')
      .style('stroke-dasharray', fullParams.tickFullLineDasharray)
      .attr('pointer-events', 'none')

    axisG.selectAll('path')
      .style('fill', 'none')
      .style('stroke', fullParams.axisLineVisible
        ? getColor(fullParams.axisLineColorType, theme)
        : 'none')
      .style('shape-rendering', 'crispEdges')

    axisG.selectAll('text')
      .attr('font-size', theme.fontSize)
      .style('color', getColor(fullParams.tickTextColorType, theme))
      .attr('dy', 0)

    // axis label (at right edge, top/bottom)
    labelG
      .attr('transform', `translate(${containerSize.width}, ${position === 'bottom' ? containerSize.height : 0})`)
      .selectAll<SVGTextElement, any>('text.axis-label')
      .data([''])
      .join(
        enter => enter.append('text').attr('class', 'axis-label').style('font-weight', 'bold'),
        update => update,
        exit => exit.remove()
      )
      .attr('text-anchor', 'start')
        .attr('dominant-baseline', position === 'bottom' ? 'auto' : 'hanging')
      .attr('x', fullParams.labelOffset[0])
        .attr('y', position === 'bottom' ? -fullParams.labelOffset[1] : fullParams.labelOffset[1])
      .attr('font-size', theme.fontSize)
      .style('fill', getColor(fullParams.labelColorType, theme))
  })

  return () => {
    destroy$.next()
    destroy$.complete()
  }
}
