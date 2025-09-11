import { Observable, Subject } from 'rxjs'
import type {
  DeepPartial,
  LayerEntity,
  ChartContext,
  ExtendableContext
} from './index'



export interface PluginInfo {
  name: string
  layers: string[]
}

export interface DefinePluginConfig<DefaultParams extends Record<string, any>, ExtendContext extends ExtendableContext> {
  name: string
  // defaultParams: DefaultParams
  // validator?: (params: DefaultParams) => { valid: boolean; errors?: string[] }
  layers: LayerEntity<Extract<keyof DefaultParams, string>, ExtendContext>[]
  extendContext?: (context: Readonly<ChartContext>) => ExtendContext
}

// export interface CreatePlugin<DefaultParams> {
//   (config: DefinePluginConfig<DefaultParams>): PluginEntity<DefaultParams>
// }


export interface PluginEntity<DefaultParams extends Record<string, any>, ExtendContext extends ExtendableContext> {
  name: string
  // layer visibility controls
  show(names: (keyof DefaultParams) | (keyof DefaultParams)[]): void
  showOnly(names: (keyof DefaultParams) | (keyof DefaultParams)[]): void
  // showAll(): void
  hide(names: (keyof DefaultParams) | (keyof DefaultParams)[]): void
  // hideAll(): void
  toggle(names: (keyof DefaultParams) | (keyof DefaultParams)[]): void
  // layer params
  // setLayers(partial: DeepPartial<DefaultParams>): void // deep-merge with default
  update(patch: DeepPartial<DefaultParams>): void // deep-merge with previous
  forceReplace(full: DefaultParams): void // replace（特殊需求，可節省效能）
  // layer<LayerName extends keyof DefaultParams>(name: LayerName): {
  //   // set(partial: DeepPartial<DefaultParams[LayerName]>): void // deep-merge with default 該 layer 的 params
  //   update(patch: DeepPartial<DefaultParams[LayerName]>): void // deep-merge with previous 該 layer 的 params
  //   replace(full: DefaultParams[LayerName]): void // replace（特殊需求，可節省效能）
  //   show(): void
  //   hide(): void
  //   toggle(): void
  // }

  injectContext(context: ChartContext<ExtendContext>): void
  destroy(): void

  // outputs (observables)
  // layers$: Observable<LayersConfig> // 各 layer 的有效參數（合併後）
  // visibleLayerNames$: Observable<string[]> // 目前可見的 layer 清單（原 show$）
  // event$: Observable<{ data: EventData; event: Event }> // 互動事件
}


