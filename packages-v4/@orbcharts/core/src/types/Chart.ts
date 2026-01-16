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

export interface ChartResize {
  width: number | 'auto'
  height: number | 'auto'
}

// export interface ChartDefaults {
//   theme: Theme
//   encoding: Encoding
// }

export interface ChartOptions {
  size: ChartResize
  // defaults: ChartDefaults
  theme: Theme
  data: RawData
  encoding: Encoding
  plugins: PluginEntity<unknown, unknown>[]
}

export interface PartialChartOptions {
  size?: Partial<ChartResize>
  theme?: DeepPartial<Theme>
  data?: RawData
  encoding?: DeepPartial<Encoding>
  plugins?: PluginEntity<unknown, unknown>[]
}

export interface CreateChart {
  (element: HTMLElement | Element, options?: PartialChartOptions): ChartEntity
}

export interface ChartEntity {
  // Commands
  resize({ width, height }: ChartResize): void
  setData(data: RawData): void // replace
  // setEncoding(partial: Partial<Encoding>): void // deep-merge with default
  updateEncoding(patch: DeepPartial<Encoding>): void // deep-merge with previous
  forceReplaceEncoding(full: Encoding): void // replace
  getEncoding(): Readonly<Encoding>
  setPlugins(plugins: PluginEntity<unknown, unknown>[]): void // replace all
  addPlugin(plugin: PluginEntity<unknown, unknown>): void
  removePlugin(id: string): void
  // setTheme(theme: Theme): void // replace all
  updateTheme(patch: DeepPartial<Theme>): void // deep-merge with previous
  forceReplaceTheme(full: Theme): void // replace all
  getTheme(): Readonly<Theme>
  destroy(): void;

  // context
  context: ChartContext<{}>
}

