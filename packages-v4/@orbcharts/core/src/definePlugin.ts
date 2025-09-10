import type { DeepPartial, DefinePluginConfig, PluginEntity, ChartContext, ExtendableContext } from './types'
import { createPlugin } from './plugin/createPlugin'

export const definePlugin = <
  DefaultParams extends Record<string, any>,
  ExtendContext extends ExtendableContext
>(config: DefinePluginConfig<DefaultParams, ExtendContext>) => {
  return class Plugin implements PluginEntity<DefaultParams, ExtendContext> {
    name: string
    show: (names: (keyof DefaultParams)[]) => void
    hide: (names: (keyof DefaultParams)[]) => void
    toggle: (names: (keyof DefaultParams)[]) => void
    showOnly: (name: keyof DefaultParams) => void
    setLayers: (partial: DeepPartial<DefaultParams>) => void
    updateLayers: (patch: DeepPartial<DefaultParams>) => void
    replaceLayers: (full: DefaultParams) => void
    layer: <LayerName extends keyof DefaultParams>(name: LayerName) => {
      set: (partial: DeepPartial<DefaultParams[LayerName]>) => void
      update: (patch: DeepPartial<DefaultParams[LayerName]>) => void
      replace: (partial: DeepPartial<DefaultParams[LayerName]>) => void
      show: () => void
      hide: () => void
      toggle: () => void
    }
    init: (context: ChartContext<ExtendContext>) => void
    destroy: () => void
    constructor () {
      return createPlugin(config)
    }
  }
}