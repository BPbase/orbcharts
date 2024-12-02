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
import { createAxisLinearScale } from '../../lib/core'
import type { BasePluginFn } from './types'
import type {
  ComputedDataGrid,
  DataFormatterGrid,
  ChartParams,
  ComputedDatumGrid,
  ContainerPositionScaled,
  TransformData,
  EventGrid,
  ColorType
} from '../../lib/core-types'
import type { BaseValueAxisParams } from '../../lib/plugins-basic-types'
import { parseTickFormatValue } from '../utils/d3Utils'
import { getColor, getMinAndMaxValue, getClassName, getUniID } from '../utils/orbchartsUtils'

// export interface BaseValueAxisParams {
//   labelOffset: [number, number]
//   labelColorType: ColorType
//   axisLineVisible: boolean
//   axisLineColorType: ColorType
//   ticks: number
//   tickFormat: string | ((text: d3.NumberValue) => string)
//   tickLineVisible: boolean
//   tickPadding: number
//   tickFullLine: boolean
//   tickFullLineDasharray: string
//   tickColorType: ColorType
//   tickTextRotate: number
//   tickTextColorType: ColorType
// }

interface BaseLinesContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataGrid>
  fullParams$: Observable<BaseValueAxisParams>
  fullDataFormatter$: Observable<DataFormatterGrid>
  fullChartParams$: Observable<ChartParams>
  gridAxesTransform$: Observable<TransformData>
  gridAxesReverseTransform$: Observable<TransformData>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  isSeriesSeprate$: Observable<boolean>
}

interface TextAlign {
  textAnchor: "start" | "middle" | "end"
  dominantBaseline: "middle" | "auto" | "hanging"
}

// const pluginName = 'ValueAxis'
// const containerClassName = getClassName(pluginName, 'container')
// const yAxisGClassName = getClassName(pluginName, 'yAxisG')
// const yAxisClassName = getClassName(pluginName, 'yAxis')
// const textClassName = getClassName(pluginName, 'text')
const defaultTickSize = 6

function renderAxisLabel ({ selection, textClassName, fullParams, axisLabelAlign, gridAxesSize, fullDataFormatter, fullChartParams, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  textClassName: string
  fullParams: BaseValueAxisParams
  axisLabelAlign: TextAlign
  gridAxesSize: { width: number, height: number }
  fullDataFormatter: DataFormatterGrid,
  fullChartParams: ChartParams
  textReverseTransform: string,
}) {
  const offsetX = fullParams.tickPadding - fullParams.labelOffset[0]
  const offsetY = fullParams.tickPadding + fullParams.labelOffset[1]
  let labelX = 0
  let labelY = 0
  if (fullDataFormatter.grid.groupAxis.position === 'bottom') {
    // labelY = - gridAxesSize.height - offsetY
    labelY = - offsetY
    if (fullDataFormatter.grid.valueAxis.position === 'left') {
      labelX = - offsetX
    } else if (fullDataFormatter.grid.valueAxis.position === 'right') {
      labelX = offsetX
    }
  } else if (fullDataFormatter.grid.groupAxis.position === 'top') {
    // labelY = gridAxesSize.height + offsetY
    labelY = offsetY
    if (fullDataFormatter.grid.valueAxis.position === 'left') {
      labelX = - offsetX
    } else if (fullDataFormatter.grid.valueAxis.position === 'right') {
      labelX = offsetX
    }
  } else if (fullDataFormatter.grid.groupAxis.position === 'left') {
    // labelX = gridAxesSize.width + offsetX
    labelX = offsetX
    if (fullDataFormatter.grid.valueAxis.position === 'bottom') {
      labelY = offsetY
    } else if (fullDataFormatter.grid.valueAxis.position === 'top') {
      labelY = - offsetY
    }
  } else if (fullDataFormatter.grid.groupAxis.position === 'right') {
    labelX = - offsetX
    if (fullDataFormatter.grid.valueAxis.position === 'bottom') {
      labelY = offsetY
    } else if (fullDataFormatter.grid.valueAxis.position === 'top') {
      labelY = - offsetY
    }
  }

  const axisLabelSelection = selection
    .selectAll<SVGGElement, BaseValueAxisParams>(`g.${textClassName}`)
    .data([fullParams])
    .join('g')
    .classed(textClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, BaseValueAxisParams>(`text`)
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
        .attr('font-size', fullChartParams.styles.textSize)
        .style('fill', getColor(fullParams.labelColorType, fullChartParams))
        .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => fullDataFormatter.grid.valueAxis.label)
    })
    .attr('transform', d => `translate(0, ${gridAxesSize.height})`)
    // .attr('transform', d => `translate(${- fullParams.tickPadding + fullParams.labelOffset[0]}, ${gridAxesSize.height + fullParams.tickPadding + fullParams.labelOffset[1]})`)


}

