import * as d3 from 'd3'
import {
  // of,
  iif,
  EMPTY,
  combineLatest,
  switchMap,
  map,
  filter,
  first,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Subject,
  Observable } from 'rxjs'
import {
  defineGridPlugin } from '../../../lib/core'
import type { DefinePluginConfig } from '../../../lib/core-types'
import type {
  TransformData,
  DataFormatterGrid,
  ChartParams } from '../../../lib/core-types'
import { DEFAULT_GROUP_AUX_PARAMS } from '../defaults'
import { parseTickFormatValue } from '../../utils/d3Utils'
import { measureTextWidth } from '../../utils/commonUtils'
import { getColor, getClassName, getUniID } from '../../utils/orbchartsUtils'
import { d3EventObservable } from '../../utils/observables'
import { gridGroupPositionObservable } from '../gridObservables'
import type { GroupAuxParams } from '../../../lib/plugins-basic-types'
import { gridSelectionsObservable } from '../gridObservables'
import { renderTspansOnAxis } from '../../utils/d3Graphics'
import { LAYER_INDEX_OF_AUX } from '../../const'

interface LineDatum {
  id: string
  x1: number
  x2: number
  y1: number
  y2: number
}

interface LabelDatum {
  id: string
  text: string
  textArr: string[]
  textWidth: number
  textHeight: number
  x: number
  y: number
}

const pluginName = 'GroupAux'
const labelClassName = getClassName(pluginName, 'label-box')

const rectPaddingWidth = 6
const rectPaddingHeight = 3

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_GROUP_AUX_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_GROUP_AUX_PARAMS,
  layerIndex: LAYER_INDEX_OF_AUX,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      showLine: {
        toBeTypes: ['boolean']
      },
      showLabel: {
        toBeTypes: ['boolean']
      },
      lineDashArray: {
        toBeTypes: ['string']
      },
      lineColorType: {
        toBeOption: 'ColorType'
      },
      labelColorType: {
        toBeOption: 'ColorType'
      },
      labelTextColorType: {
        toBeOption: 'ColorType'
      },
      labelTextFormat: {
        toBeTypes: ['string', 'Function']
      },
      labelPadding: {
        toBeTypes: ['number']
      },
      labelRotate: {
        toBeTypes: ['number']
      }
    })
    return result
  }
}

function createLineData ({ groupLabel, axisX, axisHeight, fullParams }: {
  groupLabel: string
  axisX: number
  axisHeight: number
  fullParams: GroupAuxParams
}): LineDatum[] {
  return fullParams.showLine && groupLabel
    ? [{
      id: groupLabel,
      x1: axisX,
      x2: axisX,
      y1: 0,
      y2: axisHeight
    }]
    : []
}

function createLabelData ({ groupLabel, axisX, fullParams, textSizePx, rowAmount }: {
  groupLabel: string
  axisX: number
  fullParams: GroupAuxParams
  textSizePx: number
  rowAmount: number
}) {
  const text = parseTickFormatValue(groupLabel, fullParams.labelTextFormat)
  const textArr = text.split('\n')
  const maxLengthText = textArr.reduce((acc, current) => current.length > acc.length ? current : acc, '')
  const textWidth = measureTextWidth(maxLengthText, textSizePx)
  const textHeight = textSizePx * textArr.length
  return fullParams.showLabel && groupLabel
    ? [{
      id: groupLabel,
      x: axisX,
      y: - fullParams.labelPadding * rowAmount, // rowAmount 是為了把外部 container 的變形逆轉回來
      text,
      textArr,
      textWidth,
      textHeight
    }]
    : []
}

