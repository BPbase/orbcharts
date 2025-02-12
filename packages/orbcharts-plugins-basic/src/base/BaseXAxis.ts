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
  defineMultiValuePlugin,
  createValueToAxisScale,
  getMinMax
} from '../../lib/core'
import type { BaseXAxisParams
} from '../../lib/plugins-basic-types'
import type { BasePluginFn } from './types'
// import { DEFAULT_X_Y_AXES_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../const'
import { getColor, getDatumColor, getClassName, getUniID } from '../utils/orbchartsUtils'
import { parseTickFormatValue } from '../utils/d3Utils'


interface BaseXAxisContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataMultiValue>
  // filteredMinMaxValue$: Observable<[number, number]>
  fullParams$: Observable<BaseXAxisParams>
  fullDataFormatter$: Observable<DataFormatterMultiValue>
  fullChartParams$: Observable<ChartParams>
  isCategorySeprate$: Observable<boolean>
  containerPosition$: Observable<ContainerPositionScaled[]>
  layout$: Observable<Layout>
  xScale$: Observable<d3.ScaleLinear<number, number>>
  // filteredXYMinMaxData$: Observable<{
  //   datumList: ComputedXYDatumMultiValue[];
  //   minXDatum: ComputedXYDatumMultiValue | null;
  //   maxXDatum: ComputedXYDatumMultiValue | null;
  //   minYDatum: ComputedXYDatumMultiValue | null;
  //   maxYDatum: ComputedXYDatumMultiValue | null;
  // }>
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

const xTickTextAnchor = 'middle'
const xTickDominantBaseline = 'hanging'
const xAxisLabelAnchor = 'start'
const xAxisLabelDominantBaseline = 'hanging'

function renderXAxisLabel ({ selection, xLabelClassName, fullParams, layout, fullDataFormatter, fullChartParams, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  xLabelClassName: string
  fullParams: BaseXAxisParams
  // axisLabelAlign: TextAlign
  layout: { width: number, height: number }
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  textReverseTransform: string,
}) {
  const offsetX = fullParams.tickPadding + fullParams.labelOffset[0]
  const offsetY = fullParams.tickPadding + fullParams.labelOffset[1]
  let labelX = offsetX
  let labelY = offsetY

  const axisLabelSelection = selection
    .selectAll<SVGGElement, BaseXAxisParams>(`g.${xLabelClassName}`)
    .data([fullParams])
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
        .attr('font-size', fullChartParams.styles.textSize)
        .style('fill', getColor(fullParams.labelColorType, fullChartParams))
        .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => fullDataFormatter.xAxis.label)
    })
    .attr('transform', d => `translate(${layout.width}, ${layout.height})`)
}

function renderXAxis ({ selection, xAxisClassName, fullParams, layout, fullChartParams, xScale, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  xAxisClassName: string
  fullParams: BaseXAxisParams
  // tickTextAlign: TextAlign
  layout: { width: number, height: number }
  // fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  xScale: d3.ScaleLinear<number, number>
  textReverseTransform: string,
  // xyMinMax: {
  //   minX: number;
  //   maxX: number;
  //   minY: number;
  //   maxY: number;
  // }
}) {

  const xAxisSelection = selection
    .selectAll<SVGGElement, BaseXAxisParams>(`g.${xAxisClassName}`)
    .data([fullParams])
    .join('g')
    .classed(xAxisClassName, true)
    .attr('transform', `translate(0, ${layout.height})`)

  // const _xScale = d3.scaleLinear()
  //   .domain([0, 150])
  //   .range([416.5, 791.349])

  // 刻度文字偏移
  let tickPadding = fullParams.tickPadding

  // 設定Y軸刻度
  const xAxis = d3.axisBottom(xScale)
    .scale(xScale)
    .ticks(fullParams.ticks) // 刻度分段數量
    .tickFormat(d => parseTickFormatValue(d, fullParams.tickFormat))
    .tickSize(fullParams.tickFullLine == true
      ? -layout.height
      : defaultTickSize)
    .tickSizeOuter(-layout.height)
    .tickPadding(tickPadding)
  
  const xAxisEl = xAxisSelection
    .transition()
    .duration(100)
    .call(xAxis)
  
  xAxisEl.selectAll('line')
    .style('fill', 'none')
    .style('stroke', fullParams.tickLineVisible == true ? getColor(fullParams.tickColorType, fullChartParams) : 'none')
    .style('stroke-dasharray', fullParams.tickFullLineDasharray)
    .attr('pointer-events', 'none')
  
  xAxisEl.selectAll('path')
    .style('fill', 'none')
    // .style('stroke', this.fullParams.axisLineColor!)
    .style('stroke', fullParams.axisLineVisible == true ? getColor(fullParams.axisLineColorType, fullChartParams) : 'none')
    .style('shape-rendering', 'crispEdges')
  
  // const xText = xAxisEl.selectAll('text')
  const xText = xAxisSelection.selectAll('text')
    // .style('font-family', 'sans-serif')
    .attr('font-size', fullChartParams.styles.textSize)
    .style('color', getColor(fullParams.tickTextColorType, fullChartParams))
    .attr('text-anchor', xTickTextAnchor)
    .attr('dominant-baseline', xTickDominantBaseline)
    .attr('dy', 0)
    .attr('y', tickPadding)
    xText.style('transform', textReverseTransform)
  
  // // 抵消掉預設的偏移
  // if (fullDataFormatter.grid.valueAxis.position === 'bottom' || fullDataFormatter.grid.valueAxis.position === 'top') {
  //   xText.attr('dy', 0)
  // }

  return xAxisSelection
}

export const createBaseXAxis: BasePluginFn<BaseXAxisContext> = (pluginName: string, {
  selection,
  computedData$,
  fullParams$,
  fullDataFormatter$,
  fullChartParams$,
  isCategorySeprate$,
  containerPosition$,
  layout$,
  xScale$
  // filteredXYMinMaxData$,
  // xyMinMax$
}) => {
  
  const destroy$ = new Subject()

  const containerClassName = getClassName(pluginName, 'container')
  const xAxisGClassName = getClassName(pluginName, 'xAxisG')
  const xAxisClassName = getClassName(pluginName, 'xAxis')
  const xLabelClassName = getClassName(pluginName, 'xLabel')

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
        .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${xAxisGClassName}`)
        .data([xAxisGClassName])
        .join('g')
        .classed(xAxisGClassName, true)
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
    fullParams: fullParams$,
    // tickTextAlign: tickTextAlign$,
    // axisLabelAlign: axisLabelAlign$,
    computedData: computedData$,
    layout: layout$,
    fullDataFormatter: fullDataFormatter$,
    fullChartParams: fullChartParams$,
    xScale: xScale$,
    textReverseTransform: textReverseTransform$,
    // xyMinMax: xyMinMax$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    renderXAxis({
      selection: data.axisSelection,
      xAxisClassName,
      fullParams: data.fullParams,
      // tickTextAlign: data.tickTextAlign,
      layout: data.layout,
      // fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      xScale: data.xScale,
      textReverseTransform: data.textReverseTransform,
      // xyMinMax: data.xyMinMax
    })

    renderXAxisLabel({
      selection: data.axisSelection,
      xLabelClassName,
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
