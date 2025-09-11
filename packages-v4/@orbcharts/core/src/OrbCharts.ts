import type {
  DeepPartial,
  ChartEntity,
  ChartContext,
  ChartOptions,
  Encoding,
  PluginEntity,
  RawData,
  Theme
} from './types'
import { createChart } from './chart/createChart'

export class OrbCharts implements ChartEntity {
  setData: (data: RawData) => void
  // setEncoding: (partial: DeepPartial<Encoding>) => void
  updateEncoding: (patch: DeepPartial<Encoding>) => void
  replaceEncoding: (full: Encoding) => void
  setPlugins: (plugins: PluginEntity<unknown, unknown>[]) => void
  addPlugin: (plugin: PluginEntity<unknown, unknown>) => void
  removePlugin: (id: string) => void
  // setTheme: (theme: Theme) => void
  updateTheme: (patch: DeepPartial<Theme>) => void
  forceReplaceTheme: (full: Theme) => void
  destroy: () => void;
  context: ChartContext<unknown>

  constructor(element: HTMLElement | Element, options?: DeepPartial<ChartOptions>) {
    return createChart(element, options)
  }
}