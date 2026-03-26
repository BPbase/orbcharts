
import { Observable, Subject } from 'rxjs'
import type { ColorType, ModelDatumSeries, EventData } from '../../../../core/src/types'
import type { AxisPosition, ContainerPosition, ContainerPositionScaled, Container, GraphicStyles, Layout, VisibleFilter, XYAxis, CategoryAxis } from '../../types/PluginParams'
import { ComputedDatumMultivariate  } from '../../types/ComputedData'
import type { ArcScaleType, ContainerSize, Placement, TransformData } from '../../types/Common'

// context
export interface ComputedXYDatumMultivariate extends ComputedDatumMultivariate {
  axisX: number
  axisY: number
}
export type ComputedXYDataMultivariate = ComputedXYDatumMultivariate[][]

export interface ScatterPlotExtendContext {
  layout$: Observable<Layout>
  computedData$: Observable<ComputedDatumMultivariate[][]>
  fontSizePx$: Observable<number>
  isSeriesSeprate$: Observable<boolean>
  containerPosition$: Observable<ContainerPositionScaled[]>
  containerSize$: Observable<ContainerSize>
  highlight$: Observable<ComputedDatumMultivariate[]>
  
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumMultivariate[]>>
  valueLabels$: Observable<string[]>
  xyMinMax$: Observable<{ // xy
    minX: number
    maxX: number
    minY: number
    maxY: number
  }>
  xyValueIndex$: Observable<[number, number]> // xy
  filteredXYMinMaxData$: Observable<{ // xy
    datumList: ComputedXYDatumMultivariate[]
    minXDatum: ComputedXYDatumMultivariate | null
    maxXDatum: ComputedXYDatumMultivariate | null
    minYDatum: ComputedXYDatumMultivariate | null
    maxYDatum: ComputedXYDatumMultivariate | null
  }>
  visibleComputedData$: Observable<ComputedDatumMultivariate[][]>
  visibleComputedRankingByIndexData$: Observable<ComputedDatumMultivariate[][]> // ranking
  visibleComputedXYData$: Observable<ComputedXYDataMultivariate> // xy
  graphicTransform$: Observable<TransformData>
  graphicReverseScale$: Observable<[number, number][]>
  xScale$: Observable<d3.ScaleLinear<number, number>>
  // xSumScale$: Observable<d3.ScaleLinear<number, number>>
  yScale$: Observable<d3.ScaleLinear<number, number>>
  
  zoomedXAxis$: Observable<XYAxis>
  yAxis$: Observable<XYAxis>
  
}

// plugin params
export interface ScatterPlotPluginParams {
  styles: GraphicStyles
  visibleFilter: VisibleFilter<'grid'>
  container: Container
  xAxis: XYAxis
  yAxis: XYAxis
  separateSeries: boolean
  datasetIndex: number
}

// all layer params
export interface ScatterPlotAllLayerParams {
  Scatter: ScatterParams
  ScatterBubbles: ScatterBubblesParams
  XYAux: XYAuxParams
  XYAxes: XYAxesParams
  XZoom: XZoomParams
}

// -- layer params --
export interface OrdinalBubblesParams {
  bubble: {
    // radiusMin: number // 對應value最小值
    // radiusMax: number // 對應value最大值
    sizeAdjust: number
    arcScaleType: 'area' | 'radius',
    valueLinearOpacity: [number, number]
  }
  itemLabel: {
    padding: number
    // rotate: number
    colorType: ColorType
  }
  axisLabel: {
    offset: [number, number]
    colorType: ColorType
  }
  rankingAmount: 'auto' | number
}

export interface ScatterParams {
  radius: number
  fillColorType: ColorType
  strokeColorType: ColorType
  strokeWidth: number
}

export interface ScatterBubblesParams {
  // radius: number
  fillColorType: ColorType
  strokeColorType: ColorType
  strokeWidth: number
  valueLinearOpacity: [number, number]
  arcScaleType: ArcScaleType
  sizeAdjust: number
}

export interface XYAuxParams {
  xAxis: {
    showLine: boolean
    showLabel: boolean
    lineDashArray: string
    lineColorType: ColorType
    labelColorType: ColorType
    labelTextColorType: ColorType
    labelTextFormat: string | ((text: any) => string)
    labelPadding: number
    // labelRotate: number
  }
  yAxis: {
    showLine: boolean
    showLabel: boolean
    lineDashArray: string
    lineColorType: ColorType
    labelColorType: ColorType
    labelTextColorType: ColorType
    labelTextFormat: string | ((text: any) => string)
    labelPadding: number
    // labelRotate: number
  }
}

export interface XYAxesParams {
  xAxis: {
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
    // axisLineColor: string
    // axisLabelColor: string
    // tickTextRotate: number
    tickTextColorType: ColorType
  }
  yAxis: {
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
    // axisLineColor: string
    // axisLabelColor: string
    // tickTextRotate: number
    tickTextColorType: ColorType
  }
}


export interface XZoomParams {

}

