import {
  shareReplay,
  map,
  combineLatest,
  debounceTime,
  BehaviorSubject,
  Subject,
  takeUntil
} from 'rxjs'
import type { RacingPlotExtendContext, RacingPlotPluginParams, RacingPlotAllLayerParams } from './types'
import { defineSVGPlugin, validateObject } from '@orbcharts/core'
import { DEFAULT_RACING_PLOT_PLUGIN_PARAMS } from './defaults'
import { DEFAULT_CONTAINER } from '../../const/sharedPluginParams'
import {
  categoryDataMapObservable,
  containerSizeObservable,
  layoutObservable,
  fontSizePxObservable,
  highlightObservable,
  seriesDataMapObservable
} from '../../utils/observables'
import {
  gridComputedDataObservable,
  gridSeriesLabelsObservable,
  gridVisibleComputedDataObservable,
  gridContainerPositionObservable,
  maxFrameIndexObservable,
  currentFrameLabelObservable,
  xScaleObservable,
  racingRankedSeriesDataObservable,
  computedRankedAmountObservable,
  rankedItemHeightObservable,
  rankedScaleListObservable
} from './contextObservables'
import { RacingBar } from './layers/RacingBar'
import { SeriesLabel } from './layers/SeriesLabel'
import { CounterText } from './layers/CounterText'
import { ValueAxis } from './layers/ValueAxis'
import { ValueLabel } from './layers/ValueLabel'

const racingBar = new RacingBar()
const valueLabel = new ValueLabel()
const seriesLabel = new SeriesLabel()
const counterText = new CounterText()
const valueAxis = new ValueAxis()

export const RacingPlot = defineSVGPlugin<
  RacingPlotExtendContext,
  RacingPlotPluginParams,
  RacingPlotAllLayerParams
>({
  name: 'RacingPlot',
  defaultParams: DEFAULT_RACING_PLOT_PLUGIN_PARAMS,
  layers: [valueAxis, racingBar, valueLabel, seriesLabel, counterText],
  setup: (props) => {
    const destroy$ = new Subject<void>()

    // ---- currentFrameIndex (driven by autorun or external) ----
    const currentFrameIndex$ = new BehaviorSubject<number>(0)

    // ---- select grid dataset ----
    const selectedGridData$ = combineLatest({
      gridData: props.context.gridData$,
      datasetIndex: props.pluginParams$.pipe(map(p => p.datasetIndex))
    }).pipe(
      debounceTime(0),
      map(({ gridData, datasetIndex }) => gridData[datasetIndex] ?? []),
      shareReplay(1)
    )

    // ---- layout & sizes ----
    const layout$ = layoutObservable({
      size$: props.context.size$,
      padding$: props.pluginParams$.pipe(map(p => p.styles.padding))
    }).pipe(shareReplay(1))

    const computedData$ = gridComputedDataObservable({
      selectedGridData$,
      pluginParams$: props.pluginParams$
    }).pipe(shareReplay(1))

    const fontSizePx$ = fontSizePxObservable(props.context.theme$).pipe(shareReplay(1))

    const gridContainerPosition$ = gridContainerPositionObservable({
      selectedGridData$
    }).pipe(shareReplay(1))

    const containerSize$ = containerSizeObservable({
      layout$,
      containerPosition$: gridContainerPosition$,
      container$: props.pluginParams$.pipe(map(() => DEFAULT_CONTAINER))
    }).pipe(shareReplay(1))

    const datumList$ = computedData$.pipe(map(d => d.flat()), shareReplay(1))

    const gridHighlight$ = highlightObservable({
      datumList$,
      styles$: props.pluginParams$.pipe(map(p => p.styles)),
      event$: props.context.event$
    }).pipe(shareReplay(1))

    const seriesLabels$ = gridSeriesLabelsObservable({ computedData$ })

    const SeriesDataMap$ = seriesDataMapObservable({ datumList$ }).pipe(shareReplay(1))

    const CategoryDataMap$ = categoryDataMapObservable({ datumList$ }).pipe(shareReplay(1))

    const visibleComputedData$ = gridVisibleComputedDataObservable({ computedData$ }).pipe(shareReplay(1))

    // ---- racing-specific ----

    const maxFrameIndex$ = maxFrameIndexObservable({ computedData$ }).pipe(shareReplay(1))

    const currentFrameLabel$ = currentFrameLabelObservable({
      computedData$,
      currentFrameIndex$
    }).pipe(shareReplay(1))

    const racingRankedSeriesData$ = racingRankedSeriesDataObservable({
      visibleComputedData$,
      currentFrameIndex$
    }).pipe(shareReplay(1))

    const xScale$ = xScaleObservable({
      racingRankedSeriesData$,
      currentFrameIndex$,
      containerSize$
    }).pipe(shareReplay(1))

    const computedRankedAmount$ = computedRankedAmountObservable({
      containerSize$,
      visibleComputedData$,
      fontSizePx$,
      limit$: props.pluginParams$.pipe(map(p => p.rankedAxis.limit))
    }).pipe(shareReplay(1))

    const rankedItemHeight$ = rankedItemHeightObservable({
      containerSize$,
      fontSizePx$,
      computedRankedAmount$
    }).pipe(shareReplay(1))

    const rankedScaleList$ = rankedScaleListObservable({
      racingRankedSeriesData$,
      rankedItemHeight$
    }).pipe(shareReplay(1))

    // ---- autorun ----
    let autorunTimer: ReturnType<typeof setTimeout> | null = null

    const stopAutorun = () => {
      if (autorunTimer != null) {
        clearTimeout(autorunTimer)
        autorunTimer = null
      }
    }

    // When data changes (new dataset selected), reset frame index to 0
    computedData$.pipe(takeUntil(destroy$)).subscribe(() => {
      stopAutorun()
      currentFrameIndex$.next(0)
    })

    combineLatest({
      pluginParams: props.pluginParams$,
      maxFrameIndex: maxFrameIndex$
    }).pipe(
      takeUntil(destroy$)
    ).subscribe(({ pluginParams, maxFrameIndex }) => {
      stopAutorun()

      if (!pluginParams.autorun) return

      const advance = () => {
        autorunTimer = setTimeout(() => {
          const current = currentFrameIndex$.getValue()
          if (current < maxFrameIndex) {
            currentFrameIndex$.next(current + 1)
            advance()
          } else if (pluginParams.loop) {
            currentFrameIndex$.next(0)
            advance()
          }
        }, pluginParams.frameInterval)
      }

      advance()
    })

    // ---- extend context ----
    const extendsContext: RacingPlotExtendContext = {
      layout$,
      computedData$,
      fontSizePx$,
      containerSize$,
      gridHighlight$,
      gridContainerPosition$,
      seriesLabels$,
      SeriesDataMap$,
      CategoryDataMap$,
      visibleComputedData$,
      currentFrameIndex$,
      maxFrameIndex$,
      currentFrameLabel$,
      xScale$,
      racingRankedSeriesData$,
      computedRankedAmount$,
      rankedItemHeight$,
      rankedScaleList$
    }

    props.context = {
      ...props.context,
      ...extendsContext
    }

    return () => {
      stopAutorun()
      destroy$.next()
      destroy$.complete()
    }
  },
  validator: (params: RacingPlotPluginParams) => {
    const result = validateObject(params, {
      styles: { toBeTypes: ['object'] },
      visibleFilter: { toBeTypes: ['Function'] },
      // valueAxis: { toBeTypes: ['object'] },
      autorun: { toBeTypes: ['boolean'] },
      loop: { toBeTypes: ['boolean'] },
      frameInterval: { toBeTypes: ['number'] }
    })
    return result
  }
})
