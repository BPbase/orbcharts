import * as d3 from 'd3'
import {
  shareReplay,
  map, 
  combineLatest,
  debounceTime} from 'rxjs'

import type { PartitionPlotExtendContext, PartitionPlotPluginParams, PartitionPlotAllLayerParams } from './types'
import { defineSVGPlugin } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_PARTITION_PLOT_PLUGIN_PARAMS } from './defaults'
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
import { Bubble } from './layers/Bubble'
import { Pie } from './layers/Pie'
import { PieEventText } from './layers/PieEventText'
import { PieLabel } from './layers/PieLabel'
import { Rose } from './layers/Rose'
import { RoseLabel } from './layers/RoseLabel'

const bubble = new Bubble()
const pie = new Pie()
const pieEventText = new PieEventText()
const pieLabel = new PieLabel()
const rose = new Rose()
const roseLabel = new RoseLabel()

export const PartitionPlot = defineSVGPlugin<
  PartitionPlotExtendContext,
  PartitionPlotPluginParams,
  PartitionPlotAllLayerParams
>({
  name: 'PartitionPlot',
  defaultParams: DEFAULT_PARTITION_PLOT_PLUGIN_PARAMS,
  layers: [bubble, pie, pieEventText, pieLabel, rose, roseLabel],
  setup: (props) => {
    // props.context.seriesData$.subscribe(seriesData => {
    //   console.log('PartitionPlot seriesData', seriesData)
    // })
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

    // combineLatest({
    //   layout: layout$,
    //   plugins: props.context.plugins$
    // }).pipe(
    //   debounceTime(0)
    // ).subscribe(data => {
    //   d3
    //     .select(props.context.svg)
    //     .selectAll(':scope > g') // 所有 layer
    //     .attr('transform', `translate(${data.layout.left}, ${data.layout.top})`)
    // })

    // const layoutSubscription = layout$.subscribe(layout => {
    //   props.svg.setAttribute('transform', `translate(${layout.left}, ${layout.top})`)
    // })

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

    const extendsContext: PartitionPlotExtendContext = {
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
      // layoutSubscription.unsubscribe()
    }
  },
  validator: (params: PartitionPlotPluginParams) => {
    const result = validateObject(params, {
      styles: {
        toBeTypes: ['object'],
      },
      visibleFilter: {
        toBeTypes: ['Function', 'null']
      },
      sort: {
        toBeTypes: ['Function', 'null']
      },
      container: {
        toBeTypes: ['object']
      },
      separateSeries: {
        toBeTypes: ['boolean']
      },
      separateName: {
        toBeTypes: ['boolean']
      },
      datasetIndex: {
        toBeTypes: ['number']
      }
    })
    if (result.status === 'error') {
      return result
    }
    if (params.styles) {
      const stylesResult = validateObject(params.styles, {
        padding: {
          toBeTypes: ['object']
        },
        highlightTarget: {
          toBeTypes: ['string']
        },
        highlightDefault: {
          toBeTypes: ['string', 'null']
        },
        unhighlightedOpacity: {
          toBeTypes: ['number']
        },
        transitionDuration: {
          toBeTypes: ['number']
        },
        transitionEase: {
          toBeTypes: ['string']
        }
      })
      if (stylesResult.status === 'error') {
        return stylesResult
      }
      if (params.styles.padding) {
        const paddingResult = validateObject(params.styles.padding, {
          top: {
            toBeTypes: ['number']
          },
          right: {
            toBeTypes: ['number']
          },
          bottom: {
            toBeTypes: ['number']
          },
          left: {
            toBeTypes: ['number']
          }
        })
        if (paddingResult.status === 'error') {
          return paddingResult
        }
      }
    }
    if (params.container) {
      const containerResult = validateObject(params.container, {
        columnAmount: {
          toBeTypes: ['number']
        },
        rowAmount: {
          toBeTypes: ['number']
        },
        columnGap: {
          toBe: 'number | "auto"',
          test: (value: any) => typeof value === 'number' || value === 'auto'
        },
        rowGap: {
          toBe: 'number | "auto"',
          test: (value: any) => typeof value === 'number' || value === 'auto'
        }
      })
      if (containerResult.status === 'error') {
        return containerResult
      }
    }
    
    return result
  },
})