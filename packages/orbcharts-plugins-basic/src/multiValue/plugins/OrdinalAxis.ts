import * as d3 from 'd3'
import {
  Observable,
  Subject,
  combineLatest,
  takeUntil,
  of,
  map,
  distinctUntilChanged,
  switchMap,
  shareReplay
} from 'rxjs'
import type {
  ContainerSize,
  ChartParams,
  ComputedDatumMultiValue,
  DataFormatterMultiValue,
  DefinePluginConfig,
  Layout
} from '../../../lib/core-types'
import type { OrdinalAxisParams } from '../../../lib/plugins-basic-types'
import {
  defineMultiValuePlugin,
} from '../../../lib/core'
import { DEFAULT_ORDINAL_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../const'
// import { createBaseXAxis } from '../../base/BaseXAxis'
import { getColor, getDatumColor, getClassName, getUniID } from '../../utils/orbchartsUtils'
import { multiValueContainerSelectionsObservable } from '../multiValueObservables'
import { renderTspansOnAxis } from '../../utils/d3Graphics'
import { parseTickFormatValue } from '../../utils/d3Utils'

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

interface TextAlign {
  textAnchor: "start" | "middle" | "end"
  dominantBaseline: "middle" | "auto" | "hanging"
}

interface ValueLabelData {
  text: string
  textArr: string[]
}

const pluginName = 'OrdinalAxis'

const defaultTickSize = 6
const xAxisLabelAnchor = 'start'
const xAxisLabelDominantBaseline = 'hanging'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_ORDINAL_AXIS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_ORDINAL_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
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
      tickTextRotate: {
        toBeTypes: ['number']
      },
      tickTextColorType: {
        toBeOption: 'ColorType',
      }
    })
    if (result.status === 'error') {
      return result
    }
    return result
  }
}

function createValueLabelData (groupLabels: string[], tickFormat: string | ((text: any) => string  | d3.NumberValue)): ValueLabelData[] {
  return groupLabels.map((_text, i) => {
    const text = parseTickFormatValue(_text, tickFormat)
    const textArr = typeof text === 'string' ? text.split('\n') : [text]
    
    return {
      text,
      textArr
    }
  })
}

function renderAxisLabel ({ selection, axisLabelClassName, fullParams, containerSize, fullDataFormatter, fullChartParams }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  axisLabelClassName: string
  fullParams: OrdinalAxisParams
  // axisLabelAlign: TextAlign
  containerSize: ContainerSize
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  // textReverseTransform: string,
}) {
  const offsetX = fullParams.tickPadding + fullParams.labelOffset[0]
    // const offsetY = fullParams.tickPadding + fullParams.labelOffset[1]
    let labelX = offsetX
    
  
    let y: number // = position === 'top' ? 0 : layout.height
    let offsetY
    // if (position === 'top') {
      y = 0
      offsetY = -fullParams.tickPadding - fullParams.labelOffset[1]
    // } else {
    //   y = containerSize.height
    //   offsetY = fullParams.tickPadding + fullParams.labelOffset[1]
    // }
  
    let labelY = offsetY
  
    const axisLabelSelection = selection
      .selectAll<SVGGElement, OrdinalAxisParams>(`g.${axisLabelClassName}`)
      .data([fullParams])
      .join('g')
      .classed(axisLabelClassName, true)
      .each((d, i, g) => {
        const text = d3.select(g[i])
          .selectAll<SVGTextElement, OrdinalAxisParams>(`text`)
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
          .style('fill', getColor(fullParams.labelColorType, fullChartParams))
          // .style('transform', textReverseTransform)
          // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
          .attr('x', labelX)
          .attr('y', labelY)
          .text(d => fullDataFormatter.xAxis.label)
      })
      .attr('transform', d => `translate(${containerSize.width}, ${y})`)
}

