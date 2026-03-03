import {
  shareReplay,
  map, 
  combineLatest,
  debounceTime} from 'rxjs'

import type { SeriesSeparableGraphicExtendContext, SeriesSeparableGraphicPluginParams, SeriesSeparableGraphicAllLayerParams } from './types'
import { definePlugin } from '../../../../core/src'
import { DEFAULT_SERIES_SEPARABLE_GRAPHIC_PARAMS } from './defaults'
import {
  categoryDataMapObservable,
  containerSizeObservable,
  layoutObservable,
  fontSizePxObservable,
  highlightObservable,
  seriesDataMapObservable
} from '../../utils/observables'
import {
  datumContainerPositionMapObservable,
  datumLabelsObservable,
  separateNameObservable,
  separateSeriesObservable,
  seriesComputedDataObservable,
  seriesComputedSortedDataObservable,
  seriesContainerPositionObservable,
  seriesLabelsObservable,
  seriesVisibleComputedDataObservable
} from './contextObservables'
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

    const selectedSeriesData$ = combineLatest({
      seriesData: props.context.seriesData$,
      datasetIndex: props.pluginParams$.pipe(
        map(pluginParams => pluginParams.datasetIndex)
      )
    }).pipe(
      debounceTime(0),
      map(({ seriesData, datasetIndex }) => seriesData[datasetIndex]),
      shareReplay(1)
    )

    const layout$ = layoutObservable({
      size$: props.context.size$,
      padding$: props.pluginParams$.pipe(
        map(pluginParams => pluginParams.styles.padding)
      )
    }).pipe(
      shareReplay(1)
    )

    const computedData$ = seriesComputedDataObservable({
      selectedSeriesData$,
      pluginParams$: props.pluginParams$
    }).pipe(
      shareReplay(1)
    )

    const fontSizePx$ = fontSizePxObservable(props.context.theme$).pipe(
      shareReplay(1)
    )

    const datumLabels$ = datumLabelsObservable({
      selectedSeriesData$
    }).pipe(
      shareReplay(1)
    )

    const separateSeries$ = separateSeriesObservable({
      pluginParams$: props.pluginParams$
    }).pipe(
      shareReplay(1)
    )

    const separateName$ = separateNameObservable({
      pluginParams$: props.pluginParams$
    }).pipe(
      shareReplay(1)
    )

    // const sumSeries$ = sumSeriesObservable({
    //   fullDataFormatter$: observer.fullDataFormatter$
    // }).pipe(
    //   shareReplay(1)
    // )

    const computedSortedData$ = seriesComputedSortedDataObservable({
      seriesComputedData$: computedData$,
      separateSeries$: separateSeries$,
      separateName$: separateName$,
      // sumSeries$: sumSeries$,
      datumLabels$: datumLabels$,
    }).pipe(
      shareReplay(1)
    )

    const visibleComputedSortedData$ = seriesVisibleComputedDataObservable({
      seriesComputedData$: computedSortedData$,
    }).pipe(
      shareReplay(1)
    )

    const datumList$ = computedData$.pipe(
      map(d => d.flat())
    ).pipe(
      shareReplay(1)
    )

    const seriesHighlight$ = highlightObservable({
      datumList$,
      styles$: props.pluginParams$.pipe(
        map(pluginParams => pluginParams.styles)
      ),
      event$: props.context.event$
    }).pipe(
      shareReplay(1)
    )

    const seriesLabels$ = seriesLabelsObservable({
      selectedSeriesData$,
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
      pluginParams$: props.pluginParams$,
      layout$: layout$,
    }).pipe(
      shareReplay(1)
    )

    const DatumContainerPositionMap$ = datumContainerPositionMapObservable({
      seriesContainerPosition$: seriesContainerPosition$,
      computedSortedData$: computedSortedData$,
    }).pipe(
      shareReplay(1)
    )

    const extendsContext: SeriesSeparableGraphicExtendContext = {
      layout$,
      computedData$,
      fontSizePx$,
      datumLabels$,
      separateSeries$,
      separateName$,
      computedSortedData$,
      visibleComputedSortedData$,
      datumList$,
      seriesHighlight$,
      seriesLabels$,
      SeriesDataMap$,
      seriesContainerPosition$,
      DatumContainerPositionMap$,
    }

    props.context = {
      ...props.context,
      ...extendsContext,
    }
    
    return () => {
      
    }
  },
  validator: (params: SeriesSeparableGraphicPluginParams) => {
    return { valid: true }
  },
})