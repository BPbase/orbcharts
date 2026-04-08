import * as d3 from 'd3'
import {
  combineLatest,
  debounceTime,
  switchMap,
  distinctUntilChanged,
  first,
  map,
  takeUntil,
  Observable,
  Subject } from 'rxjs'
import type { ColorType, Theme } from '@orbcharts/core'
import type { BaseLayerFn } from '../types/BaseLayer'
import type {
  CategoryAxis,
  ValueAxis,
  ComputedDatumGrid,
  ContainerPositionScaled,
  ContainerSize,
  TransformData,
  ComputedData,
  GraphicStyles,
  AxisPosition
} from '../types'
import { createValueToAxisScale } from '../utils/d3Scale'
import { parseTickFormatValue } from '../utils/d3Utils'
import { getColor, getMinMaxValue, createClassName } from '../utils/orbchartsUtils'
import { gridContainerSelectionsObservable } from '../utils/gridObservables'

export interface BaseValueAxisParams {
    labelOffset: [number, number];
    labelColorType: ColorType;
    axisLineVisible: boolean;
    axisLineColorType: ColorType;
    ticks: number;
    tickFormat: string | ((text: d3.NumberValue) => string | d3.NumberValue);
    tickLineVisible: boolean;
    tickPadding: number;
    tickFullLine: boolean;
    tickFullLineDasharray: string;
    tickColorType: ColorType;
    tickTextRotate: number;
    tickTextColorType: ColorType;
}

interface BaseValueAxisContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedData<'grid'>>
  filteredMinMaxValue$: Observable<[number, number]>
  baseValueAxisParams$: Observable<BaseValueAxisParams>
  categoryAxis$: Observable<CategoryAxis>
  valueAxis$: Observable<ValueAxis>
  theme$: Observable<Theme>
  gridAxesTransform$: Observable<TransformData>
  gridAxesReverseTransform$: Observable<TransformData>
  // gridAxesSize$: Observable<{
  //   width: number;
  //   height: number;
  // }>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  gridAxesSize$: Observable<ContainerSize>
  // gridAxesContainerSize$: Observable<ContainerSize>
  isSeriesSeprate$: Observable<boolean>
  // Optional: when provided, overrides reading position from axis objects
  categoryAxisPosition$?: Observable<AxisPosition>
  valueAxisPosition$?: Observable<AxisPosition>
}

interface TextAlign {
  textAnchor: "start" | "middle" | "end"
  dominantBaseline: "middle" | "auto" | "hanging"
}

// const pluginName = 'ValueAxis'
// const containerClassName = createClassName(pluginName, 'container')
// const yAxisGClassName = createClassName(pluginName, 'yAxisG')
// const yAxisClassName = createClassName(pluginName, 'yAxis')
// const textClassName = createClassName(pluginName, 'text')
const defaultTickSize = 6

function renderAxisLabel ({ selection, textClassName, baseValueAxisParams, axisLabelAlign, gridAxesSize, categoryAxisPosition, valueAxisPosition, valueAxisLabel, theme, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  textClassName: string
  baseValueAxisParams: BaseValueAxisParams
  axisLabelAlign: TextAlign
  gridAxesSize: ContainerSize
  categoryAxisPosition: AxisPosition
  valueAxisPosition: AxisPosition
  valueAxisLabel: string
  theme: Theme
  textReverseTransform: string,
}) {
  const offsetX = baseValueAxisParams.tickPadding - baseValueAxisParams.labelOffset[0]
  const offsetY = baseValueAxisParams.tickPadding + baseValueAxisParams.labelOffset[1]
  let labelX = 0
  let labelY = 0
  if (categoryAxisPosition === 'bottom') {
    // labelY = - gridAxesSize.height - offsetY
    labelY = - offsetY
    if (valueAxisPosition === 'left') {
      labelX = - offsetX
    } else if (valueAxisPosition === 'right') {
      labelX = offsetX
    }
  } else if (categoryAxisPosition === 'top') {
    // labelY = gridAxesSize.height + offsetY
    labelY = offsetY
    if (valueAxisPosition === 'left') {
      labelX = - offsetX
    } else if (valueAxisPosition === 'right') {
      labelX = offsetX
    }
  } else if (categoryAxisPosition === 'left') {
    // labelX = gridAxesSize.width + offsetX
    labelX = offsetX
    if (valueAxisPosition === 'bottom') {
      labelY = offsetY
    } else if (valueAxisPosition === 'top') {
      labelY = - offsetY
    }
  } else if (categoryAxisPosition === 'right') {
    labelX = - offsetX
    if (valueAxisPosition === 'bottom') {
      labelY = offsetY
    } else if (valueAxisPosition === 'top') {
      labelY = - offsetY
    }
  }

  const axisLabelSelection = selection
    .selectAll<SVGGElement, BaseValueAxisParams>(`g.${textClassName}`)
    .data([baseValueAxisParams])
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
        .attr('font-size', theme.fontSize)
        .style('fill', getColor(baseValueAxisParams.labelColorType, theme))
        .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => valueAxisLabel)
    })
    .attr('transform', d => `translate(0, ${gridAxesSize.height})`)
    // .attr('transform', d => `translate(${- baseValueAxisParams.tickPadding + baseValueAxisParams.labelOffset[0]}, ${gridAxesSize.height + baseValueAxisParams.tickPadding + baseValueAxisParams.labelOffset[1]})`)


}

