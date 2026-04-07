import * as d3 from 'd3'
import {
  Subject,
  Observable,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { GridPlotTriangleBarParams, GridPlotPluginParams } from '../types'
import { DEFAULT_BARS_TRIANGLE_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_GRAPHIC } from '../../../const/layerIndex'
import { createBaseTriangleBar } from '../../../baseLayers/BaseTriangleBar'
import { defineSVGLayer } from '@orbcharts/core'
import { GridPlotExtendContext } from '../types'
import { validateObject } from '@orbcharts/core'

const pluginName = 'GridPlot'
const layerName = 'TriangleBar'

export const TriangleBar = defineSVGLayer<GridPlotExtendContext, GridPlotPluginParams, GridPlotTriangleBarParams>({
  name: layerName,
  defaultParams: DEFAULT_BARS_TRIANGLE_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      barWidth: {
        toBeTypes: ['number']
      },
      barPadding: {
        toBeTypes: ['number']
      },
      barGroupPadding: {
        toBeTypes: ['number']
      },
      linearGradientOpacity: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      }
    })
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject()

    context.layout$
      .pipe(
        takeUntil(destroy$)
      )
      .subscribe(layout => {
        d3.select(svgG)
          .attr('transform', `translate(${layout.left}, ${layout.top})`)
      })

    const unsubscribeBaseBars = createBaseTriangleBar({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedData$,
      visibleComputedData$: context.visibleComputedData$,
      visibleComputedAxesData$: context.visibleComputedAxesData$,
      seriesLabels$: context.seriesLabels$,
      SeriesDataMap$: context.SeriesDataMap$,
      CategoryDataMap$: context.CategoryDataMap$,
      baseBarsTriangleParams$: layerParams$,
      gridAxesTransform$: context.gridAxesTransform$,
      gridGraphicTransform$: context.gridGraphicTransform$,
      gridAxesSize$: context.gridAxesSize$,
      gridHighlight$: context.gridHighlight$,
      gridContainerPosition$: context.gridContainerPosition$,
      isSeriesSeprate$: context.isSeriesSeprate$,
      styles$: pluginParams$.pipe(
        map(params => params.styles),
      ),
      eventTrigger$: context.eventTrigger$,
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseBars()
    }
  }
})
