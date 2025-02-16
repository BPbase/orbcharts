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
import type { BaseRankingLabelsParams, BaseRankingBarsParams } from '../../../lib/plugins-basic-types'
import { defineMultiValuePlugin } from '../../../lib/core'
import { createBaseRankingLabels } from '../../base/BaseRankingLabels'
import { createBaseRankingBars } from '../../base/BaseRankingBars'
import { DEFAULT_RANKING_BARS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'
import {
  // visibleComputedSumDataObservable,
  // visibleComputedRankingByIndexDataObservable,
  // rankingAmountLimitObservable,
  computedRankingAmountListObservable,
  rankingScaleListObservable,
  // computedRankingWithXYDataObservable
} from '../multiValueObservables'

const pluginName = 'RankingBars'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_RANKING_BARS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_RANKING_BARS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
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
      },
      timer: {
        toBeTypes: ['object']
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
    if (params.timer) {
      const timerResult = validateColumns(params.timer, {
        active: {
          toBeTypes: ['boolean']
        },
        period: {
          toBeTypes: ['number']
        },
      })
      if (timerResult.status === 'error') {
        return timerResult
      }
    }
    return result
  }
}

export const RankingBars = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const baseRankingAxisSelection = selection.append('g').attr('class', `${pluginName}-axis`)
  const baseRankingBarsSelection = selection.append('g').attr('class', `${pluginName}-bars`)

  const destroy$ = new Subject()

  const baseRankingAxisParams$: Observable<BaseRankingLabelsParams> = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(params => {
      return {
        ...params,
        sumValue: false
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
observer.categoryLabels$
  // const valueIndex$ = observer.fullDataFormatter$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.yAxis.valueIndex),
  //   distinctUntilChanged()
  // )

  // const isCategorySeprate$ = observer.fullDataFormatter$.pipe(
  //   takeUntil(destroy$),
  //   map(d => d.separateCategory),
  //   distinctUntilChanged()
  // )

  // const visibleComputedRankingByIndexData$ = visibleComputedRankingByIndexDataObservable({
  //   valueIndex$, // * 依據 valueIndex 來取得 visibleComputedData
  //   isCategorySeprate$,
  //   visibleComputedData$: observer.visibleComputedData$
  // })

  // const rankingAmountLimit$ = rankingAmountLimitObservable({
  //   layout$: observer.layout$,
  //   textSizePx$: observer.textSizePx$,
  //   containerPosition$: observer.containerPosition$,
  // })

  const rankingAmount$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(p => p.rankingAmount),
    distinctUntilChanged(),
  )

  const computedRankingAmountList$ = computedRankingAmountListObservable({
    containerSize$: observer.containerSize$,
    visibleComputedData$: observer.visibleComputedData$,
    textSizePx$: observer.textSizePx$,
    rankingAmount$
  }).pipe(
    takeUntil(destroy$),
    shareReplay(1)
  )

  const rankingScaleList$ = rankingScaleListObservable({
    containerSize$: observer.containerSize$,
    visibleComputedRankingData$: observer.visibleComputedRankingByIndexData$,
    textSizePx$: observer.textSizePx$,
    computedRankingAmountList$
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

  const unsubscribeBaseRankingLabels = createBaseRankingLabels(`${pluginName}-labels`, {
    selection: baseRankingAxisSelection,
    computedData$: observer.computedData$,
    // visibleComputedData$: observer.visibleComputedData$,
    visibleComputedRankingData$: observer.visibleComputedRankingByIndexData$,
    rankingScaleList$,
    fullParams$: baseRankingAxisParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    xyMinMax$: observer.xyMinMax$,
    // textSizePx$: observer.textSizePx$,
    layout$: observer.layout$,
    // containerSize$: observer.containerSize$,
    containerPosition$: observer.containerPosition$,
    isCategorySeprate$: observer.isCategorySeprate$,
  })

  const unsubscribeBaseRankingBars = createBaseRankingBars(`${pluginName}-bars`, {
    selection: baseRankingBarsSelection,
    computedData$: observer.computedData$,
    // visibleComputedData$: observer.visibleComputedData$,
    visibleComputedRankingData$: observer.visibleComputedRankingByIndexData$,
    xyValueIndex$: observer.xyValueIndex$,
    categoryLabels$: observer.categoryLabels$,
    CategoryDataMap$: observer.CategoryDataMap$,
    fullParams$: baseRankingBarsParams$,
    fullChartParams$: observer.fullChartParams$,
    // layout$: observer.layout$,
    // graphicTransform$: observer.graphicTransform$,
    // graphicReverseScale$: observer.graphicReverseScale$,
    highlight$: observer.highlight$,
    computedRankingAmountList$: computedRankingAmountList$,
    rankingScaleList$,
    xScale$: observer.xScale$,
    // rankingItemHeightList$,
    containerPosition$: observer.containerPosition$,
    containerSize$: observer.containerSize$,
    isCategorySeprate$: observer.isCategorySeprate$,
    event$: subject.event$,
  })

  const valueAmount$ = observer.visibleComputedRankingByIndexData$.pipe(
    takeUntil(destroy$),
    map(d => (d[0] && d[0][0] && d[0][0].value.length) ?? 0),
    distinctUntilChanged()
  )

  const timerActive$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(p => p.timer.active),
    distinctUntilChanged()
  )

  const timerPeriod$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(p => p.timer.period),
    distinctUntilChanged()
  )

  let toggle = true

  combineLatest({
    timerActive: timerActive$,
    valueAmount: valueAmount$,
    timerPeriod: timerPeriod$,
    xyValueIndex: observer.xyValueIndex$,
    fullDataFormatter: observer.fullDataFormatter$,
  }).pipe(
    takeUntil(destroy$),
    switchMap(async d => d)
  ).subscribe(({ timerActive, valueAmount, timerPeriod, xyValueIndex, fullDataFormatter }) => {
    if (toggle == false) {
      return
    }
    if (timerActive) {
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
        }, timerPeriod)
      }
    }
  })

  // const nextIndex$ = timerActive$.pipe(
  //   takeUntil(destroy$),
  //   switchMap(active => iif(() => active, timerPeriod$, EMPTY)),
  //   switchMap(period => interval(period)),
  //   switchMap(_ => observer.xyValueIndex$),
  //   map(xyValueIndex => xyValueIndex[0] ++), // 
  //   // switchMap(index => valueAmount$.pipe(map(amount => ({ index, amount })))),
  // )
  // .subscribe(({ index, amount }) => {
  //   if (index < amount - 1) {
  //     subject.dataFormatter$.next
  //   }
  // })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseRankingLabels()
    unsubscribeBaseRankingBars()
  }
})
