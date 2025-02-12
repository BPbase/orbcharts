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
  ComputedDatumMultiValue,
  ComputedDataMultiValue,
  // ComputedLayoutDataGrid,
  DataFormatterTypeMap,
  ContainerPositionScaled,
  ContainerSize,
  EventMultiValue,
  ChartParams, 
  Layout,
  TransformData } from '../../lib/core-types'
import type { BaseRankingBarsParams } from '../../lib/plugins-basic-types'
import { getD3TransitionEase } from '../utils/d3Utils'
import { getClassName, getUniID } from '../utils/orbchartsUtils'
import { multiValueSelectionsObservable } from '../multiValue/multiValueObservables'

// export interface BaseBarsParams {
//   // barType: BarType
//   barWidth: number
//   barPadding: number
//   barGroupPadding: number // 群組和群組間的間隔
//   barRadius: number | boolean
// }

interface BaseBarsContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataMultiValue>
  visibleComputedRankingData$: Observable<ComputedDatumMultiValue[][]>
  categoryLabels$: Observable<string[]>
  CategoryDataMap$: Observable<Map<string, ComputedDatumMultiValue[]>>
  fullParams$: Observable<BaseRankingBarsParams>
  fullChartParams$: Observable<ChartParams>
  layout$: Observable<Layout>
  graphicTransform$: Observable<TransformData>
  graphicReverseScale$: Observable<[number, number][]>
  highlight$: Observable<ComputedDatumMultiValue[]>
  computedRankingAmountList$: Observable<number[]>
  rankingScaleList$: Observable<d3.ScalePoint<string>[]>
  // rankingItemHeightList$: Observable<number[]>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  isCategorySeprate$: Observable<boolean>
  event$: Subject<EventMultiValue>
}

