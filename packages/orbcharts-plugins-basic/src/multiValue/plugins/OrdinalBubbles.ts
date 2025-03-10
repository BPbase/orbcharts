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
import { createBaseOrdinalBubbles } from '../../base/BaseOrdinalBubbles'
import { DEFAULT_ORDINAL_BUBBLES_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'
import {
  // visibleComputedSumDataObservable,
  // visibleComputedRankingBySumDataObservable,
  // rankingAmountLimitObservable,
  computedRankingAmountObservable,
  rankingItemHeightObservable,
  rankingScaleListObservable,
  // computedRankingWithXYDataObservable
} from '../multiValueObservables'
import { renderCircleText } from '../../utils/d3Graphics'
import { getDatumColor } from '../../utils/orbchartsUtils'

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



export const OrdinalBubbles = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const baseOrdinalBubblesSelection = selection.append('g').attr('class', `${pluginName}-bubbles`)
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
    // visibleComputedRankingData$: observer.visibleComputedRankingBySumData$,
    textSizePx$: observer.textSizePx$,
    computedRankingAmount$
  }).pipe(
    takeUntil(destroy$),
    shareReplay(1)
  )

  const rankingScaleList$ = rankingScaleListObservable({
    visibleComputedRankingData$: observer.visibleComputedRankingBySumData$,
    rankingItemHeight$
  }).pipe(
    takeUntil(destroy$),
    shareReplay(1)
  )

  const unsubscribeBaseRacingLabels = createBaseRacingLabels(`${pluginName}-labels`, {
    selection: baseRacingLabelsSelection,
    computedData$: observer.computedData$,
    visibleComputedRankingData$: observer.visibleComputedRankingBySumData$,
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

  const unsubscribeBaseOrdinalBubbles = createBaseOrdinalBubbles(`${pluginName}-bubbles`, {
    selection: baseOrdinalBubblesSelection,
    computedData$: observer.computedData$,
    visibleComputedRankingData$: observer.visibleComputedRankingBySumData$,
    CategoryDataMap$: observer.CategoryDataMap$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    highlight$: observer.highlight$,
    rankingItemHeight$,
    rankingScaleList$,
    containerPosition$: observer.containerPosition$,
    containerSize$: observer.containerSize$,
    ordinalPadding$: observer.ordinalPadding$,
    ordinalScale$: observer.ordinalScale$,
    isCategorySeprate$: observer.isCategorySeprate$,
    event$: subject.event$,
    // xyValueIndex$: observer.xyValueIndex$,
  })

  // const valueAmount$ = observer.visibleComputedRankingBySumData$.pipe(
  //   takeUntil(destroy$),
  //   map(d => (d[0] && d[0][0] && d[0][0].value.length) ?? 0),
  //   distinctUntilChanged()
  // )

  

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseRacingLabels()
    unsubscribeBaseOrdinalBubbles()
  }
})
