import {
  Subject } from 'rxjs'
import type { DefinePluginConfig } from '../../../lib/core-types'
import {
  defineMultiValuePlugin, createValueToAxisScale } from '../../../lib/core'
import { DEFAULT_X_ZOOM_PARAMS } from '../defaults'
import { LAYER_INDEX_OF_ROOT } from '../../const'
import { createBaseXZoom } from '../../base/BaseXZoom'

const pluginName = 'XZoom'

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

export const XZoom = defineMultiValuePlugin(pluginConfig)(({ selection, rootSelection, name, observer, subject }) => {

  const destroy$ = new Subject()

  const unsubscribeBaseOrdinalBubbles = createBaseXZoom(pluginName, {
    rootSelection,
    fullDataFormatter$: observer.fullDataFormatter$,
    xyMinMax$: observer.xyMinMax$,
    layout$: observer.layout$,
    dataFormatter$: subject.dataFormatter$,
  })
  
  return () => {
    destroy$.next(undefined)
    unsubscribeBaseOrdinalBubbles()
  }
})