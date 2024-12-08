import * as d3 from 'd3'
import {
  combineLatest,
  map,
  switchMap,
  takeUntil,
  Observable,
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineTreePlugin } from '../../../lib/core'
import { DEFAULT_TREE_LEGEND_PARAMS } from '../defaults'
import { createBaseLegend } from '../../base/BaseLegend'
import { LAYER_INDEX_OF_INFO } from '../../const'

const pluginName = 'TreeLegend'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_TREE_LEGEND_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_TREE_LEGEND_PARAMS,
  layerIndex: LAYER_INDEX_OF_INFO,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
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
  }
}

export const TreeLegend = defineTreePlugin(pluginConfig)(({ selection, rootSelection, observer, subject }) => {
  
  const destroy$ = new Subject()

  // 全部列點矩型使用相同樣式參數
  const fullParams$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(d => {
      const seriesList = [
        {
          listRectWidth: d.listRectWidth,
          listRectHeight: d.listRectHeight,
          listRectRadius: d.listRectRadius,
        }
      ]
      return {
        ...d,
        seriesList
      }
    })
  )

  const unsubscribeBaseLegend = createBaseLegend(pluginName, {
    rootSelection,
    seriesLabels$: observer.categoryLabels$,
    fullParams$,
    layout$: observer.layout$,
    fullChartParams$: observer.fullChartParams$,
    textSizePx$: observer.textSizePx$
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseLegend()
  }
})

