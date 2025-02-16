import {
  Observable,
  Subject,
  combineLatest,
  takeUntil,
  map,
  distinctUntilChanged,
  of,
  switchMap,
  shareReplay
} from 'rxjs'
import type {
  DefinePluginConfig,
} from '../../../lib/core-types'
import {
  defineMultiValuePlugin,
} from '../../../lib/core'
import { DEFAULT_X_Y_AXES_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../const'
import { createBaseXAxis } from '../../base/BaseXAxis'
import { createBaseYAxis } from '../../base/BaseYAxis'

const pluginName = 'XYAxes'


const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_X_Y_AXES_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_X_Y_AXES_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      xAxis: {
        toBeTypes: ['object']
      },
      yAxis: {
        toBeTypes: ['object']
      }
    })
    if (params.xAxis) {
      const forceResult = validateColumns(params.xAxis, {
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
        tickTextColorType: {
          toBeOption: 'ColorType',
        }
      })
      if (forceResult.status === 'error') {
        return forceResult
      }
    }
    if (params.yAxis) {
      const forceResult = validateColumns(params.yAxis, {
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
        tickTextColorType: {
          toBeOption: 'ColorType',
        }
      })
      if (forceResult.status === 'error') {
        return forceResult
      }
    }
    return result
  }
}



export const XYAxes = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  const xAxisFullParams$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(fullParams => fullParams.xAxis),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
  )

  const yAxisFullParams$ = observer.fullParams$.pipe(
    takeUntil(destroy$),
    map(fullParams => fullParams.xAxis),
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
  )

  const unsubscribeBaseXAxis = createBaseXAxis(pluginName, {
    selection,
    position$: of('bottom'),
    computedData$: observer.computedData$,
    fullParams$: xAxisFullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    isCategorySeprate$: observer.isCategorySeprate$,
    containerPosition$: observer.containerPosition$,
    layout$: observer.layout$,
    xScale$: observer.xScale$,
    // filteredXYMinMaxData$: observer.filteredXYMinMaxData$,
    // xyMinMax$: observer.xyMinMax$,
  })

  const unsubscribeBaseYAxis = createBaseYAxis(pluginName, {
    selection,
    computedData$: observer.computedData$,
    fullParams$: yAxisFullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    isCategorySeprate$: observer.isCategorySeprate$,
    containerPosition$: observer.containerPosition$,
    layout$: observer.layout$,
    yScale$: observer.yScale$,
    // filteredXYMinMaxData$: observer.filteredXYMinMaxData$,
    // xyMinMax$: observer.xyMinMax$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseXAxis()
    unsubscribeBaseYAxis()
  }
})