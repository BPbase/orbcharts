import * as d3 from 'd3'
import {
  combineLatest,
  switchMap,
  distinctUntilChanged,
  of,
  first,
  map,
  takeUntil,
  shareReplay,
  Observable,
  Subject } from 'rxjs'
import type {
  ColorType,
  ComputedDataGrid,
  ContainerPositionScaled,
  ComputedDatumGrid,
  DataFormatterGrid,
  ChartParams,
  TransformData
} from '../../lib/core-types'
import type { BaseGroupAxisParams } from '../../lib/plugins-basic-types'
import type { BasePluginFn } from './types'
import { parseTickFormatValue } from '../utils/d3Utils'
import { getColor, getClassName } from '../utils/orbchartsUtils'
import { renderTspansOnAxis } from '../utils/d3Graphics'

// export interface BaseGroupAxisParams {
//   // xLabel: string
//   // labelAnchor: 'start' | 'end'
//   labelOffset: [number, number]
//   labelColorType: ColorType
//   axisLineVisible: boolean
//   axisLineColorType: ColorType
//   ticks: number | null | 'all'
//   tickFormat: string | ((text: any) => string)
//   tickLineVisible: boolean
//   tickPadding: number
//   tickFullLine: boolean
//   tickFullLineDasharray: string
//   tickColorType: ColorType
//   // axisLineColor: string
//   // axisLabelColor: string
//   tickTextRotate: number
//   tickTextColorType: ColorType
// }

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
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  isSeriesSeprate$: Observable<boolean>
  textSizePx$: Observable<number>
}

interface TextAlign {
  textAnchor: "start" | "middle" | "end"
  dominantBaseline: "middle" | "auto" | "hanging"
}

interface GroupLabelData {
  text: string
  textArr: string[]
}

// const pluginName = 'GroupAxis'
// const containerClassName = getClassName(pluginName, 'container')
// const xAxisGClassName = getClassName(pluginName, 'xAxisG')
// const xAxisClassName = getClassName(pluginName, 'xAxis')
// const groupingLabelClassName = getClassName(pluginName, 'groupingLabel')
const defaultTickSize = 6

function createGroupLabelData (groupLabels: string[], tickFormat: string | ((text: any) => string  | d3.NumberValue)): GroupLabelData[] {
  return groupLabels.map((_text, i) => {
    const text = parseTickFormatValue(_text, tickFormat)
    const textArr = typeof text === 'string' ? text.split('\n') : [text]
    
    return {
      text,
      textArr
    }
  })
}

function renderAxisLabel ({ selection, groupingLabelClassName, fullParams, axisLabelAlign, gridAxesSize, fullDataFormatter, chartParams, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  groupingLabelClassName: string
  fullParams: BaseGroupAxisParams
  axisLabelAlign: TextAlign
  gridAxesSize: { width: number, height: number }
  fullDataFormatter: DataFormatterGrid,
  chartParams: ChartParams
  textReverseTransform: string
}) {
  
  const offsetX = fullParams.tickPadding + fullParams.labelOffset[0]
  const offsetY = fullParams.tickPadding + fullParams.labelOffset[1]
  let labelX = 0
  let labelY = 0
  if (fullDataFormatter.groupAxis.position === 'bottom') {
    labelY = offsetY
    if (fullDataFormatter.valueAxis.position === 'left') {
      labelX = offsetX
    } else if (fullDataFormatter.valueAxis.position === 'right') {
      labelX = - offsetX
    }
  } else if (fullDataFormatter.groupAxis.position === 'top') {
    labelY = - offsetY
    if (fullDataFormatter.valueAxis.position === 'left') {
      labelX = offsetX
    } else if (fullDataFormatter.valueAxis.position === 'right') {
      labelX = - offsetX
    }
  } else if (fullDataFormatter.groupAxis.position === 'left') {
    labelX = - offsetX
    if (fullDataFormatter.valueAxis.position === 'bottom') {
      labelY = - offsetY
    } else if (fullDataFormatter.valueAxis.position === 'top') {
      labelY = offsetY
    }
  } else if (fullDataFormatter.groupAxis.position === 'right') {
    labelX = offsetX
    if (fullDataFormatter.valueAxis.position === 'bottom') {
      labelY = - offsetY
    } else if (fullDataFormatter.valueAxis.position === 'top') {
      labelY = offsetY
    }
  }

  const axisLabelSelection = selection
    .selectAll<SVGGElement, BaseGroupAxisParams>(`g.${groupingLabelClassName}`)
    .data([fullParams])
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
        .attr('font-size', chartParams.styles.textSize)
        .style('fill', getColor(fullParams.labelColorType, chartParams))
        .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => fullDataFormatter.groupAxis.label)
    })
    .attr('transform', d => `translate(${gridAxesSize.width}, 0)`)
    // .attr('transform', d => `translate(${gridAxesSize.width + d.tickPadding + fullParams.labelOffset[0]}, ${- d.tickPadding - fullParams.labelOffset[1]})`)

}

