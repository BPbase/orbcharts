import * as d3 from 'd3'
import {
  Observable,
  Subject,
  combineLatest,
  takeUntil,
  map,
  distinctUntilChanged,
  of,
  iif,
  switchMap,
  shareReplay
} from 'rxjs'
import type {
  ChartParams,
  ComputedDatumMultiValue,
  ComputedDataMultiValue,
  ComputedXYDatumMultiValue,
  ContainerSize,
  ContainerPositionScaled,
  DataFormatterMultiValue,
  Layout
} from '../../lib/core-types'
import type { BaseRacingValueLabelsParams } from '../../lib/plugins-basic-types'
import type { BasePluginFn } from './types'
import { getColor, getClassName, getUniID } from '../utils/orbchartsUtils'
import { parseTickFormatValue } from '../utils/d3Utils'

interface BaseRacingAxisContext {
  selection: d3.Selection<any, unknown, any, unknown>
  computedData$: Observable<ComputedDataMultiValue>
  visibleComputedRankingData$: Observable<ComputedDatumMultiValue[][]>
  rankingScaleList$: Observable<Array<d3.ScalePoint<string>>>
  barScale$: Observable<(n: number) => number>
  computedRankingAmount$: Observable<number>
  fullParams$: Observable<BaseRacingValueLabelsParams>
  fullDataFormatter$: Observable<DataFormatterMultiValue>
  fullChartParams$: Observable<ChartParams>
  layout$: Observable<Layout>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  isCategorySeprate$: Observable<boolean>
  xyValueIndex$: Observable<[number, number]>
}

type ClipPathDatum = {
  id: string;
  // x: number;
  // y: number;
  width: number;
  height: number;
}

// const pluginName = 'RacingAxis'

const yTickTextAnchor = 'start'
const yTickDominantBaseline = 'middle'


