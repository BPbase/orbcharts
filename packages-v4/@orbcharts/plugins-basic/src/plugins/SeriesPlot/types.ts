
import { Observable, Subject } from 'rxjs'
import type { ColorType, ModelDatumSeries, EventData } from '../../../../core/src/types'
import type { AxisPosition, ContainerPosition, ContainerPositionScaled, Container, GraphicStyles, Layout, VisibleFilter, ValueAxis, CategoryAxis } from '../../types/PluginParams'
import { ComputedDatumGrid,  } from '../../types/ComputedData'
import type { ContainerSize, Placement, TransformData } from '../../types/Common'
import { BaseTooltipStyle, BaseTooltipUtils } from '../../baseLayers/types'

// context
export interface ComputedLayoutDatumGrid extends ComputedDatumGrid {
  axisX: number
  axisY: number
  axisYFromZero: number
}
export type ComputedAxesDataGrid = ComputedLayoutDatumGrid[][]

export interface SeriesPlotExtendContext {
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

export interface SeriesPlotPluginParams {
  styles: GraphicStyles
  visibleFilter: VisibleFilter<'grid'>
  container: Container
  // seriesDirection: SeriesDirection
  // rowLabels: string[]
  // columnLabels: string[]
  valueAxis: ValueAxis
  categoryAxis: CategoryAxis
  separateSeries: boolean
  datasetIndex: number
}

// all layer params
export interface SeriesPlotAllLayerParams {
  Lines: LinesParams
  LineAreas: LineAreasParams
  Dots: DotsParams
  CategoryAux: CategoryAuxParams
  Bars: BarsParams
  BarsPN: BarsPNParams
  StackedBars: StackedBarsParams
  BarsTriangle: BarsTriangleParams
  CategoryAxis: CategoryAxisParams
  ValueAxis: ValueAxisParams
  StackedValueAxis: StackedValueAxisParams
  CategoryZoom: CategoryZoomParams
  GridLegend: GridLegendParams
  GridTooltip: GridTooltipParams
}

// -- layer params --
export interface LinesParams {
  lineCurve: string
  lineWidth: number
  // labelFn: (d: ComputedDatumSeries) => string
  // labelPositionFn: (d: ComputedDatumSeries) => 'top' | 'bottom' | 'left' | 'right' | 'center'
  // labelStyleFn: (d: ComputedDatumSeries) => string
  // labelFontSizeFn: (d: ComputedDatumSeries) => number
  // labelColorFn: (d: ComputedDatumSeries) => string
  // labelPadding: number
}

export interface LineAreasParams {
  lineCurve: string
  linearGradientOpacity: [number, number]
}

export interface DotsParams {
  radius: number
  fillColorType: ColorType
  strokeColorType: ColorType
  strokeWidth: number
  // strokeWidthWhileHighlight: number
  onlyShowHighlighted: boolean
}

export interface CategoryAuxParams {
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

export interface BarsParams {
  // barType: BarType
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  barRadius: number | boolean
}

export interface BarsPNParams extends BarsParams {}

export interface StackedBarsParams {
  barWidth: number
  barGroupPadding: number
  barRadius: number | boolean
}

export interface BarsTriangleParams {
  barWidth: number
  barPadding: number
  barGroupPadding: number // 群組和群組間的間隔
  linearGradientOpacity: [number, number]
}

export interface CategoryAxisParams {
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

export interface ValueAxisParams {
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
}

export interface StackedValueAxisParams extends ValueAxisParams {}

export interface CategoryZoomParams {

}

export interface GridLegendParams {
  // position: 'top' | 'bottom' | 'left' | 'right'
  // justify: 'start' | 'center' | 'end'
  placement: Placement
  padding: number
  backgroundFill: ColorType
  backgroundStroke: ColorType
  gap: number
  listRectWidth: number
  listRectHeight: number
  listRectRadius: number
  textColorType: ColorType
}

export interface GridTooltipParams {
  backgroundColorType: ColorType
  backgroundOpacity: number
  strokeColorType: ColorType
  textColorType: ColorType
  offset: [number, number]
  padding: number
  // textRenderFn: (<T extends ChartType>(eventData: EventTypeMap<T>) => string[] | string) | null
  // svgRenderFn: (<T extends ChartType>(eventData: EventTypeMap<T>) => string) | null
  renderFn: (
    (
      eventData: EventData<'grid'>,
      context: {
        styles: BaseTooltipStyle
        utils: BaseTooltipUtils
        categoryData: ComputedDatumGrid[]
        seriesData: ComputedDatumGrid[]
      }
    ) => string[] | string
  )
}
