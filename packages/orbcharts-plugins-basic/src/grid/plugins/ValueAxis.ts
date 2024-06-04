import * as d3 from 'd3'
import {
  combineLatest,
  switchMap,
  distinctUntilChanged,
  first,
  map,
  takeUntil,
  Observable,
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { createAxisLinearScale } from '@orbcharts/core'
import type {
  DataFormatterGrid,
  ChartParams,
  TransformData } from '@orbcharts/core'
import type { ValueAxisParams } from '../types'
import { DEFAULT_VALUE_AXIS_PLUGIN_PARAMS } from '../defaults'
import { parseTickFormatValue } from '../../utils/d3Utils'
import { getColor, getMinAndMaxValue, getClassName, getUniID } from '../../utils/orbchartsUtils'

interface TextAlign {
  textAnchor: "start" | "middle" | "end"
  dominantBaseline: "middle" | "auto" | "hanging"
}

const pluginName = 'ValueAxis'
const gClassName = getClassName(pluginName, 'g')
const textClassName = getClassName(pluginName, 'text')
const defaultTickSize = 6

function renderLinearAxis ({ selection, fullParams, tickTextAlign, axisLabelAlign, gridAxesSize, fullDataFormatter, fullChartParams, valueScale, contentTransform, minAndMax }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  fullParams: ValueAxisParams
  tickTextAlign: TextAlign
  axisLabelAlign: TextAlign
  gridAxesSize: { width: number, height: number }
  fullDataFormatter: DataFormatterGrid,
  fullChartParams: ChartParams
  valueScale: d3.ScaleLinear<number, number>
  contentTransform: string,
  minAndMax: [number, number]
}) {

  const yAxisSelection = selection
    .selectAll<SVGGElement, ValueAxisParams>(`g.${gClassName}`)
    .data([fullParams])
    .join('g')
    .classed(gClassName, true)

  const axisLabelSelection = selection
    .selectAll<SVGGElement, ValueAxisParams>(`g.${textClassName}`)
    .data([fullParams])
    .join('g')
    .classed(textClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, ValueAxisParams>(`text`)
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
        .style('font-size', `${fullChartParams.styles.textSize}px`)
        .style('fill', getColor(fullParams.labelColorType, fullChartParams))
        .style('transform', contentTransform)
        .text(d => fullDataFormatter.valueAxis.label)
    })
    .attr('transform', d => `translate(${- d.tickPadding + fullParams.labelOffset[0]}, ${gridAxesSize.height + d.tickPadding + fullParams.labelOffset[1]})`)

  const valueLength = minAndMax[1] - minAndMax[0]
  
  // 設定Y軸刻度
  const yAxis = d3.axisLeft(valueScale)
    .scale(valueScale)
    .ticks(valueLength > fullParams.ticks
      ? fullParams.ticks
      : ((minAndMax[0] === 0 && minAndMax[1] === 0)
        ? 1
        : Math.ceil(valueLength))) // 刻度分段數量
    .tickFormat(d => parseTickFormatValue(d, fullParams.tickFormat))
    .tickSize(fullParams.tickFullLine == true
      ? -gridAxesSize.width
      : defaultTickSize)
    .tickPadding(fullParams.tickPadding)
  
  const yAxisEl = yAxisSelection
    .transition()
    .duration(100)
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
    .style('font-family', 'sans-serif')
    .style('font-size', `${fullChartParams.styles.textSize}px`)
    .style('color', getColor(fullParams.tickTextColorType, fullChartParams))
    .attr('text-anchor', tickTextAlign.textAnchor)
    .attr('dominant-baseline', tickTextAlign.dominantBaseline)
    .attr('transform-origin', `-${fullParams.tickPadding + defaultTickSize} 0`)
  yText.style('transform', contentTransform)

  return yAxisSelection
}


