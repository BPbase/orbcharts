import * as orbChartsCore from '@orbcharts/core'
import * as orbChartsPluginsBasic from '@orbcharts/plugins-basic/src/index'
import * as orbChartsPresetsBasic from '@orbcharts/presets-basic/src/index'

type KeyOfOrbChartsPluginsBasic = keyof typeof orbChartsPluginsBasic
type KeyOfOrbChartsPresetsBasic = keyof typeof orbChartsPresetsBasic

// -- demo清單的資料 --
export interface DemoChartTypeItem {
  title: string
  chartType: orbChartsCore.ChartType
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
export interface DemoData<T extends orbChartsCore.ChartType> {
  preset: orbChartsCore.PresetPartial<T, any>
  plugins: orbChartsCore.PluginEntity<T, string, any>[]
  data: orbChartsCore.DataTypeMap<T>
}