import * as d3 from 'd3'
import {
  debounceTime,
  combineLatest,
  switchMap,
  map,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Subject,
  Observable
} from 'rxjs'
import type { CategoricalPlotCategoryGuideParams, CategoricalPlotPluginParams } from '../types'
import { DEFAULT_CATEGORICAL_PLOT_CATEGORY_AUX_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AUX } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import type { CategoricalPlotExtendContext } from '../types'
import { validateObject } from '@orbcharts/core'
import { createClassName, getColor } from '../../../utils/orbchartsUtils'
import { gridSelectionsObservable } from '../../../utils/gridObservables'
import { parseTickFormatValue } from '../../../utils/d3Utils'
import { measureTextWidth } from '../../../utils/commonUtils'
import { renderTspansOnAxis } from '../../../utils/d3Graphics'
import type { Theme } from '@orbcharts/core'
import { d3EventObservable } from '../../../utils/observables'

interface LineDatum {
  id: string
  x1: number
  x2: number
  y1: number
  y2: number
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

const pluginName = 'CategoricalPlot'
const layerName = 'CategoryGuide'

const labelClassName = createClassName(pluginName, layerName, 'label-box')

const rectPaddingWidth = 6
const rectPaddingHeight = 3

function createLineData ({ categoryLabel, axisX, axisHeight, layerParams }: {
  categoryLabel: string
  axisX: number
  axisHeight: number
  layerParams: CategoricalPlotCategoryGuideParams
}): LineDatum[] {
  return layerParams.showLine && categoryLabel
    ? [{
      id: categoryLabel,
      x1: axisX,
      x2: axisX,
      y1: 0,
      y2: axisHeight
    }]
    : []
}

function createLabelData ({ categoryLabel, axisX, layerParams, textSizePx, rowAmount }: {
  categoryLabel: string
  axisX: number
  layerParams: CategoricalPlotCategoryGuideParams
  textSizePx: number
  rowAmount: number
}) {
  const text = parseTickFormatValue(categoryLabel, layerParams.labelTextFormat)
  const textArr = text.split('\n')
  const maxLengthText = textArr.reduce((acc, current) => current.length > acc.length ? current : acc, '')
  const textWidth = measureTextWidth(maxLengthText, textSizePx)
  const textHeight = textSizePx * textArr.length
  return layerParams.showLabel && categoryLabel
    ? [{
      id: categoryLabel,
      x: axisX,
      y: - layerParams.labelPadding * rowAmount,
      text,
      textArr,
      textWidth,
      textHeight
    }]
    : []
}

function renderLine ({ selection, lineData, layerParams, theme }: {
  selection: d3.Selection<any, string, any, unknown>
  lineData: LineDatum[]
  layerParams: CategoricalPlotCategoryGuideParams
  theme: Theme
}) {
  const gClassName = createClassName(pluginName, layerName, 'auxline')
  const auxLineSelection = selection
    .selectAll<SVGLineElement, LineDatum>(`line.${gClassName}`)
    .data(lineData)
    .join(
      enter => enter
        .append('line')
        .classed(gClassName, true)
        .style('stroke-width', 1)
        .style('pointer-events', 'none')
        .style('vector-effect', 'non-scaling-stroke')
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2),
      update => update
        .transition().duration(50)
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2),
      exit => exit.remove()
    )
    .style('stroke', () => getColor(layerParams.lineColorType, theme))
    .style('stroke-dasharray', layerParams.lineDashArray ?? 'none')
  return auxLineSelection
}

function removeLine (selection: d3.Selection<any, string, any, unknown>) {
  selection.selectAll<SVGLineElement, LineDatum>('line').data([]).exit().remove()
}

