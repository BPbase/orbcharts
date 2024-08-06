import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  Observable,
  Subject } from 'rxjs'
import type { BasePluginFn } from './types'
import type {
  ComputedDatumGrid,
  ComputedDataGrid,
  EventGrid,
  ChartParams, 
  Layout,
  TransformData } from '@orbcharts/core'
import { getD3TransitionEase } from '../utils/d3Utils'
import { getClassName, getUniID } from '../utils/orbchartsUtils'

export interface BaseBarsTriangleParams {
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  linearGradientOpacity: [number, number]
}

interface BaseBarsContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataGrid>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  fullParams$: Observable<BaseBarsTriangleParams>
  fullChartParams$: Observable<ChartParams>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridHighlight$: Observable<string[]>
  event$: Subject<EventGrid>
}


interface RenderBarParams {
  selection: d3.Selection<SVGGElement, unknown, any, any>
  barData: BarDatumGrid[][]
  zeroY: number
  groupLabels: string[]
  barScale: d3.ScalePoint<string>
  params: BaseBarsTriangleParams
  chartParams: ChartParams
  barWidth: number
  delayGroup: number
  transitionItem: number
}

interface BarDatumGrid extends ComputedDatumGrid {
  linearGradientId: string
}

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

const pluginName = 'BaseBarsTriangle'
const gClassName = getClassName(pluginName, 'g')
const gContentClassName = getClassName(pluginName, 'g-content')
// group的delay在動畫中的佔比（剩餘部份的時間為圖形本身的動畫時間，因為delay時間和最後一個group的動畫時間加總為1）
const groupDelayProportionOfDuration = 0.3

function calcBarWidth ({ axisWidth, groupAmount, barAmountOfGroup, barPadding = 0, barGroupPadding = 0 }: {
  axisWidth: number
  groupAmount: number
  barAmountOfGroup: number
  barPadding: number
  barGroupPadding: number
}) {
  const width = (axisWidth / groupAmount - barGroupPadding) / barAmountOfGroup - barPadding
  return width > 1 ? width : 1
}

function makeBarScale (barWidth: number, seriesLabels: string[], params: BaseBarsTriangleParams) {
  const barHalfWidth = barWidth! / 2
  const barGroupWidth = barWidth * seriesLabels.length + params.barPadding! * seriesLabels.length
  return d3.scalePoint()
    .domain(seriesLabels)
    .range([-barGroupWidth / 2 + barHalfWidth, barGroupWidth / 2 - barHalfWidth])
}

function calcDelayGroup (barGroupAmount: number, totalDuration: number) {
  if (barGroupAmount <= 1) {
    // 一筆內計算會出錯所以不算
    return 0
  }
  return totalDuration / (barGroupAmount - 1) * groupDelayProportionOfDuration // 依group數量計算
}

function calctransitionItem (barGroupAmount: number, totalDuration: number) {
  if (barGroupAmount <= 1) {
    // 一筆內不會有delay
    return totalDuration
  }
  return totalDuration * (1 - groupDelayProportionOfDuration) // delay後剩餘的時間
}

