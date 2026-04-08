import * as d3 from 'd3'
import {
  Subject,
  Observable,
  combineLatest,
  debounceTime,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { GridPlotStackedValueAxisParams, GridPlotPluginParams } from '../types'
import { DEFAULT_STACKED_VALUE_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../../const/layerIndex'
import { defineSVGLayer } from '@orbcharts/core'
import { GridPlotExtendContext } from '../types'
import { validateObject } from '@orbcharts/core'
import { createBaseValueAxis } from '../../../baseLayers/BaseValueAxis'
import { getValueAxisPositionFromDirection, gridAxesReverseTransformObservable, gridAxesTransformObservable } from '../contextObservables'

const pluginName = 'GridPlot'
const layerName = 'StackedValueAxis'

export const StackedValueAxis = defineSVGLayer<GridPlotExtendContext, GridPlotPluginParams, GridPlotStackedValueAxisParams>({
  name: layerName,
  defaultParams: DEFAULT_STACKED_VALUE_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  initShow: false,
  validator: (params) => {
    const result = validateObject(params, {
      labelOffset: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      },
      labelColorType: {
        toBeOption: 'ColorType',
      },
      axisLineVisible: {
        toBeTypes: ['boolean']
      },
      axisLineColorType: {
        toBeOption: 'ColorType',
      },
      ticks: {
        toBeTypes: ['number', 'null']
      },
      tickFormat: {
        toBeTypes: ['string', 'Function']
      },
      tickLineVisible: {
        toBeTypes: ['boolean']
      },
      tickPadding: {
        toBeTypes: ['number']
      },
      tickFullLine: {
        toBeTypes: ['boolean']
      },
      tickFullLineDasharray: {
        toBeTypes: ['string']
      },
      tickColorType: {
        toBeOption: 'ColorType',
      },
      tickTextRotate: {
        toBeTypes: ['number']
      },
      tickTextColorType: {
        toBeOption: 'ColorType',
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

    const direction$ = pluginParams$.pipe(
      map(params => params.direction),
      distinctUntilChanged(),
      shareReplay(1)
    )

    const opposite$ = layerParams$.pipe(
      map(params => params.opposite),
      distinctUntilChanged(),
      shareReplay(1)
    )

    const valueAxisPosition$ = combineLatest({
      direction: direction$,
      opposite: opposite$
    }).pipe(
      debounceTime(0),
      map(({ direction, opposite }) => getValueAxisPositionFromDirection(direction, opposite)),
      distinctUntilChanged(),
      shareReplay(1)
    )

    const gridAxesTransform$ = gridAxesTransformObservable({
      direction$,
      opposite$,
      layout$: context.layout$
    })

    const gridAxesReverseTransform$ = gridAxesReverseTransformObservable({
      gridAxesTransform$
    })

    const unsubscribeBaseValueAxis = createBaseValueAxis({
      selection: d3.select(svgG),
      pluginName,
      layerName,
      computedData$: context.computedStackedData$, // 計算疊加value的資料
      filteredMinMaxValue$: context.filteredStackedMinMaxValue$,
      baseValueAxisParams$: layerParams$,
      categoryAxis$: pluginParams$.pipe(map(params => params.categoryAxis)),
      valueAxis$: pluginParams$.pipe(map(params => params.valueAxis)),
      theme$: context.theme$,
      gridAxesTransform$: gridAxesTransform$,
      gridAxesReverseTransform$: gridAxesReverseTransform$,
      gridAxesSize$: context.gridAxesSize$,
      gridContainerPosition$: context.gridContainerPosition$,
      isSeriesSeprate$: context.isSeriesSeprate$,
      categoryAxisPosition$: context.categoryAxisPosition$,
      valueAxisPosition$: valueAxisPosition$,
    })

    return () => {
      destroy$.next(undefined)
      unsubscribeBaseValueAxis()
    }
  }
})