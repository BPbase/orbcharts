import type {
  DeepPartial,
  ChartEntity,
  ChartContext,
  ChartOptions,
  DataEncoding,
  PluginEntity,
  RawData,
  Theme
} from './types'
import { createChart } from './chart/createChart'

export class OrbCharts implements ChartEntity {
  svgSelection: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  canvasSelection: d3.Selection<HTMLCanvasElement, unknown, HTMLElement, any>
  setData: (data: RawData) => void
  setDataEncoding: (partial: Partial<DataEncoding>) => void
  updateDataEncoding: (patch: Partial<DataEncoding>) => void
  replaceDataEncoding: (full: DataEncoding) => void
  setPlugins: (plugins: PluginEntity[]) => void
  addPlugin: (plugin: PluginEntity) => void
  removePlugin: (id: string) => void
  setTheme: (theme: Theme) => void
  updateTheme: (patch: Partial<Theme>) => void
  replaceTheme: (full: Theme) => void
  destroy: () => void;
  context: ChartContext

  constructor(element: HTMLElement | Element, options?: DeepPartial<ChartOptions>) {
    return createChart(element, options)
  }
}