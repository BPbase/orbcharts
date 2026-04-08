import * as d3 from 'd3'
import {
  // of,
  iif,
  EMPTY,
  debounceTime,
  combineLatest,
  switchMap,
  map,
  filter,
  first,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Subject,
  Observable } from 'rxjs'
import type { GridPlotCategoryGuideParams, GridPlotPluginParams } from '../types'
import type { AxisPosition } from '../../../types'
import { DEFAULT_CATEGORY_AUX_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AUX } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import { GridPlotExtendContext } from '../types'
import { validateObject } from '@orbcharts/core'
import { createClassName, getColor } from '../../../utils/orbchartsUtils'
import { gridSelectionsObservable, gridCategoryPositionObservable } from '../../../utils/gridObservables'
import { parseTickFormatValue } from '../../../utils/d3Utils'
import { measureTextWidth } from '../../../utils/commonUtils'
import { renderTspansOnAxis } from '../../../utils/d3Graphics'
import { Theme } from '@orbcharts/core'
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

const pluginName = 'GridPlot'
const layerName = 'CategoryGuide'

const labelClassName = createClassName(pluginName, layerName, 'label-box')

const rectPaddingWidth = 6
const rectPaddingHeight = 3


function createLineData ({ categoryLabel, axisX, axisHeight, layerParams }: {
  categoryLabel: string
  axisX: number
  axisHeight: number
  layerParams: GridPlotCategoryGuideParams
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
  layerParams: GridPlotCategoryGuideParams
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
      y: - layerParams.labelPadding * rowAmount, // rowAmount 是為了把外部 container 的變形逆轉回來
      text,
      textArr,
      textWidth,
      textHeight
    }]
    : []
}

