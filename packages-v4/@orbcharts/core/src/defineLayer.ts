import type { ChartContext, DefineLayerConfig, LayerEntity, ExtendableContext } from "./types"
import { createLayer } from "./layer/createLayer"

export const defineLayer = <DefaultParams, ExtendContext extends ExtendableContext>(config: DefineLayerConfig<DefaultParams, ExtendContext>) => {
  return class Layer implements LayerEntity<DefaultParams, ExtendContext> {
    name: string
    defaultParams: DefaultParams
    layerIndex: number
    enable: (el: { svg?: SVGSVGElement; canvas?: HTMLCanvasElement }, context: ChartContext<ExtendContext>) => void
    disable: () => void
    // setParams: (params: Partial<DefaultParams>) => void
    update: (params: Partial<DefaultParams>) => void
    forceReplace: (params: DefaultParams) => void
    // injectContext: (context: ChartContext<ExtendContext>) => void
    destroy: () => void
    constructor () {
      return createLayer<DefaultParams, ExtendContext>(config)
    }
  }
}