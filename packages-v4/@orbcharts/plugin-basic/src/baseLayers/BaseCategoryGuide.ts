import * as d3 from 'd3'
import {
  combineLatest,
  debounceTime,
  switchMap,
  takeUntil,
  Observable,
  Subject
} from 'rxjs'
import type { ColorType, EventData, Theme } from '@orbcharts/core'
import type { BaseLayerFn } from '../types/BaseLayer'
import type { AxisPosition } from '../types/PluginParams'
import { getColor, createClassName } from '../utils/orbchartsUtils'
import { parseTickFormatValue } from '../utils/d3Utils'
import { measureTextWidth } from '../utils/commonUtils'
import { renderTspansOnAxis } from '../utils/d3Graphics'

// Shared rendering logic for the category guide (hover line + label).
// Used by GridPlot/CategoryGuide and CategoricalPlot/CategoryGuide.
// Each plugin computes categoryPosition$ (mouse → category) externally and passes it in.

export interface BaseCategoryGuideParams {
  showLine: boolean
  showLabel: boolean
  lineDashArray: string
  lineColorType: ColorType
  labelColorType: ColorType
  labelTextColorType: ColorType
  labelTextFormat: string | ((text: any) => string)
  labelPadding: number
  labelRotate: number
}

export interface BaseCategoryGuideContext {
  // The D3 selection to render the guide line and label into
  selection$: Observable<d3.Selection<any, unknown, any, unknown>>
  pluginName: string
  layerName: string
  // Resolved hover position (category index, label string, X pixel on axes).
  // Each plugin is responsible for computing this from the mouse event and the zoomed scale.
  categoryPosition$: Observable<{
    categoryIndex: number
    categoryLabel: string
    axisX: number
  }>
  // When this Observable emits, the guide is cleared (e.g. mouseleave / mouseout).
  clearTrigger$: Observable<unknown>
  gridAxesSize$: Observable<{ width: number; height: number }>
  layerParams$: Observable<BaseCategoryGuideParams>
  // Position of the category axis — determines where the label box is rendered relative to the line.
  categoryAxisPosition$: Observable<AxisPosition>
  textReverseTransformWithRotate$: Observable<string>
  rowAmount$: Observable<number>
  fontSizePx$: Observable<number>
  theme$: Observable<Theme>
  eventTrigger$: Subject<EventData>
}

interface LineDatum {
  id: string
  x1: number; x2: number; y1: number; y2: number
}

interface LabelDatum {
  id: string
  text: string
  textArr: string[]
  textWidth: number
  textHeight: number
  x: number
  y: number
}

const rectPaddingWidth = 6
const rectPaddingHeight = 3

function createLineData({
  categoryLabel, axisX, axisHeight, layerParams
}: {
  categoryLabel: string
  axisX: number
  axisHeight: number
  layerParams: BaseCategoryGuideParams
}): LineDatum[] {
  return layerParams.showLine && categoryLabel
    ? [{ id: categoryLabel, x1: axisX, x2: axisX, y1: 0, y2: axisHeight }]
    : []
}

function createLabelData({
  categoryLabel, axisX, layerParams, textSizePx, rowAmount
}: {
  categoryLabel: string
  axisX: number
  layerParams: BaseCategoryGuideParams
  textSizePx: number
  rowAmount: number
}): LabelDatum[] {
  if (!layerParams.showLabel || !categoryLabel) return []
  const text = parseTickFormatValue(categoryLabel, layerParams.labelTextFormat)
  const textArr = text.split('\n')
  const maxLengthText = textArr.reduce((acc, cur) => cur.length > acc.length ? cur : acc, '')
  const textWidth = measureTextWidth(maxLengthText, textSizePx)
  const textHeight = textSizePx * textArr.length
  return [{
    id: categoryLabel,
    x: axisX,
    y: -layerParams.labelPadding * rowAmount,
    text, textArr, textWidth, textHeight
  }]
}

