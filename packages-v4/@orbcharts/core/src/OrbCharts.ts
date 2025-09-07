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
    const chart = createChart(element, options)
    this.svgSelection = chart.svgSelection
    this.canvasSelection = chart.canvasSelection
    this.setData = chart.setData
    this.setDataEncoding = chart.setDataEncoding
    this.updateDataEncoding = chart.updateDataEncoding
    this.replaceDataEncoding = chart.replaceDataEncoding
    this.setPlugins = chart.setPlugins
    this.addPlugin = chart.addPlugin
    this.removePlugin = chart.removePlugin
    this.setTheme = chart.setTheme
    this.updateTheme = chart.updateTheme
    this.replaceTheme = chart.replaceTheme
    this.destroy = chart.destroy
    this.context = chart.context
  }
}