function renderAxis ({ selection, yAxisClassName, baseValueAxisParams, tickTextAlign, gridAxesSize, valueAxisPosition, valueScale, textReverseTransformWithRotate, theme }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yAxisClassName: string
  baseValueAxisParams: BaseValueAxisParams
  tickTextAlign: TextAlign
  gridAxesSize: ContainerSize
  valueAxisPosition: AxisPosition
  valueScale: d3.ScaleLinear<number, number>
  textReverseTransformWithRotate: string,
  theme: Theme
}) {

  const yAxisSelection = selection
    .selectAll<SVGGElement, BaseValueAxisParams>(`g.${yAxisClassName}`)
    .data([baseValueAxisParams])
    .join('g')
    .classed(yAxisClassName, true)

  // const _valueScale = d3.scaleLinear()
  //   .domain([0, 150])
  //   .range([416.5, 791.349])

  // 刻度文字偏移
  let tickPadding = 0
  let textY = 0
  if (valueAxisPosition === 'left') {
    tickPadding = baseValueAxisParams.tickPadding
    textY = 0
  } else if (valueAxisPosition === 'right') {
    tickPadding = - baseValueAxisParams.tickPadding
    textY = 0
  } else if (valueAxisPosition === 'bottom') {
    tickPadding = 0
    textY = baseValueAxisParams.tickPadding
  } else if (valueAxisPosition === 'top') {
    tickPadding = 0
    textY = - baseValueAxisParams.tickPadding
  }

  // 設定Y軸刻度
  const yAxis = d3.axisLeft(valueScale)
    .scale(valueScale)
    .ticks(baseValueAxisParams.ticks) // 刻度分段數量
    .tickFormat(d => parseTickFormatValue(d, baseValueAxisParams.tickFormat))
    .tickSize(baseValueAxisParams.tickFullLine == true
      ? -gridAxesSize.width
      : defaultTickSize)
    .tickPadding(tickPadding)
  
  const yAxisEl = yAxisSelection
    .transition()
    .duration(100)
    .ease(d3.easeLinear) // 線性的 - 當托曳或快速變動的時候比較滑順
    .call(yAxis)
  
  yAxisEl.selectAll('line')
    .style('fill', 'none')
    .style('stroke', baseValueAxisParams.tickLineVisible == true ? getColor(baseValueAxisParams.tickColorType, theme) : 'none')
    .style('stroke-dasharray', baseValueAxisParams.tickFullLineDasharray)
    .style('vector-effect', 'non-scaling-stroke') // 避免 scale 導致線條變形
    .attr('pointer-events', 'none')
  
  yAxisEl.selectAll('path')
    .style('fill', 'none')
    // .style('stroke', this.baseValueAxisParams.axisLineColor!)
    .style('stroke', baseValueAxisParams.axisLineVisible == true ? getColor(baseValueAxisParams.axisLineColorType, theme) : 'none')
    .style('shape-rendering', 'crispEdges')
  
  // const yText = yAxisEl.selectAll('text')
  const yText = yAxisSelection.selectAll('text')
    // .style('font-family', 'sans-serif')
    .attr('font-size', theme.fontSize)
    .style('color', getColor(baseValueAxisParams.tickTextColorType, theme))
    .attr('text-anchor', tickTextAlign.textAnchor)
    .attr('dominant-baseline', tickTextAlign.dominantBaseline)
    // .attr('dy', 0)
    .attr('y', textY)
    .attr('dy', 0)
  yText.style('transform', textReverseTransformWithRotate)
  
  // 抵消掉預設的偏移
  if (valueAxisPosition === 'bottom' || valueAxisPosition === 'top') {
    yText.attr('dy', 0)
  }

  return yAxisSelection
}



