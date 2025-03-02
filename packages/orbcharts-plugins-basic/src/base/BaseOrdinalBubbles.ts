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
import type { BaseOrdinalBubblesParams } from '../../lib/plugins-basic-types'
import { getD3TransitionEase } from '../utils/d3Utils'
import { getClassName, getUniID } from '../utils/orbchartsUtils'
import { multiValueContainerSelectionsObservable } from '../multiValue/multiValueObservables'

// export interface BaseBarsParams {
//   // barType: BarType
//   barWidth: number
//   barPadding: number
//   barGroupPadding: number // 群組和群組間的間隔
//   barRadius: number | boolean
// }

interface BaseRacingBarsContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataMultiValue>
  visibleComputedRankingData$: Observable<ComputedDatumMultiValue[][]>
  CategoryDataMap$: Observable<Map<string, ComputedDatumMultiValue[]>>
  fullParams$: Observable<BaseOrdinalBubblesParams >
  fullDataFormatter$: Observable<DataFormatterTypeMap<'multiValue'>>
  fullChartParams$: Observable<ChartParams>
  // xyValueIndex$: Observable<[number, number]>
  highlight$: Observable<ComputedDatumMultiValue[]>
  rankingItemHeight$: Observable<number>
  rankingScaleList$: Observable<d3.ScalePoint<string>[]>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  ordinalXScale$: Observable<d3.ScaleLinear<number, number>>
  isCategorySeprate$: Observable<boolean>
  event$: Subject<EventMultiValue>
}

interface RenderGraphicGParams {
  containerSelection: d3.Selection<SVGGElement, ComputedDatumMultiValue[], any, any>
  bubbleData: BubblesDatum[][]
  // rankingScaleList: d3.ScalePoint<string>[]
  transitionDuration: number
}

interface BubblesDatum extends ComputedDatumMultiValue {
  graphicValue: Array<{
    x: number
    y: number
    r: number
    opacity: number
    // _originR: number // 紀錄變化前的r
  }>
}

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}


function renderGraphicG ({ containerSelection, bubbleData, transitionDuration }: RenderGraphicGParams) {
  containerSelection
    .each((_, categoryIndex, g) => {
      const container = d3.select(g[categoryIndex])
      const graphicG = container.selectAll<SVGGElement, ComputedDatumMultiValue>(`g`)
        .data(bubbleData[categoryIndex] ?? [], d => d.id)
        .join(
          enter => {
            return enter
              .append('g')
              .attr('cursor', 'pointer')
              .attr('transform', d => {
                return `translate(0, ${d.graphicValue[0] ? d.graphicValue[0].y : 0})`
              })
          },
          update => {
            return update
              .transition()
              .duration(transitionDuration)
              .ease(d3.easeLinear)
              .attr('transform', d => {
                return `translate(0, ${d.graphicValue[0] ? d.graphicValue[0].y : 0})`
              })
          },
          exit => exit.remove()
        )
    })

  const graphicBarSelection: d3.Selection<SVGRectElement, BubblesDatum, SVGGElement, unknown> = containerSelection.selectAll(`g`)

  return graphicBarSelection
}