function renderLine ({ selection, pluginName, lineData, fullParams, fullChartParams }: {
  selection: d3.Selection<any, string, any, unknown>
  pluginName: string
  lineData: LineDatum[]
  fullParams: GroupAuxParams
  fullChartParams: ChartParams
}) {
  const gClassName = getClassName(pluginName, 'auxline')
  const auxLineSelection = selection
    .selectAll<SVGLineElement, LineDatum>(`line.${gClassName}`)
    .data(lineData)
    .join(
      enter => {
        return enter
          .append('line')
          .classed(gClassName, true)
          .style('stroke-width', 1)
          .style('pointer-events', 'none')
          .style('vector-effect', 'non-scaling-stroke')
          .attr('x1', d => d.x1)
          .attr('y1', d => d.y1)
          .attr('x2', d => d.x2)
          .attr('y2', d => d.y2)
      },
      update => {
        const updateSelection = update
          .transition()
          .duration(50)
          .attr('x1', d => d.x1)
          .attr('y1', d => d.y1)
          .attr('x2', d => d.x2)
          .attr('y2', d => d.y2)
        return updateSelection
      },
      exit => exit.remove()
    )
    .style('stroke', d => getColor(fullParams.lineColorType, fullChartParams))
    .style('stroke-dasharray', fullParams.lineDashArray ?? 'none')

  return auxLineSelection
}

function removeLine (selection: d3.Selection<any, string, any, unknown>) {
  const update = selection
    .selectAll<SVGLineElement, LineDatum>('line')
    .data([])

  update.exit().remove()
}

function renderLabel ({ selection, labelData, fullParams, fullDataFormatter, fullChartParams, textReverseTransformWithRotate, textSizePx }: {
  selection: d3.Selection<any, string, any, unknown>
  labelData: LabelDatum[]
  fullParams: GroupAuxParams
  fullDataFormatter: DataFormatterGrid
  fullChartParams: ChartParams
  // gridAxesReverseTransformValue: string
  textReverseTransformWithRotate: string
  textSizePx: number
}) {
  // const rectHeight = textSizePx + 6

  const axisLabelSelection = selection
    .selectAll<SVGGElement, LabelDatum>(`g.${labelClassName}`)
    .data(labelData)
    .join(
      enter => {
        return enter
          .append('g')
          .classed(labelClassName, true)
          .style('cursor', 'pointer')
          .attr("transform", (d, i) => {
            return `translate(${d.x}, ${d.y})`
          })
      },
      update => {
        const updateSelection = update
          .transition()
          .duration(50)
          .attr("transform", (d, i) => {
            return `translate(${d.x}, ${d.y})`
          })
        return updateSelection
      },
      exit => exit.remove()
    )
    .each((datum, i, n) => {
      const gSelection = d3.select(n[i])

      // const rectWidth = measureTextWidth(datum.text, textSizePx) + 12
      const rectWidth = datum.textWidth + (rectPaddingWidth * 2)
      const rectHeight = datum.textHeight + (rectPaddingHeight * 2)
      // -- label偏移位置 --
      let rectX = - rectWidth / 2
      let rectY = -2
      let x = rectX
      let y = rectY - 3 // 奇怪的偏移修正
      if (fullDataFormatter.groupAxis.position === 'bottom') {
        rectX = fullParams.labelRotate
          ? - rectWidth + rectHeight // 有傾斜時以末端對齊（+height是為了修正移動太多）
          : - rectWidth / 2
        rectY = 2
        x = rectX
        y = rectY - 3 // 奇怪的偏移修正
      } else if (fullDataFormatter.groupAxis.position === 'left') {
        rectX = - rectWidth + 2
        rectY = - rectHeight / 2
        x = rectX
        y = rectY - 3 // 奇怪的偏移修正
        if (fullParams.labelRotate) {
          y += rectHeight
        }
      } else if (fullDataFormatter.groupAxis.position === 'right') {
        rectX = - 2
        rectY = - rectHeight / 2
        x = rectX
        y = rectY - 3 // 奇怪的偏移修正
        if (fullParams.labelRotate) {
          y += rectHeight
        }
      } else if (fullDataFormatter.groupAxis.position === 'top') {
        rectX = fullParams.labelRotate
          ? - rectWidth + rectHeight // 有傾斜時以末端對齊（+height是為了修正移動太多）
          : - rectWidth / 2
        rectY = - rectHeight + 6
        x = - rectHeight
        y = rectY - 3 // 奇怪的偏移修正
      }

      // -- rect --
      const rect = gSelection
        .selectAll<SVGRectElement, LabelDatum>('rect')
        .data([datum])
        .join(
          enter => enter.append('rect')
            .style('cursor', 'pointer')
            .attr('rx', 5)
            .attr('ry', 5),
          update => update,
          exit => exit.remove()
        )
        .attr('width', d => `${rectWidth}px`)
        .attr('height', `${rectHeight}px`)
        .attr('fill', d => getColor(fullParams.labelColorType, fullChartParams))
        .attr('x', x)
        .attr('y', y) // 奇怪的偏移修正
        .style('transform', textReverseTransformWithRotate)

      // -- text --
      const text = gSelection
        .selectAll<SVGTextElement, LabelDatum>('text')
        .data([datum])
        .join(
          enter => enter.append('text')
            .style('dominant-baseline', 'hanging')
            .style('cursor', 'pointer'),
          update => update,
          exit => exit.remove()
        )
        .style('transform', textReverseTransformWithRotate)
        .attr('fill', d => getColor(fullParams.labelTextColorType, fullChartParams))
        .attr('font-size', fullChartParams.styles.textSize)
        .attr('x', x + rectPaddingWidth)
        .attr('y', y + rectPaddingHeight)
        .each((d, i, n) => {
          renderTspansOnAxis(d3.select(n[i]), {
            textArr: datum.textArr,
            textSizePx,
            groupAxisPosition: fullDataFormatter.groupAxis.position,
            isContainerRotated: false
          })
        })

      // -- 第二次文字寬度（因為原本計算的文字寬度有可能因為字體差異會有誤差） --
      // 取得文字寬度
      let textWidthArr: number[] = []
      text.selectAll('tspan')
        .each((d, i, n) => {
          const tspan = d3.select(n[i])
          const textNode: SVGTextElement = tspan.node() as SVGTextElement
          if (textNode && textNode.getBBox()) {
            textWidthArr.push(textNode.getBBox().width)
          }
        })
      const maxTextWidth = Math.max(...textWidthArr)
      // 依文字寬度設定矩形寬度
      rect.attr('width', maxTextWidth + rectPaddingWidth * 2)
    })

  return axisLabelSelection
}

