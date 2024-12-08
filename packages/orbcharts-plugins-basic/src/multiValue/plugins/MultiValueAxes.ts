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
  createAxisLinearScale,
  getMinAndMax
} from '../../../lib/core'
import type { MultiValueAxesParams
} from '../../../lib/plugins-basic-types'
import { DEFAULT_MULTI_VALUE_AXES_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../const'
import { getColor, getDatumColor, getClassName, getUniID } from '../../utils/orbchartsUtils'
import { parseTickFormatValue } from '../../utils/d3Utils'
// import { multiValueSelectionsObservable } from '../multiValueObservables'

interface TextAlign {
  textAnchor: "start" | "middle" | "end"
  dominantBaseline: "middle" | "auto" | "hanging"
}

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

const pluginName = 'MultiValueAxis'

const defaultTickSize = 6

const tickTextAnchor = 'end'
const tickDominantBaseline = 'middle'
const axisLabelAnchor = 'end'
const axisLabelDominantBaseline = 'auto'

function renderYAxisLabel ({ selection, yLabelClassName, fullParams, layout, fullDataFormatter, fullChartParams }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yLabelClassName: string
  fullParams: MultiValueAxesParams
  // axisLabelAlign: TextAlign
  layout: { width: number, height: number }
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  // textReverseTransform: string,
}) {
  const offsetX = fullParams.yAxis.tickPadding - fullParams.yAxis.labelOffset[0]
  const offsetY = fullParams.yAxis.tickPadding + fullParams.yAxis.labelOffset[1]
  let labelX = - offsetX
  let labelY = - offsetY

  const axisLabelSelection = selection
    .selectAll<SVGGElement, MultiValueAxesParams>(`g.${yLabelClassName}`)
    .data([fullParams])
    .join('g')
    .classed(yLabelClassName, true)
    .each((d, i, g) => {
      const text = d3.select(g[i])
        .selectAll<SVGTextElement, MultiValueAxesParams>(`text`)
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
        .attr('text-anchor', tickTextAnchor)
        .attr('dominant-baseline', tickDominantBaseline)
        .attr('font-size', fullChartParams.styles.textSize)
        .style('fill', getColor(fullParams.yAxis.labelColorType, fullChartParams))
        // .style('transform', textReverseTransform)
        // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
        .attr('x', labelX)
        .attr('y', labelY)
        .text(d => fullDataFormatter.yAxis.label)
    })
    .attr('transform', d => `translate(0, ${layout.height})`)
    // .attr('transform', d => `translate(${- fullParams.tickPadding + fullParams.labelOffset[0]}, ${layout.height + fullParams.tickPadding + fullParams.labelOffset[1]})`)
}

