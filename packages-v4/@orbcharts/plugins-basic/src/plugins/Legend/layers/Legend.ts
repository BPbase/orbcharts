import * as d3 from 'd3'
import {
  combineLatest,
  map,
  filter,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  shareReplay,
  debounceTime,
  Observable,
  Subject, 
  BehaviorSubject} from 'rxjs'
import type { LegendExtendContext, LegendPluginParams, LegendParams } from "../types"
import { defineSVGLayer } from "../../../../../core/src"
import { validateObject } from '../../../../../core/src/utils'
import { createBaseLegend } from "../../../baseLayers/BaseLegend"
import { DEFAULT_SERIES_LEGEND_PARAMS } from "../defaults"
import { LAYER_INDEX_OF_INFO } from '../../../const/layerIndex'

const pluginName = 'Legend'
const layerName = 'Legend'

export const Legend = defineSVGLayer<LegendExtendContext, LegendPluginParams, LegendParams>({
  name: layerName,
  defaultParams: DEFAULT_SERIES_LEGEND_PARAMS,
  layerIndex: LAYER_INDEX_OF_INFO,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      placement: {
        toBe: '"top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end" | "left" | "left-start" | "left-end" | "right" | "right-start" | "right-end"',
        test: (value) => {
          return [
            'top', 'top-start', 'top-end',
            'bottom', 'bottom-start', 'bottom-end',
            'left', 'left-start', 'left-end',
            'right', 'right-start', 'right-end'
          ].includes(value)
        }
      },
      padding: {
        toBeTypes: ['number']
      },
      backgroundFill: {
        toBeOption: 'ColorType',
      },
      backgroundStroke: {
        toBeOption: 'ColorType',
      },
      gap: {
        toBeTypes: ['number']
      },
      listRectWidth: {
        toBeTypes: ['number']
      },
      listRectHeight: {
        toBeTypes: ['number']
      },
      listRectRadius: {
        toBeTypes: ['number']
      },
      textColorType: {
        toBeOption: 'ColorType',
      }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {

    const destroy$ = new Subject()

    const legendLabels$: Observable<string[]> = context.SeriesDataMap$.pipe(
      takeUntil(destroy$),
      map(data => {
        return Array.from(data.keys())
      })
    )

    // 全部列點矩型使用相同樣式參數
    const baseLegendParams$ = layerParams$.pipe(
      takeUntil(destroy$),
      map(d => {
        const labelList = [
          {
            listRectWidth: d.listRectWidth,
            listRectHeight: d.listRectHeight,
            listRectRadius: d.listRectRadius,
          }
        ]
        return {
          ...d,
          labelList
        }
      })
    )

    const unsubscribeBaseLegend = createBaseLegend({
      pluginName,
      layerName,
      rootSelection: d3.select(context.svg),
      legendLabels$,
      baseLegendParams$,
      layout$: context.layout$,
      theme$: context.theme$,
      fontSizePx$: context.fontSizePx$
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseLegend()
    }
  }
})