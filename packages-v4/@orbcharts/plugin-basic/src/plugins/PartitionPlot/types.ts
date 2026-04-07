
import { Observable } from 'rxjs'
import type { ColorType, ModelDatumSeries, EventData } from '@orbcharts/core'
import type { ContainerPosition, Container, GraphicStyles, Layout } from '../../types/PluginParams'
import { ComputedDatumSeries } from '../../types/ComputedData'
import type { ArcScaleType, Placement } from '../../types/Common'

// context
export interface PartitionPlotExtendContext {
  layout$: Observable<Layout>
  computedData$: Observable<ComputedDatumSeries[][]>
  fontSizePx$: Observable<number>
  datumLabels$: Observable<string[]>
  separateSeries$: Observable<boolean>
  separateName$: Observable<boolean>
  computedSortedData$: Observable<ComputedDatumSeries[][]>
  visibleComputedSortedData$: Observable<ComputedDatumSeries[][]>
  datumList$: Observable<ComputedDatumSeries[]>
  seriesHighlight$: Observable<ComputedDatumSeries[]>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  seriesContainerPosition$: Observable<ContainerPosition[]>
  DatumContainerPositionMap$: Observable<Map<string, ContainerPosition>>
}

// plugin params
export interface PartitionPlotPluginParams {
  styles: GraphicStyles
  visibleFilter: (datum: ModelDatumSeries) => boolean | null
  sort: ((a: ModelDatumSeries, b: ModelDatumSeries) => number) | null
  // seriesLabels: string[]
  container: Container
  separateSeries: boolean
  separateName: boolean
  // sumSeries: boolean
  datasetIndex: number
}

// all layer params
export interface PartitionPlotAllLayerParams {
  Bubble: PartitionPlotBubbleParams
  Pie: PartitionPlotPieParams
  PieEventText: PartitionPlotPieEventTextParams
  PieLabel: PartitionPlotPieLabelParams
  Rose: PartitionPlotRoseParams
  RoseLabel: PartitionPlotRoseLabelParams
  Indicator: PartitionPlotIndicatorParams
}

// -- layer params --
export interface PartitionPlotBubbleParams {
  force: {
    strength: number; // 泡泡引力
    velocityDecay: number; // 衰減數
    collisionSpacing: number // 泡泡間距
  }
  bubbleLabel: {
    labelFn: ((d: ComputedDatumSeries) => string)
    colorType: ColorType
    fillRate: number
    lineHeight: number
    maxLineLength: number
    wordBreakAll: boolean
  }
  // highlightRIncrease: number
  arcScaleType: ArcScaleType
}

export interface PartitionPlotPieParams {
  outerRadius: number;
  innerRadius: number;
  outerRadiusWhileHighlight: number;
  startAngle: number;
  endAngle: number;
  padAngle: number;
  strokeColorType: ColorType;
  strokeWidth: number;
  cornerRadius: number;
}

export interface PartitionPlotPieEventTextParams {
  renderFn: (d: EventData) => string[] | string | null
  textAttrs: Array<{ [key:string]: string | number }>
  textStyles: Array<{ [key:string]: string | number }>
}

export interface PartitionPlotPieLabelParams {
  // solidColor?: string;
  // colors?: string[];
  outerRadius: number
  outerRadiusWhileHighlight: number
  // innerRadius?: number;
  // enterDuration?: number
  startAngle: number
  endAngle: number
  labelCentroid: number
  // fontSize?: number
  labelFn: ((d: ComputedDatumSeries) => string)
  labelColorType: ColorType
}

export interface PartitionPlotRoseParams {
  outerRadius: number
  padAngle: number
  strokeColorType: ColorType
  strokeWidth: number
  cornerRadius: number
  arcScaleType: ArcScaleType
  angleIncreaseWhileHighlight: number
}

export interface PartitionPlotRoseLabelParams {
  outerRadius: number
  labelCentroid: number
  labelFn: ((d: ComputedDatumSeries) => string)
  labelColorType: ColorType
  arcScaleType: ArcScaleType
}

export interface PartitionPlotIndicatorParams {
  startAngle: number
  endAngle: number
  radius: number
  indicatorType: 'line' | 'needle' | 'pin' | 'triangle'
  size: number
  colorType: ColorType
  // autoHighlight: boolean
  value: number
}
