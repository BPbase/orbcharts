import * as d3 from 'd3'
import {
  combineLatest,
  switchMap,
  distinctUntilChanged,
  of,
  first,
  map,
  takeUntil,
  Observable,
  Subject } from 'rxjs'
import { createAxisPointScale } from '@orbcharts/core'
import type { ColorType, ComputedDataGrid, ContainerPosition } from '@orbcharts/core'
import type { BasePluginFn } from './types'
import type {
  ComputedDatumGrid,
  DataFormatterGrid,
  ChartParams,
  TransformData } from '@orbcharts/core'
import { parseTickFormatValue } from '../utils/d3Utils'
import { getColor, getClassName } from '../utils/orbchartsUtils'

export interface BaseGroupAxisParams {
  // xLabel: string
  // labelAnchor: 'start' | 'end'
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  tickFormat: string | ((text: any) => string)
  tickLineVisible: boolean
  tickPadding: number
  tickFullLine: boolean
  tickFullLineDasharray: string
  tickColorType: ColorType
  // axisLineColor: string
  // axisLabelColor: string
  tickTextRotate: number
  tickTextColorType: ColorType
}

interface BaseGroupAxisContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataGrid>
  fullParams$: Observable<BaseGroupAxisParams>
  fullDataFormatter$: Observable<DataFormatterGrid>
  fullChartParams$: Observable<ChartParams>
  gridAxesTransform$: Observable<TransformData>
  gridAxesReverseTransform$: Observable<TransformData>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridContainer$: Observable<ContainerPosition[]>
  isSeriesPositionSeprate$: Observable<boolean>
}

interface TextAlign {
  textAnchor: "start" | "middle" | "end"
  dominantBaseline: "middle" | "auto" | "hanging"
}

// const pluginName = 'GroupAxis'
// const containerClassName = getClassName(pluginName, 'container')
// const xAxisGClassName = getClassName(pluginName, 'xAxisG')
// const xAxisClassName = getClassName(pluginName, 'xAxis')
// const groupingLabelClassName = getClassName(pluginName, 'groupingLabel')
const defaultTickSize = 6

