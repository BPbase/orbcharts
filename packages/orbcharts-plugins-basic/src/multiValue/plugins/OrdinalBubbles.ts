import * as d3 from 'd3'
import {
  takeUntil,
  combineLatest,
  of,
  iif,
  interval,
  map,
  distinctUntilChanged,
  shareReplay,
  switchMap,
  EMPTY,
  Subject,
} from 'rxjs'
import type { Observable } from 'rxjs'
import type {
  ChartParams,
  ComputedDatumMultiValue,
  DefinePluginConfig,
} from '../../../lib/core-types'
import type { BaseRacingLabelsParams, OrdinalBubblesParams } from '../../../lib/plugins-basic-types'
import { defineMultiValuePlugin } from '../../../lib/core'
import { createBaseRacingLabels } from '../../base/BaseRacingLabels'
import { createBaseRacingValueLabels } from '../../base/BaseRacingValueLabels'
import { createBaseRacingBars } from '../../base/BaseRacingBars'
import { DEFAULT_ORDINAL_BUBBLES_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'
import {
  // visibleComputedSumDataObservable,
  // visibleComputedRankingByIndexDataObservable,
  // rankingAmountLimitObservable,
  computedRankingAmountObservable,
  rankingItemHeightObservable,
  rankingScaleListObservable,
  // computedRankingWithXYDataObservable
} from '../multiValueObservables'
import { renderCircleText } from '../../utils/d3Graphics'
import { getDatumColor } from '../../utils/orbchartsUtils'

interface BubblesDatum extends ComputedDatumMultiValue {
  graphicValue: Array<{
    x: number
    y: number
    r: number
    // _originR: number // 紀錄變化前的r
  }>
}

const pluginName = 'OrdinalBubbles'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_ORDINAL_BUBBLES_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_ORDINAL_BUBBLES_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      bubble: {
        toBeTypes: ['object']
      },
      itemLabel: {
        toBeTypes: ['object']
      },
      axisLabel: {
        toBeTypes: ['object']
      },
      rankingAmount: {
        toBe: 'number | "auto"',
        test: (value: any) => {
          return typeof value === 'number' || value === 'auto'
        }
      },
    })
    if (params.bubble) {
      const bubbleResult = validateColumns(params.bubble, {
        sizeAdjust: {
          toBeTypes: ['number']
        },
        arcScaleType: {
          toBe: '"area" | "radius"',
          test: (value: any) => {
            return value === 'area' || value === 'radius'
          }
        },
        valueLinearOpacity: {
          toBe: '[number, number]',
          test: (value) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
        },
      })
      if (bubbleResult.status === 'error') {
        return bubbleResult
      }
    }
    if (params.itemLabel) {
      const itemLabelResult = validateColumns(params.itemLabel, {
        padding: {
          toBeTypes: ['number']
        },
        colorType: {
          toBeOption: 'ColorType',
        },
      })
      if (itemLabelResult.status === 'error') {
        return itemLabelResult
      }
    }
    if (params.axisLabel) {
      const axisLabelResult = validateColumns(params.axisLabel, {
        offset: {
          toBe: '[number, number]',
          test: (value) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
        },
        colorType: {
          toBeOption: 'ColorType',
        },
      })
      if (axisLabelResult.status === 'error') {
        return axisLabelResult
      }
    }
    return result
  }
}

function renderBubbles ({ selection, bubblesData }: {
  selection: d3.Selection<SVGGElement, any, any, any>
  bubblesData: BubblesDatum[][]
  // fullParams: OrdinalBubblesParams
  // fullChartParams: ChartParams
  // sumSeries: boolean
}) {
  const itemGSelection = selection.selectAll<SVGGElement, BubblesDatum[]>("g")
    .data(bubblesData)
    .join(
      enter => {
        return enter
          .append('g')
          .attr('cursor', 'pointer')
      },
      update => {
        return update
      },
      exit => {
        return exit
          .remove()
      }
    )
    .each((d, i, nodes) => {
      const g = d3.select(nodes[i])
      g.selectAll<SVGCircleElement, BubblesDatum>("circle")
        .data(d)
    })

  const bubblesSelection = selection.selectAll<SVGGElement, BubblesDatum>("g")
    .data(bubblesData, (d) => d.id)
    .join(
      enter => {
        const enterSelection = enter
          .append('g')
          .attr('cursor', 'pointer')
          .style('fill', '#ffffff')
          .attr("text-anchor", "middle")
        
        enterSelection
          .append("circle")
          .attr("class", "node")
          .attr("cx", 0)
          .attr("cy", 0)
          // .attr("r", 1e-6)
          .attr('fill', (d) => d.color)
          // .transition()
          // .duration(500)
            
        enterSelection
          .append('text')
          .style('opacity', 0.8)
          .attr('pointer-events', 'none')

        return enterSelection
      },
      update => {
        return update
      },
      exit => {
        return exit
          .remove()
      }
    )
    .attr("transform", (d) => {
      return `translate(${d.x},${d.y})`
    })

  return bubblesSelection
}

