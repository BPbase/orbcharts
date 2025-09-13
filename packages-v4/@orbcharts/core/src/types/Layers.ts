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

interface SetupProps<DefaultLayerParams, ExtendContext extends ExtendableContext> {
  context: ChartContext<ExtendContext>
  svg: SVGSVGElement
  canvas: HTMLCanvasElement
  params$: Observable<DefaultLayerParams>
}

export interface DefineLayerConfig<DefaultLayerParams extends Record<string, any>, ExtendContext extends ExtendableContext> {
  name: string
  defaultParams: DefaultLayerParams
  layerIndex: number
  validator?: (params: DefaultLayerParams) => { valid: boolean; errors?: string[] }
  setup: (setupProps: SetupProps<DefaultLayerParams, ExtendContext>) => () => void
}

export interface LayerEntity<LayerParams, ExtendContext extends ExtendableContext> {
  name: Readonly<string>
  defaultParams: Readonly<LayerParams>
  layerIndex: Readonly<number>
  enable(el: { svg: SVGSVGElement; canvas: HTMLCanvasElement }, context: ChartContext<ExtendContext>): void
  disable(): void
  // setParams(params: Partial<LayerParams>): void
  update(params: Partial<LayerParams>): void
  forceReplace(params: LayerParams): void
  // getParams(): LayerParams

  // injectContext(): void
  destroy(): void
}