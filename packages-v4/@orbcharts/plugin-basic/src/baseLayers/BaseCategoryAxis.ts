import * as d3 from 'd3'
import {
  combineLatest,
  debounceTime,
  switchMap,
  distinctUntilChanged,
  of,
  first,
  map,
  takeUntil,
  shareReplay,
  Observable,
  Subject } from 'rxjs'
import type { ColorType, Theme } from '@orbcharts/core'
import type {
  ComputedData,
  ContainerPositionScaled,
  ComputedDatumGrid,
  TransformData,
  ValueAxis,
  CategoryAxis,
  GraphicStyles,
  AxisPosition,
} from '../types'
import type { BaseLayerFn } from '../types/BaseLayer'
import { parseTickFormatValue } from '../utils/d3Utils'
import { getColor, createClassName } from '../utils/orbchartsUtils'
import { renderTspansOnAxis } from '../utils/d3Graphics'

export interface BaseCategoryAxisParams {
    labelOffset: [number, number];
    labelColorType: ColorType;
    axisLineVisible: boolean;
    axisLineColorType: ColorType;
    ticks: number | null | 'all';
    tickFormat: string | ((text: any) => string | d3.NumberValue);
    tickLineVisible: boolean;
    tickPadding: number;
    tickFullLine: boolean;
    tickFullLineDasharray: string;
    tickColorType: ColorType;
    tickTextRotate: number;
    tickTextColorType: ColorType;
}

interface BaseCategoryAxisContext {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  layerName: string
  computedData$: Observable<ComputedData<'grid'>>
  baseCategoryAxisParams$: Observable<BaseCategoryAxisParams>
  categoryAxis$: Observable<CategoryAxis>
  valueAxis$: Observable<ValueAxis>
  theme$: Observable<Theme>
  styles$: Observable<GraphicStyles>
  gridAxesTransform$: Observable<TransformData>
  gridAxesReverseTransform$: Observable<TransformData>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  isSeriesSeprate$: Observable<boolean>
  fontSizePx$: Observable<number>
  // Optional: when provided, overrides reading position from axis objects
  categoryAxisPosition$?: Observable<AxisPosition>
  // valueAxisPosition$?: Observable<AxisPosition>
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
// const containerClassName = createClassName(pluginName, 'container')
// const xAxisGClassName = createClassName(pluginName, 'xAxisG')
// const xAxisClassName = createClassName(pluginName, 'xAxis')
// const categoryLabelClassName = createClassName(pluginName, 'categoryLabel')
const defaultTickSize = 6

function createGroupLabelData (categoryLabels: string[], tickFormat: string | ((text: any) => string  | d3.NumberValue)): GroupLabelData[] {
  return categoryLabels.map((_text, i) => {
    const text = parseTickFormatValue(_text, tickFormat)
    const textArr = typeof text === 'string' ? text.split('\n') : [text]
    
    return {
      text,
      textArr
    }
  })
}

function renderAxisLabel ({ selection, categoryLabelClassName, baseCategoryAxisParams, axisLabelAlign, gridAxesSize, categoryAxisPosition, categoryAxisLabel, styles, theme, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  categoryLabelClassName: string
  baseCategoryAxisParams: BaseCategoryAxisParams
  axisLabelAlign: TextAlign
  gridAxesSize: { width: number, height: number }
  categoryAxisPosition: AxisPosition
  categoryAxisLabel: string
  styles: GraphicStyles
  theme: Theme
  textReverseTransform: string
}) {
  
  const offsetX = baseCategoryAxisParams.tickPadding + baseCategoryAxisParams.labelOffset[0]
  const offsetY = baseCategoryAxisParams.tickPadding + baseCategoryAxisParams.labelOffset[1]
  let labelX = 0
  let labelY = 0
  if (categoryAxisPosition === 'bottom') {
    labelY = offsetY
    labelX = offsetX
  } else if (categoryAxisPosition === 'top') {
    labelY = - offsetY
    labelX = offsetX
  } else if (categoryAxisPosition === 'left') {
    labelX = - offsetX
    labelY = - offsetY
  } else if (categoryAxisPosition === 'right') {
    labelX = offsetX
    labelY = - offsetY
  }

  const axisLabelSelection = selection
    .selectAll<SVGGElement, BaseCategoryAxisParams>(`g.${categoryLabelClassName}`)
    .data([baseCategoryAxisParams])
    .join('g')
    .classed(categoryLabelClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, BaseCategoryAxisParams>('text')
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
        .style('fill', getColor(baseCategoryAxisParams.labelColorType, theme))
        .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => categoryAxisLabel)
    })
    .attr('transform', d => `translate(${gridAxesSize.width}, 0)`)
    // .attr('transform', d => `translate(${gridAxesSize.width + d.tickPadding + baseCategoryAxisParams.labelOffset[0]}, ${- d.tickPadding - baseCategoryAxisParams.labelOffset[1]})`)

}

