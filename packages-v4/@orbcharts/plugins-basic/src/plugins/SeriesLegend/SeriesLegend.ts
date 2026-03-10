import {
  shareReplay,
  map, 
  combineLatest,
  debounceTime} from 'rxjs'

import type { SeriesLegendExtendContext, SeriesLegendPluginParams, SeriesLegendAllLayerParams } from './types'
import { defineSVGPlugin } from '../../../../core/src'
import { validateObject } from '../../../../core/src/utils'
import { DEFAULT_SERIES_SEPARABLE_GRAPHIC_PARAMS } from './defaults'
import {
  layoutObservable,
  fontSizePxObservable,
  seriesDataMapObservable
} from '../../utils/observables'
import {
  seriesComputedDataObservable,
} from './contextObservables'
import { SeriesLegend as SeriesLegendLayer } from './layers/SeriesLegend'

const seriesLegend = new SeriesLegendLayer()

export const SeriesLegend = defineSVGPlugin<
  SeriesLegendExtendContext,
  SeriesLegendPluginParams,
  SeriesLegendAllLayerParams
>({
  name: 'SeriesLegend',
  defaultParams: DEFAULT_SERIES_SEPARABLE_GRAPHIC_PARAMS,
  layers: [seriesLegend],
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

    const extendsContext: SeriesLegendExtendContext = {
      layout$,
      fontSizePx$,
      SeriesDataMap$,
    }

    props.context = {
      ...props.context,
      ...extendsContext,
    }
    
    return () => {
      // layoutSubscription.unsubscribe()
    }
  },
  validator: (params: SeriesLegendPluginParams) => {
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