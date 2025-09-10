import type { Observable } from 'rxjs'
import type { ChartContext, ExtendableContext } from './index'

// export type LayerParamsBase<LayerName extends string> = {
//   [K in LayerName]: unknown
// }


// export type LayerParams<LayerName extends string, Params = any> = Record<LayerName, Params>

// export interface LayerContext<ExtendContext extends ExtendableContext = {}> {
//   svgSelection: d3.Selection<SVGGElement, unknown, HTMLElement, any>
//   canvasSelection: d3.Selection<HTMLCanvasElement, unknown, HTMLElement, any>
//   name: string
//   context: ChartContext<ExtendContext>
// }

// export type LayerContext<ExtendContext, DefaultLayerParams extends Record<string, any> = Record<string, any>> = ChartContext<ExtendContext> & {
//   layerParams$: Observable<DefaultLayerParams>
// }

export interface DefineLayerConfig<DefaultLayerParams extends Record<string, any>, ExtendContext extends ExtendableContext> {
  name: string
  defaultParams: DefaultLayerParams
  layerIndex: number
  validator?: (params: DefaultLayerParams) => { valid: boolean; errors?: string[] }
  init: ({ context, params$ }: { context: ChartContext<ExtendContext>, params$: Observable<DefaultLayerParams> }) => () => void
}

export interface LayerEntity<LayerParams, ExtendContext extends ExtendableContext> {
  name: string
  defaultParams: LayerParams

  // constructor
  init(context: ChartContext<ExtendContext>): void
  setParams(params: Partial<LayerParams>): void
  updateParams(params: Partial<LayerParams>): void
  replaceParams(params: LayerParams): void
  // getParams(): LayerParams
  destroy(): void
}