import type { ChartContext, DefineLayerConfig, LayerEntity, ExtendableContext } from "./types"
import { createLayer } from "./layer/createLayer"

export const defineLayer = <DefaultParams, ExtendContext extends ExtendableContext>(config: DefineLayerConfig<DefaultParams, ExtendContext>) => {
  return class Layer implements LayerEntity<DefaultParams, ExtendContext> {
    name: string
    defaultParams: DefaultParams
    init: (context: ChartContext<ExtendContext>) => void
    setParams: (params: Partial<DefaultParams>) => void
    updateParams: (params: Partial<DefaultParams>) => void
    replaceParams: (params: DefaultParams) => void
    destroy: () => void
    constructor () {
      return createLayer<DefaultParams, ExtendContext>(config)
    }
  }
}