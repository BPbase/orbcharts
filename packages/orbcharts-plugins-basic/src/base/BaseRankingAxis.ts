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
import type { BaseRankingAxisParams } from '../../lib/plugins-basic-types'
import type { BasePluginFn } from './types'
import { getColor, getMinMaxValue, getClassName, getUniID } from '../utils/orbchartsUtils'
import { createLabelToAxisScale, createValueToAxisScale } from '../../lib/core'

interface BaseRankingAxisContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataMultiValue>
  // visibleComputedData$: Observable<ComputedDataMultiValue>
  visibleComputedRankingData$: Observable<ComputedDatumMultiValue[]>
  rankingScale$: Observable<d3.ScalePoint<string>>
  fullParams$: Observable<BaseRankingAxisParams>
  fullDataFormatter$: Observable<DataFormatterMultiValue>
  fullChartParams$: Observable<ChartParams>
  xyMinMax$: Observable<{
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }>
  textSizePx$: Observable<number>
  layout$: Observable<Layout>
  multiValueContainerPosition$: Observable<ContainerPositionScaled[]>
  isCategorySeprate$: Observable<boolean>
}

const pluginName = 'RankingAxis'

const yTickTextAnchor = 'end'
const yTickDominantBaseline = 'middle'
const yAxisLabelAnchor = 'end'
const yAxisLabelDominantBaseline = 'auto'
const yLabelClassName = getClassName(pluginName, 'yLabel')

function renderRankingAxisLabel ({ selection, yLabelClassName, fullParams, layout, fullDataFormatter, fullChartParams, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yLabelClassName: string
  fullParams: BaseRankingAxisParams
  // axisLabelAlign: TextAlign
  layout: { width: number, height: number }
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  textReverseTransform: string,
}) {
  const offsetX = fullParams.barLabel.padding - fullParams.axisLabel.offset[0]
  const offsetY = fullParams.barLabel.padding + fullParams.axisLabel.offset[1]
  let labelX = - offsetX
  let labelY = - offsetY

  const axisLabelSelection = selection
    .selectAll<SVGGElement, BaseRankingAxisParams>(`g.${yLabelClassName}`)
    .data([fullParams])
    .join('g')
    .classed(yLabelClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, BaseRankingAxisParams>(`text`)
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
        .style('fill', getColor(fullParams.axisLabel.colorType, fullChartParams))
        .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => fullDataFormatter.yAxis.label)
    })
    // .attr('transform', d => `translate(0, ${layout.height})`)
}

function renderRankingAxis ({ selection, yAxisClassName, fullParams, fullChartParams, rankingScale, renderLabels, textReverseTransformWithRotate, xyMinMax }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yAxisClassName: string
  fullParams: BaseRankingAxisParams
  // tickTextAlign: TextAlign
  fullChartParams: ChartParams
  rankingScale: d3.ScalePoint<string>
  renderLabels: string[]
  textReverseTransformWithRotate: string,
  xyMinMax: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }
}) {

  const yAxisSelection = selection
    .selectAll<SVGGElement, BaseRankingAxisParams>(`g.${yAxisClassName}`)
    .data(renderLabels)
    .join('g')
    .classed(yAxisClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, string>(`text`)
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
        .attr('text-anchor', yTickTextAnchor)
        .attr('dominant-baseline', yTickDominantBaseline)
        .attr('font-size', fullChartParams.styles.textSize)
        .style('fill', getColor(fullParams.barLabel.colorType, fullChartParams))
        .style('transform', textReverseTransformWithRotate)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', - fullParams.barLabel.padding)
        .attr('y', d => rankingScale(d)!)
        .text(d => d)
    })

  return yAxisSelection

  // const yAxisSelection = selection
  //   .selectAll<SVGGElement, BaseRankingAxisParams>(`g.${yAxisClassName}`)
  //   .data([fullParams])
  //   .join('g')
  //   .classed(yAxisClassName, true)

  // // const _yScale = d3.scaleLinear()
  // //   .domain([0, 150])
  // //   .range([416.5, 791.349])

  // // 刻度文字偏移
  // let tickPadding = fullParams.tickPadding

  // // 設定Y軸刻度
  // const yAxis = d3.axisLeft(yScale)
  //   .scale(yScale)
  //   .ticks(fullParams.ticks) // 刻度分段數量
  //   .tickFormat(d => parseTickFormatValue(d, fullParams.tickFormat))
  //   .tickSize(fullParams.tickFullLine == true
  //     ? -layout.width
  //     : defaultTickSize)
  //   .tickPadding(tickPadding)
  
  // const yAxisEl = yAxisSelection
  //   .transition()
  //   .duration(100)
  //   .call(yAxis)
  
  // yAxisEl.selectAll('line')
  //   .style('fill', 'none')
  //   .style('stroke', fullParams.tickLineVisible == true ? getColor(fullParams.tickColorType, fullChartParams) : 'none')
  //   .style('stroke-dasharray', fullParams.tickFullLineDasharray)
  //   .attr('pointer-events', 'none')
  
  // yAxisEl.selectAll('path')
  //   .style('fill', 'none')
  //   // .style('stroke', this.fullParams.axisLineColor!)
  //   .style('stroke', fullParams.axisLineVisible == true ? getColor(fullParams.axisLineColorType, fullChartParams) : 'none')
  //   .style('shape-rendering', 'crispEdges')
  
  // // const yText = yAxisEl.selectAll('text')
  // const yText = yAxisSelection.selectAll('text')
  //   // .style('font-family', 'sans-serif')
  //   .attr('font-size', fullChartParams.styles.textSize)
  //   .style('color', getColor(fullParams.tickTextColorType, fullChartParams))
  //   .attr('text-anchor', yTickTextAnchor)
  //   .attr('dominant-baseline', yTickDominantBaseline)
  //   // .attr('dy', 0)
  //   .attr('x', - tickPadding)
  //   .attr('dy', 0)
  // yText.style('transform', textReverseTransform)
  
  // // // 抵消掉預設的偏移
  // // if (fullDataFormatter.grid.valueAxis.position === 'bottom' || fullDataFormatter.grid.valueAxis.position === 'top') {
  // //   yText.attr('dy', 0)
  // // }

  // return yAxisSelection
}

