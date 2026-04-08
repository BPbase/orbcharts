import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  Subject,
  Observable,
  BehaviorSubject
} from 'rxjs'
import type { ComputedDatumGrid } from '../types/ComputedData'
import type { ContainerPositionScaled, ContainerSize } from '../types'
import type { RacingPlotCounterTextParams } from '../plugins/RacingPlot/types'
import { createClassName } from '../utils/orbchartsUtils'

// ---- Types ----

type TextDatum = {
  text: string
  attr: { [key: string]: any }
  style: { [key: string]: any }
}

export interface BaseCounterTextContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedDatumGrid[][]>
  currentFrameIndex$: BehaviorSubject<number>
  currentFrameLabel$: Observable<string>
  fullParams$: Observable<RacingPlotCounterTextParams>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
}

// ---- Render helpers ----

function createTextData ({
  computedData,
  frameLabel,
  frameIndex,
  renderFn,
  textAttrs,
  textStyles
}: {
  computedData: ComputedDatumGrid[][]
  frameLabel: string
  frameIndex: number
  renderFn: (categoryLabel: string, frameIndex: number, data: ComputedDatumGrid[][]) => string[] | string
  textAttrs: Array<{ [key: string]: string | number }>
  textStyles: Array<{ [key: string]: string | number }>
}): TextDatum[] {
  const callbackText = renderFn(frameLabel, frameIndex, computedData)
  const textArr = Array.isArray(callbackText) ? callbackText : [callbackText]
  return textArr.map((t, i) => ({
    text: t,
    attr: textAttrs[i] ?? {},
    style: textStyles[i] ?? {}
  }))
}

function renderText ({
  boxG,
  textClassName,
  textData,
  containerSize,
  fullParams
}: {
  boxG: d3.Selection<SVGGElement, any, any, any>
  textClassName: string
  textData: TextDatum[]
  containerSize: ContainerSize
  fullParams: RacingPlotCounterTextParams
}) {
  const x = containerSize.width - fullParams.paddingRight
  const y = containerSize.height - fullParams.paddingBottom

  boxG.attr('transform', `translate(${x}, ${y})`)

  boxG
    .selectAll<SVGTextElement, TextDatum>(`text.${textClassName}`)
    .data(textData)
    .join(
      enter => enter.append('text').attr('class', textClassName),
      update => update,
      exit => exit.remove()
    )
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'auto')
    .each((d, i, g) => {
      const t = d3.select(g[i]).text(d.text)
      Object.keys(d.attr).forEach(key => t.attr(key, d.attr[key]))
      Object.keys(d.style).forEach(key => t.style(key, d.style[key]))
    })
}

// ---- Main export ----

export function createBaseCounterText ({
  selection,
  pluginName,
  layerName,
  computedData$,
  currentFrameIndex$,
  currentFrameLabel$,
  fullParams$,
  containerPosition$,
  containerSize$
}: BaseCounterTextContext) {
  const destroy$ = new Subject<void>()

  const containerClassName = createClassName(pluginName, layerName, 'container')
  const boxClassName = createClassName(pluginName, layerName, 'box')
  const textClassName = createClassName(pluginName, layerName, 'text')

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

  const boxG = containerG
    .selectAll<SVGGElement, any>(`g.${boxClassName}`)
    .data([null])
    .join('g')
    .classed(boxClassName, true)

  // ---- render text ----
  combineLatest({
    computedData: computedData$,
    currentFrameIndex: currentFrameIndex$,
    currentFrameLabel: currentFrameLabel$,
    fullParams: fullParams$,
    containerSize: containerSize$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    const textData = createTextData({
      computedData: data.computedData,
      frameLabel: data.currentFrameLabel,
      frameIndex: data.currentFrameIndex,
      renderFn: data.fullParams.renderFn,
      textAttrs: data.fullParams.textAttrs,
      textStyles: data.fullParams.textStyles
    })
    renderText({
      boxG,
      textClassName,
      textData,
      containerSize: data.containerSize,
      fullParams: data.fullParams
    })
  })

  return () => {
    destroy$.next()
    destroy$.complete()
  }
}
