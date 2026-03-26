import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  debounceTime,
  takeUntil,
  shareReplay,
  distinctUntilChanged,
  Observable,
  Subject } from 'rxjs'
import type { BaseLayerFn } from './../types/BaseLayer'
import type { Layout, GraphicStyles, ContainerPositionScaled, XYAxis } from '../types/PluginParams'
import type { ComputedData, ComputedDatumMultivariate } from '../types/ComputedData'
import type { BaseXAxisParams } from './types'
import { createClassName, getColor, getColorScheme } from '../utils/orbchartsUtils'
import { measureTextWidth } from '../utils/commonUtils'
import { ColorType, Theme } from '../../../core/src/types'
import { ContainerSize, Placement } from '../types'
import { multivariateContainerSelectionsObservable } from '../utils/multivariateObservables'
import { parseTickFormatValue } from '../utils/d3Utils'

interface BaseXAxisContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  position$: Observable<'top' | 'bottom'>
  transitionDuration$: Observable<number>
  computedData$: Observable<ComputedData<'multivariate'>>
  // filteredMinMaxValue$: Observable<[number, number]>
  layerParams$: Observable<BaseXAxisParams>
  xAxis$: Observable<XYAxis>
  theme$: Observable<Theme>
  isSeriesSeprate$: Observable<boolean>
  containerPosition$: Observable<ContainerPositionScaled[]>
  // layout$: Observable<Layout>
  containerSize$: Observable<ContainerSize>
  xScale$: Observable<d3.ScaleLinear<number, number>>
  // filteredXYMinMaxData$: Observable<{
  //   datumList: ComputedXYDatumMultivariate[];
  //   minXDatum: ComputedXYDatumMultivariate | null;
  //   maxXDatum: ComputedXYDatumMultivariate | null;
  //   minYDatum: ComputedXYDatumMultivariate | null;
  //   maxYDatum: ComputedXYDatumMultivariate | null;
  // }>
  // xyMinMax$: Observable<{
  //   minX: number;
  //   maxX: number;
  //   minY: number;
  //   maxY: number;
  // }>
}

const defaultTickSize = 6

const xTickTextAnchor = 'middle'
const xTickDominantBaseline = 'hanging'
const xAxisLabelAnchor = 'start'
const xAxisLabelDominantBaseline = 'hanging'

function renderXAxisLabel ({ selection, position, xLabelClassName, layerParams, containerSize, xAxis, theme }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  position: 'top' | 'bottom'
  xLabelClassName: string
  layerParams: BaseXAxisParams
  // axisLabelAlign: TextAlign
  containerSize: ContainerSize
  xAxis: XYAxis
  theme: Theme
  // textReverseTransform: string,
}) {
  const offsetX = layerParams.tickPadding + layerParams.labelOffset[0]
  // const offsetY = layerParams.tickPadding + layerParams.labelOffset[1]
  let labelX = offsetX
  

  let y: number // = position === 'top' ? 0 : layout.height
  let offsetY
  if (position === 'top') {
    y = 0
    offsetY = -layerParams.tickPadding - layerParams.labelOffset[1]
  } else {
    y = containerSize.height
    offsetY = layerParams.tickPadding + layerParams.labelOffset[1]
  }

  let labelY = offsetY

  const axisLabelSelection = selection
    .selectAll<SVGGElement, BaseXAxisParams>(`g.${xLabelClassName}`)
    .data([layerParams])
    .join('g')
    .classed(xLabelClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, BaseXAxisParams>(`text`)
        .data([d])
        .join(
          enter => {
            return enter
              .append('text')
              .style('font-weight', 'bold')
          },
          update => update,
          exit => exit.remove()
        )
        .attr('text-anchor', xAxisLabelAnchor)
        .attr('dominant-baseline', xAxisLabelDominantBaseline)
        .attr('font-size', theme.fontSize)
        .style('fill', getColor(layerParams.labelColorType, theme))
        // .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => xAxis.label)
    })
    .attr('transform', d => `translate(${containerSize.width}, ${y})`)
}

