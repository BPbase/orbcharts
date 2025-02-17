import * as d3 from 'd3'
import {
  Observable,
  Subject,
  combineLatest,
  takeUntil,
  map,
  distinctUntilChanged,
  switchMap,
  shareReplay
} from 'rxjs'
import type {
  ColorType,
  ChartParams,
  ComputedDatumMultiValue,
  ComputedDataMultiValue,
  ComputedXYDatumMultiValue,
  ContainerPositionScaled,
  DataFormatterMultiValue,
  DefinePluginConfig,
  TransformData,
  Layout
} from '../../lib/core-types'
import {
  createValueToAxisScale,
} from '../../lib/core'
import type { BaseYAxisParams
} from '../../lib/plugins-basic-types'
import type { BasePluginFn } from './types'
// import { DEFAULT_X_Y_AXES_PARAMS } from '../defaults'
// import { LAYER_INDEX_OF_AXIS } from '../const'
import { getColor, getDatumColor, getClassName, getUniID } from '../utils/orbchartsUtils'
import { parseTickFormatValue } from '../utils/d3Utils'


interface BaseYAxisContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataMultiValue>
  // filteredMinMaxValue$: Observable<[number, number]>
  fullParams$: Observable<BaseYAxisParams>
  fullDataFormatter$: Observable<DataFormatterMultiValue>
  fullChartParams$: Observable<ChartParams>
  isCategorySeprate$: Observable<boolean>
  containerPosition$: Observable<ContainerPositionScaled[]>
  layout$: Observable<Layout>
  // filteredXYMinMaxData$: Observable<{
  //   datumList: ComputedXYDatumMultiValue[];
  //   minXDatum: ComputedXYDatumMultiValue | null;
  //   maxXDatum: ComputedXYDatumMultiValue | null;
  //   minYDatum: ComputedXYDatumMultiValue | null;
  //   maxYDatum: ComputedXYDatumMultiValue | null;
  // }>
  yScale$: Observable<d3.ScaleLinear<number, number>>
  // xyMinMax$: Observable<{
  //   minX: number;
  //   maxX: number;
  //   minY: number;
  //   maxY: number;
  // }>
}

// interface TextAlign {
//   textAnchor: "start" | "middle" | "end"
//   dominantBaseline: "middle" | "auto" | "hanging"
// }

const defaultTickSize = 6

const yTickTextAnchor = 'end'
const yTickDominantBaseline = 'middle'
const yAxisLabelAnchor = 'end'
const yAxisLabelDominantBaseline = 'auto'

function renderYAxisLabel ({ selection, yLabelClassName, fullParams, layout, fullDataFormatter, fullChartParams, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yLabelClassName: string
  fullParams: BaseYAxisParams
  // axisLabelAlign: TextAlign
  layout: { width: number, height: number }
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  textReverseTransform: string,
}) {
  const offsetX = fullParams.tickPadding - fullParams.labelOffset[0]
  const offsetY = fullParams.tickPadding + fullParams.labelOffset[1]
  let labelX = - offsetX
  let labelY = - offsetY

  const axisLabelSelection = selection
    .selectAll<SVGGElement, BaseYAxisParams>(`g.${yLabelClassName}`)
    .data([fullParams])
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
        .attr('font-size', fullChartParams.styles.textSize)
        .style('fill', getColor(fullParams.labelColorType, fullChartParams))
        .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => fullDataFormatter.yAxis.label)
    })
    // .attr('transform', d => `translate(0, ${layout.height})`)
}

function renderYAxis ({ selection, yAxisClassName, fullParams, layout, fullDataFormatter, fullChartParams, yScale, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yAxisClassName: string
  fullParams: BaseYAxisParams
  // tickTextAlign: TextAlign
  layout: { width: number, height: number }
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  yScale: d3.ScaleLinear<number, number>
  textReverseTransform: string,
  // xyMinMax: {
  //   minX: number;
  //   maxX: number;
  //   minY: number;
  //   maxY: number;
  // }
}) {

  const yAxisSelection = selection
    .selectAll<SVGGElement, BaseYAxisParams>(`g.${yAxisClassName}`)
    .data([fullParams])
    .join('g')
    .classed(yAxisClassName, true)

  // const _yScale = d3.scaleLinear()
  //   .domain([0, 150])
  //   .range([416.5, 791.349])

  // 刻度文字偏移
  let tickPadding = fullParams.tickPadding

  // 設定Y軸刻度
  const yAxis = d3.axisLeft(yScale)
    .scale(yScale)
    .ticks(fullParams.ticks) // 刻度分段數量
    .tickFormat(d => parseTickFormatValue(d, fullParams.tickFormat))
    .tickSize(fullParams.tickFullLine == true
      ? -layout.width
      : defaultTickSize)
    .tickPadding(tickPadding)
  
  const yAxisEl = yAxisSelection
    .transition()
    .duration(100)
    .ease(d3.easeLinear) // 線性的 - 當托曳或快速變動的時候比較滑順
    .call(yAxis)
  
  yAxisEl.selectAll('line')
    .style('fill', 'none')
    .style('stroke', fullParams.tickLineVisible == true ? getColor(fullParams.tickColorType, fullChartParams) : 'none')
    .style('stroke-dasharray', fullParams.tickFullLineDasharray)
    .attr('pointer-events', 'none')
  
  yAxisEl.selectAll('path')
    .style('fill', 'none')
    // .style('stroke', this.fullParams.axisLineColor!)
    .style('stroke', fullParams.axisLineVisible == true ? getColor(fullParams.axisLineColorType, fullChartParams) : 'none')
    .style('shape-rendering', 'crispEdges')
  
  // const yText = yAxisEl.selectAll('text')
  const yText = yAxisSelection.selectAll('text')
    // .style('font-family', 'sans-serif')
    .attr('font-size', fullChartParams.styles.textSize)
    .style('color', getColor(fullParams.tickTextColorType, fullChartParams))
    .attr('text-anchor', yTickTextAnchor)
    .attr('dominant-baseline', yTickDominantBaseline)
    // .attr('dy', 0)
    .attr('x', - tickPadding)
    .attr('dy', 0)
  yText.style('transform', textReverseTransform)
  
  // // 抵消掉預設的偏移
  // if (fullDataFormatter.grid.valueAxis.position === 'bottom' || fullDataFormatter.grid.valueAxis.position === 'top') {
  //   yText.attr('dy', 0)
  // }

  return yAxisSelection
}

