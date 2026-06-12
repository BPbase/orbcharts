import {
  shareReplay,
  map,
  of,
  combineLatest,
  debounceTime,
  Subject,
  switchMap,
  BehaviorSubject
} from 'rxjs'

import type { CategoricalPlotExtendContext, CategoricalPlotPluginParams, CategoricalPlotAllLayerParams } from './types'
import { defineSVGPlugin, validateObject } from '@orbcharts/core'
import { DEFAULT_CATEGORICAL_PLOT_PLUGIN_PARAMS } from './defaults'
import { DEFAULT_CONTAINER } from '../../const/sharedPluginParams'
import {
  containerSizeObservable,
  layoutObservable,
  fontSizePxObservable,
  highlightObservable,
  seriesDataMapObservable
} from '../../utils/observables'
import {
  seriesComputedDataObservable,
  seriesLabelsObservable,
  seriesVisibleComputedDataObservable,
  seriesContainerPositionObservable,
  categoryScaleDomainValueObservable,
  ordinalScaleObservable,
  gridAxesSizeObservable,
  gridAxesContainerSizeObservable,
  gridAxesTransformObservable,
  gridAxesReverseTransformObservable,
  filteredMinMaxValueObservable,
  valueScaleObservable,
  categoryLabelsObservable
} from './contextObservables'
import { RaisedBubble } from './layers/RaisedBubble'
import { CategoryAxis } from './layers/CategoryAxis'
import { CategoryZoom } from './layers/CategoryZoom'
import { ValueAxis } from './layers/ValueAxis'

export const CategoricalPlot = defineSVGPlugin<
  CategoricalPlotExtendContext,
  CategoricalPlotPluginParams,
  CategoricalPlotAllLayerParams
>({
  name: 'CategoricalPlot',
  defaultParams: DEFAULT_CATEGORICAL_PLOT_PLUGIN_PARAMS,
  layers: [CategoryAxis, CategoryZoom, RaisedBubble, ValueAxis],
  setup: (props) => {

    // ---- chart position ----
    const position$ = props.pluginParams$.pipe(
      map(p => p.position),
      shareReplay(1)
    )

    // ---- zoom ----
    const zoomedScaleDomain$ = new BehaviorSubject<[number, number | 'max'] | undefined>(undefined)
    props.context.event$.subscribe(event => {
      if (event.eventName === 'zoom' && event.data && event.data.scaleDomain) {
        zoomedScaleDomain$.next(event.data.scaleDomain)
      }
    })

    const zoomedCategoryAxis$ = combineLatest({
      params: props.pluginParams$
    }).pipe(
      switchMap(({ params }) => zoomedScaleDomain$.pipe(
        map(scaleDomain => ({
          position: 'bottom' as const,   // category axis is always at the bottom
          scaleDomain: scaleDomain ? scaleDomain : params.categoryAxis.scaleDomain,
          scalePadding: params.categoryAxis.scalePadding,
          label: params.categoryAxis.label
        }))
      )),
      shareReplay(1)
    )

    // ---- select series dataset ----
    const selectedSeriesData$ = combineLatest({
      seriesData: props.context.seriesData$,
      datasetIndex: props.pluginParams$.pipe(map(p => p.datasetIndex))
    }).pipe(
      debounceTime(0),
      map(({ seriesData, datasetIndex }) => seriesData[datasetIndex] ?? []),
      shareReplay(1)
    )

    // ---- layout & sizes ----
    const layout$ = layoutObservable({
      size$: props.context.size$,
      padding$: props.pluginParams$.pipe(map(p => p.styles.padding))
    }).pipe(shareReplay(1))

    const computedData$ = seriesComputedDataObservable({
      selectedSeriesData$,
      pluginParams$: props.pluginParams$
    }).pipe(shareReplay(1))

    const fontSizePx$ = fontSizePxObservable(props.context.theme$).pipe(shareReplay(1))

    const gridContainerPosition$ = seriesContainerPositionObservable({
      computedData$
    }).pipe(shareReplay(1))

    const containerSize$ = containerSizeObservable({
      layout$,
      containerPosition$: gridContainerPosition$,
      container$: of(DEFAULT_CONTAINER)
    }).pipe(shareReplay(1))

    const gridAxesSize$ = gridAxesSizeObservable({ layout$ }).pipe(shareReplay(1))

    const gridAxesContainerSize$ = gridAxesContainerSizeObservable({
      gridAxesSize$
    }).pipe(shareReplay(1))

    const datumList$ = computedData$.pipe(map(d => d.flat()), shareReplay(1))

    const SeriesDataMap$ = seriesDataMapObservable({ datumList$ }).pipe(shareReplay(1))

    const gridHighlight$ = highlightObservable({
      datumList$,
      styles$: props.pluginParams$.pipe(map(p => p.styles)),
      event$: props.context.event$
    }).pipe(shareReplay(1))

    const seriesLabels$ = seriesLabelsObservable({ computedData$ })

    const categoryLabels$ = categoryLabelsObservable({ computedData$ }).pipe(shareReplay(1))

    const visibleComputedData$ = seriesVisibleComputedDataObservable({ computedData$ }).pipe(shareReplay(1))

    const categoryScaleDomainValue$ = categoryScaleDomainValueObservable({
      computedData$,
      categoryAxis$: zoomedCategoryAxis$
    }).pipe(shareReplay(1))

    const ordinalScale$ = ordinalScaleObservable({
      computedData$,
      categoryScaleDomainValue$,
      layout$,
      position$
    }).pipe(shareReplay(1))

    const gridAxesTransform$ = gridAxesTransformObservable({
      layout$,
      position$
    }).pipe(shareReplay(1))

    const gridAxesReverseTransform$ = gridAxesReverseTransformObservable({ gridAxesTransform$ }).pipe(shareReplay(1))

    const valueAxis$ = props.pluginParams$.pipe(
      map(p => p.valueAxis),
      shareReplay(1)
    )

    const filteredMinMaxValue$ = filteredMinMaxValueObservable({
      computedData$,
      categoryScaleDomainValue$
    }).pipe(shareReplay(1))

    const valueScale$ = valueScaleObservable({
      filteredMinMaxValue$,
      valueAxis$,
      layout$
    }).pipe(shareReplay(1))

    const extendsContext: CategoricalPlotExtendContext = {
      layout$,
      computedData$,
      fontSizePx$,
      containerSize$,
      gridHighlight$,
      gridContainerPosition$,
      seriesLabels$,
      categoryLabels$,
      SeriesDataMap$,
      visibleComputedData$,
      ordinalScale$,
      categoryScaleDomainValue$,
      zoomedCategoryAxis$,
      gridAxesSize$,
      gridAxesContainerSize$,
      gridAxesTransform$,
      gridAxesReverseTransform$,
      filteredMinMaxValue$,
      valueScale$
    }

    props.context = {
      ...props.context,
      ...extendsContext
    }

    return () => {}
  },
  validator: (params: CategoricalPlotPluginParams) => {
    const result = validateObject(params, {
      styles: { toBeTypes: ['object'] },
      visibleFilter: { toBeTypes: ['Function'] },
      categoryAxis: { toBeTypes: ['object'] },
      valueAxis: { toBeTypes: ['object'] },
      datasetIndex: { toBeTypes: ['number'] }
    })
    return result
  }
})

