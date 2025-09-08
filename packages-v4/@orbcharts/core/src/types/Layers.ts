import type { ChartContext, ExtendableContext } from './index'

// export type LayerParamsBase<LayerName extends string> = {
//   [K in LayerName]: unknown
// }


// export type LayerParams<LayerName extends string, Params = any> = Record<LayerName, Params>

export interface LayerContext<ExtendContext extends ExtendableContext = {}> {
  svgSelection: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  canvasSelection: d3.Selection<HTMLCanvasElement, unknown, HTMLElement, any>
  name: string
  context: ChartContext<ExtendContext>
}

export interface DefineLayerConfig<LayerContext, DefaultLayerParams extends Record<string, any> = Record<string, any>, LayerName extends string = string> {
  name: LayerName
  defaultParams: DefaultLayerParams
  layerIndex: number
  validator?: (params: DefaultLayerParams) => { valid: boolean; errors?: string[] }
  init: (layerContext: LayerContext) => () => void
}

export interface LayerEntity<LayerName extends string, LayerParams> {
  name: LayerName
  defaultParams: LayerParams
}