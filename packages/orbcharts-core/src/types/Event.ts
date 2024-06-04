import * as d3 from 'd3'
import type { ChartType } from './Chart'
import type { ComputedDatumBase } from './ComputedData'
import type { ComputedDataSeries, ComputedDatumSeries } from './ComputedDataSeries'
import type { ComputedDataGrid, ComputedDatumGrid } from './ComputedDataGrid'
import type { ComputedDataMultiGrid } from './ComputedDataMultiGrid'
import type { ComputedDataMultiValue, ComputedDatumMultiValue } from './ComputedDataMultiValue'
import type { ComputedNode } from './ComputedDataRelationship'
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
  : EventBase

export interface EventBase {
  eventName: EventName
  pluginName: string
  // data: EventData
  type: ChartType
  event: MouseEvent | undefined
  highlightTarget: HighlightTarget
  datum: ComputedDatumBase | null
  tween?: number
}

export interface EventSeries extends EventBase {
  type: 'series'
  data: ComputedDataSeries
  series: ComputedDatumSeries[]
  seriesIndex: number
  seriesLabel: string
  datum: ComputedDatumSeries | null
  // highlightTarget: 'series' | 'datum' | 'none'
  // highlightLabel: string | null
  // highlightId: string | null
}

export interface EventGrid extends EventBase {
  type: 'grid'
  data: ComputedDataGrid
  series: ComputedDatumGrid[]
  seriesIndex: number
  seriesLabel: string
  groups: ComputedDatumGrid[]
  groupIndex: number
  groupLabel: string
  datum: ComputedDatumGrid | null
  // highlightTarget: 'series' | 'group' | 'datum' | 'none'
  // highlightLabel: string | null
  // highlightId: string | null
}

export interface EventMultiGrid extends EventBase {
  type: 'multiGrid'
  data: ComputedDataMultiGrid
  gridIndex: number
  series: ComputedDatumGrid[]
  seriesIndex: number
  seriesLabel: string
  group: ComputedDatumGrid[]
  groupIndex: number
  groupLabel: string
  datum: ComputedDatumGrid | null
  // highlightTarget: 'series' | 'group' | 'datum' | 'none'
  // highlightLabel: string | null
  // highlightId: string | null
}

export interface EventMultiValue extends EventBase {
  type: 'multiValue'
  datum: ComputedDatumMultiValue | null
}

export interface EventRelationship extends EventBase {
  type: 'relationship'
  datum: ComputedNode | null
}

export interface EventTree extends EventBase {
  type: 'tree'
  datum: ComputedDataTree | null
}