export const OrdinalBubbles = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const baseRacingBarsSelection = selection.append('g').attr('class', `${pluginName}-bars`)
  const baseRacingLabelsSelection = selection.append('g').attr('class', `${pluginName}-labels`)
  
  const destroy$ = new Subject()

  const baseRacingLabelsParams$: Observable<BaseRacingLabelsParams> = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(params => {
      return {
        barLabel: {
          ...params.itemLabel,
          position: 'outside'
        },
        axisLabel: {
          ...params.axisLabel
        }
      }
    })
  )

  const rankingAmount$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(p => p.rankingAmount),
    distinctUntilChanged(),
  )

  const computedRankingAmount$ = computedRankingAmountObservable({
    containerSize$: observer.containerSize$,
    visibleComputedData$: observer.visibleComputedData$,
    textSizePx$: observer.textSizePx$,
    rankingAmount$
  }).pipe(
    takeUntil(destroy$),
    shareReplay(1)
  )

  const rankingItemHeight$ = rankingItemHeightObservable({
    containerSize$: observer.containerSize$,
    // visibleComputedRankingData$: observer.visibleComputedRankingByIndexData$,
    textSizePx$: observer.textSizePx$,
    computedRankingAmount$
  }).pipe(
    takeUntil(destroy$),
    shareReplay(1)
  )

  const rankingScaleList$ = rankingScaleListObservable({
    visibleComputedRankingData$: observer.visibleComputedRankingByIndexData$,
    rankingItemHeight$
  }).pipe(
    takeUntil(destroy$),
    shareReplay(1)
  )

  const unsubscribeBaseRacingLabels = createBaseRacingLabels(`${pluginName}-labels`, {
    selection: baseRacingLabelsSelection,
    computedData$: observer.computedData$,
    visibleComputedRankingData$: observer.visibleComputedRankingByIndexData$,
    rankingScaleList$,
    xScale$: observer.xScale$, // 不會用到
    fullParams$: baseRacingLabelsParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    // layout$: observer.layout$,
    containerPosition$: observer.containerPosition$,
    containerSize$: observer.containerSize$,
    isCategorySeprate$: observer.isCategorySeprate$,
    // xyValueIndex$: observer.xyValueIndex$,
  })

  const valueAmount$ = observer.visibleComputedRankingByIndexData$.pipe(
    takeUntil(destroy$),
    map(d => (d[0] && d[0][0] && d[0][0].value.length) ?? 0),
    distinctUntilChanged()
  )

  const maxRadius$ = combineLatest({
    sizeAdjust: observer.fullParams$.pipe(
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

  const maxValue$ = combineLatest({
    visibleComputedRankingBySumData: observer.visibleComputedRankingBySumData$,
    scaleDomain: observer.fullDataFormatter$.pipe(
      map(d => d.xAxis.scaleDomain),
    ),
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      let maxValue = 0
      let startIndex = data.scaleDomain[0] === 'auto' || data.scaleDomain[0] === 'min'
        ? 0
        : data.scaleDomain[0]
      let endIndex = data.scaleDomain[1] === 'auto' || data.scaleDomain[1] === 'max'
        ? data.visibleComputedRankingBySumData.length - 1
        : data.scaleDomain[1]
      
      data.visibleComputedRankingBySumData.forEach(categoryData => {
        for (let i = startIndex; i <= endIndex; i++) {
          const value = categoryData[i].value
          value.forEach(v => {
            if (v > maxValue) {
              maxValue = v
            }
          })
        }  
      })
      
      return maxValue
    }),
    distinctUntilChanged(),
    shareReplay(1)
  )

  const radiusScale$ = combineLatest({
    maxRadius: maxRadius$,
    maxValue: maxValue$,
    arcScaleType: observer.fullParams$.pipe(
      map(p => p.bubble.arcScaleType),
      distinctUntilChanged()
    )
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      // 半徑比例尺
      const radiusScale = d3.scalePow()
        .domain([0, data.maxValue])
        .range([0, data.maxRadius])
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
    visibleComputedRankingBySumData: observer.visibleComputedRankingBySumData$,
    computedData: observer.computedData$,
    // fullParams: observer.fullParams$,
    // fullChartParams: observer.fullChartParams$,
    radiusScale: radiusScale$,
    rankingScaleList: rankingScaleList$,
    ordinalXScale: observer.xScale$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      return data.visibleComputedRankingBySumData.map((categoryData, categoryIndex) => {
        return categoryData.map((_d, i) => {
          const d = _d as BubblesDatum
          const rankingScale = data.rankingScaleList[i]
          const graphicValue = d.value.map((v, vIndex) => {
            return {
              x: data.ordinalXScale(i),
              y: rankingScale(d.label),
              r: data.radiusScale(v),
              // _originR: data.radiusScale(v)
            }
          })
          d.graphicValue = graphicValue
          return d
        })
      })
    })
  )

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseRacingLabels()
  }
})