function renderLine ({ selection, pluginName, lineData, layerParams, theme }: {
  selection: d3.Selection<any, string, any, unknown>
  pluginName: string
  lineData: LineDatum[]
  layerParams: GridPlotCategoryGuideParams
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
    .style('stroke', d => getColor(layerParams.lineColorType, theme))
    .style('stroke-dasharray', layerParams.lineDashArray ?? 'none')

  return auxLineSelection
}

function removeLine (selection: d3.Selection<any, string, any, unknown>) {
  const update = selection
    .selectAll<SVGLineElement, LineDatum>('line')
    .data([])

  update.exit().remove()
}

function renderLabel ({ selection, labelData, categoryAxisPosition, layerParams, theme, textReverseTransformWithRotate, fontSizePx }: {
  selection: d3.Selection<any, string, any, unknown>
  labelData: LabelDatum[]
  categoryAxisPosition: AxisPosition
  layerParams: GridPlotCategoryGuideParams
  theme: Theme
  // gridAxesReverseTransformValue: string
  textReverseTransformWithRotate: string
  fontSizePx: number
}) {
  // const rectHeight = textSizePx + 6

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
      const gSelection = d3.select(n[i])

      // const rectWidth = measureTextWidth(datum.text, textSizePx) + 12
      const rectWidth = datum.textWidth + (rectPaddingWidth * 2)
      const rectHeight = datum.textHeight + (rectPaddingHeight * 2)
      // -- label偏移位置 --
      let rectX = - rectWidth / 2
      let rectY = -2
      let x = rectX
      let y = rectY - 3 // 奇怪的偏移修正
      if (categoryAxisPosition === 'bottom') {
        rectX = layerParams.labelRotate
          ? - rectWidth + rectHeight // 有傾斜時以末端對齊（+height是為了修正移動太多）
          : - rectWidth / 2
        rectY = 2
        x = rectX
        y = rectY - 3 // 奇怪的偏移修正
      } else if (categoryAxisPosition === 'left') {
        rectX = - rectWidth + 2
        rectY = - rectHeight / 2
        x = rectX
        y = rectY - 3 // 奇怪的偏移修正
        if (layerParams.labelRotate) {
          y += rectHeight
        }
      } else if (categoryAxisPosition === 'right') {
        rectX = - 2
        rectY = - rectHeight / 2
        x = rectX
        y = rectY - 3 // 奇怪的偏移修正
        if (layerParams.labelRotate) {
          y += rectHeight
        }
      } else if (categoryAxisPosition === 'top') {
        rectX = layerParams.labelRotate
          ? - rectWidth + rectHeight // 有傾斜時以末端對齊（+height是為了修正移動太多）
          : - rectWidth / 2
        rectY = - rectHeight + 6
        x = - rectHeight
        y = rectY - 3 // 奇怪的偏移修正
      }

      // -- rect --
      const rect = gSelection
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
        .attr('width', d => `${rectWidth}px`)
        .attr('height', `${rectHeight}px`)
        .attr('fill', d => getColor(layerParams.labelColorType, theme))
        .attr('x', x)
        .attr('y', y) // 奇怪的偏移修正
        .style('transform', textReverseTransformWithRotate)

      // -- text --
      const text = gSelection
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
        .attr('fill', d => getColor(layerParams.labelTextColorType, theme))
        .attr('font-size', theme.fontSize)
        .attr('x', x + rectPaddingWidth)
        .attr('y', y + rectPaddingHeight)
        .each((d, i, n) => {
          renderTspansOnAxis(d3.select(n[i]), {
            textArr: datum.textArr,
            textSizePx: fontSizePx,
            categoryAxisPosition: categoryAxisPosition,
            isContainerRotated: false
          })
        })

      // -- 第二次文字寬度（因為原本計算的文字寬度有可能因為字體差異會有誤差） --
      // 取得文字寬度
      let textWidthArr: number[] = []
      text.selectAll('tspan')
        .each((d, i, n) => {
          const tspan = d3.select(n[i])
          const textNode: SVGTextElement = tspan.node() as SVGTextElement
          if (textNode && textNode.getBBox()) {
            textWidthArr.push(textNode.getBBox().width)
          }
        })
      const maxTextWidth = Math.max(...textWidthArr)
      // 依文字寬度設定矩形寬度
      rect.attr('width', maxTextWidth + rectPaddingWidth * 2)
    })

  return axisLabelSelection
}

function removeLabel (selection: d3.Selection<any, string, any, unknown>) {
  const gUpdate = selection
    .selectAll<SVGGElement, LabelDatum>(`g.${labelClassName}`)
    .data([])

  gUpdate.exit().remove()
}


