import type { Observable } from 'rxjs'
import type { DeepPartial, ChartContext, ExtendableContext, ValidatorResult } from './index'

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

export interface SVGLayerEnableProps<ExtendContext extends ExtendableContext, PluginParams, LayerParams> {
  context: ChartContext<ExtendContext>
  svgG: SVGGElement
  // canvas: HTMLCanvasElement
  pluginParams$: Observable<PluginParams>
  initLayerParams: DeepPartial<LayerParams>
}

export interface CanvasLayerEnableProps<ExtendContext extends ExtendableContext, PluginParams, LayerParams> {
  context: ChartContext<ExtendContext>
  // svgG: SVGGElement
  canvas: HTMLCanvasElement
  pluginParams$: Observable<PluginParams>
  initLayerParams: DeepPartial<LayerParams>
}

export type LayerEnableProps<ElementType extends 'svg' | 'canvas', ExtendContext extends ExtendableContext, PluginParams, LayerParams> =
  ElementType extends 'svg' ? SVGLayerEnableProps<ExtendContext, PluginParams, LayerParams> :
  ElementType extends 'canvas' ? CanvasLayerEnableProps<ExtendContext, PluginParams, LayerParams> :
  never

export interface SVGLayerSetupProps<ExtendContext extends ExtendableContext, PluginParams, LayerParams> {
  context: ChartContext<ExtendContext>
  svgG: SVGGElement
  // canvas: HTMLCanvasElement
  pluginParams$: Observable<PluginParams>
  layerParams$: Observable<LayerParams>
}

export interface CanvasLayerSetupProps<ExtendContext extends ExtendableContext, PluginParams, LayerParams> {
  context: ChartContext<ExtendContext>
  // svgG: SVGGElement
  canvas: HTMLCanvasElement
  pluginParams$: Observable<PluginParams>
  layerParams$: Observable<LayerParams>
}

export type LayerSetupProps<ElementType extends 'svg' | 'canvas', ExtendContext extends ExtendableContext, PluginParams, LayerParams> =
  ElementType extends 'svg' ? SVGLayerSetupProps<ExtendContext, PluginParams, LayerParams> :
  ElementType extends 'canvas' ? CanvasLayerSetupProps<ExtendContext, PluginParams, LayerParams> :
  never

export interface DefineLayerConfig<ElementType extends 'svg' | 'canvas', ExtendContext extends ExtendableContext, PluginParams extends Record<string, any>, LayerParams extends Record<string, any>> {
  name: string
  defaultParams: LayerParams
  layerIndex: number
  validator?: (params: DeepPartial<LayerParams>) => ValidatorResult
  setup: (setupProps: LayerSetupProps<ElementType, ExtendContext, PluginParams, LayerParams>) => () => void
}

export interface LayerEntity<ExtendContext extends ExtendableContext, PluginParams, LayerParams> {
  name: Readonly<string>
  defaultParams: Readonly<LayerParams>
  layerIndex: Readonly<number>
  // enable(el: { svg: SVGSVGElement; canvas: HTMLCanvasElement }, context: ChartContext<ExtendContext>): void
  enable(enableProps: LayerEnableProps<'svg' | 'canvas', ExtendContext, PluginParams, LayerParams>): void
  disable(): void
  // setParams(params: DeepPartial<LayerParams>): void
  updateParams(params: DeepPartial<LayerParams>): void
  forceReplaceParams(params: LayerParams): void
  getParams: () => Readonly<LayerParams>

  // injectContext(): void
  destroy(): void
}