function renderLabel ({ selection, labelData, layerParams, theme, textReverseTransformWithRotate, fontSizePx }: {
  selection: d3.Selection<any, string, any, unknown>
  labelData: LabelDatum[]
  layerParams: CategoricalPlotCategoryGuideParams
  theme: Theme
  textReverseTransformWithRotate: string
  fontSizePx: number
}) {
  const axisLabelSelection = selection
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
      // 'bottom' branch positioning
      const rectX = layerParams.labelRotate ? - rectWidth + rectHeight : - rectWidth / 2
      const rectY = 2
      const x = rectX
      const y = rectY - 3

      gSelection.selectAll<SVGRectElement, LabelDatum>('rect')
        .data([datum])
        .join(
          enter => enter.append('rect').style('cursor', 'pointer').attr('rx', 5).attr('ry', 5),
          update => update,
          exit => exit.remove()
        )
        .attr('width', `${rectWidth}px`)
        .attr('height', `${rectHeight}px`)
        .attr('fill', () => getColor(layerParams.labelColorType, theme))
        .attr('x', x)
        .attr('y', y)
        .style('transform', textReverseTransformWithRotate)

      const textEl = gSelection.selectAll<SVGTextElement, LabelDatum>('text')
        .data([datum])
        .join(
          enter => enter.append('text').style('dominant-baseline', 'hanging').style('cursor', 'pointer'),
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
            categoryAxisPosition: 'bottom',
            isContainerRotated: false
          })
        })

      let textWidthArr: number[] = []
      textEl.selectAll('tspan').each((d, i, n) => {
        const node = d3.select(n[i]).node() as SVGTextElement
        if (node?.getBBox) textWidthArr.push(node.getBBox().width)
      })
      const maxW = Math.max(...textWidthArr)
      if (maxW > 0) {
        gSelection.selectAll<SVGRectElement, LabelDatum>('rect')
          .attr('width', maxW + rectPaddingWidth * 2)
      }
    })
  return axisLabelSelection
}

function removeLabel (selection: d3.Selection<any, string, any, unknown>) {
  selection.selectAll<SVGGElement, LabelDatum>(`g.${labelClassName}`).data([]).exit().remove()
}

