
import { Observable, Subject } from 'rxjs'
import type { ColorType, ModelDatumSeries, EventData } from '@orbcharts/core'
import type { ContainerPosition, ContainerPositionScaled, Container, GraphicStyles, Layout, VisibleFilter, ValueAxis, CategoryAxis, AxisPosition } from '../../types/PluginParams'
import { ComputedDatumGrid,  } from '../../types/ComputedData'
import type { ContainerSize, TransformData } from '../../types/Common'
import { BaseTooltipStyle, BaseTooltipUtils } from '../../baseLayers/types'

// context
export interface ComputedLayoutDatumGrid extends ComputedDatumGrid {
  axisX: number
  axisY: number
  axisYFromZero: number
}
export type ComputedAxesDataGrid = ComputedLayoutDatumGrid[][]

export interface GridPlotExtendContext {
  layout$: Observable<Layout>
  computedData$: Observable<ComputedDatumGrid[][]>
  fontSizePx$: Observable<number>
  containerSize$: Observable<ContainerSize>
  gridHighlight$: Observable<ComputedDatumGrid[]>
  
  isSeriesSeprate$: Observable<boolean>
  gridContainerPosition$: Observable<ContainerPositionScaled[]>
  gridAxesSize$: Observable<ContainerSize> // 軸轉後的尺寸
  gridAxesContainerSize$: Observable<ContainerSize> // 軸轉後的container尺寸
  seriesLabels$: Observable<string[]>
  SeriesDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  CategoryDataMap$: Observable<Map<string, ComputedDatumGrid[]>>
  computedAxesData$: Observable<ComputedAxesDataGrid> // 有座標的資料
  visibleComputedData$: Observable<ComputedDatumGrid[][]> // filter掉visible=false的資料
  visibleComputedAxesData$: Observable<ComputedAxesDataGrid>
  computedStackedData$: Observable<ComputedDatumGrid[][]>
  categoryScaleDomainValue$: Observable<[number, number]>
  filteredMinMaxValue$: Observable<[number, number]>
  filteredStackedMinMaxValue$: Observable<[number, number]>
  gridAxesTransform$: Observable<TransformData>
  gridAxesReverseTransform$: Observable<TransformData>
  gridGraphicTransform$: Observable<TransformData>
  gridGraphicReverseScale$: Observable<[number, number][]>
  zoomedCategoryAxis$: Observable<CategoryAxis>
  categoryAxisPosition$: Observable<AxisPosition>
  // valueAxisPosition$: Observable<AxisPosition>
  // updateScaleDomain$: Subject<[number, number | "max"]> // zoom後要更新categoryAxis的scaleDomain
}

// plugin params
// export type SeriesDirection = 'row' | 'column' // default: 'row'

// export interface ValueAxis {
//   position: AxisPosition
//   /* scaleDomain說明
//    * [0] => min: 最小值, 'auto': 取最小值，但若大於0則保持為0
//    * [1] => max: 最大值, 'auto': 取最大值，但若小於0則保持為0
//    */ 
//   scaleDomain: [number | 'min' | 'auto', number | 'max' | 'auto']
//   scaleRange: [number, number]
//   label: string
// }

// export interface CategoryAxis {
//   position: AxisPosition
//   scaleDomain: [number, number | 'max']
//   scalePadding: number
//   label: string
// }

export interface GridPlotPluginParams {
  styles: GraphicStyles
  visibleFilter: VisibleFilter<'grid'>
  container: Container
  // direction: 'vertical' | 'horizontal'
  direction: 'bottom-up' | 'top-down' | 'left-right' | 'right-left'
  valueAxis: ValueAxis
  categoryAxis: CategoryAxis
  separateSeries: boolean
  datasetIndex: number
}

// all layer params
export interface GridPlotAllLayerParams {
  Line: GridPlotLineParams
  LineArea: GridPlotLineAreaParams
  Point: GridPlotPointParams
  CategoryGuide: GridPlotCategoryGuideParams
  Bar: GridPlotBarParams
  // BarsPN: GridPlotBarPNParams
  StackedBar: GridPlotStackedBarParams
  TriangleBar: GridPlotTriangleBarParams
  CategoryAxis: GridPlotCategoryAxisParams
  ValueAxis: GridPlotValueAxisParams
  StackedValueAxis: GridPlotStackedValueAxisParams
  CategoryZoom: GridPlotCategoryZoomParams
}

// -- layer params --
export interface GridPlotLineParams {
  lineCurve: string
  lineWidth: number
  // labelFn: (d: ComputedDatumSeries) => string
  // labelPositionFn: (d: ComputedDatumSeries) => 'top' | 'bottom' | 'left' | 'right' | 'center'
  // labelStyleFn: (d: ComputedDatumSeries) => string
  // labelFontSizeFn: (d: ComputedDatumSeries) => number
  // labelColorFn: (d: ComputedDatumSeries) => string
  // labelPadding: number
}

export interface GridPlotLineAreaParams {
  lineCurve: string
  linearGradientOpacity: [number, number]
}

export interface GridPlotPointParams {
  radius: number
  fillColorType: ColorType
  strokeColorType: ColorType
  strokeWidth: number
  // strokeWidthWhileHighlight: number
  onlyShowHighlighted: boolean
}

export interface GridPlotCategoryGuideParams {
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

export interface GridPlotBarParams {
  // barType: BarType
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  barRadius: number | boolean
}

export interface GridPlotBarPNParams extends GridPlotBarParams {}

export interface GridPlotStackedBarParams {
  barWidth: number
  barGroupPadding: number
  barRadius: number | boolean
}

export interface GridPlotTriangleBarParams {
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  linearGradientOpacity: [number, number]
}

export interface GridPlotCategoryAxisParams {
  // xLabel: string
  // labelAnchor: 'start' | 'end'
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
  // axisLineColor: string
  // axisLabelColor: string
  tickTextRotate: number
  tickTextColorType: ColorType
}

export interface GridPlotValueAxisParams {
  // xLabel: string
  // labelAnchor: 'start' | 'end'
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
  tickTextRotate: number
  tickTextColorType: ColorType
  opposite: boolean
}

export interface GridPlotStackedValueAxisParams extends GridPlotValueAxisParams {}

export interface GridPlotCategoryZoomParams {

}
