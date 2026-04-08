import type { ChartContext, DefineLayerConfig, LayerEntity, ExtendableContext, LayerEnableProps } from "./types"
import { createLayer } from "./layer/createLayer"

export const defineCanvasLayer = <
  ExtendContext extends ExtendableContext,
  PluginParams extends Record<string, any>,
  LayerParams extends Record<string, any>,
>(config: DefineLayerConfig<'canvas', ExtendContext, PluginParams, LayerParams>) => {
  return class Layer implements LayerEntity<ExtendContext, PluginParams, LayerParams> {
    _name: string
    _defaultParams: LayerParams
    _layerIndex: number
    _initShow: boolean
    _enable: (enableProps: LayerEnableProps<'canvas', ExtendContext, PluginParams, LayerParams>) => void
    _disable: () => void
    _updateParams: (params: Partial<LayerParams>) => void
    _forceReplaceParams: (params: LayerParams) => void
    _getParams: () => Readonly<LayerParams>
    _destroy: () => void
    constructor () {
      return createLayer<ExtendContext, PluginParams, LayerParams>('canvas', config)
    }
  }
}