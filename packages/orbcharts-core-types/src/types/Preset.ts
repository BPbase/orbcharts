import type { ChartType } from './Chart'
import type { ChartParams, ChartParamsPartial } from './ChartParams'
import type { DataFormatterTypeMap, DataFormatterPartialTypeMap } from './DataFormatter'

export interface Preset<T extends ChartType, AllPluginParams> {
  name: string
  description: string
  descriptionZh: string
  chartParams: ChartParams
  dataFormatter: DataFormatterTypeMap<T>
  pluginParams: AllPluginParams
}

export interface PresetPartial<T extends ChartType, AllPluginParams> {
  name?: string
  description?: string
  descriptionZh?: string
  chartParams?: ChartParamsPartial
  dataFormatter?: DataFormatterPartialTypeMap<T>
  pluginParams?: AllPluginParams
}
