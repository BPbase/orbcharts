import type {
  ChartParamsPartial,
  DataFormatterPartialTypeMap,
  ChartType,
  Preset } from '../../orbcharts-core/src/index'
  // import * as core from '../../packages/orbcharts-core/src/index'
import * as chartParams from './chartParamsFiles'
import * as seriesDataFormatters from './seriesDataFormatterFiles'
import * as seriesPluginParams from './seriesPluginParamsFiles'
import * as gridDataFormatters from './gridDataFormatterFiles'
import * as gridPluginParams from './gridPluginParamsFiles'
import * as multiGridDataFormatters from './multiGridDataFormatterFiles'
import * as multiGridPluginParams from './multiGridPluginParamsFiles'
import * as multiValueDataFormatters from './multiValueDataFormatterFiles'
import * as multiValuePluginParams from './multiValuePluginParamsFiles'
import * as relationshipDataFormatters from './relationshipDataFormatterFiles'
import * as relationshipPluginParams from './relationshipPluginParamsFiles'
import * as treeDataFormatters from './treeDataFormatterFiles'
import * as treePluginParams from './treePluginParamsFiles'

type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>

export interface ChartParamsFile {
  id: string
  description: string
  data: ChartParamsPartial
}

export interface DataFormatterFile<T extends ChartType> {
  id: string
  chartType: T
  description: string
  data: DataFormatterPartialTypeMap<T>
}

export interface PluginParamsFile<PluginParams> {
  id: string
  chartType: ChartType
  pluginName: string
  description: string
  data: DeepPartial<PluginParams>
}

export interface PresetFile<T extends ChartType> {
  chartParamsId?: keyof typeof chartParams
  dataFormatterId?: T extends 'series' ? keyof typeof seriesDataFormatters
    : T extends 'grid' ? keyof typeof gridDataFormatters
    : T extends 'multiGrid' ? keyof typeof multiGridDataFormatters
    : T extends 'multiValue' ? keyof typeof multiValueDataFormatters
    : T extends 'relationship' ? keyof typeof relationshipDataFormatters
    : T extends 'tree' ? keyof typeof treeDataFormatters
    : undefined
  allPluginParamsIds?:  T extends 'series' ? (keyof typeof seriesPluginParams)[]
    : T extends 'grid' ? (keyof typeof gridPluginParams)[]
    : T extends 'multiGrid' ? (keyof typeof multiGridPluginParams)[]
    : T extends 'multiValue' ? (keyof typeof multiValuePluginParams)[]
    : T extends 'relationship' ? (keyof typeof relationshipPluginParams)[]
    : T extends 'tree' ? (keyof typeof treePluginParams)[]
    : undefined,
  description: string
}
