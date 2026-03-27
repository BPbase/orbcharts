import * as d3 from 'd3'
import {
  shareReplay,
  map,
  filter,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  Observable,
  BehaviorSubject
} from 'rxjs'

import type { NetworkPlotExtendContext, NetworkPlotPluginParams, NetworkPlotAllLayerParams } from './types'
import { defineSVGPlugin } from '../../../../core/src'
import { validateObject } from '../../../../core/src/utils'
import { DEFAULT_NETWORK_PLOT_PARAMS } from './defaults'
import {
  categoryDataMapObservable,
  containerSizeObservable,
  layoutObservable,
  fontSizePxObservable,
  highlightObservable,
  seriesDataMapObservable
} from '../../utils/observables'
import {
  multivariateComputedDataObservable,
  categoryLabelsObservable,
  NodeMapObservable,
  EdgeMapObservable,
  graphVisibleComputedDataObservable
} from './contextObservables'
// import { Scatter } from './layers/Scatter'
// import { ScatterBubbles } from './layers/ScatterBubbles'
// import { XYAux } from './layers/XYAux'
// import { XYAxes } from './layers/XYAxes'
// import { XZoom } from './layers/XZoom'
// const scatter = new Scatter()
// const scatterBubbles = new ScatterBubbles()
// const xyAux = new XYAux()
// const xyAxes = new XYAxes()
// const xZoom = new XZoom()

export const NetworkPlot = defineSVGPlugin<
  NetworkPlotExtendContext,
  NetworkPlotPluginParams,
  NetworkPlotAllLayerParams
>({
  name: 'NetworkPlot',
  defaultParams: DEFAULT_NETWORK_PLOT_PARAMS,
  layers: [],
  setup: (props) => {

    const selectedGraphData$ = combineLatest({
      graphData: props.context.graphData$,
      datasetIndex: props.pluginParams$.pipe(
        map(pluginParams => pluginParams.datasetIndex)
      )
    }).pipe(
      debounceTime(0),
      map(({ graphData, datasetIndex }) => graphData[datasetIndex]),
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

    const computedData$ = multivariateComputedDataObservable({
      selectedGraphData$: selectedGraphData$,
      pluginParams$: props.pluginParams$
    }).pipe(
      shareReplay(1)
    )

    const fontSizePx$ = fontSizePxObservable(props.context.theme$).pipe(
      shareReplay(1)
    )

    const graphHighlightNodes$ = highlightObservable({
      datumList$: computedData$.pipe(map(data => data.nodes)),
      styles$: props.pluginParams$.pipe(map(pluginParams => pluginParams.styles)),
      event$: props.context.event$
    }).pipe(
      shareReplay(1)
    )

    const graphHighlightEdges$ = highlightObservable({
      datumList$: computedData$.pipe(map(data => data.edges)),
      styles$: props.pluginParams$.pipe(map(pluginParams => pluginParams.styles)),
      event$: props.context.event$
    }).pipe(
      shareReplay(1)
    )

    const CategoryNodeMap$ = categoryDataMapObservable({
      datumList$: computedData$.pipe(map(data => data.nodes))
    }).pipe(
      shareReplay(1)
    )

    const CategoryEdgeMap$ = categoryDataMapObservable({
      datumList$: computedData$.pipe(map(data => data.edges))
    }).pipe(
      shareReplay(1)
    )

    const NodeMap$ = NodeMapObservable(computedData$).pipe(
      shareReplay(1)
    )

    const EdgeMap$ = EdgeMapObservable(computedData$).pipe(
      shareReplay(1)
    )

    const categoryLabels$ = categoryLabelsObservable(CategoryNodeMap$, CategoryEdgeMap$).pipe(
      shareReplay(1)
    )

    const visibleComputedData$ = graphVisibleComputedDataObservable({
      computedData$: computedData$,
      NodeMap$
    }).pipe(
      shareReplay(1)
    )

    const extendsContext: NetworkPlotExtendContext = {
      layout$,
      computedData$,
      fontSizePx$,
      graphHighlightNodes$,
      graphHighlightEdges$,
      categoryLabels$,
      CategoryNodeMap$,
      CategoryEdgeMap$,
      NodeMap$,
      EdgeMap$,
      visibleComputedData$
    }

    props.context = {
      ...props.context,
      ...extendsContext,
    }
    
    return () => {
      // layoutSubscription.unsubscribe()
    }
  },
  validator: (params: NetworkPlotPluginParams) => {
    const result = validateObject(params, {
      styles: {
        toBeTypes: ['object'],
      },
      visibleFilter: {
        toBeTypes: ['Function']
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
    
    return result
  },
})