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
  defineGridPlugin } from '@orbcharts/core'
import type {
  TransformData,
  DataFormatterGrid,
  ChartParams } from '@orbcharts/core'
import { DEFAULT_GROUP_AREA_PARAMS } from '../defaults'
import { parseTickFormatValue } from '../../utils/d3Utils'
import { measureTextWidth } from '../../utils/commonUtils'
import { getColor, getClassName, getUniID } from '../../utils/orbchartsUtils'
import { d3EventObservable } from '../../utils/observables'
import { gridGroupPositionFnObservable } from '../gridObservables'
import { createAxisPointScale } from '@orbcharts/core'
import type { GroupAuxParams } from '../types'
import { gridSelectionsObservable } from '../gridObservables'

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
  x: number
  y: number
}

const pluginName = 'GroupAux'
const labelClassName = getClassName(pluginName, 'label-box')

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

function renderLine ({ selection, pluginName, lineData, fullParams, fullChartParams }: {
  selection: d3.Selection<any, unknown, any, unknown>
  pluginName: string
  lineData: LineDatum[]
  fullParams: GroupAuxParams
  fullChartParams: ChartParams
}) {
  const gClassName = getClassName(pluginName, 'auxline')
  const update = selection
    .selectAll<SVGLineElement, LineDatum>(`line.${gClassName}`)
    .data(lineData)
  const enter = update
    .enter()
    .append('line')
    .classed(gClassName, true)
    // .style('stroke', '#E4E7ED')
    .style('stroke', d => getColor(fullParams.lineColorType, fullChartParams))
    .style('stroke-width', 1)
    .style('stroke-dasharray', fullParams.lineDashArray ?? 'none')
    .style('pointer-events', 'none')
    // .attr('opacity', 0)
  const auxLineSelection = update.merge(enter)
  //   .attr('opacity', (d) => {
  //     return d.active == true ? 1 : 0
  //   })
  update.exit().remove()
  enter
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
  update
    .transition()
    .duration(50)
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)

  return auxLineSelection
}

function removeLine (selection: d3.Selection<any, unknown, any, unknown>) {
  const update = selection
    .selectAll<SVGLineElement, LineDatum>('line')
    .data([])

  update.exit().remove()
}

function createLabelData ({ groupLabel, axisX, fullParams }: {
  groupLabel: string
  axisX: number
  fullParams: GroupAuxParams
}) {
  return fullParams.showLabel && groupLabel
    ? [{
      id: groupLabel,
      x: axisX,
      y: - fullParams.labelPadding,
      text: parseTickFormatValue(groupLabel, fullParams.labelTextFormat)
    }]
    : []
}