function renderAxis ({ selection, xAxisClassName, baseCategoryAxisParams, tickTextAlign, gridAxesSize, categoryAxisPosition, categoryScale, categoryScaleDomain, categoryLabelData, textReverseTransformWithRotate, theme, fontSizePx }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  xAxisClassName: string
  baseCategoryAxisParams: BaseCategoryAxisParams
  tickTextAlign: TextAlign
  gridAxesSize: { width: number, height: number }
  categoryAxisPosition: AxisPosition
  categoryScale: d3.ScaleLinear<number, number>
  categoryScaleDomain: number[]
  categoryLabelData: GroupLabelData[]
  textReverseTransformWithRotate: string
  theme: Theme
  fontSizePx: number
}) {

  const xAxisSelection = selection
    .selectAll<SVGGElement, BaseCategoryAxisParams>(`g.${xAxisClassName}`)
    .data([baseCategoryAxisParams])
    .join('g')
    .classed(xAxisClassName, true)

  // 計算所有範圍內categoryLabels數量（顯示所有刻度）
  const allTicksAmount = Math.floor(categoryScaleDomain[1]) - Math.ceil(categoryScaleDomain[0]) + 1

  // 刻度文字偏移
  let tickPadding = 0
  let textX = 0
  if (categoryAxisPosition === 'left') {
    tickPadding = 0
    textX = - baseCategoryAxisParams.tickPadding
  } else if (categoryAxisPosition === 'right') {
    tickPadding = 0
    textX = baseCategoryAxisParams.tickPadding
  } else if (categoryAxisPosition === 'bottom') {
    if (baseCategoryAxisParams.tickFullLine == true) {
      tickPadding = - baseCategoryAxisParams.tickPadding
    } else {
      tickPadding = - baseCategoryAxisParams.tickPadding - defaultTickSize
    }
    textX = 0
  } else if (categoryAxisPosition === 'top') {
    if (baseCategoryAxisParams.tickFullLine == true) {
      tickPadding = baseCategoryAxisParams.tickPadding
    } else {
      tickPadding = baseCategoryAxisParams.tickPadding - defaultTickSize
    }
    textX = - 0
  }

  // 設定X軸刻度
  const xAxis = d3.axisTop(categoryScale)
    .scale(categoryScale)
    .ticks(baseCategoryAxisParams.ticks === 'all'
      ? allTicksAmount
      : baseCategoryAxisParams.ticks > allTicksAmount
        ? allTicksAmount // 不顯示超過categoryLabels數量的刻度
        : baseCategoryAxisParams.ticks)
    .tickSize(baseCategoryAxisParams.tickFullLine == true
      ? - gridAxesSize.height
      : defaultTickSize)
    .tickSizeOuter(0)
    .tickFormat((categoryIndex: number) => {
      // 用index對應到categoryLabel
      // const categoryLabel = categoryLabels[categoryIndex] ?? '' // 非整數index不顯示
      // return parseTickFormatValue(categoryLabel, baseCategoryAxisParams.tickFormat)
      return categoryLabelData[categoryIndex]?.text ?? ''
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
        .each((categoryIndex: number, i, n) => {
          // const categoryLabel = categoryLabels[categoryIndex] ?? '' // 非整數index不顯示
          // const categoryLabelText = parseTickFormatValue(categoryLabel, baseCategoryAxisParams.tickFormat)
          const textArr = categoryLabelData[categoryIndex]?.textArr ?? []

          // 將原本單行文字改為多行文字
          renderTspansOnAxis(d3.select(n[i]), {
            textArr,
            textSizePx: fontSizePx,
            categoryAxisPosition: categoryAxisPosition,
            isContainerRotated: true
          })
        })
    })

  xAxisEl.selectAll('line')
    .style('fill', 'none')
    .style('stroke', baseCategoryAxisParams.tickLineVisible == true ? getColor(baseCategoryAxisParams.tickColorType, theme) : 'none')
    .style('stroke-dasharray', baseCategoryAxisParams.tickFullLineDasharray)
    .style('vector-effect', 'non-scaling-stroke') // 避免 scale 導致線條變形
    .attr('pointer-events', 'none')

  xAxisEl.selectAll('path')
    .style('fill', 'none')
    .style('stroke', baseCategoryAxisParams.axisLineVisible == true ? getColor(baseCategoryAxisParams.axisLineColorType, theme) : 'none')
    .style('shape-rendering', 'crispEdges')

  const xText = xAxisSelection.selectAll<SVGTextElement, BaseCategoryAxisParams>('text')
    // .style('font-family', 'sans-serif')
    .attr('font-size', theme.fontSize)
    // .style('font-weight', 'bold')
    .attr('fill', getColor(baseCategoryAxisParams.tickTextColorType, theme))
    .attr('text-anchor', tickTextAlign.textAnchor)
    .attr('dominant-baseline', tickTextAlign.dominantBaseline)
    .attr('x', textX)
    .style('transform', textReverseTransformWithRotate)
  
  // 抵消掉預設的偏移
  // if (fullDataFormatter.categoryAxis.position === 'left' || fullDataFormatter.categoryAxis.position === 'right') {
    xText.attr('dy', 0)
  // }
    
  return xAxisSelection
}


