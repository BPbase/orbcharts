import type { ChartType, PresetPartial, PluginEntity, DataTypeMap } from '../lib/core-types'
import * as orbChartsPluginsBasic from '../lib/plugins-basic'
import * as orbChartsPresetsBasic from '../lib/presets-basic'

type KeyOfOrbChartsPluginsBasic = keyof typeof orbChartsPluginsBasic
type KeyOfOrbChartsPresetsBasic = keyof typeof orbChartsPresetsBasic

// -- demo清單的資料 --
export interface DemoChartTypeItem {
  title: string
  chartType: ChartType
  list: DemoMainPluginsItem[]
}

export interface DemoMainPluginsItem {
  // title: KeyOfOrbChartsPluginsBasic
  title: string
  description: string
  descriptionZh: string
  mainPluginNames: KeyOfOrbChartsPluginsBasic[]
  list: DemoItem[]
}

export interface DemoItem {
  // title: KeyOfOrbChartsPresetsBasic
  // path: string
  title: string
  // chartType: 'series' | 'grid' | 'multiGrid' | 'multiValue' | 'relationship' | 'tree'
  presetName: KeyOfOrbChartsPresetsBasic
  allPluginNames: KeyOfOrbChartsPluginsBasic[]
  getData: () => Promise<any>
}

// -- 建立demo用的資料 --
export interface DemoData<T extends ChartType> {
  preset: PresetPartial<T, any>
  plugins: PluginEntity<T, string, any>[]
  data: DataTypeMap<T>
}