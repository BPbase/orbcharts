import {
  takeUntil,
  map,
  switchMap,
  iif,
  Subject } from 'rxjs'
import {
  defineGridPlugin } from '@orbcharts/core'
import { DEFAULT_VALUE_STACK_AXIS_PARAMS } from '../defaults'

import { createBaseValueAxis } from '../../base/BaseValueAxis'

const pluginName = 'ValueStackAxis'

export const ValueStackAxis = defineGridPlugin(pluginName, DEFAULT_VALUE_STACK_AXIS_PARAMS)(({ selection, name, observer, subject }) => {
  
  const destroy$ = new Subject()

  // 將原本的value全部替換成加總後的value
  const stackedData$ = observer.computedData$.pipe(
    takeUntil(destroy$),
    map(data => {
      // 將同一group的value加總起來
      const stackedValue = new Array(data[0] ? data[0].length : 0)
        .fill(null)
        .map((_, i) => {
          return data.reduce((prev, current) => {
            if (current && current[i]) {
              const currentValue = current[i].value == null || current[i].visible == false
                ? 0
                : current[i].value!
              return prev + currentValue
            }
            return prev
          }, 0)
        })
      // 將原本的value全部替換成加總後的value
      const computedData = data.map((series, seriesIndex) => {
        return series.map((d, i) => {
          return {
            ...d,
            value: stackedValue[i],
          }
        })
      })
      return computedData
    }),
  )

  const unsubscribeBaseValueAxis = createBaseValueAxis(pluginName, {
    selection,
    computedData$: observer.isSeriesPositionSeprate$.pipe(
      switchMap(isSeriesPositionSeprate => {
        return iif(() => isSeriesPositionSeprate, observer.computedData$, stackedData$)
      })
    ),
    fullParams$: observer.fullParams$,
    fullDataFormatter$: observer.fullDataFormatter$,
    fullChartParams$: observer.fullChartParams$,  
    gridAxesTransform$: observer.gridAxesTransform$,
    gridAxesReverseTransform$: observer.gridAxesReverseTransform$,
    gridAxesSize$: observer.gridAxesSize$,
    gridContainer$: observer.gridContainer$,
    isSeriesPositionSeprate$: observer.isSeriesPositionSeprate$,
  })

  return () => {
    destroy$.next(undefined)
    unsubscribeBaseValueAxis()
  }
})