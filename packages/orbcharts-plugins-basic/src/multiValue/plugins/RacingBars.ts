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
  DefinePluginConfig,
} from '../../../lib/core-types'
import type { BaseRacingLabelsParams, BaseRacingBarsParams } from '../../../lib/plugins-basic-types'
import { defineMultiValuePlugin } from '../../../lib/core'
import { createBaseRacingLabels } from '../../base/BaseRacingLabels'
import { createBaseRacingValueLabels } from '../../base/BaseRacingValueLabels'
import { createBaseRacingBars } from '../../base/BaseRacingBars'
import { DEFAULT_RACING_BARS_PARAMS } from '../defaults'
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

const pluginName = 'RacingBars'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_RACING_BARS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_RACING_BARS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      bar: {
        toBeTypes: ['object']
      },
      barLabel: {
        toBeTypes: ['object']
      },
      valueLabel: {
        toBeTypes: ['object']
      },
      // axisLabel: {
      //   toBeTypes: ['object']
      // },
      rankingAmount: {
        toBe: 'number | "auto"',
        test: (value: any) => {
          return typeof value === 'number' || value === 'auto'
        }
      },
      autorun: {
        toBeTypes: ['boolean']
      },
    })
    if (params.bar) {
      const barResult = validateColumns(params.bar, {
        barWidth: {
          toBeTypes: ['number']
        },
        barPadding: {
          toBeTypes: ['number']
        },
        barRadius: {
          toBeTypes: ['number', 'boolean']
        },
      })
      if (barResult.status === 'error') {
        return barResult
      }
    }
    if (params.barLabel) {
      const barLabelResult = validateColumns(params.barLabel, {
        position: {
          toBe: '"inside" | "outside" | "none"',
          test: (value: any) => {
            return value === 'inside' || value === 'outside' || value === 'none'
          }
        },
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
    if (params.valueLabel) {
      const valueLabelResult = validateColumns(params.valueLabel, {
        padding: {
          toBeTypes: ['number']
        },
        colorType: {
          toBeOption: 'ColorType',
        },
        format: {
          toBeTypes: ['Function']
        },
      })
      if (valueLabelResult.status === 'error') {
        return valueLabelResult
      }
    }
    // if (params.axisLabel) {
    //   const axisLabelResult = validateColumns(params.axisLabel, {
    //     offset: {
    //       toBe: '[number, number]',
    //       test: (value) => Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
    //     },
    //     colorType: {
    //       toBeOption: 'ColorType',
    //     },
    //   })
    //   if (axisLabelResult.status === 'error') {
    //     return axisLabelResult
    //   }
    // }
    // if (params.timer) {
    //   const timerResult = validateColumns(params.timer, {
    //     active: {
    //       toBeTypes: ['boolean']
    //     },
    //     period: {
    //       toBeTypes: ['number']
    //     },
    //   })
    //   if (timerResult.status === 'error') {
    //     return timerResult
    //   }
    // }
    return result
  }
}

export const RacingBars = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const baseRacingBarsSelection = selection.append('g').attr('class', `${pluginName}-bars`)
  const baseRacingLabelsSelection = selection.append('g').attr('class', `${pluginName}-labels`)
  const baseRacingValueLabelsSelection = selection.append('g').attr('class', `${pluginName}-valueLabels`)

  const destroy$ = new Subject()

  // const baseRacingLabelsParams$: Observable<BaseRacingLabelsParams> = observer.fullParams$.pipe(
  //   takeUntil(destroy$),
  //   map(params => {
  //     return {
  //       ...params,
  //       axisLabel: {
  //         offset: [0, 0],
  //         colorType: 'primary'
  //       }
  //     }
  //   })
  // )

  // const baseRacingBarsParams$: Observable<BaseRacingBarsParams> = observer.fullParams$.pipe(
  //   takeUntil(destroy$),
  //   map(params => {
  //     return {
  //       ...params
  //     }
  //   })
  // )

  const baseRacingValueLabelsParams$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(params => {
      return params.valueLabel
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

  // const computedRankingWithXYData$ = computedRankingWithXYDataObservable({
  //   visibleComputedRankingData$: observer.visibleComputedRankingByIndexData$,
  //   rankingScaleList$
  // }).pipe(
  //   takeUntil(destroy$),
  // )

  const barScale$ = combineLatest({
    xScale: observer.xScale$,
    layout: observer.layout$,
    containerSize: observer.containerSize$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d),
    map(data => {
      // 原本的 xScale 是根據 layout 計算的，現在要根據 containerSize 重新計算
      const containerWidthScale = data.containerSize.width / data.layout.width

      return (n: number) => {
        const originWidth = data.xScale(n)
        if (originWidth == null) {
          return 0
        }
        return data.xScale(n) * containerWidthScale
      }
    }),
    shareReplay(1)
  )

  const unsubscribeBaseRacingLabels = createBaseRacingLabels(`${pluginName}-labels`, {
    selection: baseRacingLabelsSelection,
    computedData$: observer.computedData$,
    visibleComputedRankingData$: observer.visibleComputedRankingByIndexData$,
    rankingScaleList$,
    // xScale$: observer.xScale$,
    barScale$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    layout$: observer.layout$,
    containerPosition$: observer.containerPosition$,
    containerSize$: observer.containerSize$,
    isCategorySeprate$: observer.isCategorySeprate$,
    xyValueIndex$: observer.xyValueIndex$,
  })

  const unsubscribeBaseRacingValueLabels = createBaseRacingValueLabels(`${pluginName}-valueLabels`, {
    selection: baseRacingValueLabelsSelection,
    computedData$: observer.computedData$,
    visibleComputedRankingData$: observer.visibleComputedRankingByIndexData$,
    rankingScaleList$,
    // xScale$: observer.xScale$,
    barScale$,
    computedRankingAmount$,
    fullParams$: baseRacingValueLabelsParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    layout$: observer.layout$,
    containerPosition$: observer.containerPosition$,
    containerSize$: observer.containerSize$,
    isCategorySeprate$: observer.isCategorySeprate$,
    xyValueIndex$: observer.xyValueIndex$,
  })

  const unsubscribeBaseRacingBars = createBaseRacingBars(`${pluginName}-bars`, {
    selection: baseRacingBarsSelection,
    computedData$: observer.computedData$,
    visibleComputedRankingData$: observer.visibleComputedRankingByIndexData$,
    xyValueIndex$: observer.xyValueIndex$,
    CategoryDataMap$: observer.CategoryDataMap$,
    fullParams$: observer.fullParams$,
    fullChartParams$: observer.fullChartParams$,
    highlight$: observer.highlight$,
    rankingItemHeight$,
    rankingScaleList$,
    // xScale$: observer.xScale$,
    barScale$,
    containerPosition$: observer.containerPosition$,
    containerSize$: observer.containerSize$,
    // layout$: observer.layout$,
    isCategorySeprate$: observer.isCategorySeprate$,
    event$: subject.event$,
  })

  const valueAmount$ = observer.visibleComputedRankingByIndexData$.pipe(
    takeUntil(destroy$),
    map(d => (d[0] && d[0][0] && d[0][0].value.length) ?? 0),
    distinctUntilChanged()
  )

  const autorun$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(p => p.autorun),
    distinctUntilChanged()
  )

  const tickDurationPeriod$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(p => p.transitionDuration),
    distinctUntilChanged()
  )

  // -- autorun --
  let toggle = true

  combineLatest({
    autorun: autorun$,
    valueAmount: valueAmount$,
    tickDurationPeriod: tickDurationPeriod$,
    xyValueIndex: observer.xyValueIndex$,
    fullDataFormatter: observer.fullDataFormatter$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(({ autorun, valueAmount, tickDurationPeriod, xyValueIndex, fullDataFormatter }) => {
    if (toggle == false) {
      return
    }
    if (autorun) {
      const nextIndex = xyValueIndex[0] + 1
      if (nextIndex < valueAmount) {
        toggle = false // timer 執行期間不可再次執行

        setTimeout(() => {
          subject.dataFormatter$.next({
            ...fullDataFormatter,
            xAxis: {
              ...fullDataFormatter.xAxis,
              valueIndex: nextIndex
            }
          })

          toggle = true
        }, tickDurationPeriod)
      }
    }
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseRacingLabels()
    unsubscribeBaseRacingValueLabels()
    unsubscribeBaseRacingBars()
  }
})