function renderAxis ({ selection, xAxisClassName, fullParams, tickTextAlign, gridAxesSize, fullDataFormatter, chartParams, groupScale, groupScaleDomain, groupLabelData, textReverseTransformWithRotate, textSizePx }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  xAxisClassName: string
  fullParams: BaseGroupAxisParams
  tickTextAlign: TextAlign
  gridAxesSize: { width: number, height: number }
  fullDataFormatter: DataFormatterGrid,
  chartParams: ChartParams
  groupScale: d3.ScaleLinear<number, number>
  groupScaleDomain: number[]
  // groupLabels: string[]
  groupLabelData: GroupLabelData[]
  textReverseTransformWithRotate: string
  textSizePx: number
}) {

  const xAxisSelection = selection
    .selectAll<SVGGElement, BaseGroupAxisParams>(`g.${xAxisClassName}`)
    .data([fullParams])
    .join('g')
    .classed(xAxisClassName, true)

  // 計算所有範圍內groupLabels數量（顯示所有刻度）
  const allTicksAmount = Math.floor(groupScaleDomain[1]) - Math.ceil(groupScaleDomain[0]) + 1

  // 刻度文字偏移
  let tickPadding = 0
  let textX = 0
  if (fullDataFormatter.groupAxis.position === 'left') {
    tickPadding = 0
    textX = - fullParams.tickPadding
  } else if (fullDataFormatter.groupAxis.position === 'right') {
    tickPadding = 0
    textX = fullParams.tickPadding
  } else if (fullDataFormatter.groupAxis.position === 'bottom') {
    if (fullParams.tickFullLine == true) {
      tickPadding = - fullParams.tickPadding
    } else {
      tickPadding = - fullParams.tickPadding - defaultTickSize
    }
    textX = 0
  } else if (fullDataFormatter.groupAxis.position === 'top') {
    if (fullParams.tickFullLine == true) {
      tickPadding = fullParams.tickPadding
    } else {
      tickPadding = fullParams.tickPadding - defaultTickSize
    }
    textX = - 0
  }

  // 設定X軸刻度
  const xAxis = d3.axisTop(groupScale)
    .scale(groupScale)
    .ticks(fullParams.ticks === 'all'
      ? allTicksAmount
      : fullParams.ticks > allTicksAmount
        ? allTicksAmount // 不顯示超過groupLabels數量的刻度
        : fullParams.ticks)
    .tickSize(fullParams.tickFullLine == true
      ? - gridAxesSize.height
      : defaultTickSize)
    .tickSizeOuter(0)
    .tickFormat((groupIndex: number) => {
      // 用index對應到groupLabel
      // const groupLabel = groupLabels[groupIndex] ?? '' // 非整數index不顯示
      // return parseTickFormatValue(groupLabel, fullParams.tickFormat)
      return groupLabelData[groupIndex]?.text ?? ''
    })
    .tickPadding(tickPadding)

  const xAxisEl = xAxisSelection
    .transition()
    .duration(100)
    .ease(d3.easeLinear) // 線性的 - 當托曳或快速變動的時候比較滑順
    .call(xAxis)
    
    .on('end', (self, t) => {
      // 先等transition結束再處理文字，否則會被原本的文字覆蓋
      xAxisSelection
        .selectAll('.tick text')
        .each((groupIndex: number, i, n) => {
          // const groupLabel = groupLabels[groupIndex] ?? '' // 非整數index不顯示
          // const groupLabelText = parseTickFormatValue(groupLabel, fullParams.tickFormat)
          const textArr = groupLabelData[groupIndex]?.textArr ?? []

          // 將原本單行文字改為多行文字
          renderTspansOnAxis(d3.select(n[i]), {
            textArr,
            textSizePx,
            groupAxisPosition: fullDataFormatter.groupAxis.position,
            isContainerRotated: true
          })
        })
    })

  xAxisEl.selectAll('line')
    .style('fill', 'none')
    .style('stroke', fullParams.tickLineVisible == true ? getColor(fullParams.tickColorType, chartParams) : 'none')
    .style('stroke-dasharray', fullParams.tickFullLineDasharray)
    .style('vector-effect', 'non-scaling-stroke') // 避免 scale 導致線條變形
    .attr('pointer-events', 'none')

  xAxisEl.selectAll('path')
    .style('fill', 'none')
    .style('stroke', fullParams.axisLineVisible == true ? getColor(fullParams.axisLineColorType, chartParams) : 'none')
    .style('shape-rendering', 'crispEdges')

  const xText = xAxisSelection.selectAll<SVGTextElement, BaseGroupAxisParams>('text')
    // .style('font-family', 'sans-serif')
    .attr('font-size', chartParams.styles.textSize)
    // .style('font-weight', 'bold')
    .attr('fill', getColor(fullParams.tickTextColorType, chartParams))
    .attr('text-anchor', tickTextAlign.textAnchor)
    .attr('dominant-baseline', tickTextAlign.dominantBaseline)
    .attr('x', textX)
    .style('transform', textReverseTransformWithRotate)
  
  // 抵消掉預設的偏移
  // if (fullDataFormatter.groupAxis.position === 'left' || fullDataFormatter.groupAxis.position === 'right') {
    xText.attr('dy', 0)
  // }
    
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
  gridContainerPosition$,
  isSeriesSeprate$,
  textSizePx$,
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
        .data(computedData, d => (d && d[0]) ? d[0].seriesIndex : i)
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

    
  // const tickTextFormatter$ = fullDataFormatter$
  //   .pipe(
  //     map(d => {
  //       return d.seriesDirection === 'row' ? d.columnLabelFormat : d.rowLabelFormat
  //     })
  //   )

  // const textReverseTransform$: Observable<string> = new Observable(subscriber => {
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

  // 使用pointScale計算非連續性比例尺
  // const groupScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
  //   combineLatest({
  //     fullDataFormatter: fullDataFormatter$,
  //     gridAxesSize: gridAxesSize$,
  //     computedData: computedData$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {
  //     const groupMin = 0
  //     const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
  //     const groupScaleDomainMin = data.fullDataFormatter.groupAxis.scaleDomain[0] === 'auto'
  //       ? groupMin - data.fullDataFormatter.groupAxis.scalePadding
  //       : data.fullDataFormatter.groupAxis.scaleDomain[0] as number - data.fullDataFormatter.groupAxis.scalePadding
  //     const groupScaleDomainMax = data.fullDataFormatter.groupAxis.scaleDomain[1] === 'auto'
  //       ? groupMax + data.fullDataFormatter.groupAxis.scalePadding
  //       : data.fullDataFormatter.groupAxis.scaleDomain[1] as number + data.fullDataFormatter.groupAxis.scalePadding
      
  //     const groupingLength = data.computedData[0]
  //       ? data.computedData[0].length
  //       : 0

  //     let _labels = (data.computedData[0] ?? []).map(d => d.groupLabel)

  //     const axisLabels = new Array(groupingLength).fill(0)
  //       .map((d, i) => {
  //         return _labels[i] != null
  //           ? _labels[i]
  //           : String(i) // 沒有label則用序列號填充
  //       })
  //       .filter((d, i) => {
  //         return i >= groupScaleDomainMin && i <= groupScaleDomainMax
  //       })

      
  //     const padding = data.fullDataFormatter.groupAxis.scalePadding
      
  //     const groupScale = createLabelToAxisScale({
  //       axisLabels,
  //       axisWidth: data.gridAxesSize.width,
  //       padding
  //     })

  //     subscriber.next(groupScale)
  //   })
  // })

  const groupScaleDomain$ = combineLatest({
    fullDataFormatter: fullDataFormatter$,
    gridAxesSize: gridAxesSize$,
    computedData: computedData$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const groupMin = 0
      const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      // const groupScaleDomainMin = data.fullDataFormatter.groupAxis.scaleDomain[0] === 'auto'
      //   ? groupMin - data.fullDataFormatter.groupAxis.scalePadding
      //   : data.fullDataFormatter.groupAxis.scaleDomain[0] as number - data.fullDataFormatter.groupAxis.scalePadding
      const groupScaleDomainMin = data.fullDataFormatter.groupAxis.scaleDomain[0] - data.fullDataFormatter.groupAxis.scalePadding
      const groupScaleDomainMax = data.fullDataFormatter.groupAxis.scaleDomain[1] === 'max'
        ? groupMax + data.fullDataFormatter.groupAxis.scalePadding
        : data.fullDataFormatter.groupAxis.scaleDomain[1] as number + data.fullDataFormatter.groupAxis.scalePadding

      return [groupScaleDomainMin, groupScaleDomainMax]
    }),
    shareReplay(1)
  )

  const groupScale$ = combineLatest({
    groupScaleDomain: groupScaleDomain$,
    gridAxesSize: gridAxesSize$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const groupScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .domain(data.groupScaleDomain)
        .range([0, data.gridAxesSize.width])
      return groupScale
    })
  )

  const groupLabels$ = computedData$.pipe(
    map(computedData => (computedData[0] ?? []).map(d => d.groupLabel))
  )

  const tickTextAlign$: Observable<TextAlign> = combineLatest({
    fullDataFormatter: fullDataFormatter$,
    fullParams: fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      let textAnchor: 'start' | 'middle' | 'end' = 'middle'
      let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

      if (data.fullDataFormatter.groupAxis.position === 'bottom') {
        textAnchor = data.fullParams.tickTextRotate
          ? 'end'
          : 'middle'
        dominantBaseline = 'hanging'
      } else if (data.fullDataFormatter.groupAxis.position === 'top') {
        textAnchor = data.fullParams.tickTextRotate
          ? 'start'
          : 'middle'
        dominantBaseline = 'auto'
      } else if (data.fullDataFormatter.groupAxis.position === 'left') {
        textAnchor = 'end'
        dominantBaseline = 'middle'
      } else if (data.fullDataFormatter.groupAxis.position === 'right') {
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

      if (d.groupAxis.position === 'bottom') {
        dominantBaseline = 'hanging'
      } else if (d.groupAxis.position === 'top') {
        dominantBaseline = 'auto'
      } else if (d.groupAxis.position === 'left') {
        textAnchor = 'end'
      } else if (d.groupAxis.position === 'right') {
        textAnchor = 'start'
      }
      if (d.valueAxis.position === 'left') {
        textAnchor = 'start'
      } else if (d.valueAxis.position === 'right') {
        textAnchor = 'end'
      } else if (d.valueAxis.position === 'bottom') {
        dominantBaseline = 'auto'
      } else if (d.valueAxis.position === 'top') {
        dominantBaseline = 'hanging'
      }
      return {
        textAnchor,
        dominantBaseline
      }
    })
  )

  const groupLabelData$ = combineLatest({
    groupLabels: groupLabels$,
    fullParams: fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return createGroupLabelData(data.groupLabels, data.fullParams.tickFormat)
    })
  )

  combineLatest({
    axisSelection: axisSelection$,
    fullParams: fullParams$,
    tickTextAlign: tickTextAlign$,
    axisLabelAlign: axisLabelAlign$,
    gridAxesSize: gridAxesSize$,
    fullDataFormatter: fullDataFormatter$,
    chartParams: fullChartParams$,
    groupScale: groupScale$,
    groupScaleDomain: groupScaleDomain$,
    // groupLabels: groupLabels$,
    groupLabelData: groupLabelData$,
    textReverseTransform: textReverseTransform$,
    textReverseTransformWithRotate: textReverseTransformWithRotate$,
    textSizePx: textSizePx$
    // tickTextFormatter: tickTextFormatter$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    renderAxis({
      selection: data.axisSelection,
      xAxisClassName,
      fullParams: data.fullParams,
      tickTextAlign: data.tickTextAlign,
      gridAxesSize: data.gridAxesSize,
      fullDataFormatter: data.fullDataFormatter,
      chartParams: data.chartParams,
      groupScale: data.groupScale,
      groupScaleDomain: data.groupScaleDomain,
      // groupLabels: data.groupLabels,
      groupLabelData: data.groupLabelData,
      textReverseTransformWithRotate: data.textReverseTransformWithRotate,
      textSizePx: data.textSizePx
    })

    renderAxisLabel({
      selection: data.axisSelection,
      groupingLabelClassName,
      fullParams: data.fullParams,
      axisLabelAlign: data.axisLabelAlign,
      gridAxesSize: data.gridAxesSize,
      fullDataFormatter: data.fullDataFormatter,
      chartParams: data.chartParams,
      textReverseTransform: data.textReverseTransform,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
})