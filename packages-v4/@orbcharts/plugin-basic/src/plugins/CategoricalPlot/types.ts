import * as d3 from 'd3'
import { Observable, Subject } from 'rxjs'
import type { ColorType, EventData } from '@orbcharts/core'
import type {
  ContainerPositionScaled,
  GraphicStyles,
  Layout,
  VisibleFilter,
  ValueAxis,
  CategoryAxis
} from '../../types/PluginParams'
import type { ComputedDatumSeries } from '../../types/ComputedData'
import type { ContainerSize, TransformData } from '../../types/Common'

export type CategoricalPlotPosition = 'left' | 'right'

// ---- context ----

export interface CategoricalPlotExtendContext {
  layout$: Observable<Layout>
  computedData$: Observable<ComputedDatumSeries[][]>
  fontSizePx$: Observable<number>
  containerSize$: Observable<ContainerSize>
  gridHighlight$: Observable<ComputedDatumSeries[]>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  seriesLabels$: Observable<string[]>
  categoryLabels$: Observable<string[]>  // category names ordered by categoryIndex
  SeriesDataMap$: Observable<Map<string, ComputedDatumSeries[]>>
  visibleComputedData$: Observable<ComputedDatumSeries[][]>
  // ordinal (category axis) - maps categoryIndex to X screen position (horizontal)
  ordinalScale$: Observable<d3.ScaleLinear<number, number>>
  categoryScaleDomainValue$: Observable<[number, number]>
  // zoomedCategoryAxis$ always has position='bottom' (category axis is always at the bottom)
  zoomedCategoryAxis$: Observable<CategoryAxis>
  // axes sizing & transforms (for BaseCategoryAxis / BaseValueAxis)
  gridAxesSize$: Observable<ContainerSize>
  gridAxesContainerSize$: Observable<ContainerSize>
  gridAxesTransform$: Observable<TransformData>
  gridAxesReverseTransform$: Observable<TransformData>
  // value (X axis for horizontal chart)
  filteredMinMaxValue$: Observable<[number, number]>
  valueScale$: Observable<d3.ScaleLinear<number, number>>
}

// ---- category axis (no position field — position comes from CategoricalPlotPluginParams) ----

export interface CategoricalPlotCategoryAxis {
  scaleDomain: [number, number | 'max']
  scalePadding: number
  label: string
}

// ---- plugin params ----

export interface CategoricalPlotPluginParams {
  styles: GraphicStyles
  visibleFilter: VisibleFilter<'series'>
  position: CategoricalPlotPosition
  categoryAxis: CategoricalPlotCategoryAxis
  valueAxis: ValueAxis
  datasetIndex: number
}

// ---- all layer params ----

export interface CategoricalPlotAllLayerParams {
  RaisedBubble: CategoricalPlotRaisedBubblesParams
  CategoryAxis: CategoricalPlotCategoryAxisParams
  CategoryZoom: CategoricalPlotCategoryZoomParams
  ValueAxis: CategoricalPlotValueAxisParams
  CategoryGuide: CategoricalPlotCategoryGuideParams
}

// ---- layer params ----

export interface CategoricalPlotRaisedBubblesParams {
  sizeAdjust: number
  arcScaleType: 'area' | 'radius'
  valueLinearOpacity: [number, number]
  showZeroValue: boolean
}

export interface CategoricalPlotCategoryAxisParams {
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  ticks: number | null | 'all'
  tickFormat: string | ((text: any) => string | d3.NumberValue)
  tickLineVisible: boolean
  tickPadding: number
  tickFullLine: boolean
  tickFullLineDasharray: string
  tickColorType: ColorType
  tickTextRotate: number
  tickTextColorType: ColorType
}

export interface CategoricalPlotValueAxisParams {
  labelOffset: [number, number]
  labelColorType: ColorType
  axisLineVisible: boolean
  axisLineColorType: ColorType
  ticks: number | null
  tickFormat: string | ((text: d3.NumberValue) => string | d3.NumberValue)
  tickLineVisible: boolean
  tickPadding: number
  tickFullLine: boolean
  tickFullLineDasharray: string
  tickColorType: ColorType
  tickTextRotate: number
  tickTextColorType: ColorType
}

export interface CategoricalPlotCategoryZoomParams {
  // empty
}

export interface CategoricalPlotCategoryGuideParams {
  showLine: boolean
  showLabel: boolean
  lineDashArray: string
  lineColorType: ColorType
  labelColorType: ColorType
  labelTextColorType: ColorType
  labelTextFormat: string | ((text: any) => string)
  labelPadding: number
  labelRotate: number
}