function renderTriangleBars ({ selection, barData, zeroY, groupLabels, barScale, params, chartParams, barWidth, delayGroup, transitionItem }: RenderBarParams) {
  // console.log({ selection, data, zeroY, seriesLabels, barScale, params, chartParams, barWidth, delayGroup })
  // if (barWidth <= 0) {
  //   return
  // }
  const update = selection!
    .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${gClassName}`)
    .data(barData, (d, i) => groupLabels[i])
  const enter = update.enter()
    .append('g')
    .classed(gClassName, true)
    .attr('cursor', 'pointer')
  update.exit().remove()
  const graphicGroupSelection = update.merge(enter)
  enter
    .attr('transform', (d, i) => `translate(${d[0] ? d[0].axisX : 0}, ${0})`)
  update
    // .transition()
    // .duration(200)
    .attr('transform', (d, i) => `translate(${d[0] ? d[0].axisX : 0}, ${0})`)

  const barHalfWidth = barWidth! / 2

  graphicGroupSelection
    .each((d, i, g) => {
      const pathUpdate = d3.select(g[i])
        .selectAll<SVGGElement, ComputedDatumGrid>('g')
        .data(d, _d => _d.id)
      const pathEnter = pathUpdate
        .enter()
        .append('g')
        .classed(gContentClassName, true)
      pathEnter
        .append('path')
        // .attr('transform', `translate(${-barHalfWidth}, 0)`)
        // .attr('x', d => itemScale(d.itemLabel)!)
        // .attr('y', d => 0)
        .style('vector-effect', 'non-scaling-stroke')
        .attr('height', d => 0)
        .attr('d', (d) => {
          const x = barScale(d.seriesLabel)!
          const y1 = zeroY
          const y2 = y1
          return `M${x - (barWidth! / 2)},${y1} L${x},${y2} ${x + (barWidth! / 2)},${y1}`
        })
      pathUpdate.merge(pathEnter)
        .select('path')
        .style('fill', d => `url(#${d.linearGradientId})`)
        .attr('stroke', d => d.color)
        .attr('transform', `translate(${-barHalfWidth}, 0)`)
        .transition()
        .duration(transitionItem)
        .ease(getD3TransitionEase(chartParams.transitionEase))
        .delay((d, i) => d.groupIndex * delayGroup)
        .attr('transform', `translate(${-barHalfWidth}, 0)`)
        // .attr('x', d => itemScale(d.itemLabel)!)
        // .attr('y', d => -d.y)
        .attr('height', d => Math.abs(d.axisYFromZero))
        .attr('d', (d) => {
          const x = barScale(d.seriesLabel)!
          const y1 = zeroY
          const y2 = d.axisY
          return `M${x},${y1} L${x + (barWidth! / 2)},${y2} ${x + barWidth!},${y1}`
        })
        // .on('end', () => initHighlight())
      pathUpdate.exit().remove()
    })

  const graphicBarSelection: d3.Selection<SVGPathElement, ComputedDatumGrid, any, any> = graphicGroupSelection.selectAll(`g.${gContentClassName}`)

  return graphicBarSelection
}

function renderLinearGradient ({ defsSelection, barData, params }: {
  defsSelection: d3.Selection<SVGDefsElement, ComputedDatumGrid, any, any>
  barData: BarDatumGrid[][]
  params: BaseBarsTriangleParams
}) {
  const linearGradientUpdate = defsSelection!
      .selectAll<SVGLinearGradientElement, ComputedDatumGrid>('linearGradient')
      .data(barData[0] ?? [], d => d.seriesLabel)
    const linearGradientEnter = linearGradientUpdate
      .enter()
      .append('linearGradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '100%')
      .attr('y2', '0%')
      .attr('spreadMethod', 'pad')
    linearGradientUpdate.merge(linearGradientEnter)
      .attr('id', (d, i) => d.linearGradientId)
      .html((d, i) => `
        <stop offset="0%"   stop-color="${d.color}" stop-opacity="${params.linearGradientOpacity[0]}"/>
        <stop offset="100%" stop-color="${d.color}" stop-opacity="${params.linearGradientOpacity[1]}"/>
      `)
    linearGradientUpdate.exit().remove()
}


function renderClipPath ({ defsSelection, clipPathData }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  clipPathData: ClipPathDatum[]
}) {
  const update = defsSelection
    .selectAll<SVGClipPathElement, Layout>('clipPath')
    .data(clipPathData)
  const enter = update.enter()
    .append('clipPath')
  const cutRect = update.merge(enter)
    .attr('id', d => d.id)
  update.exit().remove()

  update.merge(enter).each((d, i, g) => {
    const updateRect = d3.select(g[i])
      .selectAll<SVGRectElement, typeof d>('rect')
      .data([d])
    const enterRect = updateRect.enter().append('rect')
    updateRect.merge(enterRect)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', _d => _d.width)
      .attr('height', _d => _d.height)
    updateRect.exit().remove()
  })
}

