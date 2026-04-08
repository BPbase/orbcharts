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
import type { BaseLayerFn } from '../types/BaseLayer'
import type { Layout, GraphicStyles, ContainerPositionScaled, XYAxis } from '../types/PluginParams'
import type { ComputedData, ComputedDatumMultivariate } from '../types/ComputedData'
import type { BaseYAxisParams } from './types'
import { createClassName, getColor, getColorScheme } from '../utils/orbchartsUtils'
import { measureTextWidth } from '../utils/commonUtils'
import { ColorType, Theme } from '@orbcharts/core'
import { ContainerSize, Placement } from '../types'
import { multivariateContainerSelectionsObservable } from '../utils/multivariateObservables'
import { parseTickFormatValue } from '../utils/d3Utils'

interface BaseYAxisContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedData<'multivariate'>>
  // filteredMinMaxValue$: Observable<[number, number]>
  layerParams$: Observable<BaseYAxisParams>
  yAxis$: Observable<XYAxis>
  theme$: Observable<Theme>
  isSeriesSeprate$: Observable<boolean>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  // layout$: Observable<Layout>
  // filteredXYMinMaxData$: Observable<{
  //   datumList: ComputedXYDatumMultivariate[];
  //   minXDatum: ComputedXYDatumMultivariate | null;
  //   maxXDatum: ComputedXYDatumMultivariate | null;
  //   minYDatum: ComputedXYDatumMultivariate | null;
  //   maxYDatum: ComputedXYDatumMultivariate | null;
  // }>
  yScale$: Observable<d3.ScaleLinear<number, number>>
  // xyMinMax$: Observable<{
  //   minX: number;
  //   maxX: number;
  //   minY: number;
  //   maxY: number;
  // }>
}

const defaultTickSize = 6

const yTickTextAnchor = 'end'
const yTickDominantBaseline = 'middle'
const yAxisLabelAnchor = 'end'
const yAxisLabelDominantBaseline = 'auto'

function renderYAxisLabel ({ selection, yLabelClassName, layerParams, yAxis, theme }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yLabelClassName: string
  layerParams: BaseYAxisParams
  yAxis: XYAxis
  theme: Theme
  // axisLabelAlign: TextAlign
  // textReverseTransform: string,
}) {
  const offsetX = layerParams.tickPadding - layerParams.labelOffset[0]
  const offsetY = layerParams.tickPadding + layerParams.labelOffset[1]
  let labelX = - offsetX
  let labelY = - offsetY

  const axisLabelSelection = selection
    .selectAll<SVGGElement, BaseYAxisParams>(`g.${yLabelClassName}`)
    .data([layerParams])
    .join('g')
    .classed(yLabelClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, BaseYAxisParams>(`text`)
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
        .attr('text-anchor', yAxisLabelAnchor)
        .attr('dominant-baseline', yAxisLabelDominantBaseline)
        .attr('font-size', theme.fontSize)
        .style('fill', getColor(layerParams.labelColorType, theme))
        // .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => yAxis.label)
    })
    // .attr('transform', d => `translate(0, ${layout.height})`)
}

function renderYAxis ({ selection, yAxisClassName, layerParams, containerSize, theme, yScale }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yAxisClassName: string
  layerParams: BaseYAxisParams
  // tickTextAlign: TextAlign
  containerSize: ContainerSize
  theme: Theme,
  yScale: d3.ScaleLinear<number, number>
  // textReverseTransform: string,
  // xyMinMax: {
  //   minX: number;
  //   maxX: number;
  //   minY: number;
  //   maxY: number;
  // }
}) {

  const yAxisSelection = selection
    .selectAll<SVGGElement, BaseYAxisParams>(`g.${yAxisClassName}`)
    .data([layerParams])
    .join('g')
    .classed(yAxisClassName, true)

  // const _yScale = d3.scaleLinear()
  //   .domain([0, 150])
  //   .range([416.5, 791.349])

  // 刻度文字偏移
  let tickPadding = layerParams.tickPadding

  // 設定Y軸刻度
  const yAxis = d3.axisLeft(yScale)
    .scale(yScale)
    .ticks(layerParams.ticks) // 刻度分段數量
    .tickFormat(d => parseTickFormatValue(d, layerParams.tickFormat))
    .tickSize(layerParams.tickFullLine == true
      ? -containerSize.width
      : defaultTickSize)
    .tickPadding(tickPadding)
  
  const yAxisEl = yAxisSelection
    .transition()
    .duration(100)
    .ease(d3.easeLinear) // 線性的 - 當托曳或快速變動的時候比較滑順
    .call(yAxis)
  
  yAxisEl.selectAll('line')
    .style('fill', 'none')
    .style('stroke', layerParams.tickLineVisible == true ? getColor(layerParams.tickColorType, theme) : 'none')
    .style('stroke-dasharray', layerParams.tickFullLineDasharray)
    .attr('pointer-events', 'none')
  
  yAxisEl.selectAll('path')
    .style('fill', 'none')
    // .style('stroke', this.layerParams.axisLineColor!)
    .style('stroke', layerParams.axisLineVisible == true ? getColor(layerParams.axisLineColorType, theme) : 'none')
    .style('shape-rendering', 'crispEdges')
  
  // const yText = yAxisEl.selectAll('text')
  const yText = yAxisSelection.selectAll('text')
    // .style('font-family', 'sans-serif')
    .attr('font-size', theme.fontSize)
    .style('color', getColor(layerParams.tickTextColorType, theme))
    .attr('text-anchor', yTickTextAnchor)
    .attr('dominant-baseline', yTickDominantBaseline)
    // .attr('dy', 0)
    .attr('x', - tickPadding)
    .attr('dy', 0)
  // yText.style('transform', textReverseTransform)
  
  // // 抵消掉預設的偏移
  // if (fullDataFormatter.grid.valueAxis.position === 'bottom' || fullDataFormatter.grid.valueAxis.position === 'top') {
  //   yText.attr('dy', 0)
  // }

  return yAxisSelection
}