function renderBubbles ({ graphicGSelection }: {
  graphicGSelection: d3.Selection<SVGGElement, BubblesDatum, any, any>
  // bubblesData: BubblesDatum[][]
  // fullParams: BaseOrdinalBubblesParams
  // fullChartParams: ChartParams
  // sumSeries: boolean
}) {

  graphicGSelection
    .each((datum, i, g) => {
      const _graphicGSelection = d3.select(g[i])
      
      _graphicGSelection.selectAll<SVGCircleElement, typeof datum>('circle')
        .data(datum.graphicValue)
        .join('circle')
        .attr('fill', d => datum.color)
        .style('opacity', d => d.opacity)
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr('cx', d => d.x)
        // .attr('cy', d => d.y)
        .attr('r', d => d.r)

      // const itemGSelection = _graphicGSelection.selectAll<SVGGElement, BubblesDatum>("g")
      //   .data(bubblesData[i], (d) => d.id)
      //   .join('g')
      //   .each((datum, datumIndex, _g) => {
      //     const _itemGSelection = d3.select(_g[datumIndex])

      //     _itemGSelection.selectAll<SVGCircleElement, typeof datum>('circle')
      //       .data(datum.graphicValue)
      //       .join('circle')
      //       .attr('fill', d => datum.color)
      //       .style('opacity', 0.8)
      //       .transition()
      //       .duration(200)
      //       .ease(d3.easeLinear)
      //       .attr('cx', d => d.x)
      //       .attr('cy', d => d.y)
      //       .attr('r', d => d.r)
      //   })
    })
  
  // const itemGSelection = selection.selectAll<SVGGElement, BubblesDatum[]>("g")
  //   .data(bubblesData)
  //   .join(
  //     enter => {
  //       return enter
  //         .append('g')
  //         .attr('cursor', 'pointer')
  //     },
  //     update => {
  //       return update
  //     },
  //     exit => {
  //       return exit
  //         .remove()
  //     }
  //   )
  //   .each((d, i, nodes) => {
  //     const g = d3.select(nodes[i])
  //     g.selectAll<SVGCircleElement, BubblesDatum>("circle")
  //       .data(d)
  //   })

  const bubblesSelection: d3.Selection<SVGRectElement, ComputedDatumMultiValue, SVGGElement, unknown> = graphicGSelection.selectAll(`circle`)

  return bubblesSelection
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


export const createBaseOrdinalBubbles: BasePluginFn<BaseRacingBarsContext> = (pluginName: string, {
  selection,
  computedData$,
  visibleComputedRankingData$,
  // xyValueIndex$,
  // categoryLabels$,
  CategoryDataMap$,
  fullParams$,
  fullDataFormatter$,
  fullChartParams$,
  // layout$,
  // graphicTransform$,
  // graphicReverseScale$,
  highlight$,
  // computedRankingAmountList$,
  rankingItemHeight$,
  rankingScaleList$,
  containerPosition$,
  containerSize$,
  // layout$,
  ordinalXScale$,
  isCategorySeprate$,
  event$
}) => {

  const destroy$ = new Subject()

  const clipPathID = getUniID(pluginName, 'clipPath-box')
  const bubbleClassName = getClassName(pluginName, 'bubble')
  // const containerClassName = getClassName(pluginName, 'container')
  

  const containerSelection$ = multiValueContainerSelectionsObservable({
    selection,
    pluginName,
    clipPathID,
    computedData$,
    containerPosition$,
    isCategorySeprate$,
  }).pipe(
    takeUntil(destroy$),
  )

  containerSize$.subscribe(data => {
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

  const maxRadius$ = combineLatest({
    sizeAdjust: fullParams$.pipe(
      map(p => p.bubble.sizeAdjust),
      distinctUntilChanged()
    ),
    rankingItemHeight: rankingItemHeight$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(d => (d.rankingItemHeight * d.sizeAdjust) / 2),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const minMaxValue$ = combineLatest({
    visibleComputedRankingData: visibleComputedRankingData$,
    scaleDomain: fullDataFormatter$.pipe(
      map(d => d.xAxis.scaleDomain),
    ),
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      let minValue = 0
      let maxValue = 0
      let startIndex = data.scaleDomain[0] === 'auto' || data.scaleDomain[0] === 'min'
        ? 0
        : data.scaleDomain[0]
      let endIndex = data.scaleDomain[1] === 'auto' || data.scaleDomain[1] === 'max'
        ? data.visibleComputedRankingData.length - 1
        : data.scaleDomain[1]
      
      data.visibleComputedRankingData.forEach(categoryData => {
        for (let i = startIndex; i <= endIndex; i++) {
          const value = categoryData[i].value
          value.forEach(v => {
            if (v > maxValue) {
              maxValue = v
            } else if (v < minValue) {
              minValue = v
            }
          })
        }  
      })
      
      return [minValue, maxValue]
    }),
    distinctUntilChanged(),
    shareReplay(1)
  )



  const opacityScale$ = combineLatest({
    minMaxValue: minMaxValue$,
    fullParams: fullParams$
  }).pipe(
    takeUntil(destroy$),
    map(data => {
      const opacityScale = d3.scaleLinear()
        .domain(data.minMaxValue)
        .range(data.fullParams.bubble.valueLinearOpacity)
      return opacityScale
    }),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const radiusScale$ = combineLatest({
    maxRadius: maxRadius$,
    minMaxValue: minMaxValue$,
    arcScaleType: fullParams$.pipe(
      map(p => p.bubble.arcScaleType),
      distinctUntilChanged()
    )
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      // 半徑比例尺
      const radiusScale = d3.scalePow()
        .domain([data.minMaxValue[0], data.minMaxValue[1]])
        .range([4, data.maxRadius])
        .exponent(data.arcScaleType === 'area'
          ? 0.5 // 數值映射面積（0.5為取平方根）
          : 1 // 數值映射半徑
        )
      return radiusScale
    }),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const bubbleData$: Observable<BubblesDatum[][]> = combineLatest({
    visibleComputedRankingData: visibleComputedRankingData$,
    // computedData: computedData$,
    // fullParams: fullParams$,
    // fullChartParams: fullChartParams$,
    radiusScale: radiusScale$,
    rankingScaleList: rankingScaleList$,
    ordinalXScale: ordinalXScale$,
    opacityScale: opacityScale$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      // console.log('data.visibleComputedRankingData', data.visibleComputedRankingData)
      return data.visibleComputedRankingData.map((categoryData, categoryIndex) => {
        const rankingScale = data.rankingScaleList[categoryIndex]
        
        return categoryData.map((_d, i) => {
          const d = _d as BubblesDatum
          const graphicValue = d.value.map((v, vIndex) => {
            return {
              x: data.ordinalXScale(vIndex),
              y: rankingScale(d.label),
              r: data.radiusScale(v),
              opacity: data.opacityScale(v),
              // _originR: data.radiusScale(v)
            }
          })
          d.graphicValue = graphicValue
          return d
        })
      })
    })
  )

  const transitionDuration$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.transitionDuration),
    distinctUntilChanged()
  )

  const graphicGSelection$ = combineLatest({
    containerSelection: containerSelection$,
    bubbleData: bubbleData$,
    rankingScaleList: rankingScaleList$,
    transitionDuration: transitionDuration$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      console.log('bubbleData', data.bubbleData)
      return renderGraphicG({
        containerSelection: data.containerSelection,
        bubbleData: data.bubbleData,
        // rankingScaleList: data.rankingScaleList,
        transitionDuration: data.transitionDuration
      })
    })
  )

  const graphicSelection$ = combineLatest({
    graphicGSelection: graphicGSelection$,
    // xyValueIndex: xyValueIndex$,
    ordinalXScale: ordinalXScale$,
    bubbleData: bubbleData$,
    transitionDuration: transitionDuration$,
    fullParams: fullParams$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      
      return renderBubbles({
        graphicGSelection: data.graphicGSelection,
        // bubblesData: data.bubbleData
      })
    }),
    shareReplay(1)
  )

  const highlightTarget$ = fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.highlightTarget),
    distinctUntilChanged()
  )

  // combineLatest({
  //   graphicSelection: graphicSelection$,
  //   computedData: computedData$,
  //   CategoryDataMap: CategoryDataMap$,
  //   highlightTarget: highlightTarget$
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async (d) => d),
  // ).subscribe(data => {

  //   data.graphicSelection
  //     .on('mouseover', (event, datum) => {
  //       // event.stopPropagation()
  //       // console.log({
  //       //   type: 'multiValue',
  //       //   eventName: 'mouseover',
  //       //   pluginName,
  //       //   highlightTarget: data.highlightTarget,
  //       //   datum,
  //       //   category: data.CategoryDataMap.get(datum.categoryLabel)!,
  //       //   categoryIndex: datum.categoryIndex,
  //       //   categoryLabel: datum.categoryLabel,
  //       //   data: data.computedData,
  //       //   event,
  //       // })

  //       // 只顯示目前的值
  //       datum._visibleValue = [datum.value[datum.xValueIndex]]

  //       event$.next({
  //         type: 'multiValue',
  //         eventName: 'mouseover',
  //         pluginName,
  //         highlightTarget: data.highlightTarget,
  //         datum,
  //         category: data.CategoryDataMap.get(datum.categoryLabel)!,
  //         categoryIndex: datum.categoryIndex,
  //         categoryLabel: datum.categoryLabel,
  //         data: data.computedData,
  //         event,
  //       })
  //     })
  //     .on('mousemove', (event, datum) => {
  //       // event.stopPropagation()

  //       // 只顯示目前的值
  //       datum._visibleValue = [datum.value[datum.xValueIndex]]
        
  //       event$.next({
  //         type: 'multiValue',
  //         eventName: 'mousemove',
  //         pluginName,
  //         highlightTarget: data.highlightTarget,
  //         datum,
  //         category: data.CategoryDataMap.get(datum.categoryLabel)!,
  //         categoryIndex: datum.categoryIndex,
  //         categoryLabel: datum.categoryLabel,
  //         data: data.computedData,
  //         event,
  //       })
  //     })
  //     .on('mouseout', (event, datum) => {
  //       // event.stopPropagation()

  //       event$.next({
  //         type: 'multiValue',
  //         eventName: 'mouseout',
  //         pluginName,
  //         highlightTarget: data.highlightTarget,
  //         datum,
  //         category: data.CategoryDataMap.get(datum.categoryLabel)!,
  //         categoryIndex: datum.categoryIndex,
  //         categoryLabel: datum.categoryLabel,
  //         data: data.computedData,
  //         event,
  //       })
  //     })
  //     .on('click', (event, datum) => {
  //       // event.stopPropagation()

  //       // 只顯示目前的值
  //       datum._visibleValue = [datum.value[datum.xValueIndex]]

  //       event$.next({
  //         type: 'multiValue',
  //         eventName: 'click',
  //         pluginName,
  //         highlightTarget: data.highlightTarget,
  //         datum,
  //         category: data.CategoryDataMap.get(datum.categoryLabel)!,
  //         categoryIndex: datum.categoryIndex,
  //         categoryLabel: datum.categoryLabel,
  //         data: data.computedData,
  //         event,
  //       })
  //     })

  // })

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
    // highlight({
    //   selection: data.graphicSelection,
    //   ids: data.highlight,
    //   fullChartParams: data.fullChartParams
    // })
  })

  return () => {
    destroy$.next(undefined)
  }
}