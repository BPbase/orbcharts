import type { ChartParams, ChartParamsPartial } from './ChartParams'
import type { ContextSubject } from './ContextSubject'
import type { ContextObserverCallback } from './ContextObserver'
import type { DataValidator } from './Data'
import type { ComputedDataFn, ComputedDataTypeMap } from './ComputedData'
import type { DataFormatterTypeMap, DataFormatterPartialTypeMap, DataFormatterValidator } from './DataFormatter'
import type { Preset } from './Preset'

export type ChartType = 'series' | 'grid' | 'multiGrid' | 'multiValue' | 'tree' | 'relationship' | 'noneData'

export interface CreateBaseChart {
  <T extends ChartType>({
    defaultDataFormatter,
    dataFormatterValidator,
    computedDataFn,
    dataValidator,
    contextObserverCallback
  }: {
    defaultDataFormatter: DataFormatterTypeMap<T>
    dataFormatterValidator: DataFormatterValidator<T>
    computedDataFn: ComputedDataFn<T>
    dataValidator: DataValidator<T>
    contextObserverCallback: ContextObserverCallback<T>
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
  width: number | 'auto'
  height: number | 'auto'
}

export interface ChartOptionsPartial<T extends ChartType> {
  preset?: Preset<T, unknown>
  width?: number | 'auto'
  height?: number | 'auto'
}

