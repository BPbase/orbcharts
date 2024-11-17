import type { ChartType } from './Chart'
import type { ChartParams, ChartParamsPartial } from './ChartParams'
import type { DataFormatterTypeMap, DataFormatterPartialTypeMap } from './DataFormatter'

export interface Preset<T extends ChartType, AllPluginParams> {
  name: string
  description: string
  chartParams: ChartParams
  dataFormatter: DataFormatterTypeMap<T>
  allPluginParams: AllPluginParams
}

export interface PresetPartial<T extends ChartType, AllPluginParams> {
  name?: string
  description?: string
  chartParams?: ChartParamsPartial
  dataFormatter?: DataFormatterPartialTypeMap<T>
  allPluginParams?: AllPluginParams
}
