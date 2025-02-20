import * as d3 from 'd3'
import {
  Subject,
  map,
  distinctUntilChanged,
  shareReplay,
  takeUntil
} from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineMultiGridPlugin } from '../../../lib/core'
import { DEFAULT_MULTI_BARS_TRIANGLE_PARAMS } from '../defaults'
import { createBaseBarsTriangle } from '../../base/BaseBarsTriangle'
import { multiGridPluginDetailObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
import { LAYER_INDEX_OF_GRAPHIC } from '../../const'

const pluginName = 'MultiBarsTriangle'

const gridClassName = getClassName(pluginName, 'grid')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_MULTI_BARS_TRIANGLE_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_MULTI_BARS_TRIANGLE_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      gridIndexes: {
        toBe: 'number[] | "all"',
        test: (value: any) => {
          return value === 'all' || (Array.isArray(value) && value.every((v: any) => typeof v === 'number'))
        }
      },
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
  }
}

export const MultiBarsTriangle = defineMultiGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()
  
  const unsubscribeFnArr: (() => void)[] = []

  const multiGridPluginDetail$ = multiGridPluginDetailObservables(observer)

  multiGridPluginDetail$
    .pipe(
      takeUntil(destroy$)
    )
    .subscribe(data => {
      // 每次重新計算時，清除之前的訂閱
      unsubscribeFnArr.forEach(fn => fn())

      selection.selectAll(`g.${gridClassName}`)
        .data(data)
        .join('g')
        .attr('class', gridClassName)
        .each((d, i, g) => {

          const gridSelection = d3.select(g[i])

          const isSeriesSeprate$ = d.dataFormatter$.pipe(
            takeUntil(destroy$),
            map(d => d.separateSeries),
            distinctUntilChanged(),
            shareReplay(1)
          )

          unsubscribeFnArr[i] = createBaseBarsTriangle(pluginName, {
            selection: gridSelection,
            computedData$: d.computedData$,
            visibleComputedData$: d.visibleComputedData$,
            computedAxesData$: d.computedAxesData$,
            visibleComputedAxesData$: d.visibleComputedAxesData$,
            seriesLabels$: d.seriesLabels$,
            SeriesDataMap$: d.SeriesDataMap$,
            GroupDataMap$: d.GroupDataMap$,
            fullParams$: observer.fullParams$,
            fullChartParams$: observer.fullChartParams$,
            fullDataFormatter$: d.dataFormatter$,
            gridAxesTransform$: d.gridAxesTransform$,
            gridGraphicTransform$: d.gridGraphicTransform$,
            gridAxesSize$: d.gridAxesSize$,
            gridHighlight$: observer.multiGridHighlight$,
            gridContainerPosition$: d.gridContainerPosition$,
            isSeriesSeprate$: isSeriesSeprate$,
            event$: subject.event$ as Subject<any>,
          })
        })
    })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
