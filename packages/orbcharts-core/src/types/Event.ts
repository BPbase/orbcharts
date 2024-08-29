import * as d3 from 'd3'
import type { ChartType } from './Chart'
import type { ComputedDatumBase } from './ComputedData'
import type { ComputedDataSeries, ComputedDatumSeries } from './ComputedDataSeries'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { ComputedDataMultiGrid } from './ComputedDataMultiGrid'
import type { ComputedDataMultiValue, ComputedDatumMultiValue } from './ComputedDataMultiValue'
import type { ComputedDataRelationship, ComputedNode } from './ComputedDataRelationship'
import type { ComputedDataTree } from './ComputedDataTree'
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
  // datum: ComputedDatumBase | null
  tween?: number
}

export interface EventBaseSeriesValue<DatumType, DataType> {
  data: DataType
  series: DatumType[]
  seriesIndex: number
  seriesLabel: string
  datum: DatumType | null
}

export interface EventBaseGridValue<DatumType, DataType> {
  data: DataType
  gridIndex: number
  series: DatumType[]
  seriesIndex: number
  seriesLabel: string
  groups: DatumType[]
  groupIndex: number
  groupLabel: string
  datum: DatumType | null
}

export interface EventBaseCategoryValue<DatumType, DataType> {
  data: DataType
  category: DatumType[]
  categoryIndex: number
  categoryLabel: string
  datum: DatumType | null
}

export interface EventSeries extends EventBase<'series'>, EventBaseSeriesValue<ComputedDatumSeries, ComputedDataSeries> {
  // type: 'series'
  // data: ComputedDataSeries
  // series: ComputedDatumSeries[]
  // seriesIndex: number
  // seriesLabel: string
  // datum: ComputedDatumSeries | null
  // // highlightTarget: 'series' | 'datum' | 'none'
  // // highlightLabel: string | null
  // // highlightId: string | null
}

export interface EventGrid extends EventBase<'grid'>, EventBaseGridValue<ComputedDatumGrid, ComputedDataGrid> {
  // type: 'grid'
  // data: ComputedDataGrid
  // series: ComputedDatumGrid[]
  // seriesIndex: number
  // seriesLabel: string
  // groups: ComputedDatumGrid[]
  // groupIndex: number
  // groupLabel: string
  // datum: ComputedDatumGrid | null
  // // highlightTarget: 'series' | 'group' | 'datum' | 'none'
  // // highlightLabel: string | null
  // // highlightId: string | null
}

export interface EventMultiGrid extends EventBase<'multiGrid'>, EventBaseGridValue<ComputedDatumGrid, ComputedDataMultiGrid> {
  // type: 'multiGrid'
  // data: ComputedDataMultiGrid
  // gridIndex: number
  // series: ComputedDatumGrid[]
  // seriesIndex: number
  // seriesLabel: string
  // group: ComputedDatumGrid[]
  // groupIndex: number
  // groupLabel: string
  // datum: ComputedDatumGrid | null
  // // highlightTarget: 'series' | 'group' | 'datum' | 'none'
  // // highlightLabel: string | null
  // // highlightId: string | null
}

export interface EventMultiValue extends EventBase<'multiValue'>, EventBaseCategoryValue<ComputedDatumMultiValue, ComputedDataMultiValue> {
  // type: 'multiValue'
  // data: ComputedDataMultiValue
  // category: ComputedDatumMultiValue[]
  // categoryIndex: number
  // categoryLabel: string
  // datum: ComputedDatumMultiValue | null
}

export interface EventRelationship extends EventBase<'relationship'>, EventBaseCategoryValue<ComputedNode, ComputedDataRelationship> {
  // type: 'relationship'
  // data: ComputedDataRelationship
  // category: ComputedNode[]
  // categoryIndex: number
  // categoryLabel: string
  // datum: ComputedNode | null
}

export interface EventTree extends EventBase<'tree'>, EventBaseCategoryValue<ComputedDataTree, ComputedDataTree> {
  // type: 'tree'
  // data: ComputedDataTree
  // category: ComputedDataTree[]
  // categoryIndex: number
  // categoryLabel: string
  // datum: ComputedDataTree | null
}

