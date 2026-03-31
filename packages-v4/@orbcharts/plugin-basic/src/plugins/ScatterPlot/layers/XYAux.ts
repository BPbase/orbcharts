import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  debounceTime,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject,
  iif
} from 'rxjs'
import type { Theme, EventData, ColorType } from '@orbcharts/core'
import type { ScatterPlotPluginParams, ScatterPlotExtendContext, XYAuxParams, ComputedXYDataMultivariate } from '../types'
import { defineSVGLayer } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_X_Y_AUX_PARAMS } from "../defaults"
import { multivariateSelectionsObservable } from "../../../utils/multivariateObservables"
import { getColor, getDatumColor } from '../../../utils/orbchartsUtils'
import { createClassName, createUniID } from '../../../utils/orbchartsUtils'
import type { ContainerPosition, GraphicStyles, Layout } from '../../../types/PluginParams'
import { multivariateXYPositionObservable } from '../../../utils/multivariateObservables'
import { LAYER_INDEX_OF_AUX } from '../../../const/layerIndex'
import { d3EventObservable } from '../../../utils/observables'
import { renderTspansOnAxis } from '../../../utils/d3Graphics'
import { parseTickFormatValue } from '../../../utils/d3Utils'
import { measureTextWidth } from '../../../utils/commonUtils'

interface LineDatum {
  id: string
  x1: number
  x2: number
  y1: number
  y2: number
  dashArray: string
  colorType: ColorType
}

interface LabelDatum {
  id: string
  text: string
  textArr: string[]
  textWidth: number
  textHeight: number
  colorType: ColorType
  textColorType: ColorType
  x: number
  y: number
  rectWidth: number
  rectHeight: number
  rectX: number
  rectY: number
  textX: number
  textY: number
}

const pluginName = 'ScatterPlot'
const layerName = 'XYAux'
const labelClassName = createClassName(pluginName, layerName, 'label-box')


function createLineData ({ axisX, axisY, layout, layerParams }: {
  axisX: number
  axisY: number
  layout: Layout
  layerParams: XYAuxParams
}): LineDatum[] {
  if ((axisX >= 0 && axisX <= layout.width && axisY >= 0 && axisY <= layout.height) === false) {
    return []
  }
  return [
    {
      id: 'line-x',
      x1: axisX,
      x2: axisX,
      y1: 0,
      y2: layout.height,
      dashArray: layerParams.xAxis.lineDashArray ?? 'none',
      colorType: layerParams.xAxis.lineColorType
    },
    {
      id: 'line-0',
      x1: 0,
      x2: layout.width,
      y1: axisY,
      y2: axisY,
      dashArray: layerParams.yAxis.lineDashArray ?? 'none',
      colorType: layerParams.yAxis.lineColorType
    }
  ]
}

