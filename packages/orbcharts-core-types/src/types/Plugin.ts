import * as d3 from 'd3'
import { Subject } from 'rxjs'
import type { ChartType } from './Chart'
import type { ContextSubject } from './ContextSubject'
import type { ContextObserverTypeMap } from './ContextObserver'
import type { ValidatorResult } from './Validator'

// // 透過類型選擇Plugin
// export type PluginParamsMap<T extends ChartType, PluginParams> = T extends 'series' ? Plugin<DataSeries, DataFormatterSeries, ComputedDataSeries, PluginParams>
//   : T extends 'grid' ? Plugin<DataGrid, DataFormatterGrid, ComputedDataGrid, PluginParams>
//   : T extends 'multiGrid' ? Plugin<DataMultiGrid, DataFormatterMultiGrid, ComputedDataMultiGrid, PluginParams>
//   : T extends 'multiValue' ? Plugin<DataMultiValue, DataFormatterMultiValue, ComputedDataMultiValue, PluginParams>
//   : T extends 'relationship' ? Plugin<DataRelationship, DataFormatterRelationship, ComputedDataRelationship, PluginParams>
//   : T extends 'tree' ? Plugin<DataTree, DataFormatterTree, ComputedDataTree, PluginParams>
//   : Plugin<unknown, unknown, unknown, unknown>

export interface CreateBasePlugin {
  <T extends ChartType>(): DefinePlugin<T>
}

export interface DefinePlugin<T extends ChartType> {
  <PluginName, PluginParams>(config: DefinePluginConfig<PluginName, PluginParams>): DefinePluginInitFn<T, PluginName, PluginParams>
}

export interface DefinePluginConfig<PluginName, PluginParams> {
  name: PluginName
  defaultParams: PluginParams
  layerIndex: number
  validator: (params: Partial<PluginParams>) => ValidatorResult
}

export interface DefinePluginInitFn<T extends ChartType, PluginName, PluginParams> {
  (initFn: PluginInitFn<T, PluginName, PluginParams>): PluginConstructor<T, PluginName, PluginParams>
}

// export interface CreatePlugin<T extends ChartType, PluginName, PluginParams> {
//   (): PluginEntity<T, PluginName, PluginParams>
// }

export interface PluginConstructor<T extends ChartType, PluginName, PluginParams> {
  new (): PluginEntity<T, PluginName, PluginParams>
}

export interface PluginEntity<T extends ChartType, PluginName, PluginParams> {
  params$: Subject<Partial<PluginParams>>
  name: PluginName
  defaultParams: PluginParams
  layerIndex: number
  // presetParams: Partial<PluginParams>
  init: () => void
  destroy: () => void
  setPresetParams: (presetParams: Partial<PluginParams>) => void
  setContext: (pluginContext: PluginContext<T, PluginName, PluginParams>) => void
}

export interface PluginInitFn<T extends ChartType, PluginName, PluginParams> {
  (pluginContext: PluginContext<T, PluginName, PluginParams>): () => void
}

export interface PluginContext<T extends ChartType, PluginName, PluginParams> {
  selection: d3.Selection<any, unknown, any, unknown>
  rootSelection: d3.Selection<any, unknown, any, unknown>
  name: PluginName
  chartType: ChartType, // 這邊的ChartType是由 createChart 時依 chart類別決定的，所以不能使用 pluginContext 本身的類別 T
  // 原本的store
  // selection: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>
  subject: ContextSubject<T>
  observer: ContextObserverTypeMap<T, PluginParams>
}
