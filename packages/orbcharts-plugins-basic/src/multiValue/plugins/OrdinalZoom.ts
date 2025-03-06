import {
  takeUntil,
  map,
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineMultiValuePlugin, createValueToAxisScale } from '../../../lib/core'
import { DEFAULT_X_ZOOM_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_ROOT } from '../../const'
import { createBaseXZoom } from '../../base/BaseXZoom'

const pluginName = 'OrdinalZoom'

const pluginConfig: DefinePluginConfig<typeof pluginName, typeof DEFAULT_X_ZOOM_PARAMS> = {
  name: pluginName,
  defaultParams: DEFAULT_X_ZOOM_PARAMS,
  layerIndex: LAYER_INDEX_OF_ROOT,
  validator: (params, { validateColumns }) => {
    return {
      status: 'success',
      columnName: '',
      expectToBe: ''
    }
  }
}

export const OrdinalZoom = defineMultiValuePlugin(pluginConfig)(({ selection, rootSelection, name, observer, subject }) => {

  const destroy$ = new Subject()

  const ordinalXYMinMax$ = observer.computedData$.pipe(
    takeUntil(destroy$),
    map(computedData => {
      return {
        minX: 0,//-0.5,
        maxX: computedData[0] && computedData[0][0]
          ? computedData[0][0].value.length - 1//0.5
          : 0,//0.5,
        minY: 0, // 沒用到
        maxY: 0 // 沒用到
      }
    })
  )

  const unsubscribeBaseOrdinalBubbles = createBaseXZoom(pluginName, {
      rootSelection,
      fullDataFormatter$: observer.fullDataFormatter$,
      xyMinMax$: ordinalXYMinMax$,
      layout$: observer.layout$,
      dataFormatter$: subject.dataFormatter$,
    })
  
  return () => {
    destroy$.next(undefined)
    unsubscribeBaseOrdinalBubbles()
  }
})