function renderLine({
  selection, lineClassName, lineData, layerParams, theme
}: {
  selection: d3.Selection<any, unknown, any, unknown>
  lineClassName: string
  lineData: LineDatum[]
  layerParams: BaseCategoryGuideParams
  theme: Theme
}) {
  return selection
    .selectAll<SVGLineElement, LineDatum>(`line.${lineClassName}`)
    .data(lineData)
    .join(
      enter => enter
        .append('line')
        .classed(lineClassName, true)
        .style('stroke-width', 1)
        .style('pointer-events', 'none')
        .style('vector-effect', 'non-scaling-stroke')
        .attr('x1', d => d.x1).attr('y1', d => d.y1)
        .attr('x2', d => d.x2).attr('y2', d => d.y2),
      update => update
        .transition().duration(50)
        .attr('x1', d => d.x1).attr('y1', d => d.y1)
        .attr('x2', d => d.x2).attr('y2', d => d.y2),
      exit => exit.remove()
    )
    .style('stroke', () => getColor(layerParams.lineColorType, theme))
    .style('stroke-dasharray', layerParams.lineDashArray ?? 'none')
}

function removeLine(
  selection: d3.Selection<any, unknown, any, unknown>,
  lineClassName: string
) {
  selection
    .selectAll<SVGLineElement, LineDatum>(`line.${lineClassName}`)
    .data([])
    .exit()
    .remove()
}

function renderLabel({
  selection, labelClassName, labelData, categoryAxisPosition,
  layerParams, theme, textReverseTransformWithRotate, fontSizePx
}: {
  selection: d3.Selection<any, unknown, any, unknown>
  labelClassName: string
  labelData: LabelDatum[]
  categoryAxisPosition: AxisPosition
  layerParams: BaseCategoryGuideParams
  theme: Theme
  textReverseTransformWithRotate: string
  fontSizePx: number
}) {
  return selection
    .selectAll<SVGGElement, LabelDatum>(`g.${labelClassName}`)
    .data(labelData)
    .join(
      enter => enter
        .append('g')
        .classed(labelClassName, true)
        .style('cursor', 'pointer')
        .attr('transform', d => `translate(${d.x}, ${d.y})`),
      update => update
        .transition().duration(50)
        .attr('transform', d => `translate(${d.x}, ${d.y})`),
      exit => exit.remove()
    )
    .each((datum, i, n) => {
      const gSelection = d3.select(n[i])
      const rectWidth = datum.textWidth + rectPaddingWidth * 2
      const rectHeight = datum.textHeight + rectPaddingHeight * 2

      // Label box position varies by axis position
      let rectX = -rectWidth / 2
      let rectY = -2
      let x = rectX
      let y = rectY - 3 // small visual offset
      if (categoryAxisPosition === 'bottom') {
        rectX = layerParams.labelRotate ? -rectWidth + rectHeight : -rectWidth / 2
        rectY = 2
        x = rectX; y = rectY - 3
      } else if (categoryAxisPosition === 'left') {
        rectX = -rectWidth + 2; rectY = -rectHeight / 2
        x = rectX; y = rectY - 3
        if (layerParams.labelRotate) y += rectHeight
      } else if (categoryAxisPosition === 'right') {
        rectX = -2; rectY = -rectHeight / 2
        x = rectX; y = rectY - 3
        if (layerParams.labelRotate) y += rectHeight
      } else if (categoryAxisPosition === 'top') {
        rectX = layerParams.labelRotate ? -rectWidth + rectHeight : -rectWidth / 2
        rectY = -rectHeight + 6; x = -rectHeight; y = rectY - 3
      }

      const rect = gSelection
        .selectAll<SVGRectElement, LabelDatum>('rect')
        .data([datum])
        .join(
          enter => enter.append('rect').style('cursor', 'pointer').attr('rx', 5).attr('ry', 5),
          update => update,
          exit => exit.remove()
        )
        .attr('width', `${rectWidth}px`)
        .attr('height', `${rectHeight}px`)
        .attr('fill', () => getColor(layerParams.labelColorType, theme))
        .attr('x', x).attr('y', y)
        .style('transform', textReverseTransformWithRotate)

      const textEl = gSelection
        .selectAll<SVGTextElement, LabelDatum>('text')
        .data([datum])
        .join(
          enter => enter.append('text')
            .style('dominant-baseline', 'hanging')
            .style('cursor', 'pointer'),
          update => update,
          exit => exit.remove()
        )
        .style('transform', textReverseTransformWithRotate)
        .attr('fill', () => getColor(layerParams.labelTextColorType, theme))
        .attr('font-size', theme.fontSize)
        .attr('x', x + rectPaddingWidth)
        .attr('y', y + rectPaddingHeight)
        .each((d, i, n) => {
          renderTspansOnAxis(d3.select(n[i]), {
            textArr: datum.textArr,
            textSizePx: fontSizePx,
            categoryAxisPosition,
            isContainerRotated: false
          })
        })

      // Adjust rect width to actual rendered text width
      const textWidths: number[] = []
      textEl.selectAll('tspan').each((d, i, n) => {
        const node = d3.select(n[i]).node() as SVGTextElement
        if (node?.getBBox) textWidths.push(node.getBBox().width)
      })
      const maxTextWidth = Math.max(...textWidths)
      if (maxTextWidth > 0) {
        rect.attr('width', maxTextWidth + rectPaddingWidth * 2)
      }
    })
}

