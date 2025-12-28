import type { DeepPartial, DefinePluginConfig, PluginEntity, ChartContext, ExtendableContext } from './types'
import { createPlugin } from './plugin/createPlugin'

export const definePlugin = <
  ExtendContext extends ExtendableContext,
  PluginParams extends Record<string, any>,
  AllLayerParams extends Record<string, any>
>(config: DefinePluginConfig<ExtendContext, PluginParams, AllLayerParams>) => {
  return class Plugin implements PluginEntity<PluginParams, AllLayerParams> {
    name: string
    show: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => void
    showOnly: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => void
    showAll: () => void
    hide: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => void
    hideAll: () => void
    toggle: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => void
    // setLayers: (partial: DeepPartial<PluginParams>) => void
    updateParams: (patch: DeepPartial<PluginParams | AllLayerParams>) => void
    forceReplaceParams: (full: PluginParams | AllLayerParams) => void
    getParams: () => Readonly<PluginParams | AllLayerParams>
    // layer: <LayerName extends keyof PluginParams>(name: LayerName) => {
    //   // set: (partial: DeepPartial<PluginParams[LayerName]>) => void
    //   update: (patch: DeepPartial<PluginParams[LayerName]>) => void
    //   replace: (full: PluginParams[LayerName]) => void
    //   show: () => void
    //   hide: () => void
    //   toggle: () => void
    // }
    injectContext: (context: ChartContext<{}>) => void
    destroy: () => void
    constructor (params: DeepPartial<PluginParams | AllLayerParams>) {
      return createPlugin(config, params)
    }
  }
}