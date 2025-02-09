import { Observable, Subject, BehaviorSubject } from 'rxjs'
import type { ChartType } from './Chart'
import type { ChartParams } from './ChartParams'
import type { DataFormatterTypeMap } from './DataFormatter'
import type { ComputedDataTypeMap } from './ComputedData'
import type { Layout } from './Layout'
import type { ContextObserverGrid } from './ContextObserverGrid'
import type { ContextObserverMultiGrid } from './ContextObserverMultiGrid'
import type { ContextObserverMultiValue } from './ContextObserverMultiValue'
import type { ContextObserverRelationship } from './ContextObserverRelationship'
import type { ContextObserverSeries } from './ContextObserverSeries'
import type { ContextObserverTree } from './ContextObserverTree'
import type { ContextSubject } from './ContextSubject'

export interface ContextObserverCallback<T extends ChartType> {
  ({ subject, observer }: {
    subject: ContextSubject<T>
    observer: ContextObserverBase<T, unknown>
  }): ContextObserverTypeMap<T, unknown>
}

// ContextObserver
export type ContextObserverTypeMap<T extends ChartType, PluginParams> = T extends 'series' ? ContextObserverSeries<PluginParams>
  : T extends 'grid' ? ContextObserverGrid<PluginParams>
  : T extends 'multiGrid' ? ContextObserverMultiGrid<PluginParams>
  : T extends 'multiValue' ? ContextObserverMultiValue<PluginParams>
  : T extends 'relationship' ? ContextObserverRelationship<PluginParams>
  : T extends 'tree' ? ContextObserverTree<PluginParams>
  : ContextObserverBase<ChartType, PluginParams>

export interface ContextObserverBase<T extends ChartType, PluginParams> {
  fullParams$: Observable<PluginParams>
  fullChartParams$: Observable<ChartParams>
  fullDataFormatter$: Observable<DataFormatterTypeMap<T>>
  computedData$: Observable<ComputedDataTypeMap<T>>
  layout$: Observable<Layout>
}


export interface ContainerPosition {
  slotIndex: number
  rowIndex: number
  columnIndex: number
  // translate: [number, number]
  startX: number
  startY: number
  centerX: number
  centerY: number
  width: number
  height: number
}

// container - 有縮放的
export interface ContainerPositionScaled {
  slotIndex: number
  rowIndex: number
  columnIndex: number
  translate: [number, number]
  scale: [number, number]
}

export interface ContainerSize {
  width: number
  height: number
}