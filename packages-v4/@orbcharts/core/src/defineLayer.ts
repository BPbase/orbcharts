import type { DefineLayerConfig, LayerContext, LayerEntity } from "./types"

export const defineLayer = <LayerContext, DefaultParams, LayerName extends string>(config: DefineLayerConfig<LayerContext, DefaultParams, LayerName>) => {
  return class Layer implements LayerEntity<LayerName, DefaultParams> {
    name: LayerName
    defaultParams: DefaultParams
    // layerIndex: number
    // validator?: (params: DefaultParams) => { valid: boolean; errors?: string[] }
    // init: (layerContext: LayerContext) => () => void
    constructor () {
      this.name = config.name
      // this.defaultParams = config.defaultParams
      // this.layerIndex = config.layerIndex
      // this.validator = config.validator
      // this.init = config.init
    }
  }
}