export const createBaseRankingAxis: BasePluginFn<BaseRankingAxisContext> = (pluginName: string, {
  selection,
  computedData$,
  // visibleComputedData$,
  visibleComputedRankingData$,
  rankingScale$,
  fullParams$,
  fullDataFormatter$,
  fullChartParams$,
  xyMinMax$,
  textSizePx$,
  layout$,
  multiValueContainerPosition$,
  isCategorySeprate$
}) => {

  const destroy$ = new Subject()
  
  const containerClassName = getClassName(pluginName, 'container')
  const yAxisGClassName = getClassName(pluginName, 'yAxisG')
  const yAxisClassName = getClassName(pluginName, 'yAxis')
  const textClassName = getClassName(pluginName, 'text')

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
    gridContainerPosition: multiValueContainerPosition$
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

  const textReverseTransform$ = multiValueContainerPosition$.pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(multiValueContainerPosition => {
      // const axesRotateXYReverseValue = `rotateX(${data.gridAxesReverseTransform.rotateX}deg) rotateY(${data.gridAxesReverseTransform.rotateY}deg)`
      // const axesRotateReverseValue = `rotate(${data.gridAxesReverseTransform.rotate}deg)`
      const containerScaleReverseValue = `scale(${1 / multiValueContainerPosition[0].scale[0]}, ${1 / multiValueContainerPosition[0].scale[1]})`
      // 抵消最外層scale
      return `${containerScaleReverseValue}`
    }),
    distinctUntilChanged()
  )

  const textReverseTransformWithRotate$ = combineLatest({
    textReverseTransform: textReverseTransform$,
    fullParams: fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // 必須按照順序（先抵消外層rotate，再抵消最外層scale，最後再做本身的rotate）
      return `${data.textReverseTransform} rotate(${data.fullParams.barLabel.rotate}deg)`
    })
  )

  const sortedLabels$ = visibleComputedData$.pipe(
    takeUntil(destroy$),
    map(visibleComputedData => visibleComputedData
      .flat()
      .map(d => {
        // 新增總計資料欄位
        ;(d as any)._sum = d.value.reduce((acc, curr) => acc + curr, 0)
        return d
      })
      .sort((a: any, b: any) => b._sum - a._sum)
      .map(d => d.label)
    )
  )
  
  const labelAmountLimit$ = combineLatest({
    layout: layout$,
    textSizePx: textSizePx$,
    sortedLabels: sortedLabels$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const lineHeight = data.textSizePx * 2 // 2倍行高
      const labelAmountLimit = Math.floor(data.layout.height / lineHeight)
      return labelAmountLimit
    }),
    distinctUntilChanged()
  )

  // 要顯示的labels
  const renderLabels$ = combineLatest({
    sortedLabels: sortedLabels$,
    labelAmountLimit: labelAmountLimit$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // 篩選顯示上限
      return data.sortedLabels.slice(0, data.labelAmountLimit)
    }),
    distinctUntilChanged()
  )

  const rankingScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
    combineLatest({
      layout: layout$,
      renderLabels: renderLabels$,
      labelAmountLimit: labelAmountLimit$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      
      const rankingScale = createLabelToAxisScale({
        axisLabels: data.renderLabels,
        axisWidth: data.layout.height,
        padding: 0.5
      })

      subscriber.next(rankingScale)
    })
  })

  combineLatest({
    axisSelection: axisSelection$,
    fullParams: fullParams$,
    // tickTextAlign: tickTextAlign$,
    // axisLabelAlign: axisLabelAlign$,
    computedData: computedData$,
    layout: layout$,
    fullDataFormatter: fullDataFormatter$,
    fullChartParams: fullChartParams$,
    renderLabels: renderLabels$,
    rankingScale: rankingScale$,
    textReverseTransform: textReverseTransform$,
    textReverseTransformWithRotate: textReverseTransformWithRotate$,
    xyMinMax: xyMinMax$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    renderRankingAxis({
      selection: data.axisSelection,
      yAxisClassName,
      fullParams: data.fullParams,
      // tickTextAlign: data.tickTextAlign,
      fullChartParams: data.fullChartParams,
      rankingScale: data.rankingScale,
      renderLabels: data.renderLabels,
      textReverseTransformWithRotate: data.textReverseTransformWithRotate,
      xyMinMax: data.xyMinMax
    })

    renderRankingAxisLabel({
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
