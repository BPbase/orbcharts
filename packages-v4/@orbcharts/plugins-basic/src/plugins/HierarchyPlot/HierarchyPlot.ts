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

import type { HierarchyPlotExtendContext, HierarchyPlotPluginParams, HierarchyPlotAllLayerParams } from './types'
import { defineSVGPlugin } from '../../../../core/src'
import { validateObject } from '../../../../core/src/utils'
import { DEFAULT_HIERARCHY_PLOT_PARAMS } from './defaults'
import {
  categoryDataMapObservable,
  containerSizeObservable,
  layoutObservable,
  fontSizePxObservable,
  highlightObservable,
  seriesDataMapObservable
} from '../../utils/observables'
import {
  treeComputedDataObservable,
  nodeListObservable,
  categoryLabelsObservable,
  treeVisibleComputedDataObservable
} from './contextObservables'
import { TreeMap } from './layers/TreeMap'
const treeMap = new TreeMap()

export const HierarchyPlot = defineSVGPlugin<
  HierarchyPlotExtendContext,
  HierarchyPlotPluginParams,
  HierarchyPlotAllLayerParams
>({
  name: 'HierarchyPlot',
  defaultParams: DEFAULT_HIERARCHY_PLOT_PARAMS,
  layers: [treeMap],
  setup: (props) => {

    const selectedTreeData$ = combineLatest({
      treeData: props.context.treeData$,
      datasetIndex: props.pluginParams$.pipe(
        map(pluginParams => pluginParams.datasetIndex)
      )
    }).pipe(
      debounceTime(0),
      map(({ treeData, datasetIndex }) => treeData[datasetIndex]),
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

    const computedData$ = treeComputedDataObservable({
      selectedTreeData$: selectedTreeData$,
      pluginParams$: props.pluginParams$
    }).pipe(
      shareReplay(1)
    )

    const fontSizePx$ = fontSizePxObservable(props.context.theme$).pipe(
      shareReplay(1)
    )

    const nodeList$ = nodeListObservable({
      computedData$: computedData$
    }).pipe(
      shareReplay(1)
    )

    const treeHighlight$ = highlightObservable({
      datumList$: nodeList$,
      styles$: props.pluginParams$.pipe(
        map(pluginParams => pluginParams.styles)
      ),
      event$: props.context.event$
    }).pipe(
      shareReplay(1)
    )

    const CategoryDataMap$ = categoryDataMapObservable({
      datumList$: nodeList$
    }).pipe(
      shareReplay(1)
    )
    
    const categoryLabels$ = categoryLabelsObservable(CategoryDataMap$).pipe(
      shareReplay(1)
    )

    const visibleComputedData$ = treeVisibleComputedDataObservable({
      computedData$: computedData$
    }).pipe(
      shareReplay(1)
    )

    const extendsContext: HierarchyPlotExtendContext = {
      layout$,
      computedData$,
      fontSizePx$,
      treeHighlight$,
      categoryLabels$,
      CategoryDataMap$,
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
  validator: (params: HierarchyPlotPluginParams) => {
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