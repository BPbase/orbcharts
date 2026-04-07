import * as d3 from 'd3'
import {
  combineLatest,
  debounceTime,
  switchMap,
  map,
  filter,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Subject
} from 'rxjs'
import type { RankedPlotCategoryGuideParams, RankedPlotPluginParams } from '../types'
import { DEFAULT_RANKED_PLOT_CATEGORY_GUIDE_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AUX } from '../../../const/layerIndex'
import { defineSVGLayer, validateObject } from '@orbcharts/core'
import type { RankedPlotExtendContext } from '../types'
import { createClassName, getColor } from '../../../utils/orbchartsUtils'
import { parseTickFormatValue } from '../../../utils/d3Utils'
import { d3EventObservable } from '../../../utils/observables'
import { rankedCategoryPositionObservable } from '../contextObservables'

const pluginName = 'RankedPlot'
const layerName = 'CategoryGuide'

const rectPaddingX = 6
const rectPaddingY = 3

export const CategoryGuide = defineSVGLayer<RankedPlotExtendContext, RankedPlotPluginParams, RankedPlotCategoryGuideParams>({
  name: layerName,
  defaultParams: DEFAULT_RANKED_PLOT_CATEGORY_GUIDE_PARAMS,
  layerIndex: LAYER_INDEX_OF_AUX,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      showLine: {
        toBeTypes: ['boolean']
      },
      showLabel: {
        toBeTypes: ['boolean']
      },
      lineDashArray: {
        toBeTypes: ['string']
      },
      lineColorType: {
        toBeOption: 'ColorType'
      },
      labelColorType: {
        toBeOption: 'ColorType'
      },
      labelTextColorType: {
        toBeOption: 'ColorType'
      },
      labelTextFormat: {
        toBeTypes: ['string', 'Function']
      },
      labelPadding: {
        toBeTypes: ['number']
      },
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    const auxSelection = d3.select(svgG)

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      auxSelection.attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    // ---- container group ----
    const containerG = auxSelection
      .selectAll<SVGGElement, any>('g.aux-container')
      .data([null])
      .join('g')
      .classed('aux-container', true)

    context.gridContainerPosition$.pipe(takeUntil(destroy$)).subscribe(positions => {
      const pos = positions[0]
      if (pos) {
        containerG.attr('transform', `translate(${pos.translate[0]}, ${pos.translate[1]})`)
      }
    })

    const lineClassName = createClassName(pluginName, layerName, 'aux-line')
    const labelBoxClassName = createClassName(pluginName, layerName, 'label-box')

    // ---- category position from mouse ----
    const categoryPosition$ = rankedCategoryPositionObservable({
      rootSelection: d3.select(context.svg),
      pluginParams$,
      computedData$: context.computedData$,
      layout$: context.layout$,
      gridContainerPosition$: context.gridContainerPosition$
    }).pipe(
      takeUntil(destroy$),
      shareReplay(1)
    )

    // Mouseout → clear
    d3EventObservable(d3.select(context.svg), 'mouseleave').pipe(
      takeUntil(destroy$)
    ).subscribe(() => {
      containerG.selectAll(`line.${lineClassName}`).remove()
      containerG.selectAll(`g.${labelBoxClassName}`).remove()
    })

    // ---- render aux ----
    combineLatest({
      categoryPosition: categoryPosition$,
      layerParams: layerParams$,
      gridAxesSize: context.gridAxesSize$,
      ordinalScale: context.ordinalScale$,
      fontSizePx: context.fontSizePx$,
      theme: context.theme$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      switchMap(async d => d)
    ).subscribe(data => {
      const { categoryPosition, layerParams, gridAxesSize, ordinalScale, fontSizePx, theme } = data
      const { categoryIndex, categoryLabel } = categoryPosition

      const axisX = ordinalScale(categoryIndex)

      // ---- line ----
      if (layerParams.showLine && categoryLabel) {
        containerG
          .selectAll<SVGLineElement, any>(`line.${lineClassName}`)
          .data([{ axisX }])
          .join('line')
          .classed(lineClassName, true)
          .style('pointer-events', 'none')
          .style('vector-effect', 'non-scaling-stroke')
          .style('stroke', getColor(layerParams.lineColorType, theme))
          .style('stroke-dasharray', layerParams.lineDashArray ?? 'none')
          .attr('x1', d => d.axisX)
          .attr('x2', d => d.axisX)
          .attr('y1', 0)
          .attr('y2', gridAxesSize.height)
      } else {
        containerG.selectAll(`line.${lineClassName}`).remove()
      }

      // ---- label ----
      if (layerParams.showLabel && categoryLabel) {
        const text = parseTickFormatValue(categoryLabel, layerParams.labelTextFormat)
        const textWidth = text.length * fontSizePx * 0.6
        const textHeight = fontSizePx
        const rectW = textWidth + rectPaddingX * 2
        const rectH = textHeight + rectPaddingY * 2

        const labelGroup = containerG
          .selectAll<SVGGElement, any>(`g.${labelBoxClassName}`)
          .data([{ axisX, text }])
          .join('g')
          .classed(labelBoxClassName, true)
          .attr('transform', d => `translate(${d.axisX - rectW / 2}, ${-layerParams.labelPadding})`)

        labelGroup
          .selectAll<SVGRectElement, any>('rect')
          .data([null])
          .join('rect')
          .attr('x', 0)
          .attr('y', -rectH)
          .attr('width', rectW)
          .attr('height', rectH)
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('fill', getColor(layerParams.labelColorType, theme))

        labelGroup
          .selectAll<SVGTextElement, any>('text')
          .data([text])
          .join('text')
          .attr('x', rectPaddingX)
          .attr('y', -rectPaddingY - 2)
          .attr('fill', getColor(layerParams.labelTextColorType, theme))
          .attr('font-size', fontSizePx)
          .style('dominant-baseline', 'auto')
          .text(d => d)
      } else {
        containerG.selectAll(`g.${labelBoxClassName}`).remove()
      }
    })

    return () => {
      destroy$.next(undefined)
    }
  }
})