function createLabelData ({ axisX, axisY, xValue, yValue, layerParams, fontSizePx, layout, columnAmount, rowAmount }: {
  axisX: number
  axisY: number
  xValue: number
  yValue: number
  layerParams: XYAuxParams
  fontSizePx: number
  layout: Layout
  columnAmount: number
  rowAmount: number
}): LabelDatum[] {
  if ((axisX >= 0 && axisX <= layout.width && axisY >= 0 && axisY <= layout.height) === false) {
    return []
  }
  const rectPaddingWidth = 6
  const rectPaddingHeight = 3

  // x
  const xX = axisX
  const xY = layout.height + (layerParams.xAxis.labelPadding * rowAmount) // rowAmount 是為了把外部 container 的變形逆轉回來
  const xText = parseTickFormatValue(xValue, layerParams.xAxis.labelTextFormat)
  const xTextArr = xText.split('\n')
  const xMaxLengthText = xTextArr.reduce((acc, current) => current.length > acc.length ? current : acc, '')
  const xTextWidth = measureTextWidth(xMaxLengthText, fontSizePx)
  const xTextHeight = fontSizePx * xTextArr.length
  const xRectWidth = xTextWidth + (rectPaddingWidth * 2)
  const xRectHeight = xTextHeight + (rectPaddingHeight * 2)
  const xRectX = - xRectWidth / 2
  const xRectY = - rectPaddingHeight
  const xTextX = xRectX + rectPaddingWidth
  const xTextY = xRectY + rectPaddingHeight
  // y
  const yX = - (layerParams.yAxis.labelPadding * columnAmount) // columnAmount 是為了把外部 container 的變形逆轉回來
  const yY = axisY
  const yText = parseTickFormatValue(yValue, layerParams.yAxis.labelTextFormat)
  const yTextArr = yText.split('\n')
  const yMaxLengthText = yTextArr.reduce((acc, current) => current.length > acc.length ? current : acc, '')
  const yTextWidth = measureTextWidth(yMaxLengthText, fontSizePx)
  const yTextHeight = fontSizePx * yTextArr.length
  const yRectWidth = yTextWidth + (rectPaddingWidth * 2)
  const yRectHeight = yTextHeight + (rectPaddingHeight * 2)
  const yRectX = - yTextWidth - rectPaddingWidth
  const yRectY = - rectPaddingHeight - yTextHeight / 2
  const yTextX = yRectX + rectPaddingWidth
  const yTextY = yRectY + rectPaddingHeight
  return [
    {
      id: 'label-x',
      x: xX,
      y: xY,
      text: xText,
      textArr: xTextArr,
      textWidth: xTextWidth,
      textHeight: xTextHeight,
      colorType: layerParams.xAxis.labelColorType,
      textColorType: layerParams.xAxis.labelTextColorType,
      rectWidth: xRectWidth,
      rectHeight: xRectHeight,
      rectX: xRectX,
      rectY: xRectY,
      textX: xTextX,
      textY: xTextY
    },
    {
      id: 'label-y',
      x: yX,
      y: yY,
      text: yText,
      textArr: yTextArr,
      textWidth: yTextWidth,
      textHeight: yTextHeight,
      colorType: layerParams.yAxis.labelColorType,
      textColorType: layerParams.xAxis.labelTextColorType,
      rectWidth: yRectWidth,
      rectHeight: yRectHeight,
      rectX: yRectX,
      rectY: yRectY,
      textX: yTextX,
      textY: yTextY
    }
  ]
}

function renderLine ({ selection, pluginName, lineData, theme }: {
  selection: d3.Selection<any, string, any, unknown>
  pluginName: string
  lineData: LineDatum[]
  theme: Theme
}) {
  const gClassName = createClassName(pluginName, layerName, 'auxline')
  const auxLineSelection = selection
    .selectAll<SVGLineElement, LineDatum>(`line.${gClassName}`)
    .data(lineData)
    .join(
      enter => {
        return enter
          .append('line')
          .classed(gClassName, true)
          .style('stroke-width', 1)
          .style('pointer-events', 'none')
          .style('vector-effect', 'non-scaling-stroke')
          .attr('x1', d => d.x1)
          .attr('y1', d => d.y1)
          .attr('x2', d => d.x2)
          .attr('y2', d => d.y2)
      },
      update => {
        const updateSelection = update
          .transition()
          .duration(50)
          .attr('x1', d => d.x1)
          .attr('y1', d => d.y1)
          .attr('x2', d => d.x2)
          .attr('y2', d => d.y2)
        return updateSelection
      },
      exit => exit.remove()
    )
    .style('stroke', d => getColor(d.colorType, theme))
    .style('stroke-dasharray', d => d.dashArray)

  return auxLineSelection
}

function removeLine (selection: d3.Selection<any, string, any, unknown>) {
  const update = selection
    .selectAll<SVGLineElement, LineDatum>('line')
    .data([])

  update.exit().remove()
}

function renderLabel ({ selection, labelData, layerParams, theme, textReverseTransform, fontSizePx }: {
  selection: d3.Selection<any, string, any, unknown>
  labelData: LabelDatum[]
  layerParams: XYAuxParams
  theme: Theme
  // gridAxesReverseTransformValue: string
  textReverseTransform: string
  fontSizePx: number
}) {
  // const rectHeight = fontSizePx + 6

  const axisLabelSelection = selection
    .selectAll<SVGGElement, LabelDatum>(`g.${labelClassName}`)
    .data(labelData)
    .join(
      enter => {
        return enter
          .append('g')
          .classed(labelClassName, true)
          .style('cursor', 'pointer')
          .attr("transform", (d, i) => {
            return `translate(${d.x}, ${d.y})`
          })
      },
      update => {
        const updateSelection = update
          .transition()
          .duration(50)
          .attr("transform", (d, i) => {
            return `translate(${d.x}, ${d.y})`
          })
        return updateSelection
      },
      exit => exit.remove()
    )
    .each((datum, i, n) => {
      // // const rectWidth = measureTextWidth(datum.text, fontSizePx) + 12
      // const rectWidth = datum.textWidth + 12
      // const rectHeight = datum.textHeight + 6
      // // -- label偏移位置 --
      // let rectX = - rectWidth / 2
      // let rectY = 2

      // -- rect --
      d3.select(n[i])
        .selectAll<SVGRectElement, LabelDatum>('rect')
        .data([datum])
        .join(
          enter => enter.append('rect')
            .style('cursor', 'pointer')
            .attr('rx', 5)
            .attr('ry', 5),
          update => update,
          exit => exit.remove()
        )
        .attr('width', d => `${d.rectWidth}px`)
        .attr('height', d => `${d.rectHeight}px`)
        .attr('fill', d => getColor(d.colorType, theme))
        .attr('x', d => d.rectX)
        .attr('y', d => d.rectY)
        .style('transform', textReverseTransform)

      // -- text --
      d3.select(n[i])
        .selectAll<SVGTextElement, LabelDatum>('text')
        .data([datum])
        .join(
          enter => enter.append('text')
            .style('dominant-baseline', 'hanging')
            .style('cursor', 'pointer')
            .style('pointer-events', 'none'),
          update => update,
          exit => exit.remove()
        )
        .style('transform', textReverseTransform)
        .attr('fill', d => getColor(d.textColorType, theme))
        .attr('font-size', theme.fontSize)
        .attr('x', d => d.textX)
        .attr('y', d => d.textY)
        .each((d, i, n) => {
          renderTspansOnAxis(d3.select(n[i]), {
            textArr: datum.textArr,
            textSizePx: fontSizePx,
            categoryAxisPosition: i === 0
              ? 'bottom' // x axis
              : 'left', // y axis
            isContainerRotated: false
          })
        })
    })

  return axisLabelSelection
}

function removeLabel (selection: d3.Selection<any, string, any, unknown>) {
  const gUpdate = selection
    .selectAll<SVGGElement, LabelDatum>(`g.${labelClassName}`)
    .data([])

  gUpdate.exit().remove()
}

export const XYAux = defineSVGLayer<ScatterPlotExtendContext, ScatterPlotPluginParams, XYAuxParams>({
  name: layerName,
  defaultParams: DEFAULT_X_Y_AUX_PARAMS,
  layerIndex: LAYER_INDEX_OF_AUX,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      xAxis: {
        toBeTypes: ['object']
      },
      yAxis: {
        toBeTypes: ['object']
      }
    })
    if (params.xAxis) {
      const forceResult = validateObject(params.xAxis, {
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
      if (forceResult.status === 'error') {
        return forceResult
      }
    }
    if (params.yAxis) {
      const forceResult = validateObject(params.yAxis, {
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
      if (forceResult.status === 'error') {
        return forceResult
      }
    }
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

    const destroy$ = new Subject()

    context.layout$
      .pipe(
        takeUntil(destroy$)
      )
      .subscribe(layout => {
        d3.select(svgG)
          .attr('transform', `translate(${layout.left}, ${layout.top})`)
      })

    let isLabelMouseover: boolean = false

    const rootSelection = d3.select(context.svg)

    const rootRectSelection: d3.Selection<SVGRectElement, any, any, any> = rootSelection
      .insert('rect', 'g')
      .classed(createClassName(pluginName, layerName, 'rect'), true)
      .attr('opacity', 0)

    // const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection
    //   .append('g')

    const { 
      seriesSelection$,
      axesSelection$,
      defsSelection$,
      graphicGSelection$
    } = multivariateSelectionsObservable({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      clipPathID: 'XYAuxClipPath',
      seriesLabels$: context.isSeriesSeprate$.pipe(
        switchMap(isSeriesSeprate => {
          return iif(
            () => isSeriesSeprate,
            context.seriesLabels$,
            // 如果沒分開的話只取一筆
            context.seriesLabels$.pipe(
              map(d => [d[0]])
            )
          )
        })
      ),
      containerPosition$: context.containerPosition$,
      graphicTransform$: context.graphicTransform$
    })

    context.layout$.pipe(
      takeUntil(destroy$),
    ).subscribe(d => {
      rootRectSelection
        .attr('width', d.rootWidth)
        .attr('height', d.rootHeight)
    })

    // const highlightTarget$ = context.fullChartParams$.pipe(
    //   takeUntil(destroy$),
    //   map(d => d.highlightTarget),
    //   distinctUntilChanged()
    // )

    // const rootMousemove$: Observable<any> = d3EventObservable(rootSelection, 'mousemove')
    //   .pipe(
    //     takeUntil(destroy$),
    //     debounceTime(10)
    //   )

    // let r = 0
    // rootMousemove$.subscribe(d => {
    //   r++
    //   console.log('r:', r)
    // })

    const columnAmount$ = context.containerPosition$.pipe(
      map(containerPosition => {
        const maxColumnIndex = containerPosition.reduce((acc, current) => {
          return current.columnIndex > acc ? current.columnIndex : acc
        }, 0)
        return maxColumnIndex + 1
      }),
      distinctUntilChanged()
    )

    const rowAmount$ = context.containerPosition$.pipe(
      map(containerPosition => {
        const maxRowIndex = containerPosition.reduce((acc, current) => {
          return current.rowIndex > acc ? current.rowIndex : acc
        }, 0)
        return maxRowIndex + 1
      }),
      distinctUntilChanged()
    )

    const textReverseTransform$ = context.containerPosition$.pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(containerPosition => {
        // const axesRotateXYReverseValue = `rotateX(${data.gridAxesReverseTransform.rotateX}deg) rotateY(${data.gridAxesReverseTransform.rotateY}deg)`
        // const axesRotateReverseValue = `rotate(${data.gridAxesReverseTransform.rotate}deg)`
        const containerScaleReverseValue = `scale(${1 / containerPosition[0].scale[0]}, ${1 / containerPosition[0].scale[1]})`
        // 抵消最外層scale
        return `${containerScaleReverseValue}`
      }),
      distinctUntilChanged()
    )

    const xyPosition$ = multivariateXYPositionObservable({
      rootSelection,
      xAxis$: context.zoomedXAxis$,
      yAxis$: context.yAxis$,
      xyValueIndex$: context.xyValueIndex$,
      filteredXYMinMaxData$: context.filteredXYMinMaxData$,
      containerPosition$: context.containerPosition$,
      containerSize$: context.containerSize$,
      layout$: context.layout$
    }).pipe(
      takeUntil(destroy$)
    )

    combineLatest({
      axesSelection: axesSelection$,
      // rootMousemove: rootMousemove$,
      layout: context.layout$,
      xyPosition: xyPosition$,
      // computedData: context.computedData$,
      layerParams: layerParams$,
      theme: context.theme$,
      // highlightTarget: highlightTarget$,
      textReverseTransform: textReverseTransform$,
      // CategoryDataMap: context.CategoryDataMap$,
      fontSizePx: context.fontSizePx$,
      columnAmount: columnAmount$,
      rowAmount: rowAmount$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {
      // 依event的座標取得group資料
      const { x, y, xValue, yValue } = data.xyPosition

      const lineData = createLineData({
        axisX: x,
        axisY: y,
        layout: data.layout,
        layerParams: data.layerParams,
      })
      renderLine({
        selection: data.axesSelection,
        pluginName,
        lineData,
        theme: data.theme
      })
      const labelData = createLabelData({
        axisX: x,
        axisY: y,
        xValue,
        yValue,
        layerParams: data.layerParams,
        fontSizePx: data.fontSizePx,
        layout: data.layout,
        columnAmount: data.columnAmount,
        rowAmount: data.rowAmount
      })
      const labelSelection = renderLabel({
        selection: data.axesSelection,
        labelData,
        layerParams: data.layerParams,
        theme: data.theme,
        textReverseTransform: data.textReverseTransform,
        fontSizePx: data.fontSizePx
      })

      // label的事件
      // labelSelection
      //   .on('mouseover', (event, datum) => {
      //     event.stopPropagation()
      //     // const { groupIndex, groupLabel } = data.xyPositionFn(event)

      //     isLabelMouseover = true

      //     subject.event$.next({
      //       type: 'multivariate',
      //       eventName: 'mouseover',
      //       pluginName,
      //       highlightTarget: data.highlightTarget,
      //       datum,
      //       category: [],
      //       categoryIndex: -1,
      //       categoryLabel: '',
      //       data: data.computedData,
      //       event,
      //     })
      //   })
      //   .on('mousemove', (event, datum) => {
      //     event.stopPropagation()
      //     // const { groupIndex, groupLabel } = data.xyPositionFn(event)

      //     subject.event$.next({
      //       type: 'multivariate',
      //       eventName: 'mousemove',
      //       pluginName,
      //       highlightTarget: data.highlightTarget,
      //       datum,
      //       category: [],
      //       categoryIndex: -1,
      //       categoryLabel: '',
      //       data: data.computedData,
      //       event,
      //     })
      //   })
      //   .on('mouseout', (event, datum) => {
      //     event.stopPropagation()
      //     // const { groupIndex, groupLabel } = data.xyPositionFn(event)

      //     isLabelMouseover = false

      //     subject.event$.next({
      //       type: 'multivariate',
      //       eventName: 'mouseout',
      //       pluginName,
      //       highlightTarget: data.highlightTarget,
      //       datum,
      //       category: [],
      //       categoryIndex: -1,
      //       categoryLabel: '',
      //       data: data.computedData,
      //       event,
      //     })
      //   })
      //   .on('click', (event, datum) => {
      //     event.stopPropagation()
      //     // const { groupIndex, groupLabel } = data.xyPositionFn(event)

      //     subject.event$.next({
      //       type: 'multivariate',
      //       eventName: 'click',
      //       pluginName,
      //       highlightTarget: data.highlightTarget,
      //       datum,
      //       category: [],
      //       categoryIndex: -1,
      //       categoryLabel: '',
      //       data: data.computedData,
      //       event,
      //     })
      //   })

    })


    const rootRectMouseout$ = d3EventObservable(rootRectSelection, 'mouseout').pipe(
      takeUntil(destroy$),
    )

    combineLatest({
      rootRectMouseout: rootRectMouseout$,
      axesSelection: axesSelection$,
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0)
    ).subscribe(data => {
      setTimeout(() => {
        // // @Q@ workaround - 不知為何和 label 會有衝突，當滑鼠移動到 label 上時，會觸發 mouseout 事件
        // if (isLabelMouseover == true) {
        //   return
        // }
        
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