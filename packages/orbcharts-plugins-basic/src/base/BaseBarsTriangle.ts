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
  ComputedLayoutDatumGrid,
  ComputedLayoutDataGrid,
  EventGrid,
  ChartParams,
  ContainerPosition,
  Layout,
  TransformData } from '@orbcharts/core'
import { getD3TransitionEase } from '../utils/d3Utils'
import { getClassName, getUniID } from '../utils/orbchartsUtils'
import { gridSelectionsObservable } from '../grid/gridObservables'

export interface BaseBarsTriangleParams {
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  linearGradientOpacity: [number, number]
}

interface BaseBarsContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataGrid>
  computedLayoutData$: Observable<ComputedLayoutDataGrid>
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  visibleComputedLayoutData$: Observable<ComputedLayoutDataGrid>
  existSeriesLabels$: Observable<string[]>
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
  gridHighlight$: Observable<ComputedDatumGrid[]>
  gridContainer$: Observable<ContainerPosition[]>
  isSeriesPositionSeprate$: Observable<boolean>
  event$: Subject<EventGrid>
}


interface RenderBarParams {
  graphicGSelection: d3.Selection<SVGGElement, unknown, any, any>
  pathGClassName: string
  pathClassName: string
  visibleComputedLayoutData: ComputedLayoutDataGrid
  linearGradientIds: string[]
  zeroYArr: number[]
  groupLabels: string[]
  barScale: d3.ScalePoint<string>
  params: BaseBarsTriangleParams
  chartParams: ChartParams
  barWidth: number
  delayGroup: number
  transitionItem: number
  isSeriesPositionSeprate: boolean
}

// interface BarDatumGrid extends ComputedDatumGrid {
//   linearGradientId: string
// }

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

// const pluginName = 'BaseBarsTriangle'
// const pathGClassName = getClassName(pluginName, 'pathG')
// const pathClassName = getClassName(pluginName, 'path')
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

function renderTriangleBars ({ graphicGSelection, pathGClassName, pathClassName, visibleComputedLayoutData, linearGradientIds, zeroYArr, groupLabels, barScale, params, chartParams, barWidth, delayGroup, transitionItem, isSeriesPositionSeprate }: RenderBarParams) {
  
  const barHalfWidth = barWidth! / 2

  graphicGSelection
    .each((d, seriesIndex, g) => {
      // g
      const gSelection = d3.select(g[seriesIndex])
        .selectAll<SVGGElement, ComputedDatumGrid>(`g.${pathGClassName}`)
        .data(visibleComputedLayoutData[seriesIndex] ?? [])
        .join(
          enter => {
            const enterSelection = enter
              .append('g')
              .classed(pathGClassName, true)
              .attr('cursor', 'pointer')
            enterSelection
              .append('path')
              .classed(pathClassName, true)
              .style('vector-effect', 'non-scaling-stroke')
              .attr('d', (d) => {
                const x = -barHalfWidth
                const y1 = zeroYArr[seriesIndex]
                const y2 = zeroYArr[seriesIndex]
                return `M${x},${y1} L${x + (barWidth! / 2)},${y2} ${x + barWidth!},${y1}`
              })
            return enterSelection
          },
          update => update,
          exit => exit.remove()
        )
        .attr('transform', d => `translate(${isSeriesPositionSeprate ? 0 : barScale(d.seriesLabel)!}, 0)`)

      // path
      gSelection.select(`path.${pathClassName}`)
        .attr('height', d => Math.abs(d.axisYFromZero))
        .attr('y', d => d.axisY < zeroYArr[seriesIndex] ? d.axisY : zeroYArr[seriesIndex])
        .attr('x', d => isSeriesPositionSeprate ? 0 : barScale(d.seriesLabel)!)
        // .style('fill', d => `url(#${d.linearGradientId})`)
        .style('fill', d => `url(#${linearGradientIds[d.seriesIndex]})`)
        .attr('stroke', d => d.color)
        .attr('transform', d => `translate(${(d ? d.axisX : 0)}, ${0})`)
        .transition()
        .duration(transitionItem)
        .ease(getD3TransitionEase(chartParams.transitionEase))
        .delay((d, i) => d.groupIndex * delayGroup)
        // .attr('transform', `translate(${-barHalfWidth}, 0)`)
        // .attr('x', d => itemScale(d.itemLabel)!)
        // .attr('y', d => -d.y)
        .attr('d', (d) => {
          const x = -barHalfWidth
          const y1 = zeroYArr[seriesIndex]
          const y2 = d.axisY
          return `M${x},${y1} L${x + (barWidth! / 2)},${y2} ${x + barWidth!},${y1}`
        })
      })

  const graphicBarSelection: d3.Selection<SVGPathElement, ComputedDatumGrid, any, any> = graphicGSelection.selectAll(`path.${pathClassName}`)

  return graphicBarSelection
}

function renderLinearGradient ({ defsSelection, computedData, linearGradientIds, params }: {
  defsSelection: d3.Selection<SVGDefsElement, any, any, any>
  computedData: ComputedDataGrid
  linearGradientIds: string[]
  params: BaseBarsTriangleParams
}) {
  defsSelection!
    .selectAll<SVGLinearGradientElement, ComputedDatumGrid>('linearGradient')
    .data(computedData ?? [])
    .join(
      enter => {
        return enter
          .append('linearGradient')
          .attr('x1', '0%')
          .attr('x2', '0%')
          .attr('y1', '100%')
          .attr('y2', '0%')
          .attr('spreadMethod', 'pad')
      },
      update => update,
      exit => exit.remove()
    )
    .attr('id', (d, i) => {
      return d[0] ? linearGradientIds[d[0].seriesIndex] : ''
    })
    .html((d, i) => {
      const color = d[0] ? d[0].color : ''
      return `
        <stop offset="0%"   stop-color="${color}" stop-opacity="${params.linearGradientOpacity[0]}"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="${params.linearGradientOpacity[1]}"/>
      `
    })

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
  computedLayoutData$,
  visibleComputedData$,
  visibleComputedLayoutData$,
  existSeriesLabels$,
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
  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')
  const pathGClassName = getClassName(pluginName, 'pathG')
  const pathClassName = getClassName(pluginName, 'path')

  const { 
    seriesSelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  } = gridSelectionsObservable({
    selection,
    pluginName,
    clipPathID,
    existSeriesLabels$,
    gridContainer$,
    gridAxesTransform$,
    gridGraphicTransform$
  })

  // valueAxis 的起始座標
  const valueAxisStart$: Observable<number> = gridGraphicTransform$.pipe(
    takeUntil(destroy$),
    map(data => {
      // 抵消掉外層的變型
      return - data.translate[1] / data.scale[1]
    })
  )

  const zeroYArr$ = visibleComputedLayoutData$.pipe(
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

  const linearGradientIds$ = seriesLabels$.pipe(
    takeUntil(destroy$),
    map(d => d.map((d, i) => {
      return getUniID(pluginName, `lineargradient-${d}`)
    }))
  )

  // const barData$ = combineLatest({
  //   linearGradientIds: linearGradientIds$,
  //   computedData: computedData$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async d => d),
  //   map(data => {
  //     return data.computedData.map((series, seriesIndex) => {
  //       return series.map((_d, _i) => {
  //         return <BarDatumGrid>{
  //           linearGradientId: data.linearGradientIds[seriesIndex],
  //           ..._d
  //         }
  //       })
  //     })
  //   })
  // )

  const barSelection$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    defsSelection: defsSelection$,
    visibleComputedLayoutData: visibleComputedLayoutData$,
    linearGradientIds: linearGradientIds$,
    zeroYArr: zeroYArr$,
    groupLabels: groupLabels$,
    barScale: barScale$,
    params: fullParams$,
    chartParams: fullChartParams$,
    highlightTarget: highlightTarget$,
    barWidth: barWidth$,
    delayGroup: delayGroup$,
    transitionItem: transitionItem$,
    SeriesDataMap: SeriesDataMap$,
    GroupDataMap: GroupDataMap$,
    isSeriesPositionSeprate: isSeriesPositionSeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return renderTriangleBars({
        graphicGSelection: data.graphicGSelection,
        pathGClassName,
        pathClassName,
        visibleComputedLayoutData: data.visibleComputedLayoutData,
        linearGradientIds: data.linearGradientIds,
        zeroYArr: data.zeroYArr,
        groupLabels: data.groupLabels,
        barScale: data.barScale,
        params: data.params,
        chartParams: data.chartParams,
        barWidth: data.barWidth,
        delayGroup: data.delayGroup,
        transitionItem: data.transitionItem,
        isSeriesPositionSeprate: data.isSeriesPositionSeprate
      })
    })
  )

  combineLatest({
    barSelection: barSelection$,
    computedData: computedData$,
    highlightTarget: highlightTarget$,
    SeriesDataMap: SeriesDataMap$,
    GroupDataMap: GroupDataMap$,
  }).subscribe(data => {

    data.barSelection!
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
          gridIndex: datum.gridIndex,
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
          gridIndex: datum.gridIndex,
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
          gridIndex: datum.gridIndex,
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
  })

  combineLatest({
    defsSelection: defsSelection$,
    computedData: computedData$,
    linearGradientIds: linearGradientIds$,
    params: fullParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    renderLinearGradient({
      defsSelection: data.defsSelection,
      computedData: data.computedData,
      linearGradientIds: data.linearGradientIds,
      params: data.params
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