function renderAxis ({ selection, ordinalXAxisClassName, fullParams, containerSize, fullDataFormatter, fullChartParams, ordinalScale, ordinalScaleDomain, valueLabelData, textRotateTransform, textSizePx }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  ordinalXAxisClassName: string
  fullParams: OrdinalAxisParams
  // tickTextAlign: TextAlign
  containerSize: ContainerSize
  fullDataFormatter: DataFormatterMultiValue,
  fullChartParams: ChartParams
  ordinalScale: d3.ScaleLinear<number, number>
  ordinalScaleDomain: number[]
  // groupLabels: string[]
  valueLabelData: ValueLabelData[]
  // textReverseTransformWithRotate: string
  textRotateTransform: string
  textSizePx: number
}) {

  const textAnchor = fullParams.tickTextRotate
    ? 'start'
    : 'middle'
  const dominantBaseline = 'auto'

  const xAxisSelection = selection
    .selectAll<SVGGElement, OrdinalAxisParams>(`g.${ordinalXAxisClassName}`)
    .data([fullParams])
    .join('g')
    .classed(ordinalXAxisClassName, true)

  // 計算所有範圍內groupLabels數量（顯示所有刻度）
  const allTicksAmount = Math.floor(ordinalScaleDomain[1]) - Math.ceil(ordinalScaleDomain[0]) + 1

  // 刻度文字偏移
  let tickPadding = 0
  let textX = 0
  // if (fullDataFormatter.groupAxis.position === 'left') {
  //   tickPadding = 0
  //   textX = - fullParams.tickPadding
  // } else if (fullDataFormatter.groupAxis.position === 'right') {
  //   tickPadding = 0
  //   textX = fullParams.tickPadding
  // } else if (fullDataFormatter.groupAxis.position === 'bottom') {
  //   if (fullParams.tickFullLine == true) {
  //     tickPadding = - fullParams.tickPadding
  //   } else {
  //     tickPadding = - fullParams.tickPadding - defaultTickSize
  //   }
  //   textX = 0
  // } else if (fullDataFormatter.groupAxis.position === 'top') {
    if (fullParams.tickFullLine == true) {
      tickPadding = fullParams.tickPadding
    } else {
      tickPadding = fullParams.tickPadding - defaultTickSize
    }
    textX = - 0
  // }

  // 設定X軸刻度
  const xAxis = d3.axisTop(ordinalScale)
    .scale(ordinalScale)
    .ticks(fullParams.ticks === 'all'
      ? allTicksAmount
      : fullParams.ticks > allTicksAmount
        ? allTicksAmount // 不顯示超過groupLabels數量的刻度
        : fullParams.ticks)
    .tickSize(fullParams.tickFullLine == true
      ? - containerSize.height
      : defaultTickSize)
    .tickSizeOuter(0)
    .tickFormat((valueIndex: number, i) => {
      // 用index對應到groupLabel
      // const groupLabel = groupLabels[valueIndex ] ?? '' // 非整數index不顯示
      // return parseTickFormatValue(groupLabel, fullParams.tickFormat)
      return valueLabelData[valueIndex]?.text ?? ''
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
        .each((valueIndex: number, i, n) => {
          // const groupLabel = groupLabels[valueIndex ] ?? '' // 非整數index不顯示
          // const groupLabelText = parseTickFormatValue(groupLabel, fullParams.tickFormat)
          // console.log(valueIndex)
          const textArr = valueLabelData[valueIndex]?.textArr ?? []
          // 將原本單行文字改為多行文字
          renderTspansOnAxis(d3.select(n[i]), {
            textArr,
            textSizePx,
            groupAxisPosition: 'top',
            isContainerRotated: true
          })
        })
    })

  xAxisEl.selectAll('line')
    .style('fill', 'none')
    .style('stroke', fullParams.tickLineVisible == true ? getColor(fullParams.tickColorType, fullChartParams) : 'none')
    .style('stroke-dasharray', fullParams.tickFullLineDasharray)
    .style('vector-effect', 'non-scaling-stroke') // 避免 scale 導致線條變形
    .attr('pointer-events', 'none')

  xAxisEl.selectAll('path')
    .style('fill', 'none')
    .style('stroke', fullParams.axisLineVisible == true ? getColor(fullParams.axisLineColorType, fullChartParams) : 'none')
    .style('shape-rendering', 'crispEdges')

  const xText = xAxisSelection.selectAll<SVGTextElement, OrdinalAxisParams>('text')
    // .style('font-family', 'sans-serif')
    .attr('font-size', fullChartParams.styles.textSize)
    // .style('font-weight', 'bold')
    .attr('fill', getColor(fullParams.tickTextColorType, fullChartParams))
    .attr('text-anchor', textAnchor)
    .attr('dominant-baseline', dominantBaseline)
    .attr('x', textX)
    .style('transform', textRotateTransform)
  
  // 抵消掉預設的偏移
  // if (fullDataFormatter.groupAxis.position === 'left' || fullDataFormatter.groupAxis.position === 'right') {
    xText.attr('dy', 0)
  // }
    
  return xAxisSelection
}