function renderYAxis ({ selection, yAxisClassName, fullParams, layout, fullDataFormatter, fullChartParams, yScale, textReverseTransform, minAndMax }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  yAxisClassName: string
  fullParams: MultiValueAxesParams
  // tickTextAlign: TextAlign
  layout: { width: number, height: number }
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  yScale: d3.ScaleLinear<number, number>
  textReverseTransform: string,
  minAndMax: [number, number]
}) {

  const yAxisSelection = selection
    .selectAll<SVGGElement, MultiValueAxesParams>(`g.${yAxisClassName}`)
    .data([fullParams])
    .join('g')
    .classed(yAxisClassName, true)

  const valueLength = minAndMax[1] - minAndMax[0]
  
  // const _yScale = d3.scaleLinear()
  //   .domain([0, 150])
  //   .range([416.5, 791.349])

  // 刻度文字偏移
  let tickPadding = fullParams.yAxis.tickPadding
  let textY = 0

  // 設定Y軸刻度
  const yAxis = d3.axisLeft(yScale)
    .scale(yScale)
    .ticks(valueLength > fullParams.yAxis.ticks
      ? fullParams.yAxis.ticks
      : ((minAndMax[0] === 0 && minAndMax[1] === 0)
        ? 1
        : Math.ceil(valueLength))) // 刻度分段數量
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
    .attr('text-anchor', axisLabelAnchor)
    .attr('dominant-baseline', axisLabelDominantBaseline)
    // .attr('dy', 0)
    .attr('y', textY)
  yText.style('transform', textReverseTransform)
  
  // // 抵消掉預設的偏移
  // if (fullDataFormatter.grid.valueAxis.position === 'bottom' || fullDataFormatter.grid.valueAxis.position === 'top') {
  //   yText.attr('dy', 0)
  // }

  return yAxisSelection
}

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_MULTI_VALUE_AXES_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_MULTI_VALUE_AXES_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params, { validateColumns }) => {
    // const result = validateColumns(params, {
    //   labelOffset: {
    //     toBe: '[number, number]',
    //     test: (value: any) => {
    //       return Array.isArray(value)
    //         && value.length === 2
    //         && typeof value[0] === 'number'
    //         && typeof value[1] === 'number'
    //     }
    //   },
    //   labelColorType: {
    //     toBeOption: 'ColorType',
    //   },
    //   axisLineVisible: {
    //     toBeTypes: ['boolean']
    //   },
    //   axisLineColorType: {
    //     toBeOption: 'ColorType',
    //   },
    //   ticks: {
    //     toBeTypes: ['number', 'null']
    //   },
    //   tickFormat: {
    //     toBeTypes: ['string', 'Function']
    //   },
    //   tickLineVisible: {
    //     toBeTypes: ['boolean']
    //   },
    //   tickPadding: {
    //     toBeTypes: ['number']
    //   },
    //   tickFullLine: {
    //     toBeTypes: ['boolean']
    //   },
    //   tickFullLineDasharray: {
    //     toBeTypes: ['string']
    //   },
    //   tickColorType: {
    //     toBeOption: 'ColorType',
    //   },
    //   tickTextColorType: {
    //     toBeOption: 'ColorType',
    //   }
    // })
    return {
      status: 'success',
      columnName: '',
      expectToBe: ''
    }
  }
}

export const MultiValueAxis = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const containerClassName = getClassName(pluginName, 'container')
  const yAxisGClassName = getClassName(pluginName, 'yAxisG')
  const yAxisClassName = getClassName(pluginName, 'yAxis')
  const yLabelClassName = getClassName(pluginName, 'text')

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
        .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${yAxisGClassName}`)
        .data([yAxisGClassName])
        .join('g')
        .classed(yAxisGClassName, true)
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

  const minAndMax$: Observable<[number, number]> = new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: observer.fullDataFormatter$,
      computedData: observer.computedData$
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
    
      const filteredMinAndMax = getMinAndMax(filteredData.flat().map(d => d.value[1]))
      if (filteredMinAndMax[0] === filteredMinAndMax[1]) {
        filteredMinAndMax[0] = filteredMinAndMax[1] - 1 // 避免最大及最小值相同造成無法計算scale
      }
      subscriber.next(filteredMinAndMax)
    })
  })

  const yScale$: Observable<d3.ScaleLinear<number, number>> = new Observable(subscriber => {
    combineLatest({
      fullDataFormatter: observer.fullDataFormatter$,
      layout: observer.layout$,
      minAndMax: minAndMax$
    }).pipe(
      takeUntil(destroy$),
      switchMap(async (d) => d),
    ).subscribe(data => {
    
      const yScale: d3.ScaleLinear<number, number> = createAxisLinearScale({
        maxValue: data.minAndMax[1],
        minValue: data.minAndMax[0],
        axisWidth: data.layout.height,
        scaleDomain: data.fullDataFormatter.yAxis.scaleDomain,
        scaleRange: data.fullDataFormatter.yAxis.scaleRange
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
    yScale: yScale$,
    textReverseTransform: textReverseTransform$,
    minAndMax: minAndMax$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

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
      minAndMax: data.minAndMax
    })

    renderYAxisLabel({
      selection: data.axisSelection,
      yLabelClassName,
      fullParams: data.fullParams,
      // axisLabelAlign: data.axisLabelAlign,
      layout: data.layout,
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
})