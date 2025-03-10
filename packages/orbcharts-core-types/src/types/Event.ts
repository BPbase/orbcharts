import type { ChartType } from './Chart'
import type { ComputedDatumTypeMap } from './ComputedData'
import type { ComputedDataTypeMap } from './ComputedData'
// import type { ComputedDataSeries, ComputedDatumSeries } from './ComputedDataSeries'
// import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
// import type { ComputedDataMultiGrid } from './ComputedDataMultiGrid'
// import type { ComputedDataMultiValue, ComputedDatumMultiValue } from './ComputedDataMultiValue'
// import type { ComputedDataRelationship, ComputedNode } from './ComputedDataRelationship'
// import type { ComputedDataTree } from './ComputedDataTree'
import type { HighlightTarget } from './ChartParams'

export type EventName = 'click'
  | 'mouseover'
  | 'mousemove'
  | 'mouseout'
  | 'dragstart'
  | 'drag'
  | 'dragend'
  | 'resize'
  | 'transitionMove'
  | 'transitionEnd'
  // | 'enterDuration'

// export interface Event<EventData = unknown> {
//   eventName: EventName
//   data: EventData
// }

// export interface ShareEvent<EventData = unknown> extends Event<EventData> {
//   pluginName: string
// }

// export interface EventData {

// }

// 透過類型選擇Event
export type EventTypeMap<T extends ChartType> = T extends 'series' ? EventSeries
  : T extends 'grid' ? EventGrid
  : T extends 'multiGrid' ? EventMultiGrid
  : T extends 'multiValue' ? EventMultiValue
  : T extends 'relationship' ? EventRelationship
  : T extends 'tree' ? EventTree
  : EventBase<any>

export interface EventBase<T extends ChartType> {
  type: T
  eventName: EventName
  pluginName: string
  event: MouseEvent | undefined
  highlightTarget: HighlightTarget
  datum: ComputedDatumTypeMap<T> | null
  data: ComputedDataTypeMap<T>
  tween?: number
}

export interface EventBaseSeriesValue {
  // data: ComputedDataTypeMap<T>
  series: ComputedDatumTypeMap<'series'>[]
  seriesIndex: number
  seriesLabel: string
  // datum: ComputedDatumTypeMap<T> | null
}

export interface EventBaseGridValue<T extends 'grid' | 'multiGrid'> {
  // data: ComputedDataTypeMap<T>
  gridIndex: number
  series: ComputedDatumTypeMap<T>[]
  seriesIndex: number
  seriesLabel: string
  group: ComputedDatumTypeMap<T>[]
  groupIndex: number
  groupLabel: string
  // datum: ComputedDatumTypeMap<T> | null
}

export interface EventBaseCategoryValue<T extends 'multiValue' | 'relationship' | 'tree'> {
  // data: ComputedDataTypeMap<T>
  category: ComputedDatumTypeMap<T>[]
  categoryIndex: number
  categoryLabel: string
  // datum: ComputedDatumTypeMap<T> | null
}

export interface ValueDetail {
  value: number | null
  valueIndex: number
  valueLabel: string
}

export interface EventSeries extends EventBase<'series'>, EventBaseSeriesValue {

}

export interface EventGrid extends EventBase<'grid'>, EventBaseGridValue<'grid'> {

}

export interface EventMultiGrid extends EventBase<'multiGrid'>, EventBaseGridValue<'multiGrid'> {

}

export interface EventMultiValue extends EventBase<'multiValue'>, EventBaseCategoryValue<'multiValue'> {
  valueDetail: ValueDetail[]
}

export interface EventRelationship extends EventBase<'relationship'>, EventBaseCategoryValue<'relationship'> {

}

export interface EventTree extends EventBase<'tree'>, EventBaseCategoryValue<'tree'> {

}

