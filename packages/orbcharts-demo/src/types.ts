import type { ChartType, PresetPartial, PluginEntity, DataTypeMap } from '../lib/core-types'
import type { PluginList } from '../lib/plugins-basic-types'
import * as orbChartsPresetsBasic from '../lib/presets-basic'

// type KeyOfOrbChartsPluginsBasic = keyof typeof orbChartsPluginsBasic
type KeyOfOrbChartsPresetsBasic = keyof typeof orbChartsPresetsBasic

// -- demo清單的資料 --
export interface DemoChartTypeItem<T extends ChartType> {
  title: string
  chartType: ChartType
  list: DemoMainPluginsItem<T>[]
}

export interface DemoMainPluginsItem<T extends ChartType> {
  // title: KeyOfOrbChartsPluginsBasic
  title: string
  description: string
  descriptionZh: string
  mainPluginNames: PluginList<T>[]
  list: DemoItem<T>[]
}

export interface DemoItem<T extends ChartType> {
  // title: KeyOfOrbChartsPresetsBasic
  // path: string
  title: string
  // chartType: 'series' | 'grid' | 'multiGrid' | 'multiValue' | 'relationship' | 'tree'
  presetName: KeyOfOrbChartsPresetsBasic
  allPluginNames: PluginList<T>[]
  getData: () => Promise<any>
}

// -- 建立demo用的資料 --
export interface DemoData<T extends ChartType> {
  preset: PresetPartial<T, any>
  plugins: PluginEntity<T, string, any>[]
  data: DataTypeMap<T>
}