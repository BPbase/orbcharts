import {
  shareReplay,
  map } from 'rxjs'

import type { SeriesSeparableGraphicExtendContext, SeriesSeparableGraphicPluginParams, SeriesSeparableGraphicAllLayerParams } from './types'
import { definePlugin } from '../../../../core/src'
import { DEFAULT_SERIES_SEPARABLE_GRAPHIC_PARAMS } from './defaults'
import { Pie } from './layers/Pie'

const pie = new Pie()

export const SeriesSeparableGraphic = definePlugin<
  SeriesSeparableGraphicExtendContext,
  SeriesSeparableGraphicPluginParams,
  SeriesSeparableGraphicAllLayerParams
>({
  name: 'SeriesSeparableGraphic',
  defaultParams: DEFAULT_SERIES_SEPARABLE_GRAPHIC_PARAMS,
  layers: [pie],
  setup: (props) => {

    const textSizePx$ = textSizePxObservable(observer.fullChartParams$).pipe(
      shareReplay(1)
    )

    const datumLabels$ = datumLabelsObservable({
      computedData$: observer.computedData$
    }).pipe(
      shareReplay(1)
    )

    const separateSeries$ = separateSeriesObservable({
      fullDataFormatter$: observer.fullDataFormatter$
    }).pipe(
      shareReplay(1)
    )

    const separateLabel$ = separateLabelObservable({
      fullDataFormatter$: observer.fullDataFormatter$
    }).pipe(
      shareReplay(1)
    )

    const sumSeries$ = sumSeriesObservable({
      fullDataFormatter$: observer.fullDataFormatter$
    }).pipe(
      shareReplay(1)
    )

    // const visibleComputedData$ = seriesVisibleComputedDataObservable({
    //   computedData$: observer.computedData$,
    // }).pipe(
    //   shareReplay(1)
    // )

    const computedSortedData$ = seriesComputedSortedDataObservable({
      computedData$: observer.computedData$,
      separateSeries$: separateSeries$,
      separateLabel$: separateLabel$,
      sumSeries$: sumSeries$,
      datumLabels$: datumLabels$,
    }).pipe(
      shareReplay(1)
    )

    const visibleComputedSortedData$ = seriesVisibleComputedDataObservable({
      computedData$: computedSortedData$,
    }).pipe(
      shareReplay(1)
    )

    const datumList$ = observer.computedData$.pipe(
      map(d => d.flat())
    ).pipe(
      shareReplay(1)
    )

    const seriesHighlight$ = highlightObservable({
      datumList$,
      fullChartParams$: observer.fullChartParams$,
      event$: subject.event$
    }).pipe(
      shareReplay(1)
    )

    const seriesLabels$ = seriesLabelsObservable({
      computedData$: observer.computedData$,
    }).pipe(
      shareReplay(1)
    )

    const SeriesDataMap$ = seriesDataMapObservable({
      datumList$
    }).pipe(
      shareReplay(1)
    )

    const seriesContainerPosition$ = seriesContainerPositionObservable({
      computedSortedData$: computedSortedData$,
      fullDataFormatter$: observer.fullDataFormatter$,
      layout$: observer.layout$,
    }).pipe(
      shareReplay(1)
    )

    const DatumContainerPositionMap$ = datumContainerPositionMapObservable({
      seriesContainerPosition$: seriesContainerPosition$,
      computedSortedData$: computedSortedData$,
    }).pipe(
      shareReplay(1)
    )

    props.context = {
      ...props.context,

    }

    
    return () => {
      
    }
  },
  validator: (params: SeriesSeparableGraphicPluginParams) => {
    return { valid: true }
  },
})