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
  ContainerPosition,
  EventGrid,
  ChartParams, 
  Layout,
  TransformData } from '@orbcharts/core'
import { getD3TransitionEase } from '../utils/d3Utils'
import { getClassName, getUniID } from '../utils/orbchartsUtils'

export interface BaseBarsParams {
  // barType: BarType
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  barRadius: number | boolean
}

interface BaseBarsContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataGrid>
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  fullParams$: Observable<BaseBarsParams>
  fullChartParams$: Observable<ChartParams>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridHighlight$: Observable<string[]>
  gridContainer$: Observable<ContainerPosition[]>
  isSeriesPositionSeprate$: Observable<boolean>
  event$: Subject<EventGrid>
}

interface RenderBarParams {
  graphicGSelection: d3.Selection<SVGGElement, unknown, any, any>
  computedData: ComputedDatumGrid[][]
  zeroYArr: number[]
  groupLabels: string[]
  barScale: d3.ScalePoint<string>
  params: BaseBarsParams
  chartParams: ChartParams
  barWidth: number
  transformedBarRadius: [number, number]
  delayGroup: number
  transitionItem: number
  isSeriesPositionSeprate: boolean
}

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

const pluginName = 'Bars'
const seriesClassName = getClassName(pluginName, 'series')
const axesClassName = getClassName(pluginName, 'axes')
const graphicClassName = getClassName(pluginName, 'graphic')
const barGroupClassName = getClassName(pluginName, 'barGroup')
const barClassName = getClassName(pluginName, 'bar')
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

