import * as d3 from 'd3'
import {
  // of,
  iif,
  EMPTY,
  combineLatest,
  switchMap,
  map,
  first,
  takeUntil,
  distinctUntilChanged,
  Subject,
  Observable } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import type {
  ComputedDatumGrid,
  ComputedDataGrid,
  EventGrid,
  ChartParams, 
  Layout } from '@orbcharts/core'
import type { BarsPluginParams } from '../types'
import { DEFAULT_BARS_PLUGIN_PARAMS } from '../defaults'
import { getD3TransitionEase } from '../../utils/d3Utils'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'

interface RenderBarParams {
  selection: d3.Selection<SVGGElement, unknown, any, any>
  data: ComputedDatumGrid[][]
  zeroY: number
  groupLabels: string[]
  barScale: d3.ScalePoint<string>
  params: BarsPluginParams
  chartParams: ChartParams
  barWidth: number
  transformedBarRadius: [number, number]
  delayGroup: number
  transitionItem: number
}

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

const pluginName = 'Bars'
const gClassName = getClassName(pluginName, 'g')
const rectClassName = getClassName(pluginName, 'rect')
// group的delay在動畫中的佔比（剩餘部份的時間為圖形本身的動畫時間，因為delay時間和最後一個group的動畫時間加總為1）
const groupDelayProportionOfDuration = 0.3

function calcBarWidth ({ axisWidth, groupAmount, barAmountOfGroup, barPadding = 0, barGroupPadding = 0 }: {
  axisWidth: number
  groupAmount: number
  barAmountOfGroup: number
  barPadding: number
  barGroupPadding: number
}) {
  const eachGroupWidth = axisWidth / (groupAmount - 1)
  const width = (eachGroupWidth - barGroupPadding) / barAmountOfGroup - barPadding
  return width > 1 ? width : 1
}