function renderAxis ({ selection, yAxisClassName, fullParams, tickTextAlign, gridAxesSize, fullDataFormatter, fullChartParams, valueScale, textReverseTransformWithRotate, minAndMax }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yAxisClassName: string
  fullParams: BaseValueAxisParams
  tickTextAlign: TextAlign
  gridAxesSize: { width: number, height: number }
  fullDataFormatter: DataFormatterGrid,
  fullChartParams: ChartParams
  valueScale: d3.ScaleLinear<number, number>
  textReverseTransformWithRotate: string,
  minAndMax: [number, number]
}) {

  const yAxisSelection = selection
    .selectAll<SVGGElement, BaseValueAxisParams>(`g.${yAxisClassName}`)
    .data([fullParams])
    .join('g')
    .classed(yAxisClassName, true)

  const valueLength = minAndMax[1] - minAndMax[0]
  
  // const _valueScale = d3.scaleLinear()
  //   .domain([0, 150])
  //   .range([416.5, 791.349])

  // 刻度文字偏移
  let tickPadding = 0
  let textY = 0
  if (fullDataFormatter.grid.valueAxis.position === 'left') {
    tickPadding = fullParams.tickPadding
    textY = 0
  } else if (fullDataFormatter.grid.valueAxis.position === 'right') {
    tickPadding = - fullParams.tickPadding
    textY = 0
  } else if (fullDataFormatter.grid.valueAxis.position === 'bottom') {
    tickPadding = 0
    textY = fullParams.tickPadding
  } else if (fullDataFormatter.grid.valueAxis.position === 'top') {
    tickPadding = 0
    textY = - fullParams.tickPadding
  }

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
    .tickPadding(tickPadding)
  
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
    // .style('font-family', 'sans-serif')
    .attr('font-size', fullChartParams.styles.textSize)
    .style('color', getColor(fullParams.tickTextColorType, fullChartParams))
    .attr('text-anchor', tickTextAlign.textAnchor)
    .attr('dominant-baseline', tickTextAlign.dominantBaseline)
    // .attr('dy', 0)
    .attr('y', textY)
  yText.style('transform', textReverseTransformWithRotate)
  
  // 抵消掉預設的偏移
  if (fullDataFormatter.grid.valueAxis.position === 'bottom' || fullDataFormatter.grid.valueAxis.position === 'top') {
    yText.attr('dy', 0)
  }

  return yAxisSelection
}



