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
  DataFormatterMultiValue,
  DefinePluginConfig,
} from '../../../lib/core-types'
import {
  defineMultiValuePlugin,
  createValueToAxisScale,
  getMinMax
} from '../../../lib/core'
import type { XYAxesParams
} from '../../../lib/plugins-basic-types'
import { DEFAULT_X_Y_AXES_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../const'
import { getColor, getDatumColor, getClassName, getUniID } from '../../utils/orbchartsUtils'
import { parseTickFormatValue } from '../../utils/d3Utils'
// import { filteredMinMaxXYDataObservable } from '../../../../orbcharts-core/src/utils/multiValueObservables'
// import { multiValueSelectionsObservable } from '../multiValueObservables'

// interface TextAlign {
//   textAnchor: "start" | "middle" | "end"
//   dominantBaseline: "middle" | "auto" | "hanging"
// }

// interface Axis {
//   labelOffset: [number, number]
//   labelColorType: ColorType
//   axisLineVisible: boolean
//   axisLineColorType: ColorType
//   ticks: number | null
//   tickFormat: string | ((text: d3.NumberValue) => string)
//   tickLineVisible: boolean
//   tickPadding: number
//   tickFullLine: boolean
//   tickFullLineDasharray: string
//   tickColorType: ColorType
//   tickTextColorType: ColorType
// }

const pluginName = 'XYAxes'

const defaultTickSize = 6

const xTickTextAnchor = 'middle'
const xTickDominantBaseline = 'hanging'
const xAxisLabelAnchor = 'start'
const xAxisLabelDominantBaseline = 'hanging'
const yTickTextAnchor = 'end'
const yTickDominantBaseline = 'middle'
const yAxisLabelAnchor = 'end'
const yAxisLabelDominantBaseline = 'auto'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_X_Y_AXES_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_X_Y_AXES_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      xAxis: {
        toBeTypes: ['object']
      },
      yAxis: {
        toBeTypes: ['object']
      }
    })
    if (params.xAxis) {
      const forceResult = validateColumns(params.xAxis, {
        labelOffset: {
          toBe: '[number, number]',
          test: (value: any) => {
            return Array.isArray(value)
              && value.length === 2
              && typeof value[0] === 'number'
              && typeof value[1] === 'number'
          }
        },
        labelColorType: {
          toBeOption: 'ColorType',
        },
        axisLineVisible: {
          toBeTypes: ['boolean']
        },
        axisLineColorType: {
          toBeOption: 'ColorType',
        },
        ticks: {
          toBeTypes: ['number', 'null']
        },
        tickFormat: {
          toBeTypes: ['string', 'Function']
        },
        tickLineVisible: {
          toBeTypes: ['boolean']
        },
        tickPadding: {
          toBeTypes: ['number']
        },
        tickFullLine: {
          toBeTypes: ['boolean']
        },
        tickFullLineDasharray: {
          toBeTypes: ['string']
        },
        tickColorType: {
          toBeOption: 'ColorType',
        },
        tickTextColorType: {
          toBeOption: 'ColorType',
        }
      })
      if (forceResult.status === 'error') {
        return forceResult
      }
    }
    if (params.yAxis) {
      const forceResult = validateColumns(params.yAxis, {
        labelOffset: {
          toBe: '[number, number]',
          test: (value: any) => {
            return Array.isArray(value)
              && value.length === 2
              && typeof value[0] === 'number'
              && typeof value[1] === 'number'
          }
        },
        labelColorType: {
          toBeOption: 'ColorType',
        },
        axisLineVisible: {
          toBeTypes: ['boolean']
        },
        axisLineColorType: {
          toBeOption: 'ColorType',
        },
        ticks: {
          toBeTypes: ['number', 'null']
        },
        tickFormat: {
          toBeTypes: ['string', 'Function']
        },
        tickLineVisible: {
          toBeTypes: ['boolean']
        },
        tickPadding: {
          toBeTypes: ['number']
        },
        tickFullLine: {
          toBeTypes: ['boolean']
        },
        tickFullLineDasharray: {
          toBeTypes: ['string']
        },
        tickColorType: {
          toBeOption: 'ColorType',
        },
        tickTextColorType: {
          toBeOption: 'ColorType',
        }
      })
      if (forceResult.status === 'error') {
        return forceResult
      }
    }
    return result
  }
}

