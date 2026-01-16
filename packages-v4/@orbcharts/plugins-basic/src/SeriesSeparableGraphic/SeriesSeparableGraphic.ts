import type { SeriesSeparableGraphicExtendContext, SeriesSeparableGraphicPluginParams, SeriesSeparableGraphicAllLayerParams } from './types'
import { definePlugin } from '../../../core/src'
import { DEFAULT_SERIES_SEPARABLE_GRAPHIC_PARAMS } from './defaults'

export const SeriesSeparableGraphic = definePlugin({
  name: 'SeriesSeparableGraphic',
  defaultParams: DEFAULT_SERIES_SEPARABLE_GRAPHIC_PARAMS,
  layers: [],
  setup: (props) => {
    
    return () => {

    }
  },
  validator: (params: SeriesSeparableGraphicPluginParams) => {
    return { valid: true }
  },
})