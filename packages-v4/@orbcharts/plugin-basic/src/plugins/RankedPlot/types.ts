import * as d3 from 'd3'
import { Observable, Subject } from 'rxjs'
import type { ColorType, Theme } from '@orbcharts/core'
import type {
  AxisPosition,
  ContainerPosition,
  ContainerPositionScaled,
  GraphicStyles,
  Layout,
  VisibleFilter,
  CategoryAxis
} from '../../types/PluginParams'
import type { ComputedDatumGrid } from '../../types/ComputedData'
import type { ContainerSize, TransformData } from '../../types/Common'

// ---- context ----

export interface RankedPlotExtendContext {
  layout$: Observable<Layout>
  computedData$: Observable<ComputedDatumGrid[][]>
  fontSizePx$: Observable<number>
  containerSize$: Observable<ContainerSize>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  CategoryDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  visibleComputedData$: Observable<ComputedDatumGrid[][]>
  // ordinal (category X axis)
  ordinalScale$: Observable<d3.ScaleLinear<number, number>>
  categoryScaleDomainValue$: Observable<[number, number]>
  zoomedCategoryAxis$: Observable<CategoryAxis>
  // axes transform (category always at bottom, ranking always at left)
  gridAxesSize$: Observable<ContainerSize>
  gridAxesTransform$: Observable<TransformData>
  gridAxesReverseTransform$: Observable<TransformData>
  // ranking
  rankedSeriesData$: Observable<ComputedDatumGrid[][]> // series sorted by sum desc
  computedRankedAmount$: Observable<number>
  rankedItemHeight$: Observable<number>
  rankedScaleList$: Observable<d3.ScalePoint<string>[]> // array of one scale
}

// ---- plugin params ----

export interface RankedAxis {
  label: string
  limit: number | 'auto'
}

export interface RankedPlotPluginParams {
  styles: GraphicStyles
  visibleFilter: VisibleFilter<'grid'>
  categoryAxis: {
    position: 'top' | 'bottom';
    scaleDomain: [number, number | 'max'];
    scalePadding: number;
    label: string;
  }
  rankedAxis: RankedAxis
  datasetIndex: number
}

// ---- all layer params ----

export interface RankedPlotAllLayerParams {
  RankedBubble: RankedPlotRankedBubbleParams
  RankAxis: RankedPlotRankAxisParams
  CategoryGuide: RankedPlotCategoryGuideParams
  CategoryAxis: RankedPlotCategoryAxisParams
  CategoryZoom: RankedPlotCategoryZoomParams
}

// ---- layer params ----

export interface RankedPlotRankedBubbleParams {
  sizeAdjust: number
  arcScaleType: 'area' | 'radius'
  valueLinearOpacity: [number, number]
  showZeroValue: boolean
}

export interface RankedPlotRankAxisParams {
  axisLabel: {
    offset: [number, number]
    colorType: ColorType
  }
  seriesLabel: {
    padding: number
    colorType: ColorType
  }
}

export interface RankedPlotCategoryGuideParams {
  showLine: boolean
  showLabel: boolean
  lineDashArray: string
  lineColorType: ColorType
  labelColorType: ColorType
  labelTextColorType: ColorType
  labelTextFormat: string | ((text: any) => string)
  labelPadding: number
}

export interface RankedPlotCategoryAxisParams {
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

export interface RankedPlotCategoryZoomParams {
  // empty
}