function makeBarScale (barWidth: number, seriesLabels: string[], params: BarsPluginParams) {
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

function renderRectBars ({ selection, data, zeroY, groupLabels, barScale, params, chartParams, barWidth, transformedBarRadius, delayGroup, transitionItem }: RenderBarParams) {
  
  const barHalfWidth = barWidth! / 2

  const barGroup = selection
    .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${gClassName}`)
    .data(data, (d, i) => groupLabels[i])
    .join(
      enter => {
        return enter
          .append('g')
          .classed(gClassName, true)
          .attr('cursor', 'pointer')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('transform', (d, i) => `translate(${d[0] ? d[0].axisX : 0}, ${0})`)
    .each((d, i, g) => {
      const bars = d3.select(g[i])
        .selectAll<SVGRectElement, ComputedDatumGrid>('rect')
        .data(d, d => d.id)
        .join(
          enter => {
            return enter
              .append('rect')
              .classed(rectClassName, true)
              .attr('height', d => 0)
          },
          update => update,
          exit => exit.remove()
        )
        .attr('fill', d => d.color)
        .attr('y', d => d.axisY < zeroY ? d.axisY : zeroY)
        .attr('x', d => barScale(d.seriesLabel)!)
        .attr('width', barWidth!)
        .attr('transform', `translate(${-barHalfWidth}, 0)`)
        // .attr('rx', params.barRadius == true ? barHalfWidth
        //   : params.barRadius == false ? 0
        //   : typeof params.barRadius == 'number' ? params.barRadius
        //   : 0)
        .attr('rx', transformedBarRadius[0])
        .attr('ry', transformedBarRadius[1])
        .transition()
        .duration(transitionItem)
        .ease(getD3TransitionEase(chartParams.transitionEase))
        .delay((d, i) => d.groupIndex * delayGroup)
        .attr('height', d => Math.abs(d.axisYFromZero))
    })

  const graphicBarSelection: d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, unknown> = barGroup.selectAll(`rect.${rectClassName}`)

  return graphicBarSelection
}

function renderClipPath ({ defsSelection, clipPathData }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  clipPathData: ClipPathDatum[]
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
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', _d => _d.width)
        .attr('height', _d => _d.height)
    })
}

function highlight ({ selection, ids, fullChartParams }: {
  selection: d3.Selection<any, ComputedDatumGrid, any, any>
  ids: string[]
  fullChartParams: ChartParams
}) {
  selection.interrupt('highlight')

  if (!ids.length) {
    // remove highlight
    selection
      .transition('highlight')
      .duration(200)
      .style('opacity', 1)
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

export const Bars = defineGridPlugin(pluginName, DEFAULT_BARS_PLUGIN_PARAMS)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')

  const axesSelection: d3.Selection<SVGGElement, any, any, any> = selection
    .append('g')
    .attr('clip-path', `url(#${clipPathID})`)
  const defsSelection: d3.Selection<SVGDefsElement, ComputedDatumGrid, any, any> = axesSelection.append('defs')
  const graphicGSelection: d3.Selection<SVGGElement, any, any, any> = axesSelection.append('g')
  const barSelection$: Subject<d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, unknown>> = new Subject()

  observer.gridAxesTransform$
    .pipe(
      takeUntil(destroy$),
      map(d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      axesSelection
        .style('transform', d)
    })

  observer.gridGraphicTransform$
    .pipe(
      takeUntil(destroy$),
      map(d => d.value),
      distinctUntilChanged()
    ).subscribe(d => {
      graphicGSelection
        .transition()
        .duration(50)
        .style('transform', d)
    })

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
  //     return visibleComputedData
  //   })
  // )

  const zeroY$ = observer.visibleComputedData$.pipe(
    map(d => d[0] && d[0][0]
      ? d[0][0].axisY - d[0][0].axisYFromZero
      : 0),
    distinctUntilChanged()
  )

  const barWidth$ = new Observable<number>(subscriber => {
    combineLatest({
      computedData: observer.computedData$,
      visibleComputedData: observer.visibleComputedData$,
      params: observer.fullParams$,
      gridAxesSize: observer.gridAxesSize$
    }).pipe(
      switchMap(async d => d)
    ).subscribe(data => {
      const barWidth = data.params.barWidth
        ? data.params.barWidth
        : calcBarWidth({
            axisWidth: data.gridAxesSize.width,
            groupAmount: data.computedData[0] ? data.computedData[0].length : 0,
            barAmountOfGroup: data.visibleComputedData.length,
            barPadding: data.params.barPadding,
            barGroupPadding: data.params.barGroupPadding
          })
      subscriber.next(barWidth)
    })
  }).pipe(
    takeUntil(destroy$),
    distinctUntilChanged()
  )

  // 圓角的值 [rx, ry]
  const transformedBarRadius$: Observable<[number, number]> = combineLatest({
    gridGraphicTransform: observer.gridGraphicTransform$,
    barWidth: barWidth$,
    params: observer.fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async data => data),
    map(data => {
      const barHalfWidth = data.barWidth! / 2
      const radius = data.params.barRadius === true ? barHalfWidth
        : data.params.barRadius === false ? 0
        : typeof data.params.barRadius == 'number' ? data.params.barRadius
        : 0
      const transformedRx = radius == 0
        ? 0
        : radius / data.gridGraphicTransform.scale[0] // 反向外層scale的變型
      const transformedRy = radius == 0
        ? 0
        : radius / data.gridGraphicTransform.scale[1]
      return [transformedRx, transformedRy]
    })
  )

  // const SeriesDataMap$ = visibleComputedData$.pipe(
  //   map(d => makeGridSeriesDataMap(d))
  // )

  // const GroupDataMap$ = visibleComputedData$.pipe(
  //   map(d => makeGridGroupDataMap(d))
  // )

  const seriesLabels$ = observer.visibleComputedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      const SeriesLabelSet: Set<string> = new Set()
      data.forEach(d => {
        d.forEach(_d => {
          SeriesLabelSet.add(_d.seriesLabel)
        })
      })
      return Array.from(SeriesLabelSet)
    })
  )

  const groupLabels$ = observer.visibleComputedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      const GroupLabelSet: Set<string> = new Set()
      data.forEach(d => {
        d.forEach(_d => {
          GroupLabelSet.add(_d.groupLabel)
        })
      })
      return Array.from(GroupLabelSet)
    })
  )

  const barScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
    combineLatest({
      seriesLabels: seriesLabels$,
      barWidth: barWidth$,
      params: observer.fullParams$,
    }).pipe(
      takeUntil(destroy$),
      switchMap(async d => d)
    ).subscribe(data => {
      const barScale = makeBarScale(data.barWidth, data.seriesLabels, data.params)
      subscriber.next(barScale)
    })
  })

  const transitionDuration$ = observer.fullChartParams$.pipe(
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

  const barData$ = observer.visibleComputedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      // 取得原始陣列的維度
      const rows = data.length;
      const cols = data.reduce((prev, current) => {
        return Math.max(prev, current.length)
      }, 0)

      // 初始化轉換後的陣列
      const transposedArray = new Array(cols).fill(null).map(() => new Array(rows).fill(null))

      // 遍歷原始陣列，進行轉換
      for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
              transposedArray[j][i] = data[i][j]
          }
      }