function renderXAxis ({ selection, position, xAxisClassName, layerParams, containerSize, theme, xScale, transitionDuration }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  position: 'top' | 'bottom'
  xAxisClassName: string
  layerParams: BaseXAxisParams
  // tickTextAlign: TextAlign
  containerSize: ContainerSize
  // fullDataFormatter: DataFormatterMultivariate,
  theme: Theme,
  xScale: d3.ScaleLinear<number, number>
  // textReverseTransform: string,
  // xyMinMax: {
  //   minX: number;
  //   maxX: number;
  //   minY: number;
  //   maxY: number;
  // }
  transitionDuration: number
}) {

  let y: number
  let d3Axis: d3.Axis<d3.NumberValue>
  if (position === 'top') {
    y = 0
    d3Axis = d3.axisTop(xScale)
  } else {
    y = containerSize.height
    d3Axis = d3.axisBottom(xScale)
  }

  const xAxisSelection = selection
    .selectAll<SVGGElement, BaseXAxisParams>(`g.${xAxisClassName}`)
    .data([layerParams])
    .join('g')
    .classed(xAxisClassName, true)
    .attr('transform', `translate(0, ${y})`)

  // const _xScale = d3.scaleLinear()
  //   .domain([0, 150])
  //   .range([416.5, 791.349])

  // 刻度文字偏移
  let tickPadding = layerParams.tickPadding

  // 設定Y軸刻度
  const xAxis = d3Axis
    .scale(xScale)
    .ticks(layerParams.ticks) // 刻度分段數量
    .tickFormat(d => parseTickFormatValue(d, layerParams.tickFormat))
    .tickSize(layerParams.tickFullLine == true
      ? -containerSize.height
      : defaultTickSize)
    .tickSizeOuter(-containerSize.height)
    .tickPadding(tickPadding)
  
  const xAxisEl = xAxisSelection
    .transition()
    .duration(transitionDuration)
    .ease(d3.easeLinear) // 線性的 - 當托曳或快速變動的時候比較滑順
    .call(xAxis)
  
  xAxisEl.selectAll('line')
    .style('fill', 'none')
    .style('stroke', layerParams.tickLineVisible == true ? getColor(layerParams.tickColorType, theme) : 'none')
    .style('stroke-dasharray', layerParams.tickFullLineDasharray)
    .attr('pointer-events', 'none')
  
  xAxisEl.selectAll('path')
    .style('fill', 'none')
    // .style('stroke', this.layerParams.axisLineColor!)
    .style('stroke', layerParams.axisLineVisible == true ? getColor(layerParams.axisLineColorType, theme) : 'none')
    .style('shape-rendering', 'crispEdges')
  
  // const xText = xAxisEl.selectAll('text')
  const xText = xAxisSelection.selectAll('text')
    // .style('font-family', 'sans-serif')
    .attr('font-size', theme.fontSize)
    .style('color', getColor(layerParams.tickTextColorType, theme))
    .attr('text-anchor', xTickTextAnchor)
    .attr('dominant-baseline', xTickDominantBaseline)
    // .attr('dy', tickPadding)
    // .attr('y', tickPadding)
    // xText.style('transform', textReverseTransform)
  
  // // 抵消掉預設的偏移
  // if (fullDataFormatter.grid.valueAxis.position === 'bottom' || fullDataFormatter.grid.valueAxis.position === 'top') {
    xText.attr('dy', 0)
  // }

  return xAxisSelection
}