export const createBaseValueAxis: BaseLayerFn<BaseValueAxisContext> = ({
  selection,
  pluginName,
  layerName,
  computedData$,
  filteredMinMaxValue$,
  baseValueAxisParams$,
  categoryAxis$,
  valueAxis$,
  theme$,
  gridAxesSize$,
  gridAxesTransform$,
  gridAxesReverseTransform$,
  // gridAxesSize$,
  gridContainerPosition$,
  // gridAxesContainerSize$,
  isSeriesSeprate$,
  categoryAxisPosition$: _categoryAxisPosition$,
  valueAxisPosition$: _valueAxisPosition$,
}) => {
  
  const destroy$ = new Subject()

  // Derive effective axis positions: use provided observables if available,
  // otherwise fall back to reading from axis objects (backward compat)
  const effectiveCategoryAxisPosition$: Observable<AxisPosition> = _categoryAxisPosition$
    ?? categoryAxis$.pipe(map(ca => ((ca as any).position ?? 'bottom') as AxisPosition))

  const effectiveValueAxisPosition$: Observable<AxisPosition> = _valueAxisPosition$
    ?? valueAxis$.pipe(map(va => ((va as any).position ?? 'left') as AxisPosition))

  const containerClassName = createClassName(pluginName, layerName, 'container')
  const yAxisGClassName = createClassName(pluginName, layerName, 'yAxisG')
  const yAxisClassName = createClassName(pluginName, layerName, 'yAxis')
  const textClassName = createClassName(pluginName, layerName, 'text')

  const containerSelection$ = gridContainerSelectionsObservable({
    selection,
    pluginName,
    layerName,
    computedData$,
    gridContainerPosition$,
    isSeriesSeprate$
  })

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
  //   debounceTime(0),
  //   map(data => {
  //     return data.isSeriesSeprate
  //       // series分開的時候顯示各別axis
  //       ? data.computedData
  //       // series合併的時候只顯示第一個axis
  //       : [data.computedData[0]]
  //   }),
  //   map((computedData, i) => {
  //     return selection
  //       .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${containerClassName}`)
  //       .data(computedData, d => d[0] ? d[0].seriesIndex : i)
  //       .join('g')
  //       .classed(containerClassName, true)
  //   })
  // )

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

  // combineLatest({
  //   containerSelection: containerSelection$,
  //   gridContainerPosition: gridContainerPosition$
  // }).pipe(
  //   takeUntil(destroy$),
  //   debounceTime(0)
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

  combineLatest({
    axisSelection: axisSelection$,
    gridAxesTransform: gridAxesTransform$,
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0)
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
  //     baseValueAxisParams: baseValueAxisParams$,
  //     layout: layout$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
  //     debounceTime(0),
  //   ).subscribe(data => {

  //     const transformData = Object.assign({}, data.layout.content.axesTransformData)

  //     const value = getAxesTransformValue({
  //       translate: [0, 0],
  //       scale: [transformData.scale[0] * -1, transformData.scale[1] * -1],
  //       rotate: transformData.rotate * -1 + data.baseValueAxisParams.tickTextRotate,
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
    debounceTime(0),
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
    baseValueAxisParams: baseValueAxisParams$,
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(data => {
      // 必須按照順序（先抵消外層rotate，再抵消最外層scale，最後再做本身的rotate）
      return `${data.textReverseTransform} rotate(${data.baseValueAxisParams.tickTextRotate}deg)`
    })
  )

  // const minMax$: Observable<[number, number]> = new Observable(subscriber => {
  //   combineLatest({
  //     fullDataFormatter: fullDataFormatter$,
  //     computedData: computedData$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     debounceTime(0),
  //   ).subscribe(data => {
  //     const groupMin = 0
  //     const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
  //     // const groupScaleDomainMin = data.fullDataFormatter.categoryAxis.scaleDomain[0] === 'auto'
  //     //   ? groupMin - data.fullDataFormatter.categoryAxis.scalePadding
  //     //   : data.fullDataFormatter.categoryAxis.scaleDomain[0] as number - data.fullDataFormatter.categoryAxis.scalePadding
  //     const groupScaleDomainMin = data.fullDataFormatter.categoryAxis.scaleDomain[0] - data.fullDataFormatter.categoryAxis.scalePadding
  //     const groupScaleDomainMax = data.fullDataFormatter.categoryAxis.scaleDomain[1] === 'max'
  //       ? groupMax + data.fullDataFormatter.categoryAxis.scalePadding
  //       : data.fullDataFormatter.categoryAxis.scaleDomain[1] as number + data.fullDataFormatter.categoryAxis.scalePadding
        
  //     const filteredData = data.computedData.map((d, i) => {
  //       return d.filter((_d, _i) => {
  //         return _i >= groupScaleDomainMin && _i <= groupScaleDomainMax
  //       })
  //     })
    
  //     const filteredMinMax = getMinMaxValue(filteredData.flat())
  //     if (filteredMinMax[0] === filteredMinMax[1]) {
  //       filteredMinMax[0] = filteredMinMax[1] - 1 // 避免最大及最小值相同造成無法計算scale
  //     }
  //     subscriber.next(filteredMinMax)
  //   })
  // })

  const valueScale$: Observable<d3.ScaleLinear<number, number>> = new Observable(subscriber => {
    combineLatest({
      valueAxis: valueAxis$,
      gridAxesSize: gridAxesSize$,
      // minMax: minMax$
      filteredMinMaxValue: filteredMinMaxValue$
    }).pipe(
      takeUntil(destroy$),
      debounceTime(0),
    ).subscribe(data => {
      let maxValue = data.filteredMinMaxValue[1]
      let minValue = data.filteredMinMaxValue[0]
      if (maxValue === minValue && maxValue === 0) {
        // 避免最大及最小值同等於 0 造成無法計算scale
        maxValue = 1
      }
    
      const valueScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
        maxValue,
        minValue,
        axisWidth: data.gridAxesSize.height,
        scaleDomain: data.valueAxis.scaleDomain,
        scaleRange: data.valueAxis.scaleRange
      })

      subscriber.next(valueScale)
    })
  })

  const tickTextAlign$: Observable<TextAlign> = combineLatest({
    valueAxisPosition: effectiveValueAxisPosition$,
    baseValueAxisParams: baseValueAxisParams$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(data => {
      let textAnchor: 'start' | 'middle' | 'end' = 'start'
      let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

      if (data.valueAxisPosition === 'left') {
        textAnchor = 'end'
        dominantBaseline = 'middle'
      } else if (data.valueAxisPosition === 'right') {
        textAnchor = 'start'
        dominantBaseline = 'middle'
      } else if (data.valueAxisPosition === 'bottom') {
        textAnchor = data.baseValueAxisParams.tickTextRotate
          ? 'end'
          : 'middle'
        dominantBaseline = 'hanging'
      } else if (data.valueAxisPosition === 'top') {
        textAnchor = data.baseValueAxisParams.tickTextRotate
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

  const axisLabelAlign$: Observable<TextAlign> = combineLatest({
    categoryAxisPosition: effectiveCategoryAxisPosition$,
    valueAxisPosition: effectiveValueAxisPosition$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(d => {
      let textAnchor: 'start' | 'middle' | 'end' = 'start'
      let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

      if (d.categoryAxisPosition === 'bottom') {
        dominantBaseline = 'auto'
      } else if (d.categoryAxisPosition === 'top') {
        dominantBaseline = 'hanging'
      } else if (d.categoryAxisPosition === 'left') {
        textAnchor = 'start'
      } else if (d.categoryAxisPosition === 'right') {
        textAnchor = 'end'
      }
      if (d.valueAxisPosition === 'left') {
        textAnchor = 'end'
      } else if (d.valueAxisPosition === 'right') {
        textAnchor = 'start'
      } else if (d.valueAxisPosition === 'bottom') {
        dominantBaseline = 'hanging'
      } else if (d.valueAxisPosition === 'top') {
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
    baseValueAxisParams: baseValueAxisParams$,
    tickTextAlign: tickTextAlign$,
    axisLabelAlign: axisLabelAlign$,
    computedData: computedData$,
    gridAxesSize: gridAxesSize$,
    valueAxis: valueAxis$,
    categoryAxisPosition: effectiveCategoryAxisPosition$,
    valueAxisPosition: effectiveValueAxisPosition$,
    valueScale: valueScale$,
    textReverseTransform: textReverseTransform$,
    textReverseTransformWithRotate: textReverseTransformWithRotate$,
    theme: theme$
  }).pipe(
    takeUntil(destroy$),
    debounceTime(0),
  ).subscribe(data => {

    renderAxis({
      selection: data.axisSelection,
      yAxisClassName,
      baseValueAxisParams: data.baseValueAxisParams,
      tickTextAlign: data.tickTextAlign,
      gridAxesSize: data.gridAxesSize,
      valueAxisPosition: data.valueAxisPosition,
      valueScale: data.valueScale,
      textReverseTransformWithRotate: data.textReverseTransformWithRotate,
      theme: data.theme
    })

    renderAxisLabel({
      selection: data.axisSelection,
      textClassName,
      baseValueAxisParams: data.baseValueAxisParams,
      axisLabelAlign: data.axisLabelAlign,
      gridAxesSize: data.gridAxesSize,
      categoryAxisPosition: data.categoryAxisPosition,
      valueAxisPosition: data.valueAxisPosition,
      valueAxisLabel: data.valueAxis.label,
      theme: data.theme,
      textReverseTransform: data.textReverseTransform,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}