export const createBaseYAxis: BasePluginFn<BaseYAxisContext> = (pluginName: string, {
  selection,
  computedData$,
  fullParams$,
  fullDataFormatter$,
  fullChartParams$,
  isCategorySeprate$,
  containerPosition$,
  layout$,
  // filteredXYMinMaxData$,
  yScale$,
  // xyMinMax$
}) => {
  
  const destroy$ = new Subject()

  const containerClassName = getClassName(pluginName, 'container')
  const yAxisGClassName = getClassName(pluginName, 'yAxisG')
  const yAxisClassName = getClassName(pluginName, 'yAxis')
  const yLabelClassName = getClassName(pluginName, 'yLabel')

  const containerSelection$ = combineLatest({
    computedData: computedData$.pipe(
      distinctUntilChanged((a, b) => {
        // 只有當series的數量改變時，才重新計算
        return a.length === b.length
      }),
    ),
    isCategorySeprate: isCategorySeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return data.isCategorySeprate
        // category分開的時候顯示各別axis
        ? data.computedData
        // category合併的時候只顯示第一個axis
        : [data.computedData[0]]
    }),
    map((computedData, i) => {
      return selection
        .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${containerClassName}`)
        .data(computedData, d => d[0] ? d[0].categoryIndex : i)
        .join('g')
        .classed(containerClassName, true)
    })
  )

  const axisSelection$ = containerSelection$.pipe(
    takeUntil(destroy$),
    map((containerSelection, i) => {
      return containerSelection
        .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${yAxisGClassName}`)
        .data([yAxisGClassName])
        .join('g')
        .classed(yAxisGClassName, true)
    })
  )

  combineLatest({
    containerSelection: containerSelection$,
    gridContainerPosition: containerPosition$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.containerSelection
      .attr('transform', (d, i) => {
        const gridContainerPosition = data.gridContainerPosition[i] ?? data.gridContainerPosition[0]
        const translate = gridContainerPosition.translate
        const scale = gridContainerPosition.scale
        return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
      })
      // .attr('opacity', 0)
      // .transition()
      // .attr('opacity', 1)
  })

  const textReverseTransform$ = containerPosition$.pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(containerPosition => {
      // const axesRotateXYReverseValue = `rotateX(${data.gridAxesReverseTransform.rotateX}deg) rotateY(${data.gridAxesReverseTransform.rotateY}deg)`
      // const axesRotateReverseValue = `rotate(${data.gridAxesReverseTransform.rotate}deg)`
      const containerScaleReverseValue = `scale(${1 / containerPosition[0].scale[0]}, ${1 / containerPosition[0].scale[1]})`
      // 抵消最外層scale
      return `${containerScaleReverseValue}`
    }),
    distinctUntilChanged()
  )

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
    fullParams: fullParams$,
    // tickTextAlign: tickTextAlign$,
    // axisLabelAlign: axisLabelAlign$,
    computedData: computedData$,
    layout: layout$,
    fullDataFormatter: fullDataFormatter$,
    fullChartParams: fullChartParams$,
    yScale: yScale$,
    textReverseTransform: textReverseTransform$,
    // xyMinMax: xyMinMax$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    renderYAxis({
      selection: data.axisSelection,
      yAxisClassName,
      fullParams: data.fullParams,
      // tickTextAlign: data.tickTextAlign,
      layout: data.layout,
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      yScale: data.yScale,
      textReverseTransform: data.textReverseTransform,
      // xyMinMax: data.xyMinMax
    })

    renderYAxisLabel({
      selection: data.axisSelection,
      yLabelClassName,
      fullParams: data.fullParams,
      // axisLabelAlign: data.axisLabelAlign,
      layout: data.layout,
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      textReverseTransform: data.textReverseTransform,
    })

  })


  return () => {
    destroy$.next(undefined)
  }
}
