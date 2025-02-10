import {
  takeUntil,
  of,
  map,
  distinctUntilChanged,
  Subject,
} from 'rxjs'
import type { Observable } from 'rxjs'
import type {
  DefinePluginConfig,
} from '../../../lib/core-types'
import type { BaseRankingAxisParams, BaseRankingBarsParams } from '../../../lib/plugins-basic-types'
import { defineMultiValuePlugin } from '../../../lib/core'
import { createBaseRankingAxis } from '../../base/BaseRankingAxis'
import { DEFAULT_RANKING_BARS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../const'
import {
  visibleComputedRankingDataObservable,
  // rankingAmountLimitObservable,
  computedRankingAmountListObservable,
  rankingScaleListObservable
} from '../multiValueObservables'

const pluginName = 'RankingBars'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_RANKING_BARS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_RANKING_BARS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      bar: {
        toBeTypes: ['object']
      },
      barLabel: {
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
      }
    })
    if (params.bar) {
      const barResult = validateColumns(params.bar, {
        barWidth: {
          toBeTypes: ['number']
        },
        barPadding: {
          toBeTypes: ['number']
        },
        // barRadius: {
        //   toBe: 'number | "sum"',
        //   test: (value: any) => {
        //     return typeof value === 'number' || value === 'sum'
        //   }
        // },
      })
      if (barResult.status === 'error') {
        return barResult
      }
    }
    if (params.barLabel) {
      const barLabelResult = validateColumns(params.barLabel, {
        padding: {
          toBeTypes: ['number']
        },
        rotate: {
          toBeTypes: ['number']
        },
        colorType: {
          toBeOption: 'ColorType',
        },
      })
      if (barLabelResult.status === 'error') {
        return barLabelResult
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

export const RankingBars = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const baseRankingAxisParams$: Observable<BaseRankingAxisParams> = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(params => {
      return {
        ...params,
        valueIndex: 'sum'
      }
    })
  )

  const baseRankingBarsParams$: Observable<BaseRankingBarsParams> = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(params => {
      return {
        ...params
      }
    })
  )

  const valueIndex$ = observer.fullDataFormatter$.pipe(
    takeUntil(destroy$),
    map(d => d.yAxis.valueIndex),
    distinctUntilChanged()
  )

  const isCategorySeprate$ = observer.fullDataFormatter$.pipe(
    takeUntil(destroy$),
    map(d => d.separateCategory),
    distinctUntilChanged()
  )

  const visibleComputedRankingData$ = visibleComputedRankingDataObservable({
    valueIndex$, // * 依據 valueIndex 來取得 visibleComputedData
    isCategorySeprate$,
    visibleComputedData$: observer.visibleComputedData$
  })

  // const rankingAmountLimit$ = rankingAmountLimitObservable({
  //   layout$: observer.layout$,
  //   textSizePx$: observer.textSizePx$,
  //   multiValueContainerPosition$: observer.multiValueContainerPosition$,
  // })

  const rankingAmount$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(p => p.rankingAmount),
    distinctUntilChanged(),
  )

  const computedRankingAmountList$ = computedRankingAmountListObservable({
    multiValueContainerSize$: observer.multiValueContainerSize$,
    visibleComputedRankingData$,
    textSizePx$: observer.textSizePx$,
    rankingAmount$
  })

  const rankingScaleList$ = rankingScaleListObservable({
    multiValueContainerSize$: observer.multiValueContainerSize$,
    visibleComputedRankingData$,
    textSizePx$: observer.textSizePx$,
    computedRankingAmountList$
  })

  const unsubscribeBaseRankingAxis = createBaseRankingAxis(pluginName, {
    selection,
    computedData$: observer.computedData$,
    // visibleComputedData$: observer.visibleComputedData$,
    visibleComputedRankingData$,
    rankingScaleList$,
    fullParams$: baseRankingAxisParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    xyMinMax$: observer.xyMinMax$,
    // textSizePx$: observer.textSizePx$,
    layout$: observer.layout$,
    multiValueContainerSize$: observer.multiValueContainerSize$,
    multiValueContainerPosition$: observer.multiValueContainerPosition$,
    isCategorySeprate$: observer.isCategorySeprate$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseRankingAxis()
  }
})
