import type {
  DeepPartial,
  ChartContext,
  Encoding,
  PluginEntity,
  RawData,
  Theme
} from './index'

export interface SizeConfig {
  width: number | 'auto'
  height: number | 'auto'
  resizeDebounce: number
}

// export interface ChartDefaults {
//   theme: Theme
//   encoding: Encoding
// }

export interface ChartOptions {
  size: SizeConfig
  // defaults: ChartDefaults
  theme: Theme
  data: RawData
  encoding: Encoding
  plugins: PluginEntity<any, any>[]
}

export interface PartialChartOptions {
  size?: Partial<SizeConfig>
  theme?: DeepPartial<Theme>
  data?: RawData
  encoding?: DeepPartial<Encoding>
  plugins?: PluginEntity<any, any>[]
}

export interface CreateChart {
  (element: HTMLElement | Element, options?: PartialChartOptions): ChartEntity
}

export interface ChartEntity {
  // Commands
  resize(sizeConfig: SizeConfig): void
  setData(data: RawData): void // replace
  // setEncoding(partial: Partial<Encoding>): void // deep-merge with default
  updateEncoding(patch: DeepPartial<Encoding>): void // deep-merge with previous
  forceReplaceEncoding(full: Encoding): void // replace
  getEncoding(): Readonly<Encoding>
  setPlugins(plugins: PluginEntity<any, any>[]): void // replace all
  addPlugin(plugin: PluginEntity<any, any>): void
  removePlugin(id: string): void
  // setTheme(theme: Theme): void // replace all
  updateTheme(patch: DeepPartial<Theme>): void // deep-merge with previous
  forceReplaceTheme(full: Theme): void // replace all
  getTheme(): Readonly<Theme>
  destroy(): void;

  // context
  context: ChartContext<{}>
}