function renderPointAxis ({ selection, xAxisClassName, groupingLabelClassName, params, tickTextAlign, axisLabelAlign, gridAxesSize, fullDataFormatter, chartParams, groupScale, textTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  xAxisClassName: string
  groupingLabelClassName: string
  params: BaseGroupAxisParams
  tickTextAlign: TextAlign
  axisLabelAlign: TextAlign
  gridAxesSize: { width: number, height: number }
  fullDataFormatter: DataFormatterGrid,
  chartParams: ChartParams
  groupScale: d3.ScalePoint<string>
  textTransform: string
  // tickTextFormatter: string | ((label: any) => string)
}) {

  const xAxisSelection = selection
    .selectAll<SVGGElement, BaseGroupAxisParams>(`g.${xAxisClassName}`)
    .data([params])
    .join('g')
    .classed(xAxisClassName, true)

  const axisLabelSelection = selection
    .selectAll<SVGGElement, BaseGroupAxisParams>(`g.${groupingLabelClassName}`)
    .data([params])
    .join('g')
    .classed(groupingLabelClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, BaseGroupAxisParams>('text')
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
        .attr('text-anchor', axisLabelAlign.textAnchor)
        .attr('dominant-baseline', axisLabelAlign.dominantBaseline)
        .style('font-size', `${chartParams.styles.textSize}px`)
        .style('fill', getColor(params.labelColorType, chartParams))
        .style('transform', textTransform)
        .text(d => fullDataFormatter.grid.groupAxis.label)
    })
    .attr('transform', d => `translate(${gridAxesSize.width + d.tickPadding + params.labelOffset[0]}, ${- d.tickPadding - defaultTickSize - params.labelOffset[1]})`)


  // 設定X軸刻度
  // const xAxis = d3.axisBottom(groupScale)
  const xAxis = d3.axisTop(groupScale)
    .scale(groupScale)
    .tickSize(params.tickFullLine == true
      ? -gridAxesSize.height
      : defaultTickSize)
    .tickSizeOuter(0)
    .tickFormat(d => parseTickFormatValue(d, params.tickFormat))
    .tickPadding(params.tickPadding)

  const xAxisEl = xAxisSelection
    .transition()
    .duration(100)
    .call(xAxis)      
    // .attr('text-anchor', () => params.tickTextRotate !== false ? 'end' : 'middle')
    // .attr('text-anchor', () => 'middle')

  xAxisEl.selectAll('line')
    .style('fill', 'none')
    .style('stroke', params.tickLineVisible == true ? getColor(params.tickColorType, chartParams) : 'none')
    .style('stroke-dasharray', params.tickFullLineDasharray)
    .attr('pointer-events', 'none')

  xAxisEl.selectAll('path')
    .style('fill', 'none')
    .style('stroke', params.axisLineVisible == true ? getColor(params.axisLineColorType, chartParams) : 'none')
    .style('shape-rendering', 'crispEdges')

  // const xText = xAxisEl.selectAll('text')
  // xAxisSelection.each((d, i, g) => {
  //   d3.select(g[i])
  //     .selectAll('text')
  //     .data([d])
  //     .join('text')
  //     .style('font-family', 'sans-serif')
  //     .style('font-size', `${chartParams.styles.textSize}px`)
  //     // .style('font-weight', 'bold')
  //     .style('color', getColor(params.tickTextColorType, chartParams))
  //     .attr('text-anchor', tickTextAlign.textAnchor)
  //     .attr('dominant-baseline', tickTextAlign.dominantBaseline)
  //     .attr('transform-origin', `0 -${params.tickPadding + defaultTickSize}`)
  //     .style('transform', textTransform)
  // })
  const xText = xAxisSelection.selectAll('text')
    .style('font-family', 'sans-serif')
    .style('font-size', `${chartParams.styles.textSize}px`)
    // .style('font-weight', 'bold')
    .style('color', getColor(params.tickTextColorType, chartParams))
    .attr('text-anchor', tickTextAlign.textAnchor)
    .attr('dominant-baseline', tickTextAlign.dominantBaseline)
    .attr('transform-origin', `0 -${params.tickPadding + defaultTickSize}`)
    .style('transform', textTransform)
    
    
  return xAxisSelection
}


export const createBaseGroupAxis: BasePluginFn<BaseGroupAxisContext> = ((pluginName: string, {
  selection,
  computedData$,
  fullParams$,
  fullDataFormatter$,
  fullChartParams$,
  gridAxesTransform$,
  gridAxesReverseTransform$,
  gridAxesSize$,
  gridContainer$,
  isSeriesPositionSeprate$,
}) => {
  
  const destroy$ = new Subject()

  const containerClassName = getClassName(pluginName, 'container')
  const xAxisGClassName = getClassName(pluginName, 'xAxisG')
  const xAxisClassName = getClassName(pluginName, 'xAxis')
  const groupingLabelClassName = getClassName(pluginName, 'groupingLabel')

  const containerSelection$ = combineLatest({
    computedData: computedData$.pipe(
      distinctUntilChanged((a, b) => {
        // 只有當series的數量改變時，才重新計算
        return a.length === b.length
      }),
    ),
    isSeriesPositionSeprate: isSeriesPositionSeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return data.isSeriesPositionSeprate
        // series分開的時候顯示各別axis
        ? data.computedData
        // series合併的時候只顯示第一個axis
        : [data.computedData[0]]
    }),
    map((computedData, i) => {
      return selection
        .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${containerClassName}`)
        .data(computedData, d => d[0] ? d[0].seriesIndex : i)
        .join('g')
        .classed(containerClassName, true)
    })
  )

  const axisSelection$ = containerSelection$.pipe(
    takeUntil(destroy$),
    map((containerSelection, i) => {
      return containerSelection
        .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${xAxisGClassName}`)
        .data([xAxisGClassName])
        .join('g')
        .classed(xAxisGClassName, true)
    })
  )

  combineLatest({
    containerSelection: containerSelection$,
    gridContainer: gridContainer$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.containerSelection
      .attr('transform', (d, i) => {
        const gridContainer = data.gridContainer[i] ?? data.gridContainer[0]
        const translate = gridContainer.translate
        const scale = gridContainer.scale
        return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
      })
      // .attr('opacity', 0)
      // .transition()
      // .attr('opacity', 1)
  })

  combineLatest({
    axisSelection: axisSelection$,
    gridAxesTransform: gridAxesTransform$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.axisSelection
      .style('transform', data.gridAxesTransform.value)
      // .attr('opacity', 0)
      // .transition()
      // .attr('opacity', 1)
      
  })


  // const gridAxesSize$ = gridAxisSizeObservable({
  //   fullDataFormatter$,
  //   layout$
  // })

    
  // const tickTextFormatter$ = fullDataFormatter$
  //   .pipe(
  //     map(d => {
  //       return d.grid.seriesDirection === 'row' ? d.grid.columnLabelFormat : d.grid.rowLabelFormat
  //     })
  //   )

  // const textTransform$: Observable<string> = new Observable(subscriber => {
  //   combineLatest({
  //     params: fullParams$,
  //     gridAxesTransform: gridAxesTransform$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {

  //     const transformData = Object.assign({}, data.gridAxesTransform)

  //     const value = getAxesTransformValue({
  //       translate: [0, 0],
  //       scale: [transformData.scale[0] * -1, transformData.scale[1] * -1],
  //       rotate: transformData.rotate * -1 + data.params.tickTextRotate,
  //       rotateX: transformData.rotateX * -1,
  //       rotateY: transformData.rotateY * -1
  //     })

  //     subscriber.next(value)
  //   })
  // })
  // const reverseTransform$: Observable<TransformData> = gridAxesTransform$.pipe(
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
  const textTransform$ = combineLatest({
    fullParams: fullParams$,
    fullDataFormatter: fullDataFormatter$,
    gridAxesReverseTransform: gridAxesReverseTransform$,
    gridContainer: gridContainer$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const axisReverseTranslateValue = `translate(${data.gridAxesReverseTransform.translate[0]}px, ${data.gridAxesReverseTransform.translate[1]}px)`
      const axisReverseRotateValue = `rotate(${data.gridAxesReverseTransform.rotate}deg) rotateX(${data.gridAxesReverseTransform.rotateX}deg) rotateY(${data.gridAxesReverseTransform.rotateY}deg)`
      const containerScaleReverseScaleValue = `scale(${1 / data.gridContainer[0].scale[0]}, ${1 / data.gridContainer[0].scale[1]})`
      const tickTextRotateDeg = (data.fullDataFormatter.grid.groupAxis.position === 'left' && data.fullDataFormatter.grid.valueAxis.position === 'top')
        || (data.fullDataFormatter.grid.groupAxis.position === 'right' && data.fullDataFormatter.grid.valueAxis.position === 'bottom')
          ? data.fullParams.tickTextRotate + 180 // 修正文字倒轉
          : data.fullParams.tickTextRotate
      
      const textRotateValue = `rotate(${tickTextRotateDeg}deg)`
      
      // 必須按照順序（先抵消外層rotate，再抵消最外層scale，最後再做本身的rotate）
      return `${axisReverseTranslateValue} ${axisReverseRotateValue} ${containerScaleReverseScaleValue} ${textRotateValue}`
    }),
    distinctUntilChanged()
  )

  const groupScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: fullDataFormatter$,
      gridAxesSize: gridAxesSize$,
      computedData: computedData$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      const groupMin = 0
      const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      const groupScaleDomainMin = data.fullDataFormatter.grid.groupAxis.scaleDomain[0] === 'auto'
        ? groupMin - data.fullDataFormatter.grid.groupAxis.scalePadding
        : data.fullDataFormatter.grid.groupAxis.scaleDomain[0] as number - data.fullDataFormatter.grid.groupAxis.scalePadding
      const groupScaleDomainMax = data.fullDataFormatter.grid.groupAxis.scaleDomain[1] === 'auto'
        ? groupMax + data.fullDataFormatter.grid.groupAxis.scalePadding
        : data.fullDataFormatter.grid.groupAxis.scaleDomain[1] as number + data.fullDataFormatter.grid.groupAxis.scalePadding
      
      const groupingLength = data.computedData[0]
        ? data.computedData[0].length
        : 0

      let _labels = (data.computedData[0] ?? []).map(d => d.groupLabel)

      const axisLabels = new Array(groupingLength).fill(0)
        .map((d, i) => {
          return _labels[i] != null
            ? _labels[i]
            : String(i) // 沒有label則用序列號填充
        })
        .filter((d, i) => {
          return i >= groupScaleDomainMin && i <= groupScaleDomainMax
        })

      
      const padding = data.fullDataFormatter.grid.groupAxis.scalePadding
      
      const groupScale = createAxisPointScale({
        axisLabels,
        axisWidth: data.gridAxesSize.width,
        padding
      })

      subscriber.next(groupScale)
    })
  })

  const tickTextAlign$: Observable<TextAlign> = combineLatest({
    fullDataFormatter: fullDataFormatter$,
    fullParams: fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      let textAnchor: 'start' | 'middle' | 'end' = 'middle'
      let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

      if (data.fullDataFormatter.grid.groupAxis.position === 'bottom') {
        textAnchor = data.fullParams.tickTextRotate
          ? 'end'
          : 'middle'
        dominantBaseline = 'hanging'
      } else if (data.fullDataFormatter.grid.groupAxis.position === 'top') {
        textAnchor = data.fullParams.tickTextRotate
          ? 'end'
          : 'middle'
        dominantBaseline = 'auto'
      } else if (data.fullDataFormatter.grid.groupAxis.position === 'left') {
        textAnchor = 'end'
        dominantBaseline = 'middle'
      } else if (data.fullDataFormatter.grid.groupAxis.position === 'right') {
        textAnchor = 'start'
        dominantBaseline = 'middle'
      }
      return {
        textAnchor,
        dominantBaseline
      }
    })
  )

  const axisLabelAlign$: Observable<TextAlign> = fullDataFormatter$.pipe(
    takeUntil(destroy$),
    map(d => {
      let textAnchor: 'start' | 'middle' | 'end' = 'start'
      let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

      if (d.grid.groupAxis.position === 'bottom') {
        dominantBaseline = 'hanging'
      } else if (d.grid.groupAxis.position === 'top') {
        dominantBaseline = 'auto'
      } else if (d.grid.groupAxis.position === 'left') {
        textAnchor = 'end'
      } else if (d.grid.groupAxis.position === 'right') {
        textAnchor = 'start'
      }
      if (d.grid.valueAxis.position === 'left') {
        textAnchor = 'start'
      } else if (d.grid.valueAxis.position === 'right') {
        textAnchor = 'end'
      } else if (d.grid.valueAxis.position === 'bottom') {
        dominantBaseline = 'auto'
      } else if (d.grid.valueAxis.position === 'top') {
        dominantBaseline = 'hanging'
      }
      return {
        textAnchor,
        dominantBaseline
      }
    })
  )

  combineLatest({
    axisSelection: axisSelection$,
    params: fullParams$,
    tickTextAlign: tickTextAlign$,
    axisLabelAlign: axisLabelAlign$,
    gridAxesSize: gridAxesSize$,
    fullDataFormatter: fullDataFormatter$,
    chartParams: fullChartParams$,
    groupScale: groupScale$,
    textTransform: textTransform$,
    // tickTextFormatter: tickTextFormatter$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    renderPointAxis({
      selection: data.axisSelection,
      xAxisClassName,
      groupingLabelClassName,
      params: data.params,
      tickTextAlign: data.tickTextAlign,
      axisLabelAlign: data.axisLabelAlign,
      gridAxesSize: data.gridAxesSize,
      fullDataFormatter: data.fullDataFormatter,
      chartParams: data.chartParams,
      groupScale: data.groupScale,
      textTransform: data.textTransform,
      // tickTextFormatter: data.tickTextFormatter
    })
  })

  return () => {
    destroy$.next(undefined)
  }
})