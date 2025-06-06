import {
  Observable,
  Subject,
  combineLatest,
  takeUntil,
  of,
  map,
  distinctUntilChanged,
  switchMap,
  shareReplay
} from 'rxjs'
import type {
  DefinePluginConfig,
} from '../../../lib/core-types'
import {
  defineMultiValuePlugin,
} from '../../../lib/core'
import { DEFAULT_RACING_VALUE_AXIS_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_AXIS } from '../../const'
import { createBaseXAxis } from '../../base/BaseXAxis'

const pluginName = 'RacingValueAxis'


const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_RACING_VALUE_AXIS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_RACING_VALUE_AXIS_PARAMS,
  layerIndex: LAYER_INDEX_OF_AXIS,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
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
    if (result.status === 'error') {
      return result
    }
    return result
  }
}



export const RacingValueAxis = defineMultiValuePlugin(pluginConfig)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  // 過渡速度和圖形一致
  const transitionDuration$ = observer.fullChartParams$.pipe(
    takeUntil(destroy$),
    map(d => d.transitionDuration),
    distinctUntilChanged()
  )

  const unsubscribeBaseXAxis = createBaseXAxis(pluginName, {
    selection,
    position$: of('top'),
    transitionDuration$,
    computedData$: observer.computedData$,
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,
    isCategorySeprate$: observer.isCategorySeprate$,
    containerPosition$: observer.containerPosition$,
    // layout$: observer.layout$,
    containerSize$: observer.containerSize$,
    xScale$: observer.xScale$,
    // filteredXYMinMaxData$: observer.filteredXYMinMaxData$,
    // xyMinMax$: observer.xyMinMax$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseXAxis()
  }
})