function renderLabel ({ selection, labelData, fullParams, fullDataFormatter, fullChartParams, labelTransform, textSizePx }: {
  selection: d3.Selection<any, unknown, any, unknown>
  labelData: LabelDatum[]
  fullParams: GroupAuxParams
  fullDataFormatter: DataFormatterGrid
  fullChartParams: ChartParams
  // gridAxesReverseTransformValue: string
  labelTransform: string
  textSizePx: number
}) {
  const rectHeight = textSizePx + 4

  const gUpdate = selection
    .selectAll<SVGGElement, LabelDatum>(`g.${labelClassName}`)
    .data(labelData)
  const gEnter = gUpdate
    .enter()
    .append('g')
    .classed(labelClassName, true)
    .style('cursor', 'pointer')
  const axisLabelSelection = gEnter.merge(gUpdate)
  gEnter
    .attr("transform", (d, i) => {
      return `translate(${d.x}, ${d.y})`
    })
  gUpdate
    .transition()
    .duration(50)
    .attr("transform", (d, i) => {
      return `translate(${d.x}, ${d.y})`
    })
  gUpdate.exit().remove()

  axisLabelSelection.each((datum, i, n) => {
    const rectWidth = measureTextWidth(datum.text, textSizePx) + 12
    // -- label偏移位置 --
    let rectX = - rectWidth / 2
    let rectY = -2
    if (fullDataFormatter.grid.groupAxis.position === 'bottom') {
      rectX = - rectWidth / 2
      rectY = 2
    } else if (fullDataFormatter.grid.groupAxis.position === 'left') {
      rectX = - rectWidth + 2
      rectY = - rectHeight / 2
    } else if (fullDataFormatter.grid.groupAxis.position === 'right') {
      rectX = - 2
      rectY = - rectHeight / 2
    } else if (fullDataFormatter.grid.groupAxis.position === 'top') {
      rectX = - rectWidth / 2
      rectY = - rectHeight + 2
    }

    const rectUpdate = d3.select(n[i])
      .selectAll<SVGRectElement, LabelDatum>('rect')
      .data([datum])
    const rectEnter = rectUpdate
      .enter()
      .append('rect')
      .attr('height', `${rectHeight}px`)
      .attr('fill', d => getColor(fullParams.labelColorType, fullChartParams))
      .attr('x', rectX)
      .attr('y', rectY)
      .attr('rx', 5)
      .attr('ry', 5)
      .style('cursor', 'pointer')
      // .style('pointer-events', 'none')
    const rect = rectUpdate.merge(rectEnter)
      .attr('width', d => `${rectWidth}px`)
      .style('transform', labelTransform)
    rectUpdate.exit().remove()

    const textUpdate = d3.select(n[i])
      .selectAll<SVGTextElement, LabelDatum>('text')
      .data([datum])
    const textEnter = textUpdate
      .enter()
      .append('text')
      .style('dominant-baseline', 'hanging')
      .style('cursor', 'pointer')
      // .style('pointer-events', 'none')
    const text = textUpdate.merge(textEnter)
      .text(d => d.text)
      .style('transform', labelTransform)
      .attr('fill', d => getColor(fullParams.labelTextColorType, fullChartParams))
      .attr('font-size', fullChartParams.styles.textSize)
      .attr('x', rectX + 6)
      .attr('y', rectY)
    textUpdate.exit().remove()
  })

  return axisLabelSelection
}

function removeLabel (selection: d3.Selection<any, unknown, any, unknown>) {
  const gUpdate = selection
    .selectAll<SVGGElement, LabelDatum>(`g.${labelClassName}`)
    .data([])

  gUpdate.exit().remove()
}