function removeLabel (selection: d3.Selection<any, string, any, unknown>) {
  const gUpdate = selection
    .selectAll<SVGGElement, LabelDatum>(`g.${labelClassName}`)
    .data([])

  gUpdate.exit().remove()
}


export const GroupAux = defineGridPlugin(pluginConfig)(({ selection, rootSelection, name, subject, observer }) => {
  const destroy$ = new Subject()

  let isLabelMouseover = false

  const rootRectSelection: d3.Selection<SVGRectElement, any, any, any> = rootSelection
    .insert('rect', 'g')
    .classed(getClassName(pluginName, 'rect'), true)
    .attr('opacity', 0)

  // const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection
  //   .append('g')

  const { 
    seriesSelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  } = gridSelectionsObservable({
    selection,
    pluginName,
    clipPathID: 'test',
    seriesLabels$: observer.isSeriesSeprate$.pipe(
      switchMap(isSeriesSeprate => {
        return iif(
          () => isSeriesSeprate,
          observer.seriesLabels$,
          // 如果沒分開的話只取一筆
          observer.seriesLabels$.pipe(
            map(d => [d[0]])
          )
        )
      })
    ),
    gridContainerPosition$: observer.gridContainerPosition$,
    gridAxesTransform$: observer.gridAxesTransform$,
    gridGraphicTransform$: observer.gridGraphicTransform$
  })

  observer.layout$.pipe(
    takeUntil(destroy$),
  ).subscribe(d => {
    rootRectSelection
      .attr('width', d.rootWidth)
      .attr('height', d.rootHeight)
  })

  // observer.gridAxesTransform$
  //   .pipe(
  //     takeUntil(destroy$),
  //     map(d => d.value),
  //     distinctUntilChanged()
  //   ).subscribe(d => {
  //     axisSelection
  //       .style('transform', d)
  //   })

  // const visibleComputedData$ = observer.computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(data => {
  //     const visibleComputedData = data
  //       .map(d => {
  //         return d.filter(_d => {
  //           return _d.visible == true
  //         })
  //       })
  //       .filter(d => d.length)
  //     // console.log('visibleComputedData', visibleComputedData)
  //     return visibleComputedData
  //   })
  // )

  // const SeriesDataMap$ = visibleComputedData$.pipe(
  //   map(d => makeGridSeriesDataMap(d))
  // )

  // const GroupDataMap$ = visibleComputedData$.pipe(
  //   map(d => makeGridGroupDataMap(d))
  // )

  // const contentTransform$: Observable<string> = new Observable(subscriber => {
  //   combineLatest({
  //     fullParams: observer.fullParams$,
  //     gridAxesTransform: observer.gridAxesTransform$
  //   }).pipe(
  //     takeUntil(destroy$),
  //     // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
  //     switchMap(async (d) => d),
  //   ).subscribe(data => {

  //     const transformData = Object.assign({}, data.gridAxesTransform)

  //     // const value = getAxesTransformValue({
  //     //   translate: [0, 0],
  //     //   scale: [transformData.scale[0] * -1, transformData.scale[1] * -1],
  //     //   rotate: transformData.rotate * -1,
  //     //   rotateX: transformData.rotateX * -1,
  //     //   rotateY: transformData.rotateY * -1
  //     // })

  //     subscriber.next(transformData.value)
  //   })
  // })
  // const reverseTransform$: Observable<TransformData> = observer.gridAxesTransform$.pipe(
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
  // const contentTransform$ = combineLatest({
  //   fullParams: observer.fullParams$,
  //   reverseTransform: reverseTransform$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async data => {
  //     const translate = [0, 0]
  //     return `translate(${translate[0]}px, ${translate[1]}px) rotate(${data.reverseTransform.rotate}deg) rotateX(${data.reverseTransform.rotateX}deg) rotateY(${data.reverseTransform.rotateY}deg)`
  //   }),
  //   distinctUntilChanged()
  // )

  // const groupScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
  //   combineLatest({
  //     fullDataFormatter: observer.fullDataFormatter$,
  //     gridAxesSize: observer.gridAxesSize$,
  //     computedData: observer.computedData$
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

  //     let _labels = data.fullDataFormatter.seriesDirection === 'row'
  //       // ? data.fullDataFormatter.columnLabels
  //       // : data.fullDataFormatter.rowLabels
  //       ? (data.computedData[0] ?? []).map(d => d.groupLabel)
  //       : data.computedData.map(d => d[0].groupLabel)

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

  // const groupScaleDomain$ = combineLatest({
  //   fullDataFormatter: observer.fullDataFormatter$,
  //   gridAxesSize: observer.gridAxesSize$,
  //   computedData: observer.computedData$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async (d) => d),
  //   map(data => {
  //     const groupMin = 0
  //     const groupMax = data.computedData[0] ? data.computedData[0].length - 1 : 0
  //     // const groupScaleDomainMin = data.fullDataFormatter.groupAxis.scaleDomain[0] === 'auto'
  //     //   ? groupMin - data.fullDataFormatter.groupAxis.scalePadding
  //     //   : data.fullDataFormatter.groupAxis.scaleDomain[0] as number - data.fullDataFormatter.groupAxis.scalePadding
  //     const groupScaleDomainMin = data.fullDataFormatter.groupAxis.scaleDomain[0] - data.fullDataFormatter.groupAxis.scalePadding
  //     const groupScaleDomainMax = data.fullDataFormatter.groupAxis.scaleDomain[1] === 'max'
  //       ? groupMax + data.fullDataFormatter.groupAxis.scalePadding
  //       : data.fullDataFormatter.groupAxis.scaleDomain[1] as number + data.fullDataFormatter.groupAxis.scalePadding

  //     return [groupScaleDomainMin, groupScaleDomainMax]
  //   }),
  //   shareReplay(1)
  // )

  const groupScale$ = combineLatest({
    groupScaleDomainValue: observer.groupScaleDomainValue$,
    gridAxesSize: observer.gridAxesSize$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      const groupScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        .domain(data.groupScaleDomainValue)
        .range([0, data.gridAxesSize.width])
      return groupScale
    })
  )

  // // 取得事件座標的group資料
  // const gridGroupPositionFn$ = gridGroupPositionFnObservable({
  //   fullDataFormatter$: observer.fullDataFormatter$,
  //   gridAxesSize$: observer.gridAxesSize$,
  //   computedData$: observer.computedData$,
  //   fullChartParams$: observer.fullChartParams$,
  // })

  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  // combineLatest({
  //   computedData: observer.computedData$,
  //   gridAxesSize: observer.gridAxesSize$,
  //   fullParams: observer.fullParams$,
  //   fullChartParams: observer.fullChartParams$,
  //   highlightTarget: highlightTarget$,
  //   SeriesDataMap: observer.SeriesDataMap$,
  //   GroupDataMap: observer.GroupDataMap$,
  //   gridGroupPositionFn: gridGroupPositionFn$,
  //   groupScale: groupScale$,
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async (d) => d),
  // ).subscribe(data => {
    
  //   // store.selection
  //   rootSelection
  //     .on('mouseover', (event, datum) => {
  //       // event.stopPropagation()

  //       const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

  //       subject.event$.next({
  //         type: 'grid',
  //         pluginName: name,
  //         eventName: 'mouseover',
  //         highlightTarget: data.highlightTarget,
  //         datum: null,
  //         gridIndex: 0,
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         group: data.GroupDataMap.get(groupLabel) ?? [],
  //         // group: [],
  //         groupIndex,
  //         groupLabel,
  //         event,
  //         data: data.computedData
  //       })
  //     })
  //     .on('mousemove', (event, datum) => {
  //       // event.stopPropagation()

  //       const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

  //       subject.event$.next({
  //         type: 'grid',
  //         pluginName: name,
  //         eventName: 'mousemove',
  //         highlightTarget: data.highlightTarget,
  //         datum: null,
  //         gridIndex: 0,
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         group: data.GroupDataMap.get(groupLabel) ?? [],
  //         // group: [],
  //         groupIndex,
  //         groupLabel,
  //         event,
  //         data: data.computedData
  //       })
  //     })
  //     .on('mouseout', (event, datum) => {
  //       // event.stopPropagation()

  //       const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

  //       subject.event$.next({
  //         type: 'grid',
  //         pluginName: name,
  //         eventName: 'mouseout',
  //         highlightTarget: data.highlightTarget,
  //         datum: null,
  //         gridIndex: 0,
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         group: data.GroupDataMap.get(groupLabel) ?? [],
  //         // group: [],
  //         groupIndex,
  //         groupLabel,
  //         event,
  //         data: data.computedData
  //       })
  //     })
  //     .on('click', (event, datum) => {
  //       event.stopPropagation()

  //       const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

  //       subject.event$.next({
  //         type: 'grid',
  //         pluginName: name,
  //         eventName: 'click',
  //         highlightTarget: data.highlightTarget,
  //         datum: null,
  //         gridIndex: 0,
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         // group: data.GroupDataMap.get(groupLabel) ?? [],
  //         group: [],
  //         groupIndex,
  //         groupLabel,
  //         event,
  //         data: data.computedData
  //       })
  //     })

  //   // barSelection$.next(barSelection!)
  // })

  const rootMousemove$: Observable<any> = d3EventObservable(rootSelection, 'mousemove').pipe(
    takeUntil(destroy$),
  )

  // const mousemoveGroupLabel$ = combineLatest({
  //   rootMousemove: rootMousemove$,
  //   gridGroupPositionFn: gridGroupPositionFn$,
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d),
  //   map(data => {
  //     const { groupIndex, groupLabel } = data.gridGroupPositionFn(data.rootMousemove)
  //     return { groupIndex, groupLabel }
  //   }),
  //   shareReplay(1)
  // )


  const textReverseTransform$ = combineLatest({
    gridAxesReverseTransform: observer.gridAxesReverseTransform$,
    gridContainerPosition: observer.gridContainerPosition$
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
    fullParams: observer.fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // 必須按照順序（先抵消外層rotate，再抵消最外層scale，最後再做本身的rotate）
      return `${data.textReverseTransform} rotate(${data.fullParams.labelRotate}deg)`
    })
  )

  const columnAmount$ = observer.gridContainerPosition$.pipe(
    takeUntil(destroy$),
    map(gridContainerPosition => {
      const maxColumnIndex = gridContainerPosition.reduce((acc, current) => {
        return current.columnIndex > acc ? current.columnIndex : acc
      }, 0)
      return maxColumnIndex + 1
    }),
    distinctUntilChanged()
  )

  const rowAmount$ = observer.gridContainerPosition$.pipe(
    takeUntil(destroy$),
    map(gridContainerPosition => {
      const maxRowIndex = gridContainerPosition.reduce((acc, current) => {
        return current.rowIndex > acc ? current.rowIndex : acc
      }, 0)
      return maxRowIndex + 1
    }),
    distinctUntilChanged()
  )

  const gridGroupPosition$ = gridGroupPositionObservable({
    rootSelection,
    fullDataFormatter$: observer.fullDataFormatter$,
    containerSize$: observer.containerSize$,
    gridAxesContainerSize$: observer.gridAxesContainerSize$,
    computedData$: observer.computedData$,
    gridContainerPosition$: observer.gridContainerPosition$,
    layout$: observer.layout$
  }).pipe(
    takeUntil(destroy$)
  )

  combineLatest({
    axesSelection: axesSelection$,
    columnAmount: columnAmount$,
    rowAmount: rowAmount$,
    layout: observer.layout$,
    rootMousemove: rootMousemove$,
    // gridGroupPositionFn: gridGroupPositionFn$,
    gridGroupPosition: gridGroupPosition$,
    computedData: observer.computedData$,
    groupScale: groupScale$,
    gridAxesSize: observer.gridAxesSize$,
    fullParams: observer.fullParams$,
    fullDataFormatter: observer.fullDataFormatter$,
    fullChartParams: observer.fullChartParams$,
    highlightTarget: highlightTarget$,
    // gridAxesReverseTransform: observer.gridAxesReverseTransform$,
    textReverseTransformWithRotate: textReverseTransformWithRotate$,
    GroupDataMap: observer.GroupDataMap$,
    textSizePx: observer.textSizePx$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
  ).subscribe(data => {
    // // 由於event座標是基於底層的，但是container會有多欄，所以要重新計算
    // const eventData = {
    //   offsetX: data.rootMousemove.offsetX * data.columnAmount % data.layout.rootWidth,
    //   offsetY: data.rootMousemove.offsetY * data.rowAmount % data.layout.rootHeight
    // }
    // 依event的座標取得group資料
    const { groupIndex, groupLabel } = data.gridGroupPosition
    // console.log('gridGroupPosition', groupIndex, groupLabel)
    const axisX = data.groupScale(groupIndex) ?? 0
    // console.log('axisX', axisX)
    const lineData = createLineData({
      groupLabel: groupLabel,
      axisX,
      axisHeight: data.gridAxesSize.height,
      fullParams: data.fullParams,
    })
    // console.log('lineData', lineData)
    renderLine({
      // selection: axisSelection,
      selection: data.axesSelection,
      pluginName: name,
      lineData,
      fullParams: data.fullParams,
      fullChartParams: data.fullChartParams
    })
    const labelData = createLabelData({
      groupLabel: groupLabel,
      axisX,
      fullParams: data.fullParams,
      textSizePx: data.textSizePx,
      rowAmount: data.rowAmount
    })
    const labelSelection = renderLabel({
      // selection: axisSelection,
      selection: data.axesSelection,
      labelData,
      fullParams: data.fullParams,
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      // gridAxesReverseTransformValue: data.gridAxesReverseTransform.value,
      textReverseTransformWithRotate: data.textReverseTransformWithRotate,
      textSizePx: data.textSizePx,
    })

    // label的事件
    labelSelection
      .on('mouseover', (event, datum) => {
        event.stopPropagation()
        // const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

        isLabelMouseover = true

        subject.event$.next({
          type: 'grid',
          pluginName: name,
          eventName: 'mouseover',
          highlightTarget: data.highlightTarget,
          datum: null,
          gridIndex: 0,
          series: [],
          seriesIndex: -1,
          seriesLabel: '',
          group: data.GroupDataMap.get(groupLabel) ?? [],
          groupIndex,
          groupLabel,
          event,
          data: data.computedData
        })
      })
      .on('mousemove', (event, datum) => {
        event.stopPropagation()
        // const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

        subject.event$.next({
          type: 'grid',
          pluginName: name,
          eventName: 'mousemove',
          highlightTarget: data.highlightTarget,
          datum: null,
          gridIndex: 0,
          series: [],
          seriesIndex: -1,
          seriesLabel: '',
          group: data.GroupDataMap.get(groupLabel) ?? [],
          groupIndex,
          groupLabel,
          event,
          data: data.computedData
        })
      })
      .on('mouseout', (event, datum) => {
        event.stopPropagation()
        // const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

        isLabelMouseover = false

        subject.event$.next({
          type: 'grid',
          pluginName: name,
          eventName: 'mouseout',
          highlightTarget: data.highlightTarget,
          datum: null,
          gridIndex: 0,
          series: [],
          seriesIndex: -1,
          seriesLabel: '',
          group: data.GroupDataMap.get(groupLabel) ?? [],
          groupIndex,
          groupLabel,
          event,
          data: data.computedData
        })
      })
      .on('click', (event, datum) => {
        event.stopPropagation()
        // const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

        subject.event$.next({
          type: 'grid',
          pluginName: name,
          eventName: 'click',
          highlightTarget: data.highlightTarget,
          datum: null,
          gridIndex: 0,
          series: [],
          seriesIndex: -1,
          seriesLabel: '',
          group: data.GroupDataMap.get(groupLabel) ?? [],
          groupIndex,
          groupLabel,
          event,
          data: data.computedData
        })
      })

  })

  // // -- highlight（無論highlightTarget設定為何，一律依從groupLabel來顯示） --
  // combineLatest({
  //   event: subject.event$.pipe(
  //     filter(d => d.eventName === 'mouseover' || d.eventName === 'mousemove')
  //   ),
  //   computedData: observer.computedData$,
  //   groupScale: groupScale$,
  //   gridAxesSize: observer.gridAxesSize$,
  //   fullParams: observer.fullParams$,
  //   fullChartParams: observer.fullChartParams$,
  //   highlightTarget: highlightTarget$,
  //   gridAxesReverseTransform: observer.gridAxesReverseTransform$,
  //   GroupDataMap: observer.GroupDataMap$,
  //   gridGroupPositionFn: gridGroupPositionFn$,
  //   textSizePx: observer.textSizePx$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d)
  // ).subscribe(data => {
  //   // const group = data.event.eventName === 'mouseover' || data.event.eventName === 'mousemove'
  //   //   ? data.event.group
  //   //   : []
    
  //   // const groupLabel = data.event.eventName === 'mouseover' || data.event.eventName === 'mousemove'
  //   //   ? data.event.groupLabel
  //   //   : ''
  //   const axisX = data.groupScale(data.event.groupLabel) ?? 0
    
  //   const lineData = createLineData({
  //     groupLabel: data.event.groupLabel,
  //     axisX,
  //     axisHeight: data.gridAxesSize.height,
  //     fullParams: data.fullParams,
  //   })
  //   renderLine({
  //     selection: axisSelection,
  //     pluginName: name,
  //     lineData,
  //     fullParams: data.fullParams,
  //     fullChartParams: data.fullChartParams
  //   })
  //   const labelData = createLabelData({
  //     groupLabel: data.event.groupLabel,
  //     axisX,
  //     fullParams: data.fullParams
  //   })
  //   const labelSelection = renderLabel({
  //     selection: axisSelection,
  //     labelData,
  //     fullParams: data.fullParams,
  //     fullChartParams: data.fullChartParams,
  //     gridAxesReverseTransformValue: data.gridAxesReverseTransform.value,
  //     textSizePx: data.textSizePx
  //   })

  //   // label的事件
  //   labelSelection
  //     .on('mouseover', (event, datum) => {
  
  //       const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

  //       subject.event$.next({
  //         type: 'grid',
  //         pluginName: name,
  //         eventName: 'mouseover',
  //         highlightTarget: data.highlightTarget,
  //         datum: null,
  //         gridIndex: 0,
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         group: data.event.group,
  //         groupIndex,
  //         groupLabel,
  //         event,
  //         data: data.computedData
  //       })
  //     })
  //     .on('mousemove', (event, datum) => {
  //       const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

  //       subject.event$.next({
  //         type: 'grid',
  //         pluginName: name,
  //         eventName: 'mousemove',
  //         highlightTarget: data.highlightTarget,
  //         datum: null,
  //         gridIndex: 0,
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         group: data.event.group,
  //         groupIndex,
  //         groupLabel,
  //         event,
  //         data: data.computedData
  //       })
  //     })
  //     .on('mouseout', (event, datum) => {
  //       const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

  //       subject.event$.next({
  //         type: 'grid',
  //         pluginName: name,
  //         eventName: 'mouseout',
  //         highlightTarget: data.highlightTarget,
  //         datum: null,
  //         gridIndex: 0,
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         group: data.event.group,
  //         groupIndex,
  //         groupLabel,
  //         event,
  //         data: data.computedData
  //       })
  //     })
  //     .on('click', (event, datum) => {
  //       const { groupIndex, groupLabel } = data.gridGroupPositionFn(event)

  //       subject.event$.next({
  //         type: 'grid',
  //         pluginName: name,
  //         eventName: 'click',
  //         highlightTarget: data.highlightTarget,
  //         datum: null,
  //         gridIndex: 0,
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         group: data.event.group,
  //         groupIndex,
  //         groupLabel,
  //         event,
  //         data: data.computedData
  //       })
  //     })
  // })

  

  const rootRectMouseout$ = d3EventObservable(rootRectSelection, 'mouseout').pipe(
    takeUntil(destroy$),
  )

  combineLatest({
    rootRectMouseout: rootRectMouseout$,
    axesSelection: axesSelection$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    setTimeout(() => {
      // @Q@ workaround - 不知為何和 label 會有衝突，當滑鼠移動到 label 上時，會觸發 mouseout 事件
      if (isLabelMouseover == true) {
        return
      }
      
      removeLine(data.axesSelection)
      removeLabel(data.axesSelection)
    })
  })

  return () => {
    destroy$.next(undefined)
    rootRectSelection.remove()
  }
})