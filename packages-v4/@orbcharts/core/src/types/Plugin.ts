import { Observable, Subject } from 'rxjs'
import type {
  DeepPartial,
  LayerEntity,
  ChartContext,
  ExtendableContext
} from './index'
import { ValidatorResult } from '../types/Validator'


export interface PluginInfo {
  name: string
  elementType: 'svg' | 'canvas'
  shownLayers: string[]
}

// export interface PluginSetupProps<ExtendContext extends ExtendableContext, PluginParams extends Record<string, any>> {
//   context: ChartContext<ExtendContext>
//   svg: SVGElement
//   canvas: HTMLCanvasElement
//   pluginParams$: Observable<PluginParams>
// }

// export interface SVGPluginSetupProps<ExtendContext extends ExtendableContext, PluginParams extends Record<string, any>> {
//   context: ChartContext<ExtendContext>
//   svgG: SVGGElement
//   pluginParams$: Observable<PluginParams>
// }

// export interface CanvasPluginSetupProps<ExtendContext extends ExtendableContext, PluginParams extends Record<string, any>> {
//   context: ChartContext<ExtendContext>
//   canvas: HTMLCanvasElement
//   pluginParams$: Observable<PluginParams>
// }

// export type PluginSetupProps<ElementType extends 'svg' | 'canvas', ExtendContext extends ExtendableContext, PluginParams extends Record<string, any>> =
//   ElementType extends 'svg' ? SVGPluginSetupProps<ExtendContext, PluginParams> :
//   ElementType extends 'canvas' ? CanvasPluginSetupProps<ExtendContext, PluginParams> :
//   never

export interface PluginSetupProps<ExtendContext extends ExtendableContext, PluginParams extends Record<string, any>> {
  context: ChartContext<ExtendContext>
  pluginParams$: Observable<PluginParams>
}

export interface DefinePluginConfig<ExtendContext extends ExtendableContext, PluginParams extends Record<string, any>, AllLayerParams extends Record<string, any>>{
  name: string
  defaultParams?: PluginParams
  validator?: (params: DeepPartial<AllLayerParams | PluginParams>) => ValidatorResult
    // { valid: boolean; errors?: string[] }
  layers?: LayerEntity<ExtendContext, PluginParams, AllLayerParams[keyof AllLayerParams]>[]
  // extendContext?: (context: Readonly<ChartContext>) => ExtendContext
  setup?: (props: PluginSetupProps<ExtendContext, PluginParams>) => () => void
}

// export interface CreatePlugin<PluginParams> {
//   (config: DefinePluginConfig<PluginParams>): PluginEntity<PluginParams>
// }


export interface PluginEntity<ElementType extends 'svg' | 'canvas', PluginParams extends Record<string, any>, AllLayerParams extends Record<string, any>> {
  id: string
  name: string
  elementType: ElementType
  // layer visibility controls
  show(names: (keyof AllLayerParams) | (keyof AllLayerParams)[]): void
  showOnly(names: (keyof AllLayerParams) | (keyof AllLayerParams)[]): void
  showAll(): void
  hide(names: (keyof AllLayerParams) | (keyof AllLayerParams)[]): void
  hideAll(): void
  toggle(names: (keyof AllLayerParams) | (keyof AllLayerParams)[]): void
  getShownLayerNames(): (keyof AllLayerParams)[]
  // layer params
  // setLayers(partial: DeepPartial<PluginParams>): void // deep-merge with default
  updateParams(patch: DeepPartial<PluginParams | AllLayerParams>): void // deep-merge with previous
  forceReplaceParams(full: PluginParams | AllLayerParams): void // replace（特殊需求，可節省效能）
  getParams(): Readonly<PluginParams | AllLayerParams>
  // layer<LayerName extends keyof PluginParams>(name: LayerName): {
  //   // set(partial: DeepPartial<PluginParams[LayerName]>): void // deep-merge with default 該 layer 的 params
  //   update(patch: DeepPartial<PluginParams[LayerName]>): void // deep-merge with previous 該 layer 的 params
  //   replace(full: PluginParams[LayerName]): void // replace（特殊需求，可節省效能）
  //   show(): void
  //   hide(): void
  //   toggle(): void
  // }

  injectContext(context: ChartContext<{}>): void
  destroy(): void

  // outputs (observables)
  // layers$: Observable<LayersConfig> // 各 layer 的有效參數（合併後）
  // visibleLayerNames$: Observable<string[]> // 目前可見的 layer 清單（原 show$）
  // event$: Observable<{ data: EventData; event: Event }> // 互動事件
}