export const createBaseYAxis: BaseLayerFn<BaseYAxisContext> = ({
  selection,
  pluginName,
  layerName,
  computedData$,
  layerParams$,
  yAxis$,
  theme$,
  isSeriesSeprate$,
  containerPosition$,
  containerSize$,
  // layout$,
  // filteredXYMinMaxData$,
  yScale$,
  // xyMinMax$
}) => {

  const destroy$ = new Subject()

  // const containerClassName = createClassName(pluginName, 'container')
  const yAxisGClassName = createClassName(pluginName, layerName, 'yAxisG')
  const yAxisClassName = createClassName(pluginName, layerName, 'yAxis')
  const yLabelClassName = createClassName(pluginName, layerName, 'yLabel')

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
        .selectAll<SVGGElement, ComputedDatumMultivariate[]>(`g.${yAxisGClassName}`)
        .data([yAxisGClassName])
        .join('g')
        .classed(yAxisGClassName, true)
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

  // const yScale$: Observable<d3.ScaleLinear<number, number>> = new Observable(subscriber => {
  //   combineLatest({
  //     fullDataFormatter: fullDataFormatter$,
  //     layout: layout$,
  //     // xyMinMax: observer.xyMinMax$
  //     filteredXYMinMaxData: filteredXYMinMaxData$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {
  //     const valueIndex = data.fullDataFormatter.xAxis.valueIndex
  //     if (!data.filteredXYMinMaxData.minYDatum || !data.filteredXYMinMaxData.maxYDatum
  //       || data.filteredXYMinMaxData.minYDatum.value[valueIndex] == null || data.filteredXYMinMaxData.maxYDatum.value[valueIndex] == null
  //     ) {
  //       return
  //     }
  //     let maxValue = data.filteredXYMinMaxData.maxYDatum.value[valueIndex]
  //     let minValue = data.filteredXYMinMaxData.minYDatum.value[valueIndex]
  //     if (maxValue === minValue && maxValue === 0) {
  //       // 避免最大及最小值同等於 0 造成無法計算scale
  //       maxValue = 1
  //     }

  //     const yScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
  //       maxValue,
  //       minValue,
  //       axisWidth: data.layout.height,
  //       scaleDomain: data.fullDataFormatter.yAxis.scaleDomain,
  //       scaleRange: data.fullDataFormatter.yAxis.scaleRange,
  //       reverse: true
  //     })

  //     subscriber.next(yScale)
  //   })
  // })


  combineLatest({
    axisSelection: axisSelection$,
    layerParams: layerParams$,
    // tickTextAlign: tickTextAlign$,
    // axisLabelAlign: axisLabelAlign$,
    computedData: computedData$,
    containerSize: containerSize$,
    yAxis: yAxis$,
    yScale: yScale$,
    theme: theme$
    // textReverseTransform: textReverseTransform$,
    // xyMinMax: xyMinMax$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    renderYAxis({
      selection: data.axisSelection,
      yAxisClassName,
      layerParams: data.layerParams,
      // tickTextAlign: data.tickTextAlign,
      containerSize: data.containerSize,
      theme: data.theme,
      yScale: data.yScale,
      // textReverseTransform: data.textReverseTransform,
      // xyMinMax: data.xyMinMax
    })

    renderYAxisLabel({
      selection: data.axisSelection,
      yLabelClassName,
      layerParams: data.layerParams,
      // axisLabelAlign: data.axisLabelAlign,
      yAxis: data.yAxis,
      theme: data.theme,
      // textReverseTransform: data.textReverseTransform,
    })

  })

  return () => {
    destroy$.next(undefined)
  }
}