function renderXAxisLabel ({ selection, xLabelClassName, fullParams, layout, fullDataFormatter, fullChartParams, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  xLabelClassName: string
  fullParams: XYAxesParams
  // axisLabelAlign: TextAlign
  layout: { width: number, height: number }
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  textReverseTransform: string,
}) {
  const offsetX = fullParams.xAxis.tickPadding + fullParams.xAxis.labelOffset[0]
  const offsetY = fullParams.xAxis.tickPadding + fullParams.xAxis.labelOffset[1]
  let labelX = offsetX
  let labelY = offsetY

  const axisLabelSelection = selection
    .selectAll<SVGGElement, XYAxesParams>(`g.${xLabelClassName}`)
    .data([fullParams])
    .join('g')
    .classed(xLabelClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, XYAxesParams>(`text`)
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
        .style('fill', getColor(fullParams.xAxis.labelColorType, fullChartParams))
        .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => fullDataFormatter.xAxis.label)
    })
    .attr('transform', d => `translate(${layout.width}, ${layout.height})`)
}

function renderYAxisLabel ({ selection, yLabelClassName, fullParams, layout, fullDataFormatter, fullChartParams, textReverseTransform }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yLabelClassName: string
  fullParams: XYAxesParams
  // axisLabelAlign: TextAlign
  layout: { width: number, height: number }
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  textReverseTransform: string,
}) {
  const offsetX = fullParams.yAxis.tickPadding - fullParams.yAxis.labelOffset[0]
  const offsetY = fullParams.yAxis.tickPadding + fullParams.yAxis.labelOffset[1]
  let labelX = - offsetX
  let labelY = - offsetY

  const axisLabelSelection = selection
    .selectAll<SVGGElement, XYAxesParams>(`g.${yLabelClassName}`)
    .data([fullParams])
    .join('g')
    .classed(yLabelClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, XYAxesParams>(`text`)
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
        .style('fill', getColor(fullParams.yAxis.labelColorType, fullChartParams))
        .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => fullDataFormatter.yAxis.label)
    })
    // .attr('transform', d => `translate(0, ${layout.height})`)
}