// console.log('transposedArray', transposedArray)
      return transposedArray
    })
  )

  observer.gridAxesSize$.pipe(
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

  // const renderBarsFn$ = observer.fullParams$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.barType === 'rect'
  //     ? renderRectBars
  //     : d.barType === 'triangle'
  //       ? renderTriangleBars
  //       : renderRectBars),
  // )

  const highlightTarget$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  combineLatest({
    // renderBarsFn: renderBarsFn$,
    computedData: observer.computedData$,
    barData$: barData$,
    zeroY: zeroY$,
    groupLabels: groupLabels$,
    barScale: barScale$,
    params: observer.fullParams$,
    chartParams: observer.fullChartParams$,
    highlightTarget: highlightTarget$,
    barWidth: barWidth$,
    transformedBarRadius: transformedBarRadius$,
    delayGroup: delayGroup$,
    transitionItem: transitionItem$,
    SeriesDataMap: observer.SeriesDataMap$,
    GroupDataMap: observer.GroupDataMap$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {
    
    const barSelection = renderRectBars({
      selection: graphicGSelection,
      data: data.barData$,
      zeroY: data.zeroY,
      groupLabels: data.groupLabels,
      barScale: data.barScale,
      params: data.params,
      chartParams: data.chartParams,
      barWidth: data.barWidth,
      transformedBarRadius: data.transformedBarRadius,
      delayGroup: data.delayGroup,
      transitionItem: data.transitionItem
    })

    barSelection!
      .on('mouseover', (event, datum) => {
        event.stopPropagation()
  
        subject.event$.next({
          type: 'grid',
          eventName: 'mouseover',
          pluginName: name,
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

        subject.event$.next({
          type: 'grid',
          eventName: 'mousemove',
          pluginName: name,
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

        subject.event$.next({
          type: 'grid',
          eventName: 'mouseout',
          pluginName: name,
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

        subject.event$.next({
          type: 'grid',
          eventName: 'click',
          pluginName: name,
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

    barSelection$.next(barSelection!)
  })

  // combineLatest({
  //   barSelection: barSelection$,
  //   chartParams: observer.fullChartParams$,
  //   barData$: barData$,
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d)
  // ).subscribe(data => {
  //   const ids = getGridHighlightIds(data.barData$, data.chartParams.highlightDefault)
  //   highlight(data.barSelection, ids)
  // })

  // const datumList$ = observer.computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, observer.fullChartParams$, event$: subject.event$ })
  const highlightSubscription = observer.gridHighlight$.subscribe()
  
  combineLatest({
    barSelection: barSelection$,
    highlight: observer.gridHighlight$,
    fullChartParams: observer.fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      selection: data.barSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams
    })
  })

  return () => {
    destroy$.next(undefined)
    highlightSubscription.unsubscribe()
  }
})
