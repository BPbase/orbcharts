import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  Observable,
  Subject } from 'rxjs'
import type { BasePluginFn } from './types'
import type {
  ComputedDatumGrid,
  ComputedDataGrid,
  ComputedAxesDataGrid,
  DataFormatterTypeMap,
  ContainerPositionScaled,
  EventGrid,
  ChartParams, 
  Layout,
  TransformData } from '../../lib/core-types'
import type { BaseBarsParams } from '../../lib/plugins-basic-types'
import { getD3TransitionEase } from '../utils/d3Utils'
import { getClassName, getUniID } from '../utils/orbchartsUtils'
import { gridSelectionsObservable } from '../grid/gridObservables'

// export interface BaseBarsParams {
//   // barType: BarType
//   barWidth: number
//   barPadding: number
//   barGroupPadding: number // 群組和群組間的間隔
//   barRadius: number | boolean
// }

interface BaseBarsContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataGrid>
  computedAxesData$: Observable<ComputedAxesDataGrid>
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  visibleComputedAxesData$: Observable<ComputedAxesDataGrid>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  GroupDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  fullParams$: Observable<BaseBarsParams>
  fullChartParams$: Observable<ChartParams>
  gridAxesTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridGraphicReverseScale$: Observable<[number, number][]>
  gridAxesSize$: Observable<{
    width: number;
    height: number;
  }>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  isSeriesSeprate$: Observable<boolean>
  event$: Subject<EventGrid>
}

interface RenderBarParams {
  graphicGSelection: d3.Selection<SVGGElement, string, any, any>
  rectClassName: string
  visibleComputedAxesData: ComputedAxesDataGrid
  zeroYArr: number[]
  groupLabels: string[]
  barScale: d3.ScalePoint<string>
  params: BaseBarsParams
  chartParams: ChartParams
  barWidth: number
  transformedBarRadius: [number, number][]
  delayGroup: number
  transitionItem: number
  isSeriesSeprate: boolean
}

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

// const pluginName = 'Bars'
// const rectClassName = getClassName(pluginName, 'rect')
// group的delay在動畫中的佔比（剩餘部份的時間為圖形本身的動畫時間，因為delay時間和最後一個group的動畫時間加總為1）
const groupDelayProportionOfDuration = 0.3

function calcBarWidth ({ axisWidth, groupAmount, barAmountOfGroup, barPadding = 0, barGroupPadding = 0 }: {
  axisWidth: number
  groupAmount: number
  barAmountOfGroup: number
  barPadding: number
  barGroupPadding: number
}) {
  const eachGroupWidth = groupAmount > 1 // 等於 1 時會算出 Infinity
    ? axisWidth / (groupAmount - 1) // -1是因為要扣掉兩側的padding
    : axisWidth
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
// let _data: ComputedDatumGrid[][] = []

function renderRectBars ({ graphicGSelection, rectClassName, visibleComputedAxesData, zeroYArr, groupLabels, barScale, params, chartParams, barWidth, transformedBarRadius, delayGroup, transitionItem, isSeriesSeprate }: RenderBarParams) {

  const barHalfWidth = barWidth! / 2

  graphicGSelection
    .each((seriesData, seriesIndex, g) => {
      d3.select(g[seriesIndex])
        .selectAll<SVGGElement, ComputedDatumGrid>(`rect.${rectClassName}`)
        .data(visibleComputedAxesData[seriesIndex] ?? [], d => d.id)
        .join(
          enter => {
            // console.log('enter')
            return enter
              .append('rect')
              .classed(rectClassName, true)
              .attr('cursor', 'pointer')
              .attr('height', d => 1)
          },
          update => update,
          exit => exit.remove()
        )
        .attr('transform', (d, i) => `translate(${(d ? d.axisX : 0) - barHalfWidth}, ${0})`)
        .attr('fill', d => d.color)
        .attr('y', d => d.axisY < zeroYArr[seriesIndex] ? d.axisY : zeroYArr[seriesIndex])
        .attr('x', d => isSeriesSeprate ? 0 : barScale(d.seriesLabel)!)
        .attr('width', barWidth!)
        .attr('rx', transformedBarRadius[seriesIndex][0] ?? 1)
        .attr('ry', transformedBarRadius[seriesIndex][1] ?? 1)
        .transition()
        .duration(transitionItem)
        .ease(getD3TransitionEase(chartParams.transitionEase))
        .delay((d, i) => d.groupIndex * delayGroup)
        .attr('height', d => Math.abs(d.axisYFromZero) || 1) // 無值還是給一個 1 的高度
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
  //           .attr('x', d => isSeriesSeprate ? 0 : barScale(d.seriesLabel)!)
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
  computedAxesData$,
  visibleComputedData$,
  visibleComputedAxesData$,
  seriesLabels$,
  SeriesDataMap$,
  GroupDataMap$,
  fullParams$,
  fullChartParams$,
  gridAxesTransform$,
  gridGraphicTransform$,
  gridGraphicReverseScale$,
  gridAxesSize$,
  gridHighlight$,
  gridContainerPosition$,
  isSeriesSeprate$,
  event$
}) => {

  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')
  const rectClassName = getClassName(pluginName, 'rect')
  
  // const seriesSelection$ = computedData$.pipe(
  //   takeUntil(destroy$),
  //   distinctUntilChanged((a, b) => {
  //     // 只有當series的數量改變時，才重新計算
  //     return a.length === b.length
  //   }),
  //   map((computedData, i) => {
  //     return selection
  //       .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${seriesClassName}`)
  //       .data(computedData, d => d[0] ? d[0].seriesIndex : i)
  //       .join(
  //         enter => {
  //           return enter
  //             .append('g')
  //             .classed(seriesClassName, true)
  //             .each((d, i, g) => {
  //               const axesSelection = d3.select(g[i])
  //                 .selectAll<SVGGElement, ComputedDatumGrid[]>(`g.${axesClassName}`)
  //                 .data([i])
  //                 .join(
  //                   enter => {
  //                     return enter
  //                       .append('g')
  //                       .classed(axesClassName, true)
  //                       .attr('clip-path', `url(#${clipPathID})`)
  //                       .each((d, i, g) => {
  //                         const defsSelection = d3.select(g[i])
  //                           .selectAll<SVGDefsElement, any>('defs')
  //                           .data([i])
  //                           .join('defs')
            
  //                         const graphicGSelection = d3.select(g[i])
  //                           .selectAll<SVGGElement, any>('g')
  //                           .data([i])
  //                           .join('g')
  //                           .classed(graphicClassName, true)
  //                       })
  //                   },
  //                   update => update,
  //                   exit => exit.remove()
  //                 )
  //             })
  //         },
  //         update => update,
  //         exit => exit.remove()
  //       )
  //   })
  // )

  // combineLatest({
  //   seriesSelection: seriesSelection$,
  //   gridContainerPosition: gridContainerPosition$                                                                                                                                                                                       
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d)
  // ).subscribe(data => {
  //   data.seriesSelection
  //     .transition()
  //     .attr('transform', (d, i) => {
  //       const translate = data.gridContainerPosition[i].translate
  //       const scale = data.gridContainerPosition[i].scale
  //       return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
  //     })
  // })


  // const axesSelection$ = combineLatest({
  //   seriesSelection: seriesSelection$,
  //   gridAxesTransform: gridAxesTransform$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d),
  //   map(data => {
  //     return data.seriesSelection
  //       .select<SVGGElement>(`g.${axesClassName}`)
  //       .style('transform', data.gridAxesTransform.value)
  //   })
  // )
  // const defsSelection$ = axesSelection$.pipe(
  //   takeUntil(destroy$),
  //   map(axesSelection => {
  //     return axesSelection.select<SVGDefsElement>('defs')
  //   })
  // )
  // const graphicGSelection$ = combineLatest({
  //   axesSelection: axesSelection$,
  //   gridGraphicTransform: gridGraphicTransform$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d),
  //   map(data => {
  //     const graphicGSelection = data.axesSelection
  //       .select<SVGGElement>(`g.${graphicClassName}`)
  //     graphicGSelection
  //       .transition()
  //       .duration(50)
  //       .style('transform', data.gridGraphicTransform.value)
  //     return graphicGSelection
  //   })
  // )

  const { 
    seriesSelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  } = gridSelectionsObservable({
    selection,
    pluginName,
    clipPathID,
    seriesLabels$,
    gridContainerPosition$,
    gridAxesTransform$,
    gridGraphicTransform$
  })

  const zeroYArr$ = visibleComputedAxesData$.pipe(
    takeUntil(destroy$),
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
    isSeriesSeprate: isSeriesSeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      if (data.params.barWidth) {
        return data.params.barWidth
      } else if (data.isSeriesSeprate) {
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
    }),
    distinctUntilChanged()
  )

  // 圓角的值 [rx, ry]
  const transformedBarRadius$: Observable<[number, number][]> = combineLatest({
    computedData: computedData$,
    // gridGraphicTransform: gridGraphicTransform$,
    barWidth: barWidth$,
    params: fullParams$,
    // gridContainerPosition: gridContainerPosition$,
    // gridAxesTransform: gridAxesTransform$
    gridGraphicReverseScale: gridGraphicReverseScale$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async data => data),
    map(data => {
      const barHalfWidth = data.barWidth! / 2
      const radius = data.params.barRadius === true ? barHalfWidth
        : data.params.barRadius === false ? 0
        : typeof data.params.barRadius == 'number' ? data.params.barRadius
        : 0
      
      return data.computedData.map((series, seriesIndex) => {
        const gridGraphicReverseScale = data.gridGraphicReverseScale[seriesIndex] ?? data.gridGraphicReverseScale[0]

        let transformedRx = radius * gridGraphicReverseScale[0]
        let transformedRy = radius * gridGraphicReverseScale[1]
        // if (radius == 0) {
        //   transformedRx = 0
        //   transformedRy = 0
        // } else if (data.gridAxesTransform.rotate == 0) {
        //   transformedRx = radius
        //     // 抵消外層scale的變型
        //     / data.gridGraphicTransform.scale[0] / data.gridContainerPosition[0].scale[0]
        //   transformedRy = radius
        //     // 抵消外層scale的變型
        //     / data.gridGraphicTransform.scale[1] / data.gridContainerPosition[0].scale[1]
        // } else if (data.gridAxesTransform.rotate != 0) {
        //   transformedRx = radius
        //     // 抵消外層scale的變型，由於有90度的旋轉，所以外層 (container) x和y的scale要互換
        //     / data.gridGraphicTransform.scale[0] / data.gridContainerPosition[0].scale[1]
        //   transformedRy = radius
        //     // 抵消外層scale的變型，由於有90度的旋轉，所以外層 (container) x和y的scale要互換
        //     / data.gridGraphicTransform.scale[1] / data.gridContainerPosition[0].scale[0]
        // }
        
        // 如果計算出來的x圓角值大於寬度一半則進行修正
        if (transformedRx > barHalfWidth) {
          const rScale = barHalfWidth / transformedRx
          transformedRx = transformedRx * rScale
          transformedRy = transformedRy * rScale
        }

        return [transformedRx, transformedRy] 
      })
    })
  )

  
  // const seriesLabels$ = visibleComputedData$.pipe(
  //   takeUntil(destroy$),
  //   map(data => {
  //     const SeriesLabelSet: Set<string> = new Set()
  //     data.forEach(d => {
  //       d.forEach(_d => {
  //         SeriesLabelSet.add(_d.seriesLabel)
  //       })
  //     })
  //     return Array.from(SeriesLabelSet)
  //   })
  // )

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

  const barScale$ = combineLatest({
    seriesLabels: seriesLabels$,
    barWidth: barWidth$,
    params: fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return makeBarScale(data.barWidth, data.seriesLabels, data.params)
    })
  )
  
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

  combineLatest({
    defsSelection: defsSelection$,
    gridAxesSize: gridAxesSize$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
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


  const highlightTarget$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  const barSelection$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    visibleComputedAxesData: visibleComputedAxesData$,
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
    isSeriesSeprate: isSeriesSeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return renderRectBars({
        graphicGSelection: data.graphicGSelection,
        rectClassName,
        visibleComputedAxesData: data.visibleComputedAxesData,
        zeroYArr: data.zeroYArr,
        groupLabels: data.groupLabels,
        barScale: data.barScale,
        params: data.params,
        chartParams: data.chartParams,
        barWidth: data.barWidth,
        transformedBarRadius: data.transformedBarRadius,
        delayGroup: data.delayGroup,
        transitionItem: data.transitionItem,
        isSeriesSeprate: data.isSeriesSeprate
      })
    })
  )

  combineLatest({
    barSelection: barSelection$,
    computedData: computedData$,
    highlightTarget: highlightTarget$,
    SeriesDataMap: SeriesDataMap$,
    GroupDataMap: GroupDataMap$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    data.barSelection
      .on('mouseover', (event, datum) => {
        event.stopPropagation()
  
        event$.next({
          type: 'grid',
          eventName: 'mouseover',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          gridIndex: datum.gridIndex,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          group: data.GroupDataMap.get(datum.groupLabel)!,
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
          gridIndex: datum.gridIndex,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          group: data.GroupDataMap.get(datum.groupLabel)!,
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
          gridIndex: datum.gridIndex,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          group: data.GroupDataMap.get(datum.groupLabel)!,
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
          gridIndex: datum.gridIndex,
          series: data.SeriesDataMap.get(datum.seriesLabel)!,
          seriesIndex: datum.seriesIndex,
          seriesLabel: datum.seriesLabel,
          group: data.GroupDataMap.get(datum.groupLabel)!,
          groupIndex: datum.groupIndex,
          groupLabel: datum.groupLabel,
          event,
          data: data.computedData
        })
      })
  })

  
  combineLatest({
    barSelection: barSelection$,
    highlight: gridHighlight$.pipe(
      map(data => data.map(d => d.id))
    ),
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


  return () => {
    destroy$.next(undefined)
  }
}