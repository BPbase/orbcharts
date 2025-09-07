import { Observable, Subject } from 'rxjs'
import type {
  DeepPartial,
  EventData,
  ChartContext,
} from './index'

// 定義可擴展的 context 類型 - 只包含新增的欄位
export interface ExtendableContextValue {
  // 只能添加新的欄位，不能修改現有的 ChartContext
  [key: string]: Observable<any> | Subject<any> | Function | any
}

export interface PluginInfo {
  name: string
  layers: string[]
}

export interface DefinePluginConfig<DefaultParams extends Record<string, any>> {
  name: string
  defaultParams: DefaultParams
  validator?: (params: DefaultParams) => { valid: boolean; errors?: string[] }
  extendContext?: (context: Readonly<ChartContext>) => ExtendableContextValue
}

// export interface PluginDefaults<LayersConfig = Record<string, any>> {
//   layers: LayersConfig | LayersConfig[]
// }

// export interface PluginOptions<LayersConfig = Record<string, any>> {
//   defaults: PluginDefaults<LayersConfig>
// }

export interface CreatePlugin<DefaultParams> {
  (config: DefinePluginConfig<DefaultParams>): PluginEntity<DefaultParams>
}

export interface PluginEntity<DefaultParams = Record<string, any>> {
  name: string
  
  // layer visibility controls (指令)
  show(ids: string[]): void
  hide(ids: string[]): void
  toggle(ids: string[]): void
  showOnly(ids: string[]): void

  // layer params (指令)
  setLayers(partial: DeepPartial<DefaultParams>): void // deep-merge with default
  updateLayers(patch: DeepPartial<DefaultParams>): void // deep-merge with previous
  replaceLayers(full: DefaultParams): void // replace（特殊需求，可節省效能）
  layer<LayerName extends keyof DefaultParams>(name: LayerName): {
    set(partial: Pick<DefaultParams, LayerName>): void // deep-merge with default 該 layer 的 params
    update(patch: Pick<DefaultParams, LayerName>): void // deep-merge with previous 該 layer 的 params
    replace(partial: Pick<DefaultParams, LayerName>): void // replace（特殊需求，可節省效能）
    show(): void; hide(): void; toggle(): void
  };

  // outputs (observables)
  // layers$: Observable<LayersConfig> // 各 layer 的有效參數（合併後）
  // visibleLayerNames$: Observable<string[]> // 目前可見的 layer 清單（原 show$）
  // event$: Observable<{ data: EventData; event: Event }> // 互動事件
}