function renderClipPath ({ defsSelection, clipPathData }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  clipPathData: ClipPathDatum[]
  // textReverseTransform: string
}) {
  const clipPath = defsSelection
    .selectAll<SVGClipPathElement, Layout>('clipPath')
    .data(clipPathData)
    .join(
      enter => {
        return enter
          .append('clipPath')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('id', d => d.id)
    // .attr('transform', textReverseTransform)
    .each((d, i, g) => {
      const rect = d3.select(g[i])
        .selectAll<SVGRectElement, typeof d>('rect')
        .data([d])
        .join(
          enter => {
            return enter
              .append('rect')
          },
          update => update,
          exit => exit.remove()
        )
        .attr('x', _d => - _d.width)
        .attr('y', 0)
        .attr('width', _d => _d.width * 2)
        .attr('height', _d => _d.height)
    })
}

export const OrdinalAxis = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const xAxisGClassName = getClassName(pluginName, 'xAxisG')
  const ordinalXAxisClassName = getClassName(pluginName, 'axis')
  const axisLabelClassName = getClassName(pluginName, 'axis-label')
  const clipPathID = getUniID(pluginName, 'clipPath-box')

  const containerSelection$ = multiValueContainerSelectionsObservable({
    selection,
    pluginName,
    clipPathID: null,
    computedData$: observer.computedData$,
    containerPosition$: observer.containerPosition$,
    isCategorySeprate$: observer.isCategorySeprate$,
  }).pipe(
    takeUntil(destroy$),
  )

  observer.containerSize$.subscribe(data => {
    const defsSelection = selection.selectAll<SVGDefsElement, any>('defs')
      .data([clipPathID])
      .join('defs')
    const clipPathData = [{
      id: clipPathID,
      width: data.width,
      height: data.height
    }]
    renderClipPath({
      defsSelection: defsSelection,
      clipPathData,
      // textReverseTransform: data.textReverseTransform
    })
  })

  const axisSelection$ = containerSelection$.pipe(
      takeUntil(destroy$),
      map((containerSelection, i) => {
        return containerSelection
          .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${xAxisGClassName}`)
          .data([xAxisGClassName])
          .join('g')
          .classed(xAxisGClassName, true)
      })
    )

  const valueLabelData$ = combineLatest({
    // valueLabels: observer.valueLabels$,
    computedData: observer.computedData$,
    fullParams: observer.fullParams$,
    fullDataFormatter: observer.fullDataFormatter$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const valueLabels = data.computedData[0] && data.computedData[0][0] && data.computedData[0][0].value.length
        ? data.computedData[0][0].value.map((d, i) => data.fullDataFormatter.valueLabels[i] ?? String(i))
        : []
      return createValueLabelData(valueLabels, data.fullParams.tickFormat)
    }),
    // distinctUntilChanged(),
    shareReplay(1)
  )

  // const tickTextAlign$: Observable<TextAlign> = observer.fullParams$.pipe(
  //   takeUntil(destroy$),
  //   map(data => {
  //     let textAnchor: 'start' | 'middle' | 'end' = 'middle'
  //     let dominantBaseline: 'auto' | 'middle' | 'hanging' = 'hanging'

  //     textAnchor = data.tickTextRotate
  //       ? 'start'
  //       : 'middle'
  //     dominantBaseline = 'auto'

  //     return {
  //       textAnchor,
  //       dominantBaseline
  //     }
  //   })
  // )

  const ordinalScaleDomain$ = combineLatest({
    valueLabelData: valueLabelData$,
    fullDataFormatter: observer.fullDataFormatter$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const groupMin = - 0.5
      const groupMax = data.valueLabelData.length - 0.5
      // const groupScaleDomainMin = data.fullDataFormatter.groupAxis.scaleDomain[0] === 'auto'
      //   ? groupMin - data.fullDataFormatter.groupAxis.scalePadding
      //   : data.fullDataFormatter.groupAxis.scaleDomain[0] as number - data.fullDataFormatter.groupAxis.scalePadding
      const groupScaleDomainMin = data.fullDataFormatter.xAxis.scaleDomain[0] === 'min' || data.fullDataFormatter.xAxis.scaleDomain[0] === 'auto'
        ? groupMin
        : data.fullDataFormatter.xAxis.scaleDomain[0] as number
      const groupScaleDomainMax = data.fullDataFormatter.xAxis.scaleDomain[1] === 'max' || data.fullDataFormatter.xAxis.scaleDomain[1] === 'auto'
        ? groupMax
        : data.fullDataFormatter.xAxis.scaleDomain[1] as number

      return [groupScaleDomainMin, groupScaleDomainMax]
    }),
    shareReplay(1)
  )

  const textRotateTransform$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(data => {
      return data.tickTextRotate
        ? `rotate(${data.tickTextRotate})`
        : ''
    })
  )

  combineLatest({
    axisSelection: axisSelection$,
    fullParams: observer.fullParams$,
    // tickTextAlign: tickTextAlign$,
    // axisLabelAlign: axisLabelAlign$,
    containerSize: observer.containerSize$,
    fullDataFormatter: observer.fullDataFormatter$,
    fullChartParams: observer.fullChartParams$,
    ordinalScale: observer.ordinalScale$,
    ordinalScaleDomain: ordinalScaleDomain$,
    // groupLabels: groupLabels$,
    valueLabelData: valueLabelData$,
    // textReverseTransform: textReverseTransform$,
    // textReverseTransformWithRotate: textReverseTransformWithRotate$,
    textRotateTransform: textRotateTransform$,
    textSizePx: observer.textSizePx$
    // tickTextFormatter: tickTextFormatter$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    renderAxis({
      selection: data.axisSelection,
      ordinalXAxisClassName,
      fullParams: data.fullParams,
      // tickTextAlign: data.tickTextAlign,
      containerSize: data.containerSize,
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      ordinalScale: data.ordinalScale,
      ordinalScaleDomain: data.ordinalScaleDomain,
      // groupLabels: data.groupLabels,
      valueLabelData: data.valueLabelData,
      // textReverseTransformWithRotate: data.textReverseTransformWithRotate,
      textRotateTransform: data.textRotateTransform,
      textSizePx: data.textSizePx
    })

    renderAxisLabel({
      selection: data.axisSelection,
      axisLabelClassName,
      fullParams: data.fullParams,
      // axisLabelAlign: data.axisLabelAlign,
      containerSize: data.containerSize,
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      // textReverseTransform: data.textReverseTransform,
    })
  })

  return () => {
    destroy$.next(undefined)
  }
})