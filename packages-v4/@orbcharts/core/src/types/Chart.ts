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

// // 定義可擴展的 context 類型
// export interface ExtendableContextValue {
//   // 可以是 Observable, Subject, 或其他任何值
//   [key: string]: Observable<any> | Subject<any> | Function | any
// }

export interface ChartOptions {
  width: number | 'auto'
  height: number | 'auto'
  defaults: ChartDefaults
  // extendContext?: (context: Readonly<ChartContext>) => ExtendableContextValue
}

export interface CreateChart {
  (element: HTMLElement | Element, options?: DeepPartial<ChartOptions> | undefined): ChartEntity
}

export interface ChartEntity {
  svgSelection: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  canvasSelection: d3.Selection<HTMLCanvasElement, unknown, HTMLElement, any>

  // Commands
  setData(data: RawData): void // replace
  setDataEncoding(partial: Partial<DataEncoding>): void // deep-merge with default
  updateDataEncoding(patch: Partial<DataEncoding>): void // deep-merge with previous
  replaceDataEncoding(full: DataEncoding): void // replace
  setPlugins(plugins: PluginEntity[]): void // replace all
  addPlugin(plugin: PluginEntity): void
  removePlugin(id: string): void 
  setTheme(theme: Theme): void // replace all
  updateTheme(patch: Partial<Theme>): void // deep-merge with previous
  replaceTheme(full: Theme): void // replace all
  destroy(): void;

  // context
  context: ChartContext
}

