import * as d3 from 'd3'
import {
  Subject,
  map,
  takeUntil
} from 'rxjs'
import type { RacingPlotSeriesLabelParams, RacingPlotPluginParams } from '../types'
import { DEFAULT_RACING_PLOT_SERIES_LABEL_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_LABEL } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import type { RacingPlotExtendContext } from '../types'
import { createBaseRacingSeriesLabel } from '../../../baseLayers/BaseRacingSeriesLabel'
import { validateObject } from '@orbcharts/core'

const pluginName = 'RacingPlot'
const layerName = 'SeriesLabel'

export const SeriesLabel = defineSVGLayer<RacingPlotExtendContext, RacingPlotPluginParams, RacingPlotSeriesLabelParams>({
  name: layerName,
  defaultParams: DEFAULT_RACING_PLOT_SERIES_LABEL_PARAMS,
  layerIndex: LAYER_INDEX_OF_LABEL,
  initShow: true,
  validator: (params) => {
    const result = validateObject(params, {
      axisLabel: {
        toBeTypes: ['object']
      },
      seriesLabel: {
        toBeTypes: ['object']
      }
    })
    if (result.status === 'error') {
      return result
    }
    if (params.axisLabel) {
      const axisLabelResult = validateObject(params.axisLabel, {
        offset: {
          toBe: '[number, number]',
          test: (value: any) => {
            return Array.isArray(value)
              && value.length === 2
              && typeof value[0] === 'number'
              && typeof value[1] === 'number'
          }
        },
        colorType: {
          toBeOption: 'ColorType',
        },
      })
      if (axisLabelResult.status === 'error') {
        return axisLabelResult
      }
    }
    if (params.seriesLabel) {
      const seriesLabelResult = validateObject(params.seriesLabel, {
        position: {
          toBe: '"inside-left" | "inside-right" | "outside"',
          test: (value: any) => {
            return value === 'inside-left' || value === 'inside-right' || value === 'outside'
          }
        },
        padding: {
          toBeTypes: ['number']
        },
        colorType: {
          toBeOption: 'ColorType',
        }
      })
      if (seriesLabelResult.status === 'error') {
        return seriesLabelResult
      }
    }
    return result
  },
  setup: ({ svgG, pluginParams$, layerParams$, context }) => {
    const destroy$ = new Subject<void>()

    context.layout$.pipe(takeUntil(destroy$)).subscribe(layout => {
      d3.select(svgG).attr('transform', `translate(${layout.left}, ${layout.top})`)
    })

    const unsubscribe = createBaseRacingSeriesLabel({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      racingRankedSeriesData$: context.racingRankedSeriesData$,
      currentFrameIndex$: context.currentFrameIndex$,
      xScale$: context.xScale$,
      fullParams$: layerParams$,
      styles$: pluginParams$.pipe(map(p => p.styles)),
      rankingAxisLabel$: pluginParams$.pipe(map(p => p.rankedAxis.label)),
      rankedScaleList$: context.rankedScaleList$,
      containerPosition$: context.gridContainerPosition$,
      containerSize$: context.containerSize$,
      theme$: context.theme$
    })

    return () => {
      destroy$.next()
      unsubscribe()
    }
  }
})
