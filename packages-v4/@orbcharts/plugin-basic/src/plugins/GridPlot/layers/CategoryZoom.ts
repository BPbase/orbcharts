import * as d3 from 'd3'
import {
  map,
  distinctUntilChanged
} from 'rxjs'
import type { GridPlotCategoryZoomParams, GridPlotPluginParams } from '../types'
import { DEFAULT_CATEGORY_ZOOM_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_ROOT } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import type { GridPlotExtendContext } from '../types'
import { isDirectionHorizontal } from '../contextObservables'
import { createBaseCategoryZoom } from '../../../baseLayers/BaseCategoryZoom'

const pluginName = 'GridPlot'
const layerName = 'CategoryZoom'

export const CategoryZoom = defineSVGLayer<GridPlotExtendContext, GridPlotPluginParams, GridPlotCategoryZoomParams>({
  name: layerName,
  defaultParams: DEFAULT_CATEGORY_ZOOM_PARAMS,
  layerIndex: LAYER_INDEX_OF_ROOT,
  initShow: false,
  validator: (params) => {
    return { status: 'success', columnName: '', expectToBe: '' }
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const rootSelection = d3.select(context.svg)

    const categoryMaxIndex$ = context.computedData$.pipe(
      map(d => d[0] ? d[0].length - 1 : 0),
      distinctUntilChanged()
    )

    const initCategoryAxis$ = pluginParams$.pipe(
      map(d => d.categoryAxis)
    )

    // gridAxesSize.width is always the category-axis length
    // (transposed for horizontal chart: width = layout.height)
    const axisWidth$ = context.gridAxesSize$.pipe(
      map(d => d.width)
    )

    // 'bottom-up'/'top-down': category on X -> rescaleX -> isHorizontal = true
    // 'left-right'/'right-left': category on Y -> rescaleY -> isHorizontal = false
    const isHorizontal$ = pluginParams$.pipe(
      map(d => !isDirectionHorizontal(d.direction)),
      distinctUntilChanged()
    )

    const unsubscribe = createBaseCategoryZoom({
      rootSelection,
      pluginName,
      layerName,
      initCategoryAxis$,
      categoryMaxIndex$,
      axisWidth$,
      isHorizontal$,
      eventTrigger$: context.eventTrigger$
    })

    return () => {
      unsubscribe()
    }
  }
})