function highlight ({ selection, ids, fullChartParams }: {
  selection: d3.Selection<SVGPathElement, ComputedDatumGrid, any, any>
  ids: string[]
  fullChartParams: ChartParams
}) {
  selection.interrupt('highlight')

  const removeHighlight = () => {
    selection
      .transition('highlight')
      .duration(200)
      .style('opacity', 1)
  }

  if (!ids.length) {
    removeHighlight()
    return
  }
  
  selection
    .each((d, i, n) => {
      if (ids.includes(d.id)) {
        d3.select(n[i])
          .style('opacity', 1)
      } else {
        d3.select(n[i])
          .style('opacity', fullChartParams.styles.unhighlightedOpacity)
      }
    })
}


export const createBaseBarsTriangle: BasePluginFn<BaseBarsContext> = (pluginName: string, {
  selection,
  computedData$,
  SeriesDataMap$,
  GroupDataMap$,
  fullParams$,
  fullChartParams$,
  gridAxesTransform$,
  gridGraphicTransform$,
  gridAxesSize$,
  gridHighlight$,
  event$
}) => {
  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')

  const axisSelection: d3.Selection<SVGGElement, any, any, any> = selection
    .append('g')
    .attr('clip-path', `url(#${clipPathID})`)
  const defsSelection: d3.Selection<SVGDefsElement, ComputedDatumGrid, any, any> = axisSelection.append('defs')
  const graphicGSelection: d3.Selection<SVGGElement, any, any, any> = axisSelection.append('g')
  let graphicSelection: d3.Selection<SVGGElement, any, any, any> | undefined
  const pathSelection$: Subject<d3.Selection<SVGPathElement, ComputedDatumGrid, any, any>> = new Subject()
  // .style('transform', 'translate(0px, 0px) scale(1)')

  gridAxesTransform$
    .pipe(
      takeUntil(destroy$),
      map(d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      axisSelection
        .style('transform', d)
    })

  gridGraphicTransform$
    .pipe(
      takeUntil(destroy$),
      switchMap(async d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      graphicGSelection
        .transition()
        .duration(50)
        .style('transform', d)
    })

  // const axisSize$ = gridAxisSizeObservable({
  //   dataFormatter$,
  //   layout$
  // })

  const zeroY$ = computedData$.pipe(
    map(d => d[0] && d[0][0]
      ? d[0][0].axisY - d[0][0].axisYFromZero
      : 0),
    distinctUntilChanged()
  )

  const barWidth$ = new Observable<number>(subscriber => {
    combineLatest({
      computedData: computedData$,
      params: fullParams$,
      axisSize: gridAxesSize$
    }).pipe(
      switchMap(async d => d)
    ).subscribe(data => {
      const barWidth = calcBarWidth({
        axisWidth: data.axisSize.width,
        groupAmount: data.computedData[0] ? data.computedData[0].length : 0,
        barAmountOfGroup: data.computedData.length,
        barPadding: data.params.barPadding,
        barGroupPadding: data.params.barGroupPadding
      })
      subscriber.next(barWidth)
    })
  }).pipe(
    takeUntil(destroy$),
    distinctUntilChanged()
  )

  const seriesLabels$ = computedData$.pipe(
    takeUntil(destroy$),
    map(data => data.map((d, i) => d[0] ? d[0].seriesLabel : String(i)))
  )

  const groupLabels$ = computedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      return data[0] ? data[0].map(d => d.groupLabel) : []
    })
  )

  const barScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
    combineLatest({
      seriesLabels: seriesLabels$,
      barWidth: barWidth$,
      params: fullParams$,
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      const barScale = makeBarScale(data.barWidth, data.seriesLabels, data.params)
      subscriber.next(barScale)
    })
  })

  const transitionDuration$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.transitionDuration),
    distinctUntilChanged()
  )

  const delayGroup$ = new Observable<number>(subscriber => {
    combineLatest({
      groupLabels: groupLabels$,
      transitionDuration: transitionDuration$,
    }).pipe(
      switchMap(async d => d)
    ).subscribe(data => {
      const delay = calcDelayGroup(data.groupLabels.length, data.transitionDuration)
      subscriber.next(delay)
    })
  }).pipe(
    takeUntil(destroy$),
    distinctUntilChanged()
  )

  const transitionItem$ = new Observable<number>(subscriber => {
    combineLatest({
      groupLabels: groupLabels$,
      transitionDuration: transitionDuration$
    }).pipe(
      switchMap(async d => d)
    ).subscribe(data => {
      const transition = calctransitionItem(data.groupLabels.length, data.transitionDuration)
      subscriber.next(transition)
    })
  }).pipe(
    takeUntil(destroy$),
    distinctUntilChanged()
  )

  const transposedData$ = computedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      // 取得原始陣列的維度
      const rows = data.length;
      const cols = data.reduce((prev, current) => {
        return Math.max(prev, current.length)
      }, 0)

      // 初始化轉換後的陣列
      const transposedArray: typeof data = new Array(cols).fill(null).map(() => new Array(rows).fill(null))

      // 遍歷原始陣列，進行轉換
      for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
              transposedArray[j][i] = data[i][j]
          }
      }

      return transposedArray
    })
  )

  const barData$ = transposedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      const linearGradientIds = data.length
        ? data[0].map(d => getUniID(pluginName, `lineargradient-${d.seriesLabel}`))
        : []
      return data.map(d => {
        return d.map((_d, _i) => {
          return <BarDatumGrid>{
            linearGradientId: linearGradientIds[_i],
            ..._d
          }
        })
      })
    })
  )

  gridAxesSize$.pipe(
    takeUntil(destroy$)
  ).subscribe(data => {
    const clipPathData = [{
      id: clipPathID,
      width: data.width,
      height: data.height
    }]
    renderClipPath({
      defsSelection,
      clipPathData
    })
  })

  // const SeriesDataMap$ = computedData$.pipe(
  //   map(d => makeGridSeriesDataMap(d))
  // )

  // const GroupDataMap$ = computedData$.pipe(
  //   map(d => makeGridGroupDataMap(d))
  // )

  const highlightTarget$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  combineLatest({
    barData: barData$,
    computedData: computedData$,
    zeroY: zeroY$,
    groupLabels: groupLabels$,
    barScale: barScale$,
    params: fullParams$,
    chartParams: fullChartParams$,
    highlightTarget: highlightTarget$,
    barWidth: barWidth$,
    delayGroup: delayGroup$,
    transitionItem: transitionItem$,
    SeriesDataMap: SeriesDataMap$,
    GroupDataMap: GroupDataMap$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {
    const pathSelection = renderTriangleBars({
      selection: graphicGSelection,
      barData: data.barData,
      zeroY: data.zeroY,
      groupLabels: data.groupLabels,
      barScale: data.barScale,
      params: data.params,
      chartParams: data.chartParams,
      barWidth: data.barWidth,
      delayGroup: data.delayGroup,
      transitionItem: data.transitionItem
    })
    renderLinearGradient({
      defsSelection,
      barData: data.barData,
      params: data.params
    })

    pathSelection!
      .on('mouseover', (event, datum) => {
        event.stopPropagation()

        event$.next({
          type: 'grid',
          eventName: 'mouseover',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })
      .on('mousemove', (event, datum) => {
        event.stopPropagation()

        event$.next({
          type: 'grid',
          eventName: 'mousemove',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })
      .on('mouseout', (event, datum) => {
        event.stopPropagation()

        event$.next({
          type: 'grid',
          eventName: 'mouseout',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })
      .on('click', (event, datum) => {
        event.stopPropagation()

        event$.next({
          type: 'grid',
          eventName: 'click',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          groups: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })

    pathSelection$.next(pathSelection)
  })

  // const datumList$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, fullChartParams$, event$: event$ })
  const highlightSubscription = gridHighlight$.subscribe()
  
  combineLatest({
    pathSelection: pathSelection$,
    highlight: gridHighlight$,
    fullChartParams: fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      selection: data.pathSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams
    })
  })

  return () => {
    destroy$.next(undefined)
    highlightSubscription.unsubscribe()
  }
}