function makeBarScale (barWidth: number, seriesLabels: string[], params: BaseBarsParams) {
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


function renderRectBars ({ graphicGSelection, computedData, zeroYArr, groupLabels, barScale, params, chartParams, barWidth, transformedBarRadius, delayGroup, transitionItem, isSeriesPositionSeprate }: RenderBarParams) {
  
  const barHalfWidth = barWidth! / 2

  graphicGSelection
    .each((d, seriesIndex, g) => {
      console.log(d, seriesIndex, g)
      d3.select(g[seriesIndex])
        .selectAll<SVGGElement, ComputedDatumGrid>(`rect.${rectClassName}`)
        .data(computedData[seriesIndex])
        .join(
          enter => {
            return enter
              .append('rect')
              .classed(rectClassName, true)
              .attr('cursor', 'pointer')
              .attr('height', d => 0)
          },
          update => update,
          exit => exit.remove()
        )
        .classed(barClassName, true)
        .attr('transform', (d, i) => `translate(${(d ? d.axisX : 0) - barHalfWidth}, ${0})`)
        .attr('fill', d => d.color)
        .attr('y', d => d.axisY < zeroYArr[seriesIndex] ? d.axisY : zeroYArr[seriesIndex])
        .attr('x', d => isSeriesPositionSeprate ? 0 : barScale(d.seriesLabel)!)
        .attr('width', barWidth!)
        .attr('rx', transformedBarRadius[0])
        .attr('ry', transformedBarRadius[1])
        .transition()
        .duration(transitionItem)
        .ease(getD3TransitionEase(chartParams.transitionEase))
        .delay((d, i) => d.groupIndex * delayGroup)
        .attr('height', d => Math.abs(d.axisYFromZero))
      })


  // graphicGSelection
  //   .each((d, seriesIndex, g) => {
  //     d3.select(g[seriesIndex])
  //       .selectAll<SVGGElement, ComputedDatumGrid>(`g.${barClassName}`)
  //       .data(computedData[seriesIndex], d => d.seriesIndex)
  //       .join('g')
  //       .classed(barClassName, true)
  //       .attr('transform', (d, i) => `translate(${d ? d.axisX : 0}, ${0})`)
  //       .each((datum, i, g) => {
  //         d3.select(g[i])
  //           .selectAll<SVGRectElement, ComputedDatumGrid>(`rect.${rectClassName}`)
  //           .data([computedData[seriesIndex][i]], d => d.id)
  //           .join(
  //             enter => {
  //               return enter
  //                 .append('rect')
  //                 .classed(rectClassName, true)
  //                 .attr('height', d => 0)
  //             },
  //             update => update,
  //             exit => exit.remove()
  //           )
  //           .attr('cursor', 'pointer')
  //           .attr('fill', d => d.color)
  //           .attr('y', d => d.axisY < zeroYArr[seriesIndex] ? d.axisY : zeroYArr[seriesIndex])
  //           .attr('x', d => isSeriesPositionSeprate ? 0 : barScale(d.seriesLabel)!)
  //           .attr('width', barWidth!)
  //           .attr('transform', `translate(${-barHalfWidth}, 0)`)
  //           // .attr('rx', params.barRadius == true ? barHalfWidth
  //           //   : params.barRadius == false ? 0
  //           //   : typeof params.barRadius == 'number' ? params.barRadius
  //           //   : 0)
  //           .attr('rx', transformedBarRadius[0])
  //           .attr('ry', transformedBarRadius[1])
  //           .transition()
  //           .duration(transitionItem)
  //           .ease(getD3TransitionEase(chartParams.transitionEase))
  //           .delay((d, i) => d.groupIndex * delayGroup)
  //           .attr('height', d => Math.abs(d.axisYFromZero))
  //       })
  //   })

  const graphicBarSelection: d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, unknown> = graphicGSelection.selectAll(`rect.${rectClassName}`)

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


export const createBaseBars: BasePluginFn<BaseBarsContext> = (pluginName: string, {
  selection,
  computedData$,
  visibleComputedData$,
  SeriesDataMap$,
  GroupDataMap$,
  fullParams$,
  fullChartParams$,
  gridAxesTransform$,
  gridGraphicTransform$,
  gridAxesSize$,
  gridHighlight$,
  gridContainer$,
  isSeriesPositionSeprate$,
  event$
}) => {

  const seriesDestroy$ = new Subject()
  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')
  
  const seriesSelection$ = computedData$.pipe(
    takeUntil(seriesDestroy$),
    distinctUntilChanged((a, b) => {
      // 只有當series的數量改變時，才重新計算
      return a.length === b.length
    }),
    map((computedData, i) => {
      return selection
        .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${seriesClassName}`)
        .data(computedData, d => d[0] ? d[0].seriesIndex : i)
        // .join('g')
        .join(
          enter => {
            return enter
              .append('g')
              .classed(seriesClassName, true)
              .each((d, i, g) => {
                const axesSelection = d3.select(g[i])
                  .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${axesClassName}`)
                  .data([i])
                  .join(
                    enter => {
                      return enter
                        .append('g')
                        .classed(axesClassName, true)
                        .attr('clip-path', `url(#${clipPathID})`)
                        .each((d, i, g) => {
                          const defsSelection = d3.select(g[i])
                            .selectAll<SVGDefsElement, any>('defs')
                            .data([i])
                            .join('defs')
            
                          const graphicGSelection = d3.select(g[i])
                            .selectAll<SVGGElement, any>('g')
                            .data([i])
                            .join('g')
                            .classed(graphicClassName, true)
                        })
                    },
                    update => update,
                    exit => exit.remove()
                  )
              })
          },
          update => update,
          exit => exit.remove()
        )
    })
  )

  combineLatest({
    seriesSelection: seriesSelection$,
    gridContainer: gridContainer$
  }).pipe(
    takeUntil(seriesDestroy$),
  ).subscribe(data => {
    data.seriesSelection
      .attr('transform', (d, i) => {
        const translate = data.gridContainer[i].translate
        const scale = data.gridContainer[i].scale
        return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
      })
  })


  const axesSelection$ = combineLatest({
    seriesSelection: seriesSelection$,
    gridAxesTransform: gridAxesTransform$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      return data.seriesSelection
        .select<SVGGElement>(`g.${axesClassName}`)
        .style('transform', data.gridAxesTransform.value)
    })
  )
  const defsSelection$ = axesSelection$.pipe(
    takeUntil(destroy$),
    map(axesSelection => {
      return axesSelection.select<SVGDefsElement>('defs')
    })
  )
  const graphicGSelection$ = combineLatest({
    axesSelection: axesSelection$,
    gridGraphicTransform: gridGraphicTransform$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      const graphicGSelection = data.axesSelection
        .select<SVGGElement>(`g.${graphicClassName}`)
      graphicGSelection
        .transition()
        .duration(50)
        .style('transform', data.gridGraphicTransform.value)
      return graphicGSelection
    })
  )

  

  // combineLatest({
  //   axesSelection: axesSelection$,
  //   gridAxesTransform: gridAxesTransform$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d),
  //   // distinctUntilChanged()
  // ).subscribe(data => {
  //   data.axesSelection
  //     .style('transform', data.gridAxesTransform.value)
  // })


  // combineLatest({
  //   graphicGSelection: graphicGSelection$,
  //   gridGraphicTransform: gridGraphicTransform$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d),
  //   // distinctUntilChanged()
  // ).subscribe(data => {
  //   data.graphicGSelection
  //     .transition()
  //     .duration(50)
  //     .style('transform', data.gridGraphicTransform.value)
  // })

  const zeroYArr$ = visibleComputedData$.pipe(
    // map(d => d[0] && d[0][0]
    //   ? d[0][0].axisY - d[0][0].axisYFromZero
    //   : 0),
    map(data => {
      return data.map(d => {
        return d[0] ? d[0].axisY - d[0].axisYFromZero : 0
      })
    }),
    distinctUntilChanged()
  )

  const barWidth$ = combineLatest({
    computedData: computedData$,
    visibleComputedData: visibleComputedData$,
    params: fullParams$,
    gridAxesSize: gridAxesSize$,
    isSeriesPositionSeprate: isSeriesPositionSeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      if (data.params.barWidth) {
        return data.params.barWidth
      } else if (data.isSeriesPositionSeprate) {
        return calcBarWidth({
          axisWidth: data.gridAxesSize.width,
          groupAmount: data.computedData[0] ? data.computedData[0].length : 0,
          barAmountOfGroup: 1,
          barPadding: data.params.barPadding,
          barGroupPadding: data.params.barGroupPadding
        })
      } else {
        return calcBarWidth({
          axisWidth: data.gridAxesSize.width,
          groupAmount: data.computedData[0] ? data.computedData[0].length : 0,
          barAmountOfGroup: data.visibleComputedData.length,
          barPadding: data.params.barPadding,
          barGroupPadding: data.params.barGroupPadding
        })
      }
    })
  )

  // 圓角的值 [rx, ry]
  const transformedBarRadius$: Observable<[number, number]> = combineLatest({
    gridGraphicTransform: gridGraphicTransform$,
    barWidth: barWidth$,
    params: fullParams$
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

  
  const seriesLabels$ = visibleComputedData$.pipe(
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

  const groupLabels$ = visibleComputedData$.pipe(
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

  // 

  combineLatest({
    defsSelection: defsSelection$,
    gridAxesSize: gridAxesSize$,
  }).pipe(
    takeUntil(destroy$)
  ).subscribe(data => {
    const clipPathData = [{
      id: clipPathID,
      width: data.gridAxesSize.width,
      height: data.gridAxesSize.height
    }]
    renderClipPath({
      defsSelection: data.defsSelection,
      clipPathData
    })
  })

  // const renderBarsFn$ = fullParams$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.barType === 'rect'
  //     ? renderRectBars
  //     : d.barType === 'triangle'
  //       ? renderTriangleBars
  //       : renderRectBars),
  // )

  const highlightTarget$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  const barSelection$ = new Subject<d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, unknown>>()

  combineLatest({
    graphicGSelection: graphicGSelection$,
    computedData: computedData$,
    // barData$: barData$,
    zeroYArr: zeroYArr$,
    groupLabels: groupLabels$,
    barScale: barScale$,
    params: fullParams$,
    chartParams: fullChartParams$,
    highlightTarget: highlightTarget$,
    barWidth: barWidth$,
    transformedBarRadius: transformedBarRadius$,
    delayGroup: delayGroup$,
    transitionItem: transitionItem$,
    SeriesDataMap: SeriesDataMap$,
    GroupDataMap: GroupDataMap$,
    isSeriesPositionSeprate: isSeriesPositionSeprate$
  }).pipe(
    takeUntil(destroy$),
    // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
    switchMap(async (d) => d),
  ).subscribe(data => {

    // const graphicGSelection: d3.Selection<SVGGElement, any, any, any> = selection.select(`g.${graphicClassName}`)
    
    const barSelection = renderRectBars({
      graphicGSelection: data.graphicGSelection,
      computedData: data.computedData,
      zeroYArr: data.zeroYArr,
      groupLabels: data.groupLabels,
      barScale: data.barScale,
      params: data.params,
      chartParams: data.chartParams,
      barWidth: data.barWidth,
      transformedBarRadius: data.transformedBarRadius,
      delayGroup: data.delayGroup,
      transitionItem: data.transitionItem,
      isSeriesPositionSeprate: data.isSeriesPositionSeprate
    })

    barSelection!
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

    barSelection$.next(barSelection!)
  })

  // combineLatest({
  //   barSelection: barSelection$,
  //   chartParams: fullChartParams$,
  //   barData$: barData$,
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d)
  // ).subscribe(data => {
  //   const ids = getGridHighlightIds(data.barData$, data.chartParams.highlightDefault)
  //   highlight(data.barSelection, ids)
  // })

  // const datumList$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.flat())
  // )
  // const highlight$ = highlightObservable({ datumList$, fullChartParams$, event$: subject.event$ })
  // gridHighlight$.subscribe()
  
  combineLatest({
    barSelection: barSelection$,
    highlight: gridHighlight$,
    fullChartParams: fullChartParams$
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




  // seriesSelection$
  //   .pipe(
  //     takeUntil(destroy$),
  //     switchMap(async d => d)
  //   ).subscribe(seriesSelection => {
      

  //     const clipPathID = getUniID(pluginName, 'clipPath-box')

  //     const axesSelection: d3.Selection<SVGGElement, string, any, any> = seriesSelection
  //       .selectAll<SVGGElement, any>('g')
  //       .data([clipPathID])
  //       .join('g')
  //       .attr('clip-path', `url(#${clipPathID})`)
  //     const defsSelection: d3.Selection<SVGDefsElement, string, any, any> = axesSelection
  //       .selectAll<SVGDefsElement, any>('defs')
  //       .data([clipPathID])
  //       .join('defs')
  //     const graphicGSelection: d3.Selection<SVGGElement, any, any, any> = axesSelection
  //       .selectAll<SVGGElement, any>('g')
  //       .data([clipPathID])
  //       .join('g')
  //     const barSelection$: Subject<d3.Selection<SVGRectElement, ComputedDatumGrid, SVGGElement, unknown>> = new Subject()

  //     gridAxesTransform$
  //       .pipe(
  //         takeUntil(destroy$),
  //         map(d => d.value),
  //         distinctUntilChanged()
  //       ).subscribe(d => {
  //         axesSelection
  //           .style('transform', d)
  //       })

  //     gridGraphicTransform$
  //       .pipe(
  //         takeUntil(destroy$),
  //         map(d => d.value),
  //         distinctUntilChanged()
  //       ).subscribe(d => {
  //         graphicGSelection
  //           .transition()
  //           .duration(50)
  //           .style('transform', d)
  //       })

  //     // const visibleComputedData$ = computedData$.pipe(
  //     //   takeUntil(destroy$),
  //     //   map(data => {
  //     //     const visibleComputedData = data
  //     //       .map(d => {
  //     //         return d.filter(_d => {
  //     //           return _d.visible == true
  //     //         })
  //     //       })
  //     //       .filter(d => d.length)
  //     //     return visibleComputedData
  //     //   })
  //     // )

  //     const zeroY$ = visibleComputedData$.pipe(
  //       map(d => d[0] && d[0][0]
  //         ? d[0][0].axisY - d[0][0].axisYFromZero
  //         : 0),
  //       distinctUntilChanged()
  //     )

  //     const barWidth$ = new Observable<number>(subscriber => {
  //       combineLatest({
  //         computedData: computedData$,
  //         visibleComputedData: visibleComputedData$,
  //         params: fullParams$,
  //         gridAxesSize: gridAxesSize$
  //       }).pipe(
  //         switchMap(async d => d)
  //       ).subscribe(data => {
  //         const barWidth = data.params.barWidth
  //           ? data.params.barWidth
  //           : calcBarWidth({
  //               axisWidth: data.gridAxesSize.width,
  //               groupAmount: data.computedData[0] ? data.computedData[0].length : 0,
  //               barAmountOfGroup: data.visibleComputedData.length,
  //               barPadding: data.params.barPadding,
  //               barGroupPadding: data.params.barGroupPadding
  //             })
  //         subscriber.next(barWidth)
  //       })
  //     }).pipe(
  //       takeUntil(destroy$),
  //       distinctUntilChanged()
  //     )

  //     // 圓角的值 [rx, ry]
  //     const transformedBarRadius$: Observable<[number, number]> = combineLatest({
  //       gridGraphicTransform: gridGraphicTransform$,
  //       barWidth: barWidth$,
  //       params: fullParams$
  //     }).pipe(
  //       takeUntil(destroy$),
  //       switchMap(async data => data),
  //       map(data => {
  //         const barHalfWidth = data.barWidth! / 2
  //         const radius = data.params.barRadius === true ? barHalfWidth
  //           : data.params.barRadius === false ? 0
  //           : typeof data.params.barRadius == 'number' ? data.params.barRadius
  //           : 0
  //         const transformedRx = radius == 0
  //           ? 0
  //           : radius / data.gridGraphicTransform.scale[0] // 反向外層scale的變型
  //         const transformedRy = radius == 0
  //           ? 0
  //           : radius / data.gridGraphicTransform.scale[1]
  //         return [transformedRx, transformedRy]
  //       })
  //     )

  //     // const SeriesDataMap$ = visibleComputedData$.pipe(
  //     //   map(d => makeGridSeriesDataMap(d))
  //     // )

  //     // const GroupDataMap$ = visibleComputedData$.pipe(
  //     //   map(d => makeGridGroupDataMap(d))
  //     // )

  //     const seriesLabels$ = visibleComputedData$.pipe(
  //       takeUntil(destroy$),
  //       map(data => {
  //         const SeriesLabelSet: Set<string> = new Set()
  //         data.forEach(d => {
  //           d.forEach(_d => {
  //             SeriesLabelSet.add(_d.seriesLabel)
  //           })
  //         })
  //         return Array.from(SeriesLabelSet)
  //       })
  //     )

  //     const groupLabels$ = visibleComputedData$.pipe(
  //       takeUntil(destroy$),
  //       map(data => {
  //         const GroupLabelSet: Set<string> = new Set()
  //         data.forEach(d => {
  //           d.forEach(_d => {
  //             GroupLabelSet.add(_d.groupLabel)
  //           })
  //         })
  //         return Array.from(GroupLabelSet)
  //       })
  //     )

  //     const barScale$: Observable<d3.ScalePoint<string>> = new Observable(subscriber => {
  //       combineLatest({
  //         seriesLabels: seriesLabels$,
  //         barWidth: barWidth$,
  //         params: fullParams$,
  //       }).pipe(
  //         takeUntil(destroy$),
  //         switchMap(async d => d)
  //       ).subscribe(data => {
  //         const barScale = makeBarScale(data.barWidth, data.seriesLabels, data.params)
  //         subscriber.next(barScale)
  //       })
  //     })

  //     const transitionDuration$ = fullChartParams$.pipe(
  //       takeUntil(destroy$),
  //       map(d => d.transitionDuration),
  //       distinctUntilChanged()
  //     )

  //     const delayGroup$ = new Observable<number>(subscriber => {
  //       combineLatest({
  //         groupLabels: groupLabels$,
  //         transitionDuration: transitionDuration$,
  //       }).pipe(
  //         switchMap(async d => d)
  //       ).subscribe(data => {
  //         const delay = calcDelayGroup(data.groupLabels.length, data.transitionDuration)
  //         subscriber.next(delay)
  //       })
  //     }).pipe(
  //       takeUntil(destroy$),
  //       distinctUntilChanged()
  //     )

  //     const transitionItem$ = new Observable<number>(subscriber => {
  //       combineLatest({
  //         groupLabels: groupLabels$,
  //         transitionDuration: transitionDuration$
  //       }).pipe(
  //         switchMap(async d => d)
  //       ).subscribe(data => {
  //         const transition = calctransitionItem(data.groupLabels.length, data.transitionDuration)
  //         subscriber.next(transition)
  //       })
  //     }).pipe(
  //       takeUntil(destroy$),
  //       distinctUntilChanged()
  //     )

  //     const barData$ = visibleComputedData$.pipe(
  //       takeUntil(destroy$),
  //       map(data => {
  //         // 取得原始陣列的維度
  //         const rows = data.length;
  //         const cols = data.reduce((prev, current) => {
  //           return Math.max(prev, current.length)
  //         }, 0)

  //         // 初始化轉換後的陣列
  //         const transposedArray = new Array(cols).fill(null).map(() => new Array(rows).fill(null))

  //         // 遍歷原始陣列，進行轉換
  //         for (let i = 0; i < rows; i++) {
  //             for (let j = 0; j < cols; j++) {
  //                 transposedArray[j][i] = data[i][j]
  //             }
  //         }
  //   // console.log('transposedArray', transposedArray)
  //         return transposedArray
  //       })
  //     )

  //     gridAxesSize$.pipe(
  //       takeUntil(destroy$)
  //     ).subscribe(data => {
  //       const clipPathData = [{
  //         id: clipPathID,
  //         width: data.width,
  //         height: data.height
  //       }]
  //       renderClipPath({
  //         defsSelection,
  //         clipPathData
  //       })
  //     })

  //     // const renderBarsFn$ = fullParams$.pipe(
  //     //   takeUntil(destroy$),
  //     //   map(d => d.barType === 'rect'
  //     //     ? renderRectBars
  //     //     : d.barType === 'triangle'
  //     //       ? renderTriangleBars
  //     //       : renderRectBars),
  //     // )

  //     const highlightTarget$ = fullChartParams$.pipe(
  //       takeUntil(destroy$),
  //       map(d => d.highlightTarget),
  //       distinctUntilChanged()
  //     )

  //     combineLatest({
  //       // renderBarsFn: renderBarsFn$,
  //       computedData: computedData$,
  //       barData$: barData$,
  //       zeroY: zeroY$,
  //       groupLabels: groupLabels$,
  //       barScale: barScale$,
  //       params: fullParams$,
  //       chartParams: fullChartParams$,
  //       highlightTarget: highlightTarget$,
  //       barWidth: barWidth$,
  //       transformedBarRadius: transformedBarRadius$,
  //       delayGroup: delayGroup$,
  //       transitionItem: transitionItem$,
  //       SeriesDataMap: SeriesDataMap$,
  //       GroupDataMap: GroupDataMap$
  //     }).pipe(
  //       takeUntil(destroy$),
  //       // 轉換後會退訂前一個未完成的訂閱事件，因此可以取到「同時間」最後一次的訂閱事件
  //       switchMap(async (d) => d),
  //     ).subscribe(data => {
        
  //       const barSelection = renderRectBars({
  //         selection: graphicGSelection,
  //         data: data.barData$,
  //         zeroY: data.zeroY,
  //         groupLabels: data.groupLabels,
  //         barScale: data.barScale,
  //         params: data.params,
  //         chartParams: data.chartParams,
  //         barWidth: data.barWidth,
  //         transformedBarRadius: data.transformedBarRadius,
  //         delayGroup: data.delayGroup,
  //         transitionItem: data.transitionItem
  //       })

  //       barSelection!
  //         .on('mouseover', (event, datum) => {
  //           event.stopPropagation()
      
  //           event$.next({
  //             type: 'grid',
  //             eventName: 'mouseover',
  //             pluginName,
  //             highlightTarget: data.highlightTarget,
  //             datum,
  //             series: data.SeriesDataMap.get(datum.seriesLabel)!,
  //             seriesIndex: datum.seriesIndex,
  //             seriesLabel: datum.seriesLabel,
  //             groups: data.GroupDataMap.get(datum.groupLabel)!,
  //             groupIndex: datum.groupIndex,
  //             groupLabel: datum.groupLabel,
  //             event,
  //             data: data.computedData
  //           })
  //         })
  //         .on('mousemove', (event, datum) => {
  //           event.stopPropagation()

  //           event$.next({
  //             type: 'grid',
  //             eventName: 'mousemove',
  //             pluginName,
  //             highlightTarget: data.highlightTarget,
  //             datum,
  //             series: data.SeriesDataMap.get(datum.seriesLabel)!,
  //             seriesIndex: datum.seriesIndex,
  //             seriesLabel: datum.seriesLabel,
  //             groups: data.GroupDataMap.get(datum.groupLabel)!,
  //             groupIndex: datum.groupIndex,
  //             groupLabel: datum.groupLabel,
  //             event,
  //             data: data.computedData
  //           })
  //         })
  //         .on('mouseout', (event, datum) => {
  //           event.stopPropagation()

  //           event$.next({
  //             type: 'grid',
  //             eventName: 'mouseout',
  //             pluginName,
  //             highlightTarget: data.highlightTarget,
  //             datum,
  //             series: data.SeriesDataMap.get(datum.seriesLabel)!,
  //             seriesIndex: datum.seriesIndex,
  //             seriesLabel: datum.seriesLabel,
  //             groups: data.GroupDataMap.get(datum.groupLabel)!,
  //             groupIndex: datum.groupIndex,
  //             groupLabel: datum.groupLabel,
  //             event,
  //             data: data.computedData
  //           })
  //         })
  //         .on('click', (event, datum) => {
  //           event.stopPropagation()

  //           event$.next({
  //             type: 'grid',
  //             eventName: 'click',
  //             pluginName,
  //             highlightTarget: data.highlightTarget,
  //             datum,
  //             series: data.SeriesDataMap.get(datum.seriesLabel)!,
  //             seriesIndex: datum.seriesIndex,
  //             seriesLabel: datum.seriesLabel,
  //             groups: data.GroupDataMap.get(datum.groupLabel)!,
  //             groupIndex: datum.groupIndex,
  //             groupLabel: datum.groupLabel,
  //             event,
  //             data: data.computedData
  //           })
  //         })

  //       barSelection$.next(barSelection!)
  //     })

  //     // combineLatest({
  //     //   barSelection: barSelection$,
  //     //   chartParams: fullChartParams$,
  //     //   barData$: barData$,
  //     // }).pipe(
  //     //   takeUntil(destroy$),
  //     //   switchMap(async d => d)
  //     // ).subscribe(data => {
  //     //   const ids = getGridHighlightIds(data.barData$, data.chartParams.highlightDefault)
  //     //   highlight(data.barSelection, ids)
  //     // })

  //     // const datumList$ = computedData$.pipe(
  //     //   takeUntil(destroy$),
  //     //   map(d => d.flat())
  //     // )
  //     // const highlight$ = highlightObservable({ datumList$, fullChartParams$, event$: subject.event$ })
  //     gridHighlight$.subscribe()
      
  //     combineLatest({
  //       barSelection: barSelection$,
  //       highlight: gridHighlight$,
  //       fullChartParams: fullChartParams$
  //     }).pipe(
  //       takeUntil(destroy$),
  //       switchMap(async d => d)
  //     ).subscribe(data => {
  //       highlight({
  //         selection: data.barSelection,
  //         ids: data.highlight,
  //         fullChartParams: data.fullChartParams
  //       })
  //     })

  //   })


  return () => {
    seriesDestroy$.next(undefined)
    destroy$.next(undefined)
  }
}