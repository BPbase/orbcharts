import type { Observable } from 'rxjs'
import type { DeepPartial, ChartContext, ExtendableContext } from './index'

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

// export type LayerContext<ExtendContext, LayerParams extends Record<string, any> = Record<string, any>> = ChartContext<ExtendContext> & {
//   layerParams$: Observable<LayerParams>
// }

export interface LayerEnableProps<ExtendContext extends ExtendableContext, PluginParams, LayerParams> {
  context: ChartContext<ExtendContext>
  svgG: SVGGElement
  canvas: HTMLCanvasElement
  pluginParams$: Observable<PluginParams>
  initLayerParams: DeepPartial<LayerParams>
}

export interface LayerSetupProps<ExtendContext extends ExtendableContext, PluginParams, LayerParams> {
  context: ChartContext<ExtendContext>
  svgG: SVGGElement
  canvas: HTMLCanvasElement
  pluginParams$: Observable<PluginParams>
  layerParams$: Observable<LayerParams>
}

export interface DefineLayerConfig<ExtendContext extends ExtendableContext, PluginParams extends Record<string, any>, LayerParams extends Record<string, any>> {
  name: string
  defaultParams: LayerParams
  layerIndex: number
  validator?: (params: LayerParams) => { valid: boolean; errors?: string[] }
  setup: (setupProps: LayerSetupProps<ExtendContext, PluginParams, LayerParams>) => () => void
}

export interface LayerEntity<ExtendContext extends ExtendableContext, PluginParams, LayerParams> {
  name: Readonly<string>
  defaultParams: Readonly<LayerParams>
  layerIndex: Readonly<number>
  // enable(el: { svg: SVGSVGElement; canvas: HTMLCanvasElement }, context: ChartContext<ExtendContext>): void
  enable(enableProps: LayerEnableProps<ExtendContext, PluginParams, LayerParams>): void
  disable(): void
  // setParams(params: DeepPartial<LayerParams>): void
  updateParams(params: DeepPartial<LayerParams>): void
  // forceReplaceParams(params: LayerParams): void
  getParams: () => Readonly<LayerParams>

  // injectContext(): void
  destroy(): void
}