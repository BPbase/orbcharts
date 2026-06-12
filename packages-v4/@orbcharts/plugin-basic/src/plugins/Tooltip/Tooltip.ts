import {
  shareReplay,
  map, 
  combineLatest,
  debounceTime} from 'rxjs'

import type { TooltipExtendContext, TooltipPluginParams, TooltipAllLayerParams } from './types'
import { defineSVGPlugin } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { DEFAULT_TOOLTIP_PLUGIN_PARAMS } from './defaults'
import {
  layoutObservable,
  fontSizePxObservable,
  seriesDataMapObservable,
  categoryDataMapObservable
} from '../../utils/observables'
import {
  seriesComputedDataObservable,
} from './contextObservables'
import { Tooltip as TooltipLayer } from './layers/Tooltip'

export const Tooltip = defineSVGPlugin<
  TooltipExtendContext,
  TooltipPluginParams,
  TooltipAllLayerParams
>({
  name: 'Tooltip',
  defaultParams: DEFAULT_TOOLTIP_PLUGIN_PARAMS,
  layers: [TooltipLayer],
  setup: (props) => {

    const selectedSeriesData$ = combineLatest({
      gridData: props.context.gridData$,
      datasetIndex: props.pluginParams$.pipe(
        map(pluginParams => pluginParams.datasetIndex)
      )
    }).pipe(
      debounceTime(0),
      map(({ gridData, datasetIndex }) => gridData[datasetIndex]),
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

    const datumList$ = computedData$.pipe(
      map(d => d.flat())
    ).pipe(
      shareReplay(1)
    )

    const SeriesDataMap$ = seriesDataMapObservable({
      datumList$
    }).pipe(
      shareReplay(1)
    )

    const CategoryDataMap$ = categoryDataMapObservable({
      datumList$: datumList$
    }).pipe(
      shareReplay(1)
    )

    const extendsContext: TooltipExtendContext = {
      layout$,
      fontSizePx$,
      SeriesDataMap$,
      CategoryDataMap$,
    }

    props.context = {
      ...props.context,
      ...extendsContext,
    }
    
    return () => {
      // layoutSubscription.unsubscribe()
    }
  },
  validator: (params: TooltipPluginParams) => {
    const result = validateObject(params, {
      styles: {
        toBeTypes: ['object'],
      },
      datasetIndex: {
        toBeTypes: ['number']
      }
    })
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