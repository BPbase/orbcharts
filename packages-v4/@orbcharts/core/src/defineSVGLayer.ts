import type { ChartContext, DefineLayerConfig, LayerEntity, ExtendableContext, LayerEnableProps } from "./types"
import { createLayer } from "./layer/createLayer"

export const defineSVGLayer = <
  ExtendContext extends ExtendableContext,
  PluginParams extends Record<string, any>,
  LayerParams extends Record<string, any>,
>(config: DefineLayerConfig<'svg', ExtendContext, PluginParams, LayerParams>) => {
  return class Layer implements LayerEntity<ExtendContext, PluginParams, LayerParams> {
    name: string
    defaultParams: LayerParams
    layerIndex: number
    enable: (enableProps: LayerEnableProps<'svg', ExtendContext, PluginParams, LayerParams>) => void
    disable: () => void
    // setParams: (params: Partial<LayerParams>) => void
    updateParams: (params: Partial<LayerParams>) => void
    forceReplaceParams: (params: LayerParams) => void
    getParams: () => Readonly<LayerParams>
    // injectContext: (context: ChartContext<ExtendContext>) => void
    destroy: () => void
    constructor () {
      return createLayer<ExtendContext, PluginParams, LayerParams>('svg', config)
    }
  }
}