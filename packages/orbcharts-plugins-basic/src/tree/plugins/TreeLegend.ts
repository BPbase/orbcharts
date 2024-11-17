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
  validator: (params) => {
    return {
      status: 'success',
      message: ''
    }
  }
}

export const TreeLegend = defineTreePlugin(pluginConfig)(({ selection, rootSelection, observer, subject }) => {
  
  const destroy$ = new Subject()

  const categoryLabels$: Observable<string[]> = observer.CategoryDataMap$.pipe(
    takeUntil(destroy$),
    map(data => {
      return Array.from(data.keys())
    })
  )

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
    seriesLabels$: categoryLabels$,
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

