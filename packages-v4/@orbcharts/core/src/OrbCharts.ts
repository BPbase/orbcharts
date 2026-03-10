import type {
  DeepPartial,
  Size,
  ChartEntity,
  ChartContext,
  PartialChartOptions,
  Encoding,
  PluginEntity,
  RawData,
  Theme,
  SizeConfig
} from './types'
import { createChart } from './chart/createChart'

export class OrbCharts implements ChartEntity {
  resize: (sizeConfig: SizeConfig) => void
  setData: (data: RawData) => void
  // setEncoding: (partial: DeepPartial<Encoding>) => void
  updateEncoding: (patch: DeepPartial<Encoding>) => void
  forceReplaceEncoding: (full: Encoding) => void
  getEncoding: () => Readonly<Encoding>
  setPlugins: (plugins: PluginEntity<unknown, unknown>[]) => void
  addPlugin: (plugin: PluginEntity<unknown, unknown>) => void
  removePlugin: (id: string) => void
  // setTheme: (theme: Theme) => void
  updateTheme: (patch: DeepPartial<Theme>) => void
  forceReplaceTheme: (full: Theme) => void
  getTheme: () => Readonly<Theme>
  destroy: () => void;
  context: ChartContext<unknown>

  constructor(element: HTMLElement | Element, options?: PartialChartOptions) {
    return createChart(element, options)
  }
}