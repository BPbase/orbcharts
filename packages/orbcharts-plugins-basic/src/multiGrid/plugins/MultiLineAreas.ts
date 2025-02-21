import * as d3 from 'd3'
import {
  map,
  takeUntil,
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineMultiGridPlugin } from '../../../lib/core'
import { DEFAULT_MULTI_LINE_AREAS_PARAMS } from '../defaults'
import { createBaseLineAreas } from '../../base/BaseLineAreas'
import { multiGridPluginDetailObservables } from '../multiGridObservables'
import { getClassName, getUniID } from '../../utils/orbchartsUtils'
import { LAYER_INDEX_OF_GRAPHIC_GROUND } from '../../const'

const pluginName = 'MultiLineAreas'

const gridClassName = getClassName(pluginName, 'grid')

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_MULTI_LINE_AREAS_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_MULTI_LINE_AREAS_PARAMS,
  layerIndex: LAYER_INDEX_OF_GRAPHIC_GROUND,
  validator: (params, { validateColumns }) => {
    const result = validateColumns(params, {
      gridIndexes: {
        toBe: 'number[] | "all"',
        test: (value: any) => {
          return value === 'all' || (Array.isArray(value) && value.every((v: any) => typeof v === 'number'))
        }
      },
      lineCurve: {
        toBeTypes: ['string']
      },
      linearGradientOpacity: {
        toBe: '[number, number]',
        test: (value: any) => {
          return Array.isArray(value)
            && value.length === 2
            && typeof value[0] === 'number'
            && typeof value[1] === 'number'
        }
      },
    })
    return result
  }
}

export const MultiLineAreas = defineMultiGridPlugin(pluginConfig)(({ selection, name, subject, observer }) => {
  const destroy$ = new Subject()
  
  const unsubscribeFnArr: (() => void)[] = []

  // 攤平所有grid的containerPosition
  const allContainerPosition$ = observer.multiGridContainerPosition$.pipe(
    takeUntil(destroy$),
    map(data => {
      return data.flat()
    })
  )

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

          unsubscribeFnArr[i] = createBaseLineAreas(pluginName, {
            selection: gridSelection,
            computedData$: d.computedData$,
            computedAxesData$: d.computedAxesData$,
            visibleComputedData$: d.visibleComputedData$,
            visibleComputedAxesData$: d.visibleComputedAxesData$,
            seriesLabels$: d.seriesLabels$,
            SeriesDataMap$: d.SeriesDataMap$,
            GroupDataMap$: d.GroupDataMap$,
            fullDataFormatter$: d.dataFormatter$,
            fullParams$: observer.fullParams$,
            fullChartParams$: observer.fullChartParams$,
            gridAxesTransform$: d.gridAxesTransform$,
            gridGraphicTransform$: d.gridGraphicTransform$,
            gridAxesSize$: d.gridAxesSize$,
            gridHighlight$: observer.multiGridHighlight$,
            gridContainerPosition$: d.gridContainerPosition$,
            allContainerPosition$: allContainerPosition$,
            layout$: observer.layout$,
            event$: subject.event$ as Subject<any>,
          })
        })
    })

  return () => {
    destroy$.next(undefined)
    unsubscribeFnArr.forEach(fn => fn())
  }
})
