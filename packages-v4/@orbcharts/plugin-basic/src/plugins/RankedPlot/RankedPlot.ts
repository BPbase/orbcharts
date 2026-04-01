import {
  shareReplay,
  map,
  of,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  BehaviorSubject
} from 'rxjs'

import type { RankedPlotExtendContext, RankedPlotPluginParams, RankedPlotAllLayerParams } from './types'
import { defineSVGPlugin, validateObject } from '@orbcharts/core'
import { DEFAULT_RANKED_PLOT_PARAMS } from './defaults'
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
  categoryScaleDomainValueObservable,
  ordinalScaleObservable,
  gridAxesSizeObservable,
  gridAxesTransformObservable,
  gridAxesReverseTransformObservable,
  rankedSeriesDataObservable,
  computedRankedAmountObservable,
  rankedItemHeightObservable,
  rankedScaleListObservable
} from './contextObservables'
import { CategoryAxis } from './layers/CategoryAxis'
import { CategoryAux } from './layers/CategoryAux'
import { CategoryZoom } from './layers/CategoryZoom'
import { RankedBubbles } from './layers/RankedBubbles'
import { RankedSeriesAxis } from './layers/RankedSeriesAxis'

const categoryAxis = new CategoryAxis()
const categoryAux = new CategoryAux()
const categoryZoom = new CategoryZoom()
const rankedBubbles = new RankedBubbles()
const rankedSeriesAxis = new RankedSeriesAxis()

export const RankedPlot = defineSVGPlugin<
  RankedPlotExtendContext,
  RankedPlotPluginParams,
  RankedPlotAllLayerParams
>({
  name: 'RankedPlot',
  defaultParams: DEFAULT_RANKED_PLOT_PARAMS,
  layers: [categoryAxis, categoryAux, categoryZoom, rankedBubbles, rankedSeriesAxis],
  setup: (props) => {

    // ---- zoom ----
    const zoomedScaleDomain$ = new BehaviorSubject<[number, number | 'max'] | undefined>(undefined)
    props.context.event$.subscribe(event => {
      if (event.eventName === 'zoom' && event.data && event.data.scaleDomain) {
        zoomedScaleDomain$.next(event.data.scaleDomain)
      }
    })

    const zoomedCategoryAxis$ = props.pluginParams$.pipe(
      map(params => params.categoryAxis),
      switchMap(categoryAxis => zoomedScaleDomain$.pipe(
        map(scaleDomain => scaleDomain
          ? { ...categoryAxis, scaleDomain }
          : categoryAxis
        )
      )),
      shareReplay(1)
    )

    // ---- select grid dataset ----
    const selectedGridData$ = combineLatest({
      gridData: props.context.gridData$,
      datasetIndex: props.pluginParams$.pipe(map(p => p.datasetIndex))
    }).pipe(
      debounceTime(0),
      map(({ gridData, datasetIndex }) => gridData[datasetIndex]),
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
      selectedGridData$,
      layout$
    }).pipe(shareReplay(1))

    const containerSize$ = containerSizeObservable({
      layout$,
      containerPosition$: gridContainerPosition$,
      container$: of(DEFAULT_CONTAINER)
    }).pipe(shareReplay(1))

    const gridAxesSize$ = gridAxesSizeObservable({ layout$ }).pipe(shareReplay(1))

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

    const categoryScaleDomainValue$ = categoryScaleDomainValueObservable({
      selectedGridData$,
      categoryAxis$: zoomedCategoryAxis$
    }).pipe(shareReplay(1))

    const ordinalScale$ = ordinalScaleObservable({
      computedData$,
      categoryScaleDomainValue$,
      layout$
    }).pipe(shareReplay(1))

    const gridAxesTransform$ = gridAxesTransformObservable({
      layout$,
      categoryAxisPosition$: props.pluginParams$.pipe(map(p => p.categoryAxis.position))
    }).pipe(shareReplay(1))

    const gridAxesReverseTransform$ = gridAxesReverseTransformObservable({ gridAxesTransform$ }).pipe(shareReplay(1))

    const rankedSeriesData$ = rankedSeriesDataObservable({ visibleComputedData$ }).pipe(shareReplay(1))

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
      rankedSeriesData$,
      rankedItemHeight$
    }).pipe(shareReplay(1))

    const extendsContext: RankedPlotExtendContext = {
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
      ordinalScale$,
      categoryScaleDomainValue$,
      zoomedCategoryAxis$,
      gridAxesSize$,
      gridAxesTransform$,
      gridAxesReverseTransform$,
      rankedSeriesData$,
      computedRankedAmount$,
      rankedItemHeight$,
      rankedScaleList$
    }

    props.context = {
      ...props.context,
      ...extendsContext
    }

    return () => {}
  },
  validator: (params: RankedPlotPluginParams) => {
    const result = validateObject(params, {
      styles: { toBeTypes: ['object'] },
      visibleFilter: { toBeTypes: ['Function'] }
    })
    return result
  }
})