export const ValueAxis = defineGridPlugin(pluginName, DEFAULT_VALUE_AXIS_PLUGIN_PARAMS)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  // const axisGUpdate = selection
  //   .selectAll('g')
  //   .data()

  const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection.append('g')
  // let graphicSelection: d3.Selection<SVGGElement, any, any, any> | undefined
  // let pathSelection: d3.Selection<SVGPathElement, ComputedDatumGrid[], any, any> | undefined
  // .style('transform', 'translate(0px, 0px) scale(1)')

  observer.gridAxesTransform$
    .pipe(
      takeUntil(destroy$),
      map(d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      axisSelection
        .style('transform', d)
        .attr('opacity', 0)
        .transition()
        .attr('opacity', 1)
    })

  // const gridAxesSize$ = gridAxisSizeObservable({
  //   fullDataFormatter$,
  //   layout$
  // })

  // const contentTransform$: Observable<string> = new Observable(subscriber => {
  //   combineLatest({
  //     fullParams: fullParams$,
  //     layout: layout$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {

  //     const transformData = Object.assign({}, data.layout.content.axesTransformData)

  //     const value = getAxesTransformValue({
  //       translate: [0, 0],
  //       scale: [transformData.scale[0] * -1, transformData.scale[1] * -1],
  //       rotate: transformData.rotate * -1 + data.fullParams.tickTextRotate,
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
    gridAxesOppositeTransform: observer.gridAxesOppositeTransform$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async data => {
      const rotate = data.gridAxesOppositeTransform.rotate + data.fullParams.tickTextRotate
      return `translate(${data.gridAxesOppositeTransform.translate[0]}px, ${data.gridAxesOppositeTransform.translate[1]}px) rotate(${rotate}deg) rotateX(${data.gridAxesOppositeTransform.rotateX}deg) rotateY(${data.gridAxesOppositeTransform.rotateY}deg)`
    }),
    distinctUntilChanged()
  )

  const minAndMax$: Observable<[number, number]> = new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: observer.fullDataFormatter$,
      gridAxesSize: observer.gridAxesSize$,
      computedData: observer.computedData$
    }).pipe(
      takeUntil(destroy$),
      // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
      switchMap(async (d) => d),
    ).subscribe(data => {
      const groupMin = 0
      const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      const groupScaleDomainMin = data.fullDataFormatter.groupAxis.scaleDomain[0] === 'auto'
        ? groupMin - data.fullDataFormatter.groupAxis.scalePadding
        : data.fullDataFormatter.groupAxis.scaleDomain[0] as number - data.fullDataFormatter.groupAxis.scalePadding
      const groupScaleDomainMax = data.fullDataFormatter.groupAxis.scaleDomain[1] === 'auto'
        ? groupMax + data.fullDataFormatter.groupAxis.scalePadding
        : data.fullDataFormatter.groupAxis.scaleDomain[1] as number + data.fullDataFormatter.groupAxis.scalePadding
        
      const filteredData = data.computedData.map((d, i) => {
        return d.filter((_d, _i) => {
          return _i >= groupScaleDomainMin && _i <= groupScaleDomainMax
        })
      })
    
      const filteredMinAndMax = getMinAndMaxValue(filteredData.flat())

      subscriber.next(filteredMinAndMax)
    })
  })

  const valueScale$: Observable<d3.ScaleLinear<number, number>> = new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: observer.fullDataFormatter$,
      gridAxesSize: observer.gridAxesSize$,
      minAndMax: minAndMax$
    }).pipe(
      takeUntil(destroy$),
      // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
      switchMap(async (d) => d),
    ).subscribe(data => {
    
      const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
        maxValue: data.minAndMax[1],
        minValue: data.minAndMax[0],
        axisWidth: data.gridAxesSize.height,
        scaleDomain: data.fullDataFormatter.valueAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.valueAxis.scaleRange
      })

      subscriber.next(valueScale)
    })
  })

  const tickTextAlign$: Observable<TextAlign> = observer.fullDataFormatter$.pipe(
    takeUntil(destroy$),
    map(d => {
      let textAnchor: 'start' | 'middle' | 'end' = 'start'
      let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

      if (d.valueAxis.position === 'left') {
        textAnchor = 'end'
        dominantBaseline = 'middle'
      } else if (d.valueAxis.position === 'right') {
        textAnchor = 'start'
        dominantBaseline = 'middle'
      } else if (d.valueAxis.position === 'bottom') {
        textAnchor = 'middle'
        dominantBaseline = 'hanging'
      } else if (d.valueAxis.position === 'top') {
        textAnchor = 'middle'
        dominantBaseline = 'auto'
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

      if (d.groupAxis.position === 'bottom') {
        dominantBaseline = 'auto'
      } else if (d.groupAxis.position === 'top') {
        dominantBaseline = 'hanging'
      } else if (d.groupAxis.position === 'left') {
        textAnchor = 'start'
      } else if (d.groupAxis.position === 'right') {
        textAnchor = 'end'
      }
      if (d.valueAxis.position === 'left') {
        textAnchor = 'end'
      } else if (d.valueAxis.position === 'right') {
        textAnchor = 'start'
      } else if (d.valueAxis.position === 'bottom') {
        dominantBaseline = 'hanging'
      } else if (d.valueAxis.position === 'top') {
        dominantBaseline = 'auto'
      }
      return {
        textAnchor,
        dominantBaseline
      }
    })
  )
  

  combineLatest({
    fullParams: observer.fullParams$,
    tickTextAlign: tickTextAlign$,
    axisLabelAlign: axisLabelAlign$,
    computedData: observer.computedData$,
    gridAxesSize: observer.gridAxesSize$,
    fullDataFormatter: observer.fullDataFormatter$,
    fullChartParams: observer.fullChartParams$,
    valueScale: valueScale$,
    contentTransform: contentTransform$,
    minAndMax: minAndMax$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {

    renderLinearAxis({
      selection: axisSelection,
      fullParams: data.fullParams,
      tickTextAlign: data.tickTextAlign,
      axisLabelAlign: data.axisLabelAlign,
      gridAxesSize: data.gridAxesSize,
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      valueScale: data.valueScale,
      contentTransform: data.contentTransform,
      minAndMax: data.minAndMax
    })
  })

  return () => {
    destroy$.next(undefined)
  }
})