export const createBaseXAxis: BaseLayerFn<BaseXAxisContext> = ({
  selection,
  pluginName,
  layerName,
  position$,
  computedData$,
  layerParams$,
  xAxis$,
  theme$,
  isSeriesSeprate$,
  containerPosition$,
  // layout$,
  containerSize$,
  xScale$,
  // filteredXYMinMaxData$,
  // xyMinMax$
  transitionDuration$
}) => {

  const destroy$ = new Subject()

  // const containerClassName = createClassName(pluginName, 'container')
  const xAxisGClassName = createClassName(pluginName, layerName, 'xAxisG')
  const xAxisClassName = createClassName(pluginName, layerName, 'xAxis')
  const xLabelClassName = createClassName(pluginName, layerName, 'xLabel')

  const containerSelection$ = multivariateContainerSelectionsObservable({
    selection,
    pluginName,
    layerName,
    clipPathID: null,
    computedData$,
    containerPosition$,
    isSeriesSeprate$,
  }).pipe(
    takeUntil(destroy$),
  )

  // const containerSelection$ = combineLatest({
  //   computedData: computedData$.pipe(
  //     distinctUntilChanged((a, b) => {
  //       // 只有當series的數量改變時，才重新計算
  //       return a.length === b.length
  //     }),
  //   ),
  //   isSeriesSeprate: isSeriesSeprate$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async (d) => d),
  //   map(data => {
  //     return data.isSeriesSeprate
  //       // category分開的時候顯示各別axis
  //       ? data.computedData
  //       // category合併的時候只顯示第一個axis
  //       : [data.computedData[0]]
  //   }),
  //   map((computedData, i) => {
  //     return selection
  //       .selectAll<SVGGElement, ComputedDatumMultivariate[]>(`g.${containerClassName}`)
  //       .data(computedData, d => d[0] ? d[0].categoryIndex : i)
  //       .join('g')
  //       .classed(containerClassName, true)
  //   })
  // )

  const axisSelection$ = containerSelection$.pipe(
    takeUntil(destroy$),
    map((containerSelection, i) => {
      return containerSelection
        .selectAll<SVGGElement, ComputedDatumMultivariate[]>(`g.${xAxisGClassName}`)
        .data([xAxisGClassName])
        .join('g')
        .classed(xAxisGClassName, true)
    })
  )

  // combineLatest({
  //   containerSelection: containerSelection$,
  //   gridContainerPosition: containerPosition$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d)
  // ).subscribe(data => {
  //   data.containerSelection
  //     .attr('transform', (d, i) => {
  //       const gridContainerPosition = data.gridContainerPosition[i] ?? data.gridContainerPosition[0]
  //       const translate = gridContainerPosition.translate
  //       const scale = gridContainerPosition.scale
  //       // return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
  //       return `translate(${translate[0]}, ${translate[1]})`
  //     })
  //     // .attr('opacity', 0)
  //     // .transition()
  //     // .attr('opacity', 1)
  // })

  // const textReverseTransform$ = containerPosition$.pipe(
  //   takeUntil(destroy$),
  //   switchMap(async (d) => d),
  //   map(containerPosition => {
  //     // const axesRotateXYReverseValue = `rotateX(${data.gridAxesReverseTransform.rotateX}deg) rotateY(${data.gridAxesReverseTransform.rotateY}deg)`
  //     // const axesRotateReverseValue = `rotate(${data.gridAxesReverseTransform.rotate}deg)`
  //     const containerScaleReverseValue = `scale(${1 / containerPosition[0].scale[0]}, ${1 / containerPosition[0].scale[1]})`
  //     // 抵消最外層scale
  //     return `${containerScaleReverseValue}`
  //   }),
  //   distinctUntilChanged()
  // )

  // const xScale$: Observable<d3.ScaleLinear<number, number>> = new Observable(subscriber => {
  //   combineLatest({
  //     fullDataFormatter: fullDataFormatter$,
  //     layout: layout$,
  //     // xyMinMax: xyMinMax$
  //     filteredXYMinMaxData: filteredXYMinMaxData$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {
  //     const valueIndex = data.fullDataFormatter.xAxis.valueIndex
  //     if (!data.filteredXYMinMaxData.minXDatum || !data.filteredXYMinMaxData.maxXDatum
  //       || data.filteredXYMinMaxData.minXDatum.value[valueIndex] == null || data.filteredXYMinMaxData.maxXDatum.value[valueIndex] == null
  //     ) {
  //       return
  //     }
  //     let maxValue = data.filteredXYMinMaxData.maxXDatum.value[valueIndex]
  //     let minValue = data.filteredXYMinMaxData.minXDatum.value[valueIndex]
  //     if (maxValue === minValue && maxValue === 0) {
  //       // 避免最大及最小值同等於 0 造成無法計算scale
  //       maxValue = 1
  //     }

  //     const xScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
  //       maxValue,
  //       minValue,
  //       axisWidth: data.layout.width,
  //       scaleDomain: data.fullDataFormatter.xAxis.scaleDomain,
  //       scaleRange: data.fullDataFormatter.xAxis.scaleRange,
  //     })

  //     subscriber.next(xScale)
  //   })
  // })

  combineLatest({
    axisSelection: axisSelection$,
    position: position$,
    layerParams: layerParams$,
    // tickTextAlign: tickTextAlign$,
    // axisLabelAlign: axisLabelAlign$,
    computedData: computedData$,
    // layout: layout$,
    containerSize: containerSize$,
    xAxis: xAxis$,
    theme: theme$,
    xScale: xScale$,
    // textReverseTransform: textReverseTransform$,
    // xyMinMax: xyMinMax$
    transitionDuration: transitionDuration$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    // console.log('data.layout', data.layout)
    // console.log('data.containerSize', data.containerSize)

    renderXAxis({
      selection: data.axisSelection,
      position: data.position,
      xAxisClassName,
      layerParams: data.layerParams,
      // tickTextAlign: data.tickTextAlign,
      theme: data.theme,
      containerSize: data.containerSize,
      // fullDataFormatter: data.fullDataFormatter,
      
      xScale: data.xScale,
      // textReverseTransform: data.textReverseTransform,
      // xyMinMax: data.xyMinMax
      transitionDuration: data.transitionDuration
    })

    renderXAxisLabel({
      selection: data.axisSelection,
      position: data.position,
      xLabelClassName,
      layerParams: data.layerParams,
      // axisLabelAlign: data.axisLabelAlign,
      containerSize: data.containerSize,
      xAxis: data.xAxis,
      theme: data.theme,
      // textReverseTransform: data.textReverseTransform,
    })

  })

  return () => {
    destroy$.next(undefined)
  }
}