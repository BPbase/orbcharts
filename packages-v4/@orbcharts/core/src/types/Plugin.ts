import { Observable } from 'rxjs'
import type {
  DeepPartial,
  EventData,
} from './index'

export interface PluginInfo {
  name: string
  layers: string[]
}

export interface PluginDefaults<LayersConfig = Record<string, any>> {
  layers: LayersConfig | LayersConfig[]
}

export interface PluginOptions<LayersConfig = Record<string, any>> {
  defaults: PluginDefaults<LayersConfig>
}

export interface CreatePlugin {
  (options?: DeepPartial<PluginOptions>): PluginEntity
}

export interface PluginEntity<LayersConfig = Record<string, any>> {
  id: string
  
  // layer visibility controls (指令)
  show(ids: string[]): void
  hide(ids: string[]): void
  toggle(ids: string[]): void
  showOnly(ids: string[]): void

  // layer params (指令)
  setLayers(partial: Partial<LayersConfig>): void // deep-merge with default
  updateLayers(patch: Partial<LayersConfig>): void // deep-merge with previous
  replaceLayers(full: LayersConfig): void // replace（特殊需求，可節省效能）
  layer(id: string): {
    set(partial: unknown): void // deep-merge with default 該 layer 的 params
    update(patch: unknown): void // deep-merge with previous 該 layer 的 params
    replace(partial: unknown): void // replace（特殊需求，可節省效能）
    show(): void; hide(): void; toggle(): void
  };

  // outputs (observables)
  layers$: Observable<LayersConfig> // 各 layer 的有效參數（合併後）
  visibleLayerNames$: Observable<string[]> // 目前可見的 layer 清單（原 show$）
  event$: Observable<{ data: EventData; event: Event }> // 互動事件
}