export const createBaseValueAxis: BasePluginFn<BaseLinesContext> = (pluginName: string, {
  selection,
  computedData$,
  fullParams$,
  fullDataFormatter$,
  fullChartParams$,
  gridAxesTransform$,
  gridAxesReverseTransform$,
  gridAxesSize$,
  gridContainerPosition$,
  isSeriesSeprate$,
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
    isSeriesSeprate: isSeriesSeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return data.isSeriesSeprate
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
        .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${yAxisGClassName}`)
        .data([yAxisGClassName])
        .join('g')
        .classed(yAxisGClassName, true)
    })
  )

  combineLatest({
    containerSelection: containerSelection$,
    gridContainerPosition: gridContainerPosition$
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

  // const textReverseTransform$: Observable<string> = new Observable(subscriber => {
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
  const textReverseTransform$ = combineLatest({
    gridAxesReverseTransform: gridAxesReverseTransform$,
    gridContainerPosition: gridContainerPosition$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
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
    fullParams: fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // 必須按照順序（先抵消外層rotate，再抵消最外層scale，最後再做本身的rotate）
      return `${data.textReverseTransform} rotate(${data.fullParams.tickTextRotate}deg)`
    })
  )

  const minAndMax$: Observable<[number, number]> = new Observable(subscriber => {
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
      // const groupScaleDomainMin = data.fullDataFormatter.grid.groupAxis.scaleDomain[0] === 'auto'
      //   ? groupMin - data.fullDataFormatter.grid.groupAxis.scalePadding
      //   : data.fullDataFormatter.grid.groupAxis.scaleDomain[0] as number - data.fullDataFormatter.grid.groupAxis.scalePadding
      const groupScaleDomainMin = data.fullDataFormatter.grid.groupAxis.scaleDomain[0] - data.fullDataFormatter.grid.groupAxis.scalePadding
      const groupScaleDomainMax = data.fullDataFormatter.grid.groupAxis.scaleDomain[1] === 'max'
        ? groupMax + data.fullDataFormatter.grid.groupAxis.scalePadding
        : data.fullDataFormatter.grid.groupAxis.scaleDomain[1] as number + data.fullDataFormatter.grid.groupAxis.scalePadding
        
      const filteredData = data.computedData.map((d, i) => {
        return d.filter((_d, _i) => {
          return _i >= groupScaleDomainMin && _i <= groupScaleDomainMax
        })
      })
    
      const filteredMinAndMax = getMinAndMaxValue(filteredData.flat())
      if (filteredMinAndMax[0] === filteredMinAndMax[1]) {
        filteredMinAndMax[0] = filteredMinAndMax[1] - 1 // 避免最大及最小值相同造成無法計算scale
      }
      subscriber.next(filteredMinAndMax)
    })
  })

  const valueScale$: Observable<d3.ScaleLinear<number, number>> = new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: fullDataFormatter$,
      gridAxesSize: gridAxesSize$,
      minAndMax: minAndMax$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
    
      const valueScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
        maxValue: data.minAndMax[1],
        minValue: data.minAndMax[0],
        axisWidth: data.gridAxesSize.height,
        scaleDomain: data.fullDataFormatter.grid.valueAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.grid.valueAxis.scaleRange
      })

      subscriber.next(valueScale)
    })
  })

  const tickTextAlign$: Observable<TextAlign> = combineLatest({
    fullDataFormatter: fullDataFormatter$,
    fullParams: fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      let textAnchor: 'start' | 'middle' | 'end' = 'start'
      let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

      if (data.fullDataFormatter.grid.valueAxis.position === 'left') {
        textAnchor = 'end'
        dominantBaseline = 'middle'
      } else if (data.fullDataFormatter.grid.valueAxis.position === 'right') {
        textAnchor = 'start'
        dominantBaseline = 'middle'
      } else if (data.fullDataFormatter.grid.valueAxis.position === 'bottom') {
        textAnchor = data.fullParams.tickTextRotate
          ? 'end'
          : 'middle'
        dominantBaseline = 'hanging'
      } else if (data.fullDataFormatter.grid.valueAxis.position === 'top') {
        textAnchor = data.fullParams.tickTextRotate
          ? 'start'
          : 'middle'
        dominantBaseline = 'auto'
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
        dominantBaseline = 'auto'
      } else if (d.grid.groupAxis.position === 'top') {
        dominantBaseline = 'hanging'
      } else if (d.grid.groupAxis.position === 'left') {
        textAnchor = 'start'
      } else if (d.grid.groupAxis.position === 'right') {
        textAnchor = 'end'
      }
      if (d.grid.valueAxis.position === 'left') {
        textAnchor = 'end'
      } else if (d.grid.valueAxis.position === 'right') {
        textAnchor = 'start'
      } else if (d.grid.valueAxis.position === 'bottom') {
        dominantBaseline = 'hanging'
      } else if (d.grid.valueAxis.position === 'top') {
        dominantBaseline = 'auto'
      }
      return {
        textAnchor,
        dominantBaseline
      }
    })
  )
  

  combineLatest({
    axisSelection: axisSelection$,
    fullParams: fullParams$,
    tickTextAlign: tickTextAlign$,
    axisLabelAlign: axisLabelAlign$,
    computedData: computedData$,
    gridAxesSize: gridAxesSize$,
    fullDataFormatter: fullDataFormatter$,
    fullChartParams: fullChartParams$,
    valueScale: valueScale$,
    textReverseTransform: textReverseTransform$,
    textReverseTransformWithRotate: textReverseTransformWithRotate$,
    minAndMax: minAndMax$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    renderAxis({
      selection: data.axisSelection,
      yAxisClassName,
      fullParams: data.fullParams,
      tickTextAlign: data.tickTextAlign,
      gridAxesSize: data.gridAxesSize,
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      valueScale: data.valueScale,
      textReverseTransformWithRotate: data.textReverseTransformWithRotate,
      minAndMax: data.minAndMax
    })

    renderAxisLabel({
      selection: data.axisSelection,
      textClassName,
      fullParams: data.fullParams,
      axisLabelAlign: data.axisLabelAlign,
      gridAxesSize: data.gridAxesSize,
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      textReverseTransform: data.textReverseTransform,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}