function removeLabel(
  selection: d3.Selection<any, unknown, any, unknown>,
  labelClassName: string
) {
  selection
    .selectAll<SVGGElement, LabelDatum>(`g.${labelClassName}`)
    .data([])
    .exit()
    .remove()
}

export const createBaseCategoryGuide: BaseLayerFn<BaseCategoryGuideContext> = ({
  selection$,
  pluginName,
  layerName,
  categoryPosition$,
  clearTrigger$,
  gridAxesSize$,
  layerParams$,
  categoryAxisPosition$,
  textReverseTransformWithRotate$,
  rowAmount$,
  fontSizePx$,
  theme$,
  eventTrigger$
}) => {
  const destroy$ = new Subject<void>()

  const lineClassName = createClassName(pluginName, layerName, 'auxline')
  const labelClassName = createClassName(pluginName, layerName, 'label-box')

  let isLabelMouseover = false

  // ---- Render guide on mouse move ----
  combineLatest({
    selection: selection$,
    categoryPosition: categoryPosition$,
    gridAxesSize: gridAxesSize$,
    layerParams: layerParams$,
    categoryAxisPosition: categoryAxisPosition$,
    textReverseTransformWithRotate: textReverseTransformWithRotate$,
    rowAmount: rowAmount$,
    fontSizePx: fontSizePx$,
    theme: theme$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    const { categoryLabel, axisX } = data.categoryPosition

    renderLine({
      selection: data.selection,
      lineClassName,
      lineData: createLineData({
        categoryLabel,
        axisX,
        axisHeight: data.gridAxesSize.height,
        layerParams: data.layerParams
      }),
      layerParams: data.layerParams,
      theme: data.theme
    })

    const labelSelection = renderLabel({
      selection: data.selection,
      labelClassName,
      labelData: createLabelData({
        categoryLabel,
        axisX,
        layerParams: data.layerParams,
        textSizePx: data.fontSizePx,
        rowAmount: data.rowAmount
      }),
      categoryAxisPosition: data.categoryAxisPosition,
      layerParams: data.layerParams,
      textReverseTransformWithRotate: data.textReverseTransformWithRotate,
      theme: data.theme,
      fontSizePx: data.fontSizePx
    })

    // Label mouse events (stopPropagation so they don't clear the guide)
    labelSelection
      .on('mouseover', (event: MouseEvent) => {
        event.stopPropagation()
        isLabelMouseover = true
        eventTrigger$.next({ eventName: 'mouseover', pluginName, layerName, target: null, event })
      })
      .on('mousemove', (event: MouseEvent) => {
        event.stopPropagation()
        eventTrigger$.next({ eventName: 'mousemove', pluginName, layerName, target: null, event })
      })
      .on('mouseout', (event: MouseEvent) => {
        event.stopPropagation()
        isLabelMouseover = false
        eventTrigger$.next({ eventName: 'mouseout', pluginName, layerName, target: null, event })
      })
      .on('click', (event: MouseEvent) => {
        event.stopPropagation()
        eventTrigger$.next({ eventName: 'click', pluginName, layerName, target: null, event })
      })
  })

  // ---- Clear guide on mouseleave / mouseout ----
  combineLatest({
    clearTrigger: clearTrigger$,
    selection: selection$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0)
  ).subscribe(data => {
    setTimeout(() => {
      if (isLabelMouseover) return
      removeLine(data.selection, lineClassName)
      removeLabel(data.selection, labelClassName)
    })
  })

  return () => {
    destroy$.next()
  }
}
