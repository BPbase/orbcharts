import type { Observable, Subject } from 'rxjs'
import type {
  DeepPartial,
  ChartContext,
  DataEncoding,
  EventData,
  ModelData,
  PluginInfo,
  PluginEntity,
  RawData,
  Theme
} from './index'

export interface ChartDefaults {
  theme: Theme
  dataEncoding: Partial<DataEncoding>
}

export interface ChartOptions {
  width: number | 'auto'
  height: number | 'auto'
  defaults: ChartDefaults
}

export interface CreateChart {
  (element: HTMLElement | Element, options?: DeepPartial<ChartOptions>): ChartEntity
}

export interface ChartEntity {
  // Commands
  setData(data: RawData): void // replace
  setDataEncoding(partial: Partial<DataEncoding>): void // deep-merge with default
  updateDataEncoding(patch: Partial<DataEncoding>): void // deep-merge with previous
  replaceDataEncoding(full: DataEncoding): void // replace
  setPlugins(plugins: PluginEntity<unknown, unknown>[]): void // replace all
  addPlugin(plugin: PluginEntity<unknown, unknown>): void
  removePlugin(id: string): void 
  setTheme(theme: Theme): void // replace all
  updateTheme(patch: Partial<Theme>): void // deep-merge with previous
  replaceTheme(full: Theme): void // replace all
  destroy(): void;

  // context
  context: ChartContext
}