function renderRacingLabels ({ selection, fullParams, fullChartParams, rankingScale, valueScale, categoryData, computedRankingAmount, xyValueIndex }: {
  selection: d3.Selection<SVGGElement, any, any, any>,
  fullParams: BaseRacingValueLabelsParams
  fullChartParams: ChartParams
  rankingScale: d3.ScalePoint<string>
  valueScale: ((n: number) => number)
  categoryData: ComputedDatumMultiValue[]
  computedRankingAmount: number
  // textReverseTransform: string
  xyValueIndex: [number, number]
}) {

  const labelData = categoryData.slice(0, computedRankingAmount + 1) // 將多餘的label移除避免不避要的計算

  const labelGSelection = selection
    .selectAll<SVGGElement, string>(`g`)
    .data(categoryData, (d: ComputedDatumMultiValue) => d.id)
    // .join('g')
    // .classed(boxClassName, true)
    .join(
      enter => {
        return enter
          .append('g')
          // .attr('x', d => valueScale(d.value[xyValueIndex[0]]) + fullParams.padding)
          // .attr('y', d => rankingScale(d.label)!)
          .attr('transform', d => `translate(${valueScale(d.value[xyValueIndex[0]]) + fullParams.padding}, ${rankingScale(d.label)!})`)
      },
      update => {
        return update
          .transition()
          .duration(fullChartParams.transitionDuration)
          .ease(d3.easeLinear)
          // // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
          // .attr('x', d => valueScale(d.value[xyValueIndex[0]]) + fullParams.padding)
          // .attr('y', d => rankingScale(d.label)!)
          .attr('transform', d => `translate(${valueScale(d.value[xyValueIndex[0]]) + fullParams.padding}, ${rankingScale(d.label)!})`)
      },
      exit => exit.remove()
    )
    .each((d, i, g) => {
      const gSelection = d3.select(g[i])
      gSelection
        .selectAll<SVGRectElement, string>('text')
        .data([d])
        .join(
          enter => {
            return enter
              .append('text')
          },
          update => update,
          exit => exit.remove()
        )
        .attr('text-anchor', yTickTextAnchor)
        .attr('dominant-baseline', yTickDominantBaseline)
        .attr('font-size', fullChartParams.styles.textSize)
        .style('fill', getColor(fullParams.colorType, fullChartParams))
        // .style('transform', textReverseTransform)
        // .style('transform', textReverseTransformWithRotate)
        // .text(d => parseTickFormatValue(d.value[xyValueIndex[0]], fullParams.format))
        .transition()
        .duration(fullChartParams.transitionDuration)
        .ease(d3.easeLinear)
        .textTween(datum => {
          const currentIndex = xyValueIndex[0]
          const prevIndex = currentIndex === 0 ? 0 : currentIndex - 1
          const prev = datum.value[prevIndex]
          const current = datum.value[currentIndex]
          return t => {
            const tweenNumber = t === 1
              ? d3.interpolateNumber(prev, current)(t)
              : d3.interpolateRound(prev, current)(t) // 過渡時使用整數避免小數位數爆炸多
            return parseTickFormatValue(tweenNumber, fullParams.format)
          }
        })
    })

  // const labelSelection = selection
  //   .selectAll<SVGGElement, string>(`text`)
  //   .data(categoryData, (d: ComputedDatumMultiValue) => d.id)
  //   // .join('g')
  //   // .classed(boxClassName, true)
  //   .join(
  //     enter => {
  //       return enter
  //         .append('text')
  //         // .style('font-weight', 'bold')
  //         .attr('x', d => valueScale(d.value[xyValueIndex[0]]) + fullParams.padding)
  //         .attr('y', d => rankingScale(d.label)!)
  //     },
  //     update => {
  //       return update
  //         .transition()
  //         .duration(fullChartParams.transitionDuration)
  //         .ease(d3.easeLinear)
  //         // 偏移使用 x, y 而非 transform 才不會受到外層 scale 變形影響
  //         .attr('x', d => valueScale(d.value[xyValueIndex[0]]) + fullParams.padding)
  //         .attr('y', d => rankingScale(d.label)!)
  //     },
  //     exit => exit.remove()
  //   )
  //   .attr('text-anchor', yTickTextAnchor)
  //   .attr('dominant-baseline', yTickDominantBaseline)
  //   .attr('font-size', fullChartParams.styles.textSize)
  //   .style('fill', getColor(fullParams.colorType, fullChartParams))
  //   // .style('transform', textReverseTransformWithRotate)
  //   // .text(d => parseTickFormatValue(d.value[xyValueIndex[0]], fullParams.format))
  //   .transition()
  //   .duration(fullChartParams.transitionDuration)
  //   .ease(d3.easeLinear)
  //   .textTween(datum => {
  //     const currentIndex = xyValueIndex[0]
  //     const prevIndex = currentIndex === 0 ? 0 : currentIndex - 1
  //     const prev = datum.value[prevIndex]
  //     const current = datum.value[currentIndex]
  //     return t => {
  //       const tweenNumber = d3.interpolateNumber(prev, current)(t)
  //       return parseTickFormatValue(tweenNumber, fullParams.format)
  //     }
  //   })

  const labelSelection: d3.Selection<SVGTextElement, ComputedDatumMultiValue, SVGGElement, unknown> = labelGSelection.selectAll(`text`)

  return labelSelection
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

export const createBaseRacingValueLabels: BasePluginFn<BaseRacingAxisContext> = (pluginName: string, {
  selection,
  computedData$,
  visibleComputedRankingData$,
  rankingScaleList$,
  barScale$,
  computedRankingAmount$,
  fullParams$,
  fullDataFormatter$,
  fullChartParams$,
  layout$,
  containerPosition$,
  containerSize$,
  isCategorySeprate$,
  xyValueIndex$
}) => {

  const destroy$ = new Subject()
  
  const containerClassName = getClassName(pluginName, 'container')
  const boxClassName = getClassName(pluginName, 'box')
  const clipPathID = getUniID(pluginName, 'clipPath-box')

  const containerSelection$ = combineLatest({
    computedData: computedData$.pipe(
      distinctUntilChanged((a, b) => {
        // 只有當series的數量改變時，才重新計算
        return a.length === b.length
      }),
    ),
    isCategorySeprate: isCategorySeprate$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
    map(data => {
      return data.isCategorySeprate
        // category分開的時候顯示各別axis
        ? data.computedData
        // category合併的時候只顯示第一個axis
        : [data.computedData[0]]
    }),
    map((computedData, i) => {
      return selection
        .selectAll<SVGGElement, ComputedDatumMultiValue[]>(`g.${containerClassName}`)
        .data(computedData, d => d[0] ? d[0].categoryIndex : i)
        .join('g')
        .classed(containerClassName, true)
    })
  )

  combineLatest({
    containerSelection: containerSelection$,
    containerPosition: containerPosition$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(data => {
    data.containerSelection
      .attr('transform', (d, i) => {
        const containerPosition = data.containerPosition[i] ?? data.containerPosition[0]
        const translate = containerPosition.translate
        const scale = containerPosition.scale
        // return `translate(${translate[0]}, ${translate[1]}) scale(${scale[0]}, ${scale[1]})`
        return `translate(${translate[0]}, ${translate[1]})`
      })
      // .attr('opacity', 0)
      // .transition()
      // .attr('opacity', 1)
  })

  // const textReverseTransform$ = containerPosition$.pipe(
  //   takeUntil(destroy$),
  //   switchMap(async (d) => d),
  //   map(containerPosition => {
  //     // const axesRotateXYReverseValue = `rotateX(${data.gridAxesReverseTransform.rotateX}deg) rotateY(${data.gridAxesReverseTransform.rotateY}deg)`
  //     // const axesRotateReverseValue = `rotate(${data.gridAxesReverseTransform.rotate}deg)`
  //     const containerScaleReverseValue = `scale(${1 / containerPosition[0].scale[0]}, ${1 / containerPosition[0].scale[1]})`
  //     // 抵消最外層scale
  //     return `${containerScaleReverseValue}`
  //   }),
  //   distinctUntilChanged()
  // )

  // const textReverseTransformWithRotate$ = combineLatest({
  //   textReverseTransform: textReverseTransform$,
  //   fullParams: fullParams$,
  // }).pipe(
  //   takeUntil(destroy$),
  //   switchMap(async (d) => d),
  //   map(data => {
  //     // 必須按照順序（先抵消外層rotate，再抵消最外層scale，最後再做本身的rotate）
  //     return `${data.textReverseTransform} rotate(${data.fullParams.barLabel.rotate}deg)`
  //   })
  // )

  // const rankingLabelList$ = visibleComputedRankingData$.pipe(
  //   takeUntil(destroy$),
  //   map(data => {
  //     return data.map(categoryData => categoryData.map(d => d.label))
  //   })
  // )

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

  combineLatest({
    containerSelection: containerSelection$,
    fullParams: fullParams$,
    fullChartParams: fullChartParams$,
    visibleComputedRankingData: visibleComputedRankingData$,
    rankingScaleList: rankingScaleList$,
    valueScale: barScale$,
    computedRankingAmount: computedRankingAmount$,
    // textReverseTransform: textReverseTransform$,
    xyValueIndex: xyValueIndex$
  }).pipe(
    takeUntil(destroy$),
    switchMap(async (d) => d),
  ).subscribe(data => {

    data.containerSelection.each((d, i, g) => {
      const _containerSelection = d3.select(g[i])
      // const rankingLabels = data.rankingLabelList[i]
      const rankingScale = data.rankingScaleList[i]
      if (!rankingScale) {
        return
      }
      
      // const containerClipPathID = `${clipPathID}-${i}`  
      const axisSelection = _containerSelection
        .selectAll<SVGGElement, any>(`g.${boxClassName}`)
        .data([i])
        .join('g')
        .attr('class', boxClassName)
        .attr('clip-path', `url(#${clipPathID})`)

      renderRacingLabels({
        selection: axisSelection,
        fullParams: data.fullParams,
        fullChartParams: data.fullChartParams,
        rankingScale: rankingScale,
        categoryData: data.visibleComputedRankingData[i],
        // textReverseTransform: data.textReverseTransform,
        // textReverseTransformWithRotate: data.textReverseTransformWithRotate,
        valueScale: data.valueScale,
        computedRankingAmount: data.computedRankingAmount,
        xyValueIndex: data.xyValueIndex,
      })
    })

  })

  return () => {
    destroy$.next(undefined)
  }
}