export const GroupAux = defineGridPlugin(pluginName, DEFAULT_GROUP_AREA_PARAMS)(({ selection, rootSelection, name, subject, observer }) => {
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
    seriesLabels$: observer.seriesLabels$,
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

      let _labels = data.fullDataFormatter.grid.seriesDirection === 'row'
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

  // 取得事件座標的group資料
  const gridGroupPositionFn$ = gridGroupPositionFnObservable({
    fullDataFormatter$: observer.fullDataFormatter$,
    gridAxesSize$: observer.gridAxesSize$,
    computedData$: observer.computedData$,
    fullChartParams$: observer.fullChartParams$,
  })

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
  //         gridIndex: 0, // @Q@ 暫不處理
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         groups: data.GroupDataMap.get(groupLabel) ?? [],
  //         // groups: [],
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
  //         gridIndex: 0, // @Q@ 暫不處理
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         groups: data.GroupDataMap.get(groupLabel) ?? [],
  //         // groups: [],
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
  //         gridIndex: 0, // @Q@ 暫不處理
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         groups: data.GroupDataMap.get(groupLabel) ?? [],
  //         // groups: [],
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
  //         gridIndex: 0, // @Q@ 暫不處理
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         // groups: data.GroupDataMap.get(groupLabel) ?? [],
  //         groups: [],
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

  const labelTransform$ = combineLatest({
    fullParams: observer.fullParams$,
    fullDataFormatter: observer.fullDataFormatter$,
    gridAxesReverseTransform: observer.gridAxesReverseTransform$,
    gridContainerPosition: observer.gridContainerPosition$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      const axisReverseTranslateValue = `translate(${data.gridAxesReverseTransform.translate[0]}px, ${data.gridAxesReverseTransform.translate[1]}px)`
      const axisReverseRotateValue = `rotate(${data.gridAxesReverseTransform.rotate}deg) rotateX(${data.gridAxesReverseTransform.rotateX}deg) rotateY(${data.gridAxesReverseTransform.rotateY}deg)`
      const containerScaleReverseScaleValue = `scale(${1 / data.gridContainerPosition[0].scale[0]}, ${1 / data.gridContainerPosition[0].scale[1]})`
      const tickTextRotateDeg = (data.fullDataFormatter.grid.groupAxis.position === 'left' && data.fullDataFormatter.grid.valueAxis.position === 'top')
        || (data.fullDataFormatter.grid.groupAxis.position === 'right' && data.fullDataFormatter.grid.valueAxis.position === 'bottom')
          // ? data.fullParams.tickTextRotate + 180 // 修正文字倒轉
          // : data.fullParams.tickTextRotate
          ? 180 // 修正文字倒轉
          : 0
      
      const textRotateValue = `rotate(${tickTextRotateDeg}deg)`
      
      // 必須按照順序（先抵消外層rotate，再抵消最外層scale，最後再做本身的rotate）
      return `${axisReverseTranslateValue} ${axisReverseRotateValue} ${containerScaleReverseScaleValue} ${textRotateValue}`
    }),
    distinctUntilChanged()
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

  combineLatest({
    axesSelection: axesSelection$,
    columnAmount: columnAmount$,
    rowAmount: rowAmount$,
    layout: observer.layout$,
    rootMousemove: rootMousemove$,
    gridGroupPositionFn: gridGroupPositionFn$,
    computedData: observer.computedData$,
    groupScale: groupScale$,
    gridAxesSize: observer.gridAxesSize$,
    fullParams: observer.fullParams$,
    fullDataFormatter: observer.fullDataFormatter$,
    fullChartParams: observer.fullChartParams$,
    highlightTarget: highlightTarget$,
    // gridAxesReverseTransform: observer.gridAxesReverseTransform$,
    labelTransform: labelTransform$,
    GroupDataMap: observer.GroupDataMap$,
    textSizePx: observer.textSizePx$
  }).subscribe(data => {
    // 由於event座標是基於底層的，但是container會有多欄，所以要重新計算
    const eventData = {
      offsetX: data.rootMousemove.offsetX * data.columnAmount % data.layout.rootWidth,
      offsetY: data.rootMousemove.offsetY * data.rowAmount % data.layout.rootHeight
    }
    // 依event的座標取得group資料
    const { groupIndex, groupLabel } = data.gridGroupPositionFn(eventData)

    const axisX = data.groupScale(groupLabel) ?? 0
    
    const lineData = createLineData({
      groupLabel: groupLabel,
      axisX,
      axisHeight: data.gridAxesSize.height,
      fullParams: data.fullParams,
    })
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
      fullParams: data.fullParams
    })
    const labelSelection = renderLabel({
      // selection: axisSelection,
      selection: data.axesSelection,
      labelData,
      fullParams: data.fullParams,
      fullDataFormatter: data.fullDataFormatter,
      fullChartParams: data.fullChartParams,
      // gridAxesReverseTransformValue: data.gridAxesReverseTransform.value,
      labelTransform: data.labelTransform,
      textSizePx: data.textSizePx
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
          gridIndex: 0, // @Q@ 暫不處理
          series: [],
          seriesIndex: -1,
          seriesLabel: '',
          groups: data.GroupDataMap.get(groupLabel) ?? [],
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
          gridIndex: 0, // @Q@ 暫不處理
          series: [],
          seriesIndex: -1,
          seriesLabel: '',
          groups: data.GroupDataMap.get(groupLabel) ?? [],
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
          gridIndex: 0, // @Q@ 暫不處理
          series: [],
          seriesIndex: -1,
          seriesLabel: '',
          groups: data.GroupDataMap.get(groupLabel) ?? [],
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
          gridIndex: 0, // @Q@ 暫不處理
          series: [],
          seriesIndex: -1,
          seriesLabel: '',
          groups: data.GroupDataMap.get(groupLabel) ?? [],
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
  //   // const groups = data.event.eventName === 'mouseover' || data.event.eventName === 'mousemove'
  //   //   ? data.event.groups
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
  //         gridIndex: 0, // @Q@ 暫不處理
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         groups: data.event.groups,
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
  //         gridIndex: 0, // @Q@ 暫不處理
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         groups: data.event.groups,
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
  //         gridIndex: 0, // @Q@ 暫不處理
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         groups: data.event.groups,
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
  //         gridIndex: 0, // @Q@ 暫不處理
  //         series: [],
  //         seriesIndex: -1,
  //         seriesLabel: '',
  //         groups: data.event.groups,
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