export const CategoryGuide = defineSVGLayer<CategoricalPlotExtendContext, CategoricalPlotPluginParams, CategoricalPlotCategoryGuideParams>({
  name: layerName,
  defaultParams: DEFAULT_CATEGORICAL_PLOT_CATEGORY_AUX_PARAMS,
  layerIndex: LAYER_INDEX_OF_AUX,
  initShow: false,
  validator: (params) => {
    return validateObject(params, {
      showLine: { toBeTypes: ['boolean'] },
      showLabel: { toBeTypes: ['boolean'] },
      lineDashArray: { toBeTypes: ['string'] },
      lineColorType: { toBeOption: 'ColorType' },
      labelColorType: { toBeOption: 'ColorType' },
      labelTextColorType: { toBeOption: 'ColorType' },
      labelTextFormat: { toBeTypes: ['string', 'Function'] },
      labelPadding: { toBeTypes: ['number'] },
      labelRotate: { toBeTypes: ['number'] }
    })
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    let isLabelMouseover = false

    const rootSelection = d3.select(svgG.parentElement)

    const rootRectSelection: d3.Selection<SVGRectElement, any, any, any> = rootSelection
      .insert('rect', 'g')
      .classed(createClassName(pluginName, layerName, 'rect'), true)
      .attr('opacity', 0)

    const { axesSelection$ } = gridSelectionsObservable({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      clipPathID: 'aux-clip',
      seriesLabels$: context.seriesLabels$.pipe(map(d => [d[0] ?? ''])),
      gridContainerPosition$: context.gridContainerPosition$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridGraphicTransform$: context.gridAxesTransform$
    })

    context.layout$.pipe(takeUntil(destroy$)).subscribe(d => {
      rootRectSelection.attr('width', d.rootWidth).attr('height', d.rootHeight)
    })

    const rootMousemove$: Observable<MouseEvent> = d3EventObservable(rootSelection, 'mousemove').pipe(
      takeUntil(destroy$)
    )

    // ---- detect hovered category from screen X coordinate ----
    // Category axis is horizontal at the bottom, so we detect by mouse X position.
    const hoveredSeriesInfo$ = combineLatest({
      rootMousemove: rootMousemove$,
      ordinalScale: context.ordinalScale$,
      categoryLabels: context.categoryLabels$,
      layout: context.layout$,
      categoryScaleDomainValue: context.categoryScaleDomainValue$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d),
      map(data => {
        const relativeX = (data.rootMousemove as any).offsetX - data.layout.left
        // invert the ordinal scale to get the nearest categoryIndex
        const rawIndex = data.ordinalScale.invert(relativeX)
        const categoryCount = data.categoryLabels.length
        const categoryIndex = Math.max(0, Math.min(categoryCount - 1, Math.round(rawIndex)))
        const categoryLabel = data.categoryLabels[categoryIndex] ?? ''
        // axisX is the X position of this category (vertical aux line drawn here)
        const axisX = data.ordinalScale(categoryIndex) ?? 0
        return { categoryIndex, categoryLabel, axisX }
      }),
      shareReplay(1)
    )

    const groupScale$ = combineLatest({
      categoryScaleDomainValue: context.categoryScaleDomainValue$,
      gridAxesSize: context.gridAxesSize$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => d3.scaleLinear()
        .domain(data.categoryScaleDomainValue)
        .range([0, data.gridAxesSize.width])
      )
    )

    const textReverseTransform$ = combineLatest({
      gridAxesReverseTransform: context.gridAxesReverseTransform$,
      gridContainerPosition: context.gridContainerPosition$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        const rotXY = `rotateX(${data.gridAxesReverseTransform.rotateX}deg) rotateY(${data.gridAxesReverseTransform.rotateY}deg)`
        const rot = `rotate(${data.gridAxesReverseTransform.rotate}deg)`
        const scale = `scale(${1 / data.gridContainerPosition[0].scale[0]}, ${1 / data.gridContainerPosition[0].scale[1]})`
        return `${rotXY} ${rot} ${scale}`
      }),
      distinctUntilChanged()
    )

    const textReverseTransformWithRotate$ = combineLatest({
      textReverseTransform: textReverseTransform$,
      layerParams: layerParams$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => `${data.textReverseTransform} rotate(${data.layerParams.labelRotate}deg)`)
    )

    const rowAmount$ = context.gridContainerPosition$.pipe(
      takeUntil(destroy$),
      map(pos => pos.reduce((acc, cur) => cur.rowIndex > acc ? cur.rowIndex : acc, 0) + 1),
      distinctUntilChanged()
    )

    combineLatest({
      axesSelection: axesSelection$,
      rowAmount: rowAmount$,
      hoveredSeriesInfo: hoveredSeriesInfo$,
      gridAxesSize: context.gridAxesSize$,
      layerParams: layerParams$,
      theme: context.theme$,
      textReverseTransformWithRotate: textReverseTransformWithRotate$,
      fontSizePx: context.fontSizePx$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      const { categoryLabel, axisX } = data.hoveredSeriesInfo

      renderLine({
        selection: data.axesSelection,
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
        selection: data.axesSelection,
        labelData: createLabelData({
          categoryLabel,
          axisX,
          layerParams: data.layerParams,
          textSizePx: data.fontSizePx,
          rowAmount: data.rowAmount
        }),
        layerParams: data.layerParams,
        textReverseTransformWithRotate: data.textReverseTransformWithRotate,
        theme: data.theme,
        fontSizePx: data.fontSizePx
      })

      labelSelection
        .on('mouseover', (event: MouseEvent) => {
          event.stopPropagation()
          isLabelMouseover = true
          context.eventTrigger$.next({ eventName: 'mouseover', pluginName, layerName, target: null, event })
        })
        .on('mousemove', (event: MouseEvent) => {
          event.stopPropagation()
          context.eventTrigger$.next({ eventName: 'mousemove', pluginName, layerName, target: null, event })
        })
        .on('mouseout', (event: MouseEvent) => {
          event.stopPropagation()
          isLabelMouseover = false
          context.eventTrigger$.next({ eventName: 'mouseout', pluginName, layerName, target: null, event })
        })
        .on('click', (event: MouseEvent) => {
          event.stopPropagation()
          context.eventTrigger$.next({ eventName: 'click', pluginName, layerName, target: null, event })
        })
    })

    const rootRectMouseout$ = d3EventObservable(rootRectSelection, 'mouseout').pipe(takeUntil(destroy$))

    combineLatest({
      rootRectMouseout: rootRectMouseout$,
      axesSelection: axesSelection$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      setTimeout(() => {
        if (isLabelMouseover) return
        removeLine(data.axesSelection)
        removeLabel(data.axesSelection)
      })
    })

    return () => {
      destroy$.next(undefined)
      rootRectSelection.remove()
    }
  }
})

