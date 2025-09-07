import type { DeepPartial, DefinePluginConfig, PluginEntity } from './types'
import { createPlugin } from './plugin/createPlugin'
export const definePlugin = <DefaultParams extends Record<string, any>>(config: DefinePluginConfig<DefaultParams>) => {
  return class Plugin implements PluginEntity<DefaultParams> {
    name: string
    show: (ids: string[]) => void
    hide: (ids: string[]) => void
    toggle: (ids: string[]) => void
    showOnly: (ids: string[]) => void
    setLayers: (partial: DeepPartial<DefaultParams>) => void
    updateLayers: (patch: DeepPartial<DefaultParams>) => void
    replaceLayers: (full: DefaultParams) => void
    layer: <LayerName extends keyof DefaultParams>(name: LayerName) => {
      set: (partial: Pick<DefaultParams, LayerName>) => void
      update: (patch: Pick<DefaultParams, LayerName>) => void
      replace: (partial: Pick<DefaultParams, LayerName>) => void
      show: () => void
      hide: () => void
      toggle: () => void
    }
    constructor () {
      return createPlugin(config)
    }
  }
}