export const createBaseCategoryAxis: BaseLayerFn<BaseCategoryAxisContext> = (({
  selection,
  pluginName,
  layerName,
  computedData$,
  baseCategoryAxisParams$,
  categoryAxis$,
  valueAxis$,
  theme$,
  styles$,
  gridAxesTransform$,
  gridAxesReverseTransform$,
  gridAxesSize$,
  gridContainerPosition$,
  isSeriesSeprate$,
  fontSizePx$,
  categoryAxisPosition$: _categoryAxisPosition$,
  // valueAxisPosition$: _valueAxisPosition$,
}) => {
  
  const destroy$ = new Subject()

  // Derive effective axis positions: use provided observables if available,
  // otherwise fall back to reading from axis objects (backward compat)
  const effectiveCategoryAxisPosition$: Observable<AxisPosition> = _categoryAxisPosition$
    ?? categoryAxis$.pipe(map(ca => ((ca as any).position ?? 'bottom') as AxisPosition))

  // const effectiveValueAxisPosition$: Observable<AxisPosition> = _valueAxisPosition$
  //   ?? valueAxis$.pipe(map(va => ((va as any).position ?? 'left') as AxisPosition))

  const containerClassName = createClassName(pluginName, layerName, 'container')
  const xAxisGClassName = createClassName(pluginName, layerName, 'xAxisG')
  const xAxisClassName = createClassName(pluginName, layerName, 'xAxis')
  const categoryLabelClassName = createClassName(pluginName, layerName, 'categoryLabel')

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
    debounceTime(0)
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

    
  // const tickTextFormatter$ = fullDataFormatter$
  //   .pipe(
  //     map(d => {
  //       return d.seriesDirection === 'row' ? d.columnLabelFormat : d.rowLabelFormat
  //     })
  //   )

  // const textReverseTransform$: Observable<string> = new Observable(subscriber => {
  //   combineLatest({
  //     params: baseCategoryAxisParams$,
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
    baseCategoryAxisParams: baseCategoryAxisParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // 必須按照順序（先抵消外層rotate，再抵消最外層scale，最後再做本身的rotate）
      return `${data.textReverseTransform} rotate(${data.baseCategoryAxisParams.tickTextRotate}deg)`
    })
  )

  // 使用pointScale計算非連續性比例尺
  // const categoryScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
  //   combineLatest({
  //     fullDataFormatter: fullDataFormatter$,
  //     gridAxesSize: gridAxesSize$,
  //     computedData: computedData$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {
  //     const categoryMin = 0
  //     const categoryMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
  //     const categoryScaleDomainMin = data.fullDataFormatter.categoryAxis.scaleDomain[0] === 'auto'
  //       ? categoryMin - data.fullDataFormatter.categoryAxis.scalePadding
  //       : data.fullDataFormatter.categoryAxis.scaleDomain[0] as number - data.fullDataFormatter.categoryAxis.scalePadding
  //     const categoryScaleDomainMax = data.fullDataFormatter.categoryAxis.scaleDomain[1] === 'auto'
  //       ? categoryMax + data.fullDataFormatter.categoryAxis.scalePadding
  //       : data.fullDataFormatter.categoryAxis.scaleDomain[1] as number + data.fullDataFormatter.categoryAxis.scalePadding
      
  //     const categoryLength = data.computedData[0]
  //       ? data.computedData[0].length
  //       : 0

  //     let _labels = (data.computedData[0] ?? []).map(d => d.categoryLabel)

  //     const axisLabels = new Array(categoryLength).fill(0)
  //       .map((d, i) => {
  //         return _labels[i] != null
  //           ? _labels[i]
  //           : String(i) // 沒有label則用序列號填充
  //       })
  //       .filter((d, i) => {
  //         return i >= categoryScaleDomainMin && i <= categoryScaleDomainMax
  //       })

      
  //     const padding = data.fullDataFormatter.categoryAxis.scalePadding
      
  //     const categoryScale = createLabelToAxisScale({
  //       axisLabels,
  //       axisWidth: data.gridAxesSize.width,
  //       padding
  //     })

  //     subscriber.next(categoryScale)
  //   })
  // })

  const categoryScaleDomain$ = combineLatest({
    categoryAxis: categoryAxis$,
    valueAxis: valueAxis$,
    gridAxesSize: gridAxesSize$,
    computedData: computedData$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const categoryMin = 0
      const categoryMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
      // const categoryScaleDomainMin = data.fullDataFormatter.categoryAxis.scaleDomain[0] === 'auto'
      //   ? categoryMin - data.fullDataFormatter.categoryAxis.scalePadding
      //   : data.fullDataFormatter.categoryAxis.scaleDomain[0] as number - data.fullDataFormatter.categoryAxis.scalePadding
      const categoryScaleDomainMin = data.categoryAxis.scaleDomain[0] - data.categoryAxis.scalePadding
      const categoryScaleDomainMax = data.categoryAxis.scaleDomain[1] === 'max'
        ? categoryMax + data.categoryAxis.scalePadding
        : data.categoryAxis.scaleDomain[1] as number + data.categoryAxis.scalePadding

      return [categoryScaleDomainMin, categoryScaleDomainMax]
    }),
    shareReplay(1)
  )

  const categoryScale$ = combineLatest({
    categoryScaleDomain: categoryScaleDomain$,
    gridAxesSize: gridAxesSize$,
    categoryAxis: categoryAxis$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const reverse = data.categoryAxis.reverse ?? false
      const categoryScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .domain(data.categoryScaleDomain)
        .range(reverse ? [data.gridAxesSize.width, 0] : [0, data.gridAxesSize.width])
      return categoryScale
    })
  )

  const categoryLabels$ = computedData$.pipe(
    map(computedData => (computedData[0] ?? []).map(d => d.category))
  )

  const tickTextAlign$: Observable<TextAlign> = combineLatest({
    categoryAxisPosition: effectiveCategoryAxisPosition$,
    baseCategoryAxisParams: baseCategoryAxisParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      let textAnchor: 'start' | 'middle' | 'end' = 'middle'
      let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

      if (data.categoryAxisPosition === 'bottom') {
        textAnchor = data.baseCategoryAxisParams.tickTextRotate
          ? 'end'
          : 'middle'
        dominantBaseline = 'hanging'
      } else if (data.categoryAxisPosition === 'top') {
        textAnchor = data.baseCategoryAxisParams.tickTextRotate
          ? 'start'
          : 'middle'
        dominantBaseline = 'auto'
      } else if (data.categoryAxisPosition === 'left') {
        textAnchor = 'end'
        dominantBaseline = 'middle'
      } else if (data.categoryAxisPosition === 'right') {
        textAnchor = 'start'
        dominantBaseline = 'middle'
      }
      return {
        textAnchor,
        dominantBaseline
      }
    })
  )

  const axisLabelAlign$: Observable<TextAlign> = effectiveCategoryAxisPosition$.pipe(
    takeUntil(destroy$),
    debounceTime(0),
    map(categoryAxisPosition => {
      let textAnchor: 'start' | 'middle' | 'end' = 'start'
      let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

      if (categoryAxisPosition === 'bottom') {
        textAnchor = 'start'
        dominantBaseline = 'hanging'
      } else if (categoryAxisPosition === 'top') {
        textAnchor = 'start'
        dominantBaseline = 'auto'
      } else if (categoryAxisPosition === 'left') {
        textAnchor = 'end'
        dominantBaseline = 'middle'
      } else if (categoryAxisPosition === 'right') {
        textAnchor = 'start'
        dominantBaseline = 'middle'
      }
      return {
        textAnchor,
        dominantBaseline
      }
    })
  )

  const categoryLabelData$ = combineLatest({
    categoryLabels: categoryLabels$,
    baseCategoryAxisParams: baseCategoryAxisParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return createGroupLabelData(data.categoryLabels, data.baseCategoryAxisParams.tickFormat)
    })
  )

  combineLatest({
    axisSelection: axisSelection$,
    baseCategoryAxisParams: baseCategoryAxisParams$,
    tickTextAlign: tickTextAlign$,
    axisLabelAlign: axisLabelAlign$,
    gridAxesSize: gridAxesSize$,
    categoryAxis: categoryAxis$,
    categoryAxisPosition: effectiveCategoryAxisPosition$,
    theme: theme$,
    styles: styles$,
    categoryScale: categoryScale$,
    categoryScaleDomain: categoryScaleDomain$,
    categoryLabelData: categoryLabelData$,
    textReverseTransform: textReverseTransform$,
    textReverseTransformWithRotate: textReverseTransformWithRotate$,
    fontSizePx: fontSizePx$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    renderAxis({
      selection: data.axisSelection,
      xAxisClassName,
      baseCategoryAxisParams: data.baseCategoryAxisParams,
      tickTextAlign: data.tickTextAlign,
      gridAxesSize: data.gridAxesSize,
      categoryAxisPosition: data.categoryAxisPosition,
      theme: data.theme,
      categoryScale: data.categoryScale,
      categoryScaleDomain: data.categoryScaleDomain,
      categoryLabelData: data.categoryLabelData,
      textReverseTransformWithRotate: data.textReverseTransformWithRotate,
      fontSizePx: data.fontSizePx
    })

    renderAxisLabel({
      selection: data.axisSelection,
      categoryLabelClassName,
      baseCategoryAxisParams: data.baseCategoryAxisParams,
      axisLabelAlign: data.axisLabelAlign,
      gridAxesSize: data.gridAxesSize,
      categoryAxisPosition: data.categoryAxisPosition,
      categoryAxisLabel: data.categoryAxis.label,
      theme: data.theme,
      styles: data.styles,
      textReverseTransform: data.textReverseTransform,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
})