function renderXAxis ({ selection, xAxisClassName, fullParams, layout, fullDataFormatter, fullChartParams, xScale, textReverseTransform, minMaxXY }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  xAxisClassName: string
  fullParams: XYAxesParams
  // tickTextAlign: TextAlign
  layout: { width: number, height: number }
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  xScale: d3.ScaleLinear<number, number>
  textReverseTransform: string,
  minMaxXY: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }
}) {

  const xAxisSelection = selection
    .selectAll<SVGGElement, XYAxesParams>(`g.${xAxisClassName}`)
    .data([fullParams])
    .join('g')
    .classed(xAxisClassName, true)
    .attr('transform', `translate(0, ${layout.height})`)

  // const _xScale = d3.scaleLinear()
  //   .domain([0, 150])
  //   .range([416.5, 791.349])

  // 刻度文字偏移
  let tickPadding = fullParams.xAxis.tickPadding

  // 設定Y軸刻度
  const xAxis = d3.axisBottom(xScale)
    .scale(xScale)
    .ticks(fullParams.xAxis.ticks) // 刻度分段數量
    .tickFormat(d => parseTickFormatValue(d, fullParams.xAxis.tickFormat))
    .tickSize(fullParams.xAxis.tickFullLine == true
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
    .style('stroke', fullParams.xAxis.tickLineVisible == true ? getColor(fullParams.xAxis.tickColorType, fullChartParams) : 'none')
    .style('stroke-dasharray', fullParams.xAxis.tickFullLineDasharray)
    .attr('pointer-events', 'none')
  
  xAxisEl.selectAll('path')
    .style('fill', 'none')
    // .style('stroke', this.fullParams.axisLineColor!)
    .style('stroke', fullParams.xAxis.axisLineVisible == true ? getColor(fullParams.xAxis.axisLineColorType, fullChartParams) : 'none')
    .style('shape-rendering', 'crispEdges')
  
  // const xText = xAxisEl.selectAll('text')
  const xText = xAxisSelection.selectAll('text')
    // .style('font-family', 'sans-serif')
    .attr('font-size', fullChartParams.styles.textSize)
    .style('color', getColor(fullParams.xAxis.tickTextColorType, fullChartParams))
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

function renderYAxis ({ selection, yAxisClassName, fullParams, layout, fullDataFormatter, fullChartParams, yScale, textReverseTransform, minMaxXY }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yAxisClassName: string
  fullParams: XYAxesParams
  // tickTextAlign: TextAlign
  layout: { width: number, height: number }
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  yScale: d3.ScaleLinear<number, number>
  textReverseTransform: string,
  minMaxXY: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }
}) {

  const yAxisSelection = selection
    .selectAll<SVGGElement, XYAxesParams>(`g.${yAxisClassName}`)
    .data([fullParams])
    .join('g')
    .classed(yAxisClassName, true)

  // const _yScale = d3.scaleLinear()
  //   .domain([0, 150])
  //   .range([416.5, 791.349])

  // 刻度文字偏移
  let tickPadding = fullParams.yAxis.tickPadding

  // 設定Y軸刻度
  const yAxis = d3.axisLeft(yScale)
    .scale(yScale)
    .ticks(fullParams.yAxis.ticks) // 刻度分段數量
    .tickFormat(d => parseTickFormatValue(d, fullParams.yAxis.tickFormat))
    .tickSize(fullParams.yAxis.tickFullLine == true
      ? -layout.width
      : defaultTickSize)
    .tickPadding(tickPadding)
  
  const yAxisEl = yAxisSelection
    .transition()
    .duration(100)
    .call(yAxis)
  
  yAxisEl.selectAll('line')
    .style('fill', 'none')
    .style('stroke', fullParams.yAxis.tickLineVisible == true ? getColor(fullParams.yAxis.tickColorType, fullChartParams) : 'none')
    .style('stroke-dasharray', fullParams.yAxis.tickFullLineDasharray)
    .attr('pointer-events', 'none')
  
  yAxisEl.selectAll('path')
    .style('fill', 'none')
    // .style('stroke', this.fullParams.axisLineColor!)
    .style('stroke', fullParams.yAxis.axisLineVisible == true ? getColor(fullParams.yAxis.axisLineColorType, fullChartParams) : 'none')
    .style('shape-rendering', 'crispEdges')
  
  // const yText = yAxisEl.selectAll('text')
  const yText = yAxisSelection.selectAll('text')
    // .style('font-family', 'sans-serif')
    .attr('font-size', fullChartParams.styles.textSize)
    .style('color', getColor(fullParams.yAxis.tickTextColorType, fullChartParams))
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


export const XYAxes = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const containerClassName = getClassName(pluginName, 'container')
  const xyAxisGClassName = getClassName(pluginName, 'xyAxisG')
  const xAxisClassName = getClassName(pluginName, 'xAxis')
  const yAxisClassName = getClassName(pluginName, 'yAxis')
  const xLabelClassName = getClassName(pluginName, 'xLabel')
  const yLabelClassName = getClassName(pluginName, 'yLabel')

  const containerSelection$ = combineLatest({
    computedData: observer.computedData$.pipe(
      distinctUntilChanged((a, b) => {
        // 只有當series的數量改變時，才重新計算
        return a.length === b.length
      }),
    ),
    isCategorySeprate: observer.isCategorySeprate$
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
        .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${xyAxisGClassName}`)
        .data([xyAxisGClassName])
        .join('g')
        .classed(xyAxisGClassName, true)
    })
  )

  combineLatest({
    containerSelection: containerSelection$,
    gridContainerPosition: observer.multiValueContainerPosition$
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

  const textReverseTransform$ = observer.multiValueContainerPosition$.pipe(
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

  // const minMax$: Observable<[number, number]> = new Observable(subscriber => {
  //   combineLatest({
  //     fullDataFormatter: observer.fullDataFormatter$,
  //     computedData: observer.computedData$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {
  //     const groupMin = 0
  //     const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
  //     // const groupScaleDomainMin = data.fullDataFormatter.grid.groupAxis.scaleDomain[0] === 'auto'
  //     //   ? groupMin - data.fullDataFormatter.grid.groupAxis.scalePadding
  //     //   : data.fullDataFormatter.grid.groupAxis.scaleDomain[0] as number - data.fullDataFormatter.grid.groupAxis.scalePadding
  //     const groupScaleDomainMin = data.fullDataFormatter.grid.groupAxis.scaleDomain[0] - data.fullDataFormatter.grid.groupAxis.scalePadding
  //     const groupScaleDomainMax = data.fullDataFormatter.grid.groupAxis.scaleDomain[1] === 'max'
  //       ? groupMax + data.fullDataFormatter.grid.groupAxis.scalePadding
  //       : data.fullDataFormatter.grid.groupAxis.scaleDomain[1] as number + data.fullDataFormatter.grid.groupAxis.scalePadding
        
  //     const filteredData = data.computedData.map((d, i) => {
  //       return d.filter((_d, _i) => {
  //         return _i >= groupScaleDomainMin && _i <= groupScaleDomainMax
  //       })
  //     })
    
  //     const filteredMinMax = getMinMax(filteredData.flat().map(d => d.value[1]))
  //     if (filteredMinMax[0] === filteredMinMax[1]) {
  //       filteredMinMax[0] = filteredMinMax[1] - 1 // 避免最大及最小值相同造成無法計算scale
  //     }
  //     subscriber.next(filteredMinMax)
  //   })
  // })

  const xScale$: Observable<d3.ScaleLinear<number, number>> = new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: observer.fullDataFormatter$,
      layout: observer.layout$,
      // minMaxXY: observer.minMaxXY$
      filteredMinMaxXYData: observer.filteredMinMaxXYData$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      if (!data.filteredMinMaxXYData.minXDatum || !data.filteredMinMaxXYData.maxXDatum
        || data.filteredMinMaxXYData.minXDatum.value[0] == null || data.filteredMinMaxXYData.maxXDatum.value[0] == null
      ) {
        return
      }
      let maxValue = data.filteredMinMaxXYData.maxXDatum.value[0]
      let minValue = data.filteredMinMaxXYData.minXDatum.value[0]
      if (maxValue === minValue && maxValue === 0) {
        // 避免最大及最小值同等於 0 造成無法計算scale
        maxValue = 1
      }

      const xScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
        maxValue,
        minValue,
        axisWidth: data.layout.width,
        scaleDomain: data.fullDataFormatter.xAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.xAxis.scaleRange,
      })

      subscriber.next(xScale)
    })
  })

  const yScale$: Observable<d3.ScaleLinear<number, number>> = new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: observer.fullDataFormatter$,
      layout: observer.layout$,
      // minMaxXY: observer.minMaxXY$
      filteredMinMaxXYData: observer.filteredMinMaxXYData$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
      if (!data.filteredMinMaxXYData.minYDatum || !data.filteredMinMaxXYData.maxYDatum
        || data.filteredMinMaxXYData.minYDatum.value[1] == null || data.filteredMinMaxXYData.maxYDatum.value[1] == null
      ) {
        return
      }
      let maxValue = data.filteredMinMaxXYData.maxYDatum.value[1]
      let minValue = data.filteredMinMaxXYData.minYDatum.value[1]
      if (maxValue === minValue && maxValue === 0) {
        // 避免最大及最小值同等於 0 造成無法計算scale
        maxValue = 1
      }

      const yScale: d3.ScaleLinear<number, number> = createValueToAxisScale({
        maxValue,
        minValue,
        axisWidth: data.layout.height,
        scaleDomain: data.fullDataFormatter.yAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.yAxis.scaleRange,
        reverse: true
      })

      subscriber.next(yScale)
    })
  })


  combineLatest({
    axisSelection: axisSelection$,
    fullParams: observer.fullParams$,
    // tickTextAlign: tickTextAlign$,
    // axisLabelAlign: axisLabelAlign$,
    computedData: observer.computedData$,
    layout: observer.layout$,
    fullDataFormatter: observer.fullDataFormatter$,
    fullChartParams: observer.fullChartParams$,
    xScale: xScale$,
    yScale: yScale$,
    textReverseTransform: textReverseTransform$,
    minMaxXY: observer.minMaxXY$
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
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      xScale: data.xScale,
      textReverseTransform: data.textReverseTransform,
      minMaxXY: data.minMaxXY
    })

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
      minMaxXY: data.minMaxXY
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
})