export const CategoryGuide = defineSVGLayer<GridPlotExtendContext, GridPlotPluginParams, GridPlotCategoryGuideParams>({
  name: layerName,
  defaultParams: DEFAULT_CATEGORY_AUX_PARAMS,
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
      labelRotate: {
        toBeTypes: ['number']
      }
    })
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

    let isLabelMouseover = false

    // const rootSelection = d3.select(`svg.orbcharts-${pluginName}__svg`)
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
    } = gridSelectionsObservable({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      clipPathID: 'test',
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
      gridContainerPosition$: context.gridContainerPosition$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridGraphicTransform$: context.gridGraphicTransform$
    })

    context.layout$.pipe(
      takeUntil(destroy$),
    ).subscribe(d => {
      rootRectSelection
        .attr('width', d.rootWidth)
        .attr('height', d.rootHeight)
    })

    // context.gridAxesTransform$
    //   .pipe(
    //     takeUntil(destroy$),
    //     map(d => d.value),
    //     distinctUntilChanged()
    //   ).subscribe(d => {
    //     axisSelection
    //       .style('transform', d)
    //   })

    // const visibleComputedData$ = context.computedData$.pipe(
    //   takeUntil(destroy$),
    //   map(data => {
    //     const visibleComputedData = data
    //       .map(d => {
    //         return d.filter(_d => {
    //           return _d.visible == true
    //         })
    //       })
    //       .filter(d => d.length)
    //     // console.log('visibleComputedData', visibleComputedData)
    //     return visibleComputedData
    //   })
    // )

    // const SeriesDataMap$ = visibleComputedData$.pipe(
    //   map(d => makeGridSeriesDataMap(d))
    // )

    // const CategoryDataMap$ = visibleComputedData$.pipe(
    //   map(d => makeGridCategoryDataMap(d))
    // )

    // const contentTransform$: Observable<string> = new Observable(subscriber => {
    //   combineLatest({
    //     layerParams: context.layerParams$,
    //     gridAxesTransform: context.gridAxesTransform$
    //   }).pipe(
    //     takeUntil(destroy$),
    //     // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    //     debounceTime(0),
    //   ).subscribe(data => {

    //     const transformData = Object.assign({}, data.gridAxesTransform)

    //     // const value = getAxesTransformValue({
    //     //   translate: [0, 0],
    //     //   scale: [transformData.scale[0] * -1, transformData.scale[1] * -1],
    //     //   rotate: transformData.rotate * -1,
    //     //   rotateX: transformData.rotateX * -1,
    //     //   rotateY: transformData.rotateY * -1
    //     // })

    //     subscriber.next(transformData.value)
    //   })
    // })
    // const reverseTransform$: Observable<TransformData> = context.gridAxesTransform$.pipe(
    //   takeUntil(destroy$),
    //   map(d => {
    //     const translate: [number, number] = [d.translate[0] * -1, d.translate[1] * -1]
    //     const scale: [number, number] = [d.scale[0] * -1, d.scale[1] * -1]
    //     const rotate = d.rotate * -1
    //     const rotateX = d.rotateX * -1
    //     const rotateY = d.rotateY * -1
    //     return {
    //       translate,
    //       scale,
    //       rotate,
    //       rotateX,
    //       rotateY,
    //       value: ''
    //     }
    //   }),
    // )
    // const contentTransform$ = combineLatest({
    //   layerParams: context.layerParams$,
    //   reverseTransform: reverseTransform$
    // }).pipe(
    //   takeUntil(destroy$),
    //   switchMap(async data => {
    //     const translate = [0, 0]
    //     return `translate(${translate[0]}px, ${translate[1]}px) rotate(${data.reverseTransform.rotate}deg) rotateX(${data.reverseTransform.rotateX}deg) rotateY(${data.reverseTransform.rotateY}deg)`
    //   }),
    //   distinctUntilChanged()
    // )

    // const groupScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
    //   combineLatest({
    //     fullDataFormatter: context.fullDataFormatter$,
    //     gridAxesSize: context.gridAxesSize$,
    //     computedData: context.computedData$
    //   }).pipe(
    //     takeUntil(destroy$),
    //     debounceTime(0),
    //   ).subscribe(data => {
    //     const groupMin = 0
    //     const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
    //     const groupScaleDomainMin = data.fullDataFormatter.categoryAxis.scaleDomain[0] === 'auto'
    //       ? groupMin - data.fullDataFormatter.categoryAxis.scalePadding
    //       : data.fullDataFormatter.categoryAxis.scaleDomain[0] as number - data.fullDataFormatter.categoryAxis.scalePadding
    //     const groupScaleDomainMax = data.fullDataFormatter.categoryAxis.scaleDomain[1] === 'auto'
    //       ? groupMax + data.fullDataFormatter.categoryAxis.scalePadding
    //       : data.fullDataFormatter.categoryAxis.scaleDomain[1] as number + data.fullDataFormatter.categoryAxis.scalePadding
        
    //     const groupingLength = data.computedData[0]
    //       ? data.computedData[0].length
    //       : 0

    //     let _labels = data.fullDataFormatter.seriesDirection === 'row'
    //       // ? data.fullDataFormatter.columnLabels
    //       // : data.fullDataFormatter.rowLabels
    //       ? (data.computedData[0] ?? []).map(d => d.categoryLabel)
    //       : data.computedData.map(d => d[0].categoryLabel)

    //     const axisLabels = new Array(groupingLength).fill(0)
    //       .map((d, i) => {
    //         return _labels[i] != null
    //           ? _labels[i]
    //           : String(i) // 沒有label則用序列號填充
    //       })
    //       .filter((d, i) => {
    //         return i >= groupScaleDomainMin && i <= groupScaleDomainMax
    //       })

        
    //     const padding = data.fullDataFormatter.categoryAxis.scalePadding
        
    //     const groupScale = createLabelToAxisScale({
    //       axisLabels,
    //       axisWidth: data.gridAxesSize.width,
    //       padding
    //     })

    //     subscriber.next(groupScale)
    //   })
    // })

    // const groupScaleDomain$ = combineLatest({
    //   fullDataFormatter: context.fullDataFormatter$,
    //   gridAxesSize: context.gridAxesSize$,
    //   computedData: context.computedData$
    // }).pipe(
    //   takeUntil(destroy$),
    //   debounceTime(0),
    //   map(data => {
    //     const groupMin = 0
    //     const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
    //     // const groupScaleDomainMin = data.fullDataFormatter.categoryAxis.scaleDomain[0] === 'auto'
    //     //   ? groupMin - data.fullDataFormatter.categoryAxis.scalePadding
    //     //   : data.fullDataFormatter.categoryAxis.scaleDomain[0] as number - data.fullDataFormatter.categoryAxis.scalePadding
    //     const groupScaleDomainMin = data.fullDataFormatter.categoryAxis.scaleDomain[0] - data.fullDataFormatter.categoryAxis.scalePadding
    //     const groupScaleDomainMax = data.fullDataFormatter.categoryAxis.scaleDomain[1] === 'max'
    //       ? groupMax + data.fullDataFormatter.categoryAxis.scalePadding
    //       : data.fullDataFormatter.categoryAxis.scaleDomain[1] as number + data.fullDataFormatter.categoryAxis.scalePadding

    //     return [groupScaleDomainMin, groupScaleDomainMax]
    //   }),
    //   shareReplay(1)
    // )

    const groupScale$ = combineLatest({
      categoryScaleDomainValue: context.categoryScaleDomainValue$,
      gridAxesSize: context.gridAxesSize$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        const groupScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
          .domain(data.categoryScaleDomainValue)
          .range([0, data.gridAxesSize.width])
        return groupScale
      })
    )

    // // 取得事件座標的group資料
    // const gridGroupPositionFn$ = gridGroupPositionFnObservable({
    //   fullDataFormatter$: context.fullDataFormatter$,
    //   gridAxesSize$: context.gridAxesSize$,
    //   computedData$: context.computedData$,
    //   fullChartParams$: context.fullChartParams$,
    // })

    const highlightTarget$ = pluginParams$.pipe(
      takeUntil(destroy$),
      map(d => d.styles.highlightTarget),
      distinctUntilChanged()
    )

    // combineLatest({
    //   computedData: context.computedData$,
    //   gridAxesSize: context.gridAxesSize$,
    //   layerParams: context.layerParams$,
    //   fullChartParams: context.fullChartParams$,
    //   highlightTarget: highlightTarget$,
    //   SeriesDataMap: context.SeriesDataMap$,
    //   CategoryDataMap: context.CategoryDataMap$,
    //   gridGroupPositionFn: gridGroupPositionFn$,
    //   groupScale: groupScale$,
    // }).pipe(
    //   takeUntil(destroy$),
    //   debounceTime(0),
    // ).subscribe(data => {
      
    //   // store.selection
    //   rootSelection
    //     .on('mouseover', (event, datum) => {
    //       // event.stopPropagation()

    //       const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

    //       subject.event$.next({
    //         type: 'grid',
    //         pluginName: name,
    //         eventName: 'mouseover',
    //         highlightTarget: data.highlightTarget,
    //         datum: null,
    //         gridIndex: 0,
    //         series: [],
    //         seriesIndex: -1,
    //         seriesLabel: '',
    //         group: data.CategoryDataMap.get(categoryLabel) ?? [],
    //         // group: [],
    //         categoryIndex,
    //         categoryLabel,
    //         event,
    //         data: data.computedData
    //       })
    //     })
    //     .on('mousemove', (event, datum) => {
    //       // event.stopPropagation()

    //       const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

    //       subject.event$.next({
    //         type: 'grid',
    //         pluginName: name,
    //         eventName: 'mousemove',
    //         highlightTarget: data.highlightTarget,
    //         datum: null,
    //         gridIndex: 0,
    //         series: [],
    //         seriesIndex: -1,
    //         seriesLabel: '',
    //         group: data.CategoryDataMap.get(categoryLabel) ?? [],
    //         // group: [],
    //         categoryIndex,
    //         categoryLabel,
    //         event,
    //         data: data.computedData
    //       })
    //     })
    //     .on('mouseout', (event, datum) => {
    //       // event.stopPropagation()

    //       const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

    //       subject.event$.next({
    //         type: 'grid',
    //         pluginName: name,
    //         eventName: 'mouseout',
    //         highlightTarget: data.highlightTarget,
    //         datum: null,
    //         gridIndex: 0,
    //         series: [],
    //         seriesIndex: -1,
    //         seriesLabel: '',
    //         group: data.CategoryDataMap.get(categoryLabel) ?? [],
    //         // group: [],
    //         categoryIndex,
    //         categoryLabel,
    //         event,
    //         data: data.computedData
    //       })
    //     })
    //     .on('click', (event, datum) => {
    //       event.stopPropagation()

    //       const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

    //       subject.event$.next({
    //         type: 'grid',
    //         pluginName: name,
    //         eventName: 'click',
    //         highlightTarget: data.highlightTarget,
    //         datum: null,
    //         gridIndex: 0,
    //         series: [],
    //         seriesIndex: -1,
    //         seriesLabel: '',
    //         // group: data.CategoryDataMap.get(categoryLabel) ?? [],
    //         group: [],
    //         categoryIndex,
    //         categoryLabel,
    //         event,
    //         data: data.computedData
    //       })
    //     })

    //   // barSelection$.next(barSelection!)
    // })

    const rootMousemove$: Observable<any> = d3EventObservable(rootSelection, 'mousemove').pipe(
      takeUntil(destroy$),
    )

    // const mousemoveGroupLabel$ = combineLatest({
    //   rootMousemove: rootMousemove$,
    //   gridGroupPositionFn: gridGroupPositionFn$,
    // }).pipe(
    //   takeUntil(destroy$),
    //   debounceTime(0),
    //   map(data => {
    //     const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(data.rootMousemove)
    //     return { categoryIndex, categoryLabel }
    //   }),
    //   shareReplay(1)
    // )


    const textReverseTransform$ = combineLatest({
      gridAxesReverseTransform: context.gridAxesReverseTransform$,
      gridContainerPosition: context.gridContainerPosition$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        // const axisReverseTranslateValue = `translate(${data.gridAxesReverseTransform.translate[0]}px, ${data.gridAxesReverseTransform.translate[1]}px)`
        const axesRotateXYReverseValue = `rotateX(${data.gridAxesReverseTransform.rotateX}deg) rotateY(${data.gridAxesReverseTransform.rotateY}deg)`
        const axesRotateReverseValue = `rotate(${data.gridAxesReverseTransform.rotate}deg)`
        const containerScaleReverseValue = `scale(${1 / data.gridContainerPosition[0].scale[0]}, ${1 / data.gridContainerPosition[0].scale[1]})`
        // 必須按照順序（先抵消外層rotate，再抵消最外層scale）
        return `${axesRotateXYReverseValue} ${axesRotateReverseValue} ${containerScaleReverseValue}`
      }),
      distinctUntilChanged()
    )

    const textReverseTransformWithRotate$ = combineLatest({
      textReverseTransform: textReverseTransform$,
      layerParams: layerParams$,
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
      map(data => {
        // 必須按照順序（先抵消外層rotate，再抵消最外層scale，最後再做本身的rotate）
        return `${data.textReverseTransform} rotate(${data.layerParams.labelRotate}deg)`
      })
    )

    const columnAmount$ = context.gridContainerPosition$.pipe(
      takeUntil(destroy$),
      map(gridContainerPosition => {
        const maxColumnIndex = gridContainerPosition.reduce((acc, current) => {
          return current.columnIndex > acc ? current.columnIndex : acc
        }, 0)
        return maxColumnIndex + 1
      }),
      distinctUntilChanged()
    )

    const rowAmount$ = context.gridContainerPosition$.pipe(
      takeUntil(destroy$),
      map(gridContainerPosition => {
        const maxRowIndex = gridContainerPosition.reduce((acc, current) => {
          return current.rowIndex > acc ? current.rowIndex : acc
        }, 0)
        return maxRowIndex + 1
      }),
      distinctUntilChanged()
    )

    const gridGroupPosition$ = gridCategoryPositionObservable({
      rootSelection,
      // fullDataFormatter$: context.fullDataFormatter$,
      pluginParams$: pluginParams$,
      // containerSize$: context.containerSize$,
      gridAxesContainerSize$: context.gridAxesContainerSize$,
      computedData$: context.computedData$,
      gridContainerPosition$: context.gridContainerPosition$,
      layout$: context.layout$
    }).pipe(
      takeUntil(destroy$)
    )

    combineLatest({
      axesSelection: axesSelection$,
      // columnAmount: columnAmount$,
      rowAmount: rowAmount$,
      // layout: context.layout$,
      // rootMousemove: rootMousemove$,
      // gridGroupPositionFn: gridGroupPositionFn$,
      gridGroupPosition: gridGroupPosition$,
      // computedData: context.computedData$,
      groupScale: groupScale$,
      gridAxesSize: context.gridAxesSize$,
      // pluginParams: pluginParams$,
      categoryAxisPosition: context.categoryAxisPosition$,
      layerParams: layerParams$,
      theme: context.theme$,
      // highlightTarget: highlightTarget$,
      // gridAxesReverseTransform: context.gridAxesReverseTransform$,
      textReverseTransformWithRotate: textReverseTransformWithRotate$,
      // CategoryDataMap: context.CategoryDataMap$,
      fontSizePx: context.fontSizePx$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {
      // // 由於event座標是基於底層的，但是container會有多欄，所以要重新計算
      // const eventData = {
      //   offsetX: data.rootMousemove.offsetX * data.columnAmount % data.layout.rootWidth,
      //   offsetY: data.rootMousemove.offsetY * data.rowAmount % data.layout.rootHeight
      // }
      // 依event的座標取得group資料
      const { categoryIndex, categoryLabel } = data.gridGroupPosition
      // console.log('gridGroupPosition', categoryIndex, categoryLabel)
      const axisX = data.groupScale(categoryIndex) ?? 0
      // console.log('axisX', axisX)
      const lineData = createLineData({
        categoryLabel: categoryLabel,
        axisX,
        axisHeight: data.gridAxesSize.height,
        layerParams: data.layerParams,
      })
      // console.log('lineData', lineData)
      renderLine({
        // selection: axisSelection,
        selection: data.axesSelection,
        pluginName,
        lineData,
        layerParams: data.layerParams,
        theme: data.theme
      })
      const labelData = createLabelData({
        categoryLabel: categoryLabel,
        axisX,
        layerParams: data.layerParams,
        textSizePx: data.fontSizePx,
        rowAmount: data.rowAmount
      })
      const labelSelection = renderLabel({
        // selection: axisSelection,
        selection: data.axesSelection,
        labelData,
        categoryAxisPosition: data.categoryAxisPosition,
        layerParams: data.layerParams,
        // gridAxesReverseTransformValue: data.gridAxesReverseTransform.value,
        textReverseTransformWithRotate: data.textReverseTransformWithRotate,
        theme: data.theme,
        fontSizePx: data.fontSizePx,
      })

      // label的事件
      labelSelection
        .on('mouseover', (event, datum) => {
          event.stopPropagation()
          // const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

          isLabelMouseover = true

          context.eventTrigger$.next({
            // type: 'grid',
            // pluginName: name,
            // eventName: 'mouseover',
            // highlightTarget: data.highlightTarget,
            // datum: null,
            // gridIndex: 0,
            // series: [],
            // seriesIndex: -1,
            // seriesLabel: '',
            // group: data.CategoryDataMap.get(categoryLabel) ?? [],
            // categoryIndex,
            // categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mouseover',
            pluginName,
            layerName,
            target: null,
            event,
          })
        })
        .on('mousemove', (event, datum) => {
          event.stopPropagation()
          // const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

          context.eventTrigger$.next({
            // type: 'grid',
            // pluginName: name,
            // eventName: 'mousemove',
            // highlightTarget: data.highlightTarget,
            // datum: null,
            // gridIndex: 0,
            // series: [],
            // seriesIndex: -1,
            // seriesLabel: '',
            // group: data.CategoryDataMap.get(categoryLabel) ?? [],
            // categoryIndex,
            // categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mousemove',
            pluginName,
            layerName,
            target: null,
            event,
          })
        })
        .on('mouseout', (event, datum) => {
          event.stopPropagation()
          // const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

          isLabelMouseover = false

          context.eventTrigger$.next({
            // type: 'grid',
            // pluginName: name,
            // eventName: 'mouseout',
            // highlightTarget: data.highlightTarget,
            // datum: null,
            // gridIndex: 0,
            // series: [],
            // seriesIndex: -1,
            // seriesLabel: '',
            // group: data.CategoryDataMap.get(categoryLabel) ?? [],
            // categoryIndex,
            // categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'mouseout',
            pluginName,
            layerName,
            target: null,
            event,
          })
        })
        .on('click', (event, datum) => {
          event.stopPropagation()
          // const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

          context.eventTrigger$.next({
            // type: 'grid',
            // pluginName: name,
            // eventName: 'click',
            // highlightTarget: data.highlightTarget,
            // datum: null,
            // gridIndex: 0,
            // series: [],
            // seriesIndex: -1,
            // seriesLabel: '',
            // group: data.CategoryDataMap.get(categoryLabel) ?? [],
            // categoryIndex,
            // categoryLabel,
            // event,
            // data: data.computedData
            eventName: 'click',
            pluginName,
            layerName,
            target: null,
            event,
          })
        })

    })

    // // -- highlight（無論highlightTarget設定為何，一律依從categoryLabel來顯示） --
    // combineLatest({
    //   event: subject.event$.pipe(
    //     filter(d => d.eventName === 'mouseover' || d.eventName === 'mousemove')
    //   ),
    //   computedData: context.computedData$,
    //   groupScale: groupScale$,
    //   gridAxesSize: context.gridAxesSize$,
    //   layerParams: context.layerParams$,
    //   fullChartParams: context.fullChartParams$,
    //   highlightTarget: highlightTarget$,
    //   gridAxesReverseTransform: context.gridAxesReverseTransform$,
    //   CategoryDataMap: context.CategoryDataMap$,
    //   gridGroupPositionFn: gridGroupPositionFn$,
    //   textSizePx: context.textSizePx$
    // }).pipe(
    //   takeUntil(destroy$),
    //   debounceTime(0)
    // ).subscribe(data => {
    //   // const group = data.event.eventName === 'mouseover' || data.event.eventName === 'mousemove'
    //   //   ? data.event.group
    //   //   : []
      
    //   // const categoryLabel = data.event.eventName === 'mouseover' || data.event.eventName === 'mousemove'
    //   //   ? data.event.categoryLabel
    //   //   : ''
    //   const axisX = data.groupScale(data.event.categoryLabel) ?? 0
      
    //   const lineData = createLineData({
    //     categoryLabel: data.event.categoryLabel,
    //     axisX,
    //     axisHeight: data.gridAxesSize.height,
    //     layerParams: data.layerParams,
    //   })
    //   renderLine({
    //     selection: axisSelection,
    //     pluginName: name,
    //     lineData,
    //     layerParams: data.layerParams,
    //     fullChartParams: data.fullChartParams
    //   })
    //   const labelData = createLabelData({
    //     categoryLabel: data.event.categoryLabel,
    //     axisX,
    //     layerParams: data.layerParams
    //   })
    //   const labelSelection = renderLabel({
    //     selection: axisSelection,
    //     labelData,
    //     layerParams: data.layerParams,
    //     fullChartParams: data.fullChartParams,
    //     gridAxesReverseTransformValue: data.gridAxesReverseTransform.value,
    //     textSizePx: data.textSizePx
    //   })

    //   // label的事件
    //   labelSelection
    //     .on('mouseover', (event, datum) => {
    
    //       const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

    //       subject.event$.next({
    //         type: 'grid',
    //         pluginName: name,
    //         eventName: 'mouseover',
    //         highlightTarget: data.highlightTarget,
    //         datum: null,
    //         gridIndex: 0,
    //         series: [],
    //         seriesIndex: -1,
    //         seriesLabel: '',
    //         group: data.event.group,
    //         categoryIndex,
    //         categoryLabel,
    //         event,
    //         data: data.computedData
    //       })
    //     })
    //     .on('mousemove', (event, datum) => {
    //       const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

    //       subject.event$.next({
    //         type: 'grid',
    //         pluginName: name,
    //         eventName: 'mousemove',
    //         highlightTarget: data.highlightTarget,
    //         datum: null,
    //         gridIndex: 0,
    //         series: [],
    //         seriesIndex: -1,
    //         seriesLabel: '',
    //         group: data.event.group,
    //         categoryIndex,
    //         categoryLabel,
    //         event,
    //         data: data.computedData
    //       })
    //     })
    //     .on('mouseout', (event, datum) => {
    //       const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

    //       subject.event$.next({
    //         type: 'grid',
    //         pluginName: name,
    //         eventName: 'mouseout',
    //         highlightTarget: data.highlightTarget,
    //         datum: null,
    //         gridIndex: 0,
    //         series: [],
    //         seriesIndex: -1,
    //         seriesLabel: '',
    //         group: data.event.group,
    //         categoryIndex,
    //         categoryLabel,
    //         event,
    //         data: data.computedData
    //       })
    //     })
    //     .on('click', (event, datum) => {
    //       const { categoryIndex, categoryLabel } = data.gridGroupPositionFn(event)

    //       subject.event$.next({
    //         type: 'grid',
    //         pluginName: name,
    //         eventName: 'click',
    //         highlightTarget: data.highlightTarget,
    //         datum: null,
    //         gridIndex: 0,
    //         series: [],
    //         seriesIndex: -1,
    //         seriesLabel: '',
    //         group: data.event.group,
    //         categoryIndex,
    //         categoryLabel,
    //         event,
    //         data: data.computedData
    //       })
    //     })
    // })

    

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
        // @Q@ workaround - 不知為何和 label 會有衝突，當滑鼠移動到 label 上時，會觸發 mouseout 事件
        if (isLabelMouseover == true) {
          return
        }
        
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