interface RenderBarParams {
  graphicGSelection: d3.Selection<SVGGElement, string, any, any>
  rectClassName: string
  visibleComputedRankingData: ComputedDatumMultiValue[][]
  // zeroYArr: number[]
  // groupLabels: string[]
  // barScale: d3.ScalePoint<string>
  rankingScaleList: d3.ScalePoint<string>[]
  // rankingItemHeightList: number[]
  params: BaseRankingBarsParams
  chartParams: ChartParams
  barWidthList: number[]
  // transformedBarRadius: [number, number][]
  // delayGroup: number
  transitionItem: number
  isCategorySeprate: boolean
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

function makeBarScale (barWidth: number, categoryLabels: string[], params: BaseRankingBarsParams) {
  const barHalfWidth = barWidth! / 2
  const barGroupWidth = barWidth * categoryLabels.length + params.bar.barPadding! * categoryLabels.length
  return d3.scalePoint()
    .domain(categoryLabels)
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
// let _data: ComputedDatumMultiValue[][] = []

function renderRectBars ({ graphicGSelection, rectClassName, visibleComputedRankingData, rankingScaleList, params, chartParams, barWidthList, transitionItem, isCategorySeprate }: RenderBarParams) {

  // const barHalfWidth = barWidth! / 2

  graphicGSelection
    .each((_, categoryIndex, g) => {
      d3.select(g[categoryIndex])
        .selectAll<SVGGElement, ComputedDatumMultiValue>(`rect.${rectClassName}`)
        .data(visibleComputedRankingData[categoryIndex] ?? [], d => d.id)
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
        .attr('y', d => rankingScaleList[categoryIndex] && rankingScaleList[categoryIndex](d.label))
        .attr('x', d => isCategorySeprate ? 0 : barScale(d.seriesLabel)!)
        .attr('width', barWidth!)
        .attr('rx', transformedBarRadius[seriesIndex][0] ?? 1)
        .attr('ry', transformedBarRadius[seriesIndex][1] ?? 1)
        .transition()
        .duration(transitionItem)
        .ease(getD3TransitionEase(chartParams.transitionEase))
        .delay((d, i) => d.groupIndex * delayGroup)
        .attr('height', d => Math.abs(d.axisYFromZero) || 1) // 無值還是給一個 1 的高度
    })

  const graphicBarSelection: d3.Selection<SVGRectElement, ComputedDatumMultiValue, SVGGElement, unknown> = graphicGSelection.selectAll(`rect.${rectClassName}`)

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
  selection: d3.Selection<any, ComputedDatumMultiValue, any, any>
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
  visibleComputedRankingData$,
  categoryLabels$,
  CategoryDataMap$,
  fullParams$,
  fullChartParams$,
  layout$,
  graphicTransform$,
  graphicReverseScale$,
  highlight$,
  computedRankingAmountList$,
  rankingScaleList$,
  // rankingItemHeightList$,
  containerPosition$,
  containerSize$,
  isCategorySeprate$,
  event$
}) => {

  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')
  const rectClassName = getClassName(pluginName, 'rect')
  
  const {
    categorySelection$,
    axesSelection$,
    defsSelection$,
    graphicGSelection$
  } = multiValueSelectionsObservable({
    selection,
    pluginName,
    clipPathID,
    categoryLabels$: categoryLabels$,
    containerPosition$: containerPosition$,
    graphicTransform$: graphicTransform$
  })

  // const graphicReverseScale$: Observable<[number, number][]> = combineLatest({
  //   computedData: computedData$,
  //   graphicReverseScale: graphicReverseScale$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async data => data),
  //   map(data => {
  //     return data.computedData.map((series, categoryIndex) => {
  //       return data.graphicReverseScale[categoryIndex]
  //     })
  //   })
  // )

  const clipPathSubscription = combineLatest({
    defsSelection: defsSelection$,
    layout: layout$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {
    // 外層的遮罩
    const clipPathData = [{
      id: clipPathID,
      width: data.layout.width,
      height: data.layout.height
    }]
    renderClipPath({
      defsSelection: data.defsSelection,
      clipPathData,
    })
  })

  const barWidthList$ = combineLatest({
    computedData: computedData$,
    visibleComputedRankingData: visibleComputedRankingData$,
    params: fullParams$,
    // gridAxesSize: gridAxesSize$,
    computedRankingAmountList: computedRankingAmountList$,
    containerSize: containerSize$,
    isCategorySeprate: isCategorySeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      if (data.params.bar.barWidth) {
        return data.computedRankingAmountList.map(_ => {
          return data.params.bar.barWidth
        })
      } else {
        return data.computedRankingAmountList.map(computedRankingAmount => {
          return calcBarWidth({
            axisWidth: data.containerSize.height,
            groupAmount: computedRankingAmount,
            barAmountOfGroup: 1,
            barPadding: 0,
            barGroupPadding: data.params.bar.barPadding
          })
        })
      }
    }),
    distinctUntilChanged()
  )

  const transitionDuration$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.transitionDuration),
    distinctUntilChanged()
  )

  const transitionItem$ = new Observable<number>(subscriber => {
    combineLatest({
      categoryLabels: categoryLabels$,
      transitionDuration: transitionDuration$
    }).pipe(
      switchMap(async d => d)
    ).subscribe(data => {
      const transition = calctransitionItem(data.categoryLabels.length, data.transitionDuration)
      subscriber.next(transition)
    })
  }).pipe(
    takeUntil(destroy$),
    distinctUntilChanged()
  )

  const graphicSelection$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    visibleComputedRankingData: visibleComputedRankingData$,
    rankingScaleList: rankingScaleList$,
    barWidthList: barWidthList$,
    fullChartParams: fullChartParams$,
    fullParams: fullParams$,
    transitionItem: transitionItem$,
    isCategorySeprate: isCategorySeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      // return renderDots({
      //   graphicGSelection: data.graphicGSelection,
      //   circleGClassName,
      //   circleClassName,
      //   visibleComputedRankingData: data.visibleComputedRankingData,
      //   fullParams: data.fullParams,
      //   fullChartParams: data.fullChartParams,
      //   graphicReverseScale: data.graphicReverseScale
      // })
      renderRectBars({
        graphicGSelection: data.graphicGSelection,
        rectClassName,
        visibleComputedRankingData: data.visibleComputedRankingData,
        // zeroYArr,
        // groupLabels,
        // barScale,
        rankingScaleList: data.rankingScaleList,
        // rankingItemHeightList: data.rankingItemHeightList,
        params: data.fullParams,
        chartParams: data.fullChartParams,
        barWidthList: data.barWidthList,
        // transformedBarRadius,
        // delayGroup,
        transitionItem: data.transitionItem,
        isCategorySeprate: data.isCategorySeprate
      })
    })
  )

  const highlightTarget$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  combineLatest({
    graphicSelection: graphicSelection$,
    computedData: computedData$,
    CategoryDataMap: CategoryDataMap$,
    highlightTarget: highlightTarget$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    data.graphicSelection
      .on('mouseover', (event, datum) => {
        // event.stopPropagation()
        // console.log({
        //   type: 'multiValue',
        //   eventName: 'mouseover',
        //   pluginName,
        //   highlightTarget: data.highlightTarget,
        //   datum,
        //   category: data.CategoryDataMap.get(datum.categoryLabel)!,
        //   categoryIndex: datum.categoryIndex,
        //   categoryLabel: datum.categoryLabel,
        //   data: data.computedData,
        //   event,
        // })
        event$.next({
          type: 'multiValue',
          eventName: 'mouseover',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          category: data.CategoryDataMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          data: data.computedData,
          event,
        })
      })
      .on('mousemove', (event, datum) => {
        // event.stopPropagation()

        event$.next({
          type: 'multiValue',
          eventName: 'mousemove',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          category: data.CategoryDataMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          data: data.computedData,
          event,
        })
      })
      .on('mouseout', (event, datum) => {
        // event.stopPropagation()

        event$.next({
          type: 'multiValue',
          eventName: 'mouseout',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          category: data.CategoryDataMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          data: data.computedData,
          event,
        })
      })
      .on('click', (event, datum) => {
        // event.stopPropagation()

        event$.next({
          type: 'multiValue',
          eventName: 'click',
          pluginName,
          highlightTarget: data.highlightTarget,
          datum,
          category: data.CategoryDataMap.get(datum.categoryLabel)!,
          categoryIndex: datum.categoryIndex,
          categoryLabel: datum.categoryLabel,
          data: data.computedData,
          event,
        })
      })

  })

  combineLatest({
    graphicSelection: graphicSelection$,
    highlight: highlight$.pipe(
      map(data => data.map(d => d.id))
    ),
    fullChartParams: fullChartParams$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    highlight({
      selection: data.graphicSelection,
      ids: data.highlight,
      fullChartParams: data.fullChartParams
    })
  })

  return () => {
    destroy$.next(undefined)
  }
}