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
import type { LegendExtendContext, LegendPluginParams, LegendLegendParams } from "../types"
import { defineSVGLayer } from '@orbcharts/core'
import { validateObject } from '@orbcharts/core'
import { createBaseLegend } from "../../../baseLayers/BaseLegend"
import { DEFAULT_LEGEND_LEGEND_PARAMS } from "../defaults"
import { LAYER_INDEX_OF_INFO } from '../../../const/layerIndex'

const pluginName = 'Legend'
const layerName = 'Legend'

export const Legend = defineSVGLayer<LegendExtendContext, LegendPluginParams, LegendLegendParams>({
  name: layerName,
  defaultParams: DEFAULT_LEGEND_LEGEND_PARAMS,
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
      backgroundColorType: {
        toBeOption: 'ColorType',
      },
      strokeColorType: {
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

    // Legend 顯示的項目跟著 encoding.color.by 走：color.by 是 'category' 就依類別分組上色，
    // 其他情況（'series'、'dataset'、'index'）沒有對應的離散分組可用，一律 fallback 依系列分組，
    // 確保跟圖表實際的上色依據（datum.color）一致，而不是自己另外算一套顏色。
    const legendItems$: Observable<{ label: string; color: string }[]> = combineLatest({
      colorBy: context.encoding$.pipe(map(encoding => encoding.color.by), distinctUntilChanged()),
      seriesDataMap: context.SeriesDataMap$,
      categoryDataMap: context.CategoryDataMap$,
    }).pipe(
      takeUntil(destroy$),
      map(({ colorBy, seriesDataMap, categoryDataMap }) => {
        const dataMap = colorBy === 'category' ? categoryDataMap : seriesDataMap
        return Array.from(dataMap.entries()).map(([label, items]) => ({
          label,
          color: items[0]?.color ?? ''
        }))
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
      selection: d3.select(svgG),
      legendItems$,
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