import type { Observable, Subject } from 'rxjs'
import type {
  DeepPartial,
  ChartContext,
  Encoding,
  EventData,
  ModelData,
  PluginInfo,
  PluginEntity,
  RawData,
  Theme
} from './index'

export interface ChartDefaults {
  theme: Theme
  encoding: Partial<Encoding>
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
  // setEncoding(partial: Partial<Encoding>): void // deep-merge with default
  updateEncoding(patch: DeepPartial<Encoding>): void // deep-merge with previous
  replaceEncoding(full: Encoding): void // replace
  setPlugins(plugins: PluginEntity<unknown, unknown>[]): void // replace all
  addPlugin(plugin: PluginEntity<unknown, unknown>): void
  removePlugin(id: string): void 
  // setTheme(theme: Theme): void // replace all
  updateTheme(patch: DeepPartial<Theme>): void // deep-merge with previous
  forceReplaceTheme(full: Theme): void // replace all
  destroy(): void;

  // context
  context: ChartContext
}

