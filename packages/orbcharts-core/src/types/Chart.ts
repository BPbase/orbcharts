import type { ChartParams, ChartParamsPartial } from './ChartParams'
import type { ContextSubject } from './ContextSubject'
import type { ContextObserverFn } from './ContextObserver'
import type { ComputedDataFn } from './ComputedData'
import type { DataFormatterTypeMap, DataFormatterPartialTypeMap } from './DataFormatter'

export type ChartType = 'series' | 'grid' | 'multiGrid' | 'multiValue' | 'tree' | 'relationship'

export interface CreateBaseChart {
  <T extends ChartType>({ defaultDataFormatter, computedDataFn, contextObserverFn }: {
    defaultDataFormatter: DataFormatterTypeMap<T>
    computedDataFn: ComputedDataFn<T>
    contextObserverFn: ContextObserverFn<T>
  }): CreateChart<T>
}


export interface CreateChart<T extends ChartType> {
  // (element: HTMLElement | Element, pluginParams: any[], chartParams?: Partial<ChartParams>): Chart<T>
  (element: HTMLElement | Element, options?: ChartOptionsPartial<T>): ChartEntity<T>
}

export interface ChartEntity<T extends ChartType> extends ContextSubject<T> {
  selection: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>
  destroy: () => void
}

export interface ChartOptions<T extends ChartType> {
  preset: Preset<T, unknown>
}

export interface ChartOptionsPartial<T extends ChartType> {
  preset?: Preset<T, unknown>
}

export interface Preset<T extends ChartType, AllPluginParams> {
  name: string
  description: string
  chartParams?: ChartParamsPartial
  dataFormatter?: DataFormatterPartialTypeMap<T>
  allPluginParams?: AllPluginParams
}

// export interface PresetPartial<T extends ChartType, AllPluginParams> {
//   chartParams?: ChartParamsPartial
//   dataFormatter?: DataFormatterPartialTypeMap<T>
//   allPluginParams?: AllPluginParams
//   description?: string
// }
