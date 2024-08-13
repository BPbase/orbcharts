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
import {
  defineGridPlugin } from '@orbcharts/core'
import { createAxisPointScale } from '@orbcharts/core'
import type {
  ComputedDatumGrid,
  DataFormatterGrid,
  ChartParams,
  TransformData } from '@orbcharts/core'
import type { GroupAxisParams } from '../types'
import { DEFAULT_GROUPING_AXIS_PARAMS } from '../defaults'
import { parseTickFormatValue } from '../../utils/d3Utils'
import { getColor, getClassName } from '../../utils/orbchartsUtils'

interface TextAlign {
  textAnchor: "start" | "middle" | "end"
  dominantBaseline: "middle" | "auto" | "hanging"
}

const pluginName = 'GroupAxis'
const containerClassName = getClassName(pluginName, 'container')
const xAxisGClassName = getClassName(pluginName, 'xAxisG')
const xAxisClassName = getClassName(pluginName, 'xAxis')
const groupingLabelClassName = getClassName(pluginName, 'groupingLabel')
const defaultTickSize = 6

function renderPointAxis ({ selection, params, tickTextAlign, axisLabelAlign, gridAxesSize, fullDataFormatter, chartParams, groupScale, contentTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  params: GroupAxisParams
  tickTextAlign: TextAlign
  axisLabelAlign: TextAlign
  gridAxesSize: { width: number, height: number }
  fullDataFormatter: DataFormatterGrid,
  chartParams: ChartParams
  groupScale: d3.ScalePoint<string>
  contentTransform: string
  // tickTextFormatter: string | ((label: any) => string)
}) {
console.log('contentTransform', contentTransform)
  const xAxisSelection = selection
    .selectAll<SVGGElement, GroupAxisParams>(`g.${xAxisClassName}`)
    .data([params])
    .join('g')
    .classed(xAxisClassName, true)

  const axisLabelSelection = selection
    .selectAll<SVGGElement, GroupAxisParams>(`g.${groupingLabelClassName}`)
    .data([params])
    .join('g')
    .classed(groupingLabelClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, GroupAxisParams>('text')
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
        .style('transform', contentTransform)
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
  const xText = xAxisSelection.selectAll('text')
    .style('font-family', 'sans-serif')
    .style('font-size', `${chartParams.styles.textSize}px`)
    // .style('font-weight', 'bold')
    .style('color', getColor(params.tickTextColorType, chartParams))
    .attr('text-anchor', tickTextAlign.textAnchor)
    .attr('dominant-baseline', tickTextAlign.dominantBaseline)
    .attr('transform-origin', `0 -${params.tickPadding + defaultTickSize}`)
    .style('transform', contentTransform)
  // if (params.textRotate === true) {
  //   xText.attr('transform', 'translate(0,0) rotate(-45)')
  // } else if (typeof params.textRotate === 'number') {
    // xText.attr('transform', `translate(0,0) rotate(${params.tickTextRotate})`)
  // }
    
  return xAxisSelection
}


export const GroupAxis = defineGridPlugin(pluginName, DEFAULT_GROUPING_AXIS_PARAMS)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  // const axisGUpdate = selection
  //   .selectAll('g')
  //   .data()

  // const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  // let graphicSelection: d3.Selection<SVGGElement, any, any, any> | undefined
  // let pathSelection: d3.Selection<SVGPathElement, ComputedDatumGrid[], any, any> | undefined
  // .style('transform', 'translate(0px, 0px) scale(1)')

  const containerSelection$ = observer.computedData$.pipe(
    takeUntil(destroy$),
    distinctUntilChanged((a, b) => {
      // 只有當series的數量改變時，才重新計算
      return a.length === b.length
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
    gridContainer: observer.gridContainer$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.containerSelection
      .attr('transform', (d, i) => {
        const translate = data.gridContainer[i].translate
        const scale = data.gridContainer[i].scale
        return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
      })
  })

  combineLatest({
    axisSelection: axisSelection$,
    gridAxesTransform: observer.gridAxesTransform$,
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
  //   observer.layout$
  // })

    
  // const tickTextFormatter$ = fullDataFormatter$
  //   .pipe(
  //     map(d => {
  //       return d.grid.seriesType === 'row' ? d.grid.columnLabelFormat : d.grid.rowLabelFormat
  //     })
  //   )

  // const contentTransform$: Observable<string> = new Observable(subscriber => {
  //   combineLatest({
  //     params: observer.fullParams$,
  //     gridAxesTransform: observer.gridAxesTransform$
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
  // const oppositeTransform$: Observable<TransformData> = observer.gridAxesTransform$.pipe(
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
  const contentTransform$ = combineLatest({
    fullParams: observer.fullParams$,
    gridAxesOppositeTransform: observer.gridAxesOppositeTransform$,
    gridContainer: observer.gridContainer$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const scale = [1 / data.gridContainer[0].scale[0], 1 / data.gridContainer[0].scale[1]]
      const rotate = data.gridAxesOppositeTransform.rotate + data.fullParams.tickTextRotate
      return `translate(${data.gridAxesOppositeTransform.translate[0]}px, ${data.gridAxesOppositeTransform.translate[1]}px) rotate(${rotate}deg) rotateX(${data.gridAxesOppositeTransform.rotateX}deg) rotateY(${data.gridAxesOppositeTransform.rotateY}deg) scale(${scale[0]}, ${scale[1]})`
    }),
    distinctUntilChanged()
  )

  const groupScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: observer.fullDataFormatter$,
      gridAxesSize: observer.gridAxesSize$,
      computedData: observer.computedData$
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

      let _labels = data.fullDataFormatter.grid.gridData.seriesType === 'row'
        // ? data.fullDataFormatter.grid.columnLabels
        // : data.fullDataFormatter.grid.rowLabels
        ? (data.computedData[0] ?? []).map(d => d.groupLabel)
        : data.computedData.map(d => d[0].groupLabel)

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

  const tickTextAlign$: Observable<TextAlign> = observer.fullDataFormatter$.pipe(
    takeUntil(destroy$),
    map(d => {
      let textAnchor: 'start' | 'middle' | 'end' = 'middle'
      let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

      if (d.grid.groupAxis.position === 'bottom') {
        textAnchor = 'middle'
        dominantBaseline = 'hanging'
      } else if (d.grid.groupAxis.position === 'top') {
        textAnchor = 'middle'
        dominantBaseline = 'auto'
      } else if (d.grid.groupAxis.position === 'left') {
        textAnchor = 'end'
        dominantBaseline = 'middle'
      } else if (d.grid.groupAxis.position === 'right') {
        textAnchor = 'start'
        dominantBaseline = 'middle'
      }
      return {
        textAnchor,
        dominantBaseline
      }
    })
  )

  const axisLabelAlign$: Observable<TextAlign> = observer.fullDataFormatter$.pipe(
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
    params: observer.fullParams$,
    tickTextAlign: tickTextAlign$,
    axisLabelAlign: axisLabelAlign$,
    gridAxesSize: observer.gridAxesSize$,
    fullDataFormatter: observer.fullDataFormatter$,
    chartParams: observer.fullChartParams$,
    groupScale: groupScale$,
    contentTransform: contentTransform$,
    // tickTextFormatter: tickTextFormatter$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {
// console.log('data.fullDataFormatter.grid.groupAxis', data.fullDataFormatter.grid.groupAxis)
    renderPointAxis({
      selection: data.axisSelection,
      params: data.params,
      tickTextAlign: data.tickTextAlign,
      axisLabelAlign: data.axisLabelAlign,
      gridAxesSize: data.gridAxesSize,
      fullDataFormatter: data.fullDataFormatter,
      chartParams: data.chartParams,
      groupScale: data.groupScale,
      contentTransform: data.contentTransform,
      // tickTextFormatter: data.tickTextFormatter
    })
  })

  return () => {
    destroy$.next(undefined)
  }
})