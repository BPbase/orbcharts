import type {
  // -- series --
  BubblesParams,
  PieParams,
  PieEventTextsParams,
  PieLabelsParams,
  RoseParams,
  RoseLabelsParams,
  SeriesLegendParams,

  // -- grid --
  BarsParams,
  BarsPNParams,
  BarStackParams,
  BarsTriangleParams,
  DotsParams,
  GridLegendParams,
  GroupAuxParams,
  GroupAxisParams,
  LineAreasParams,
  LinesParams,
  ScalingAreaParams,
  ValueAxisParams,
  ValueStackAxisParams,

  // -- multiGrid --
  MultiBarsParams,
  MultiBarStackParams,
  MultiBarsTriangleParams,
  MultiDotsParams,
  MultiGridLegendParams,
  MultiGroupAxisParams,
  MultiLineAreasParams,
  MultiLinesParams,
  MultiValueAxisParams,
  MultiValueStackAxisParams,
  OverlappingValueAxesParams,
  OverlappingValueStackAxesParams,

  // -- tree --
  TreeLegendParams,
  TreeMapParams,

  // -- noneData --
  TooltipParams
} from '../lib/plugins-basic-types'

type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>

// -- series --
// series的全部plugin參數
export type PresetSeriesPluginParams = PresetBubblesParams
  & PresetPieParams
  & PresetPieEventTextsParams
  & PresetPieLabelsParams
  & PresetRoseParams
  & PresetRoseLabelsParams
  & PresetSeriesLegendParams

export interface PresetBubblesParams {
  Bubbles: Partial<BubblesParams>
}

export interface PresetPieParams {
  Pie: Partial<PieParams>
}

export interface PresetPieEventTextsParams {
  PieEventTexts: Partial<PieEventTextsParams>
}

export interface PresetPieLabelsParams {
  PieLabels: Partial<PieLabelsParams>
}

export interface PresetRoseParams {
  Rose: Partial<RoseParams>
}

export interface PresetRoseLabelsParams {
  RoseLabels: Partial<RoseLabelsParams>
}

export interface PresetSeriesLegendParams {
  SeriesLegend: Partial<SeriesLegendParams>
}

// -- grid --
// grid的全部plugin參數
export type PresetGridPluginParams = PresetBarsParams
  & PresetBarsPNParams
  & PresetBarStackParams
  & PresetBarsTriangleParams
  & PresetDotsParams
  & PresetGridLegendParams
  & PresetGroupAuxParams
  & PresetGroupAxisParams
  & PresetLineAreasParams
  & PresetLinesParams
  & PresetScalingAreaParams
  & PresetValueAxisParams
  & PresetValueStackAxisParams

export interface PresetBarsParams {
  Bars: Partial<BarsParams>
}

export interface PresetBarsPNParams {
  BarsPN: Partial<BarsPNParams>
}

export interface PresetBarStackParams {
  BarStack: Partial<BarStackParams>
}

export interface PresetBarsTriangleParams {
  BarsTriangle: Partial<BarsTriangleParams>
}

export interface PresetDotsParams {
  Dots: Partial<DotsParams>
}

export interface PresetGridLegendParams {
  GridLegend: Partial<GridLegendParams>
}

export interface PresetGroupAuxParams {
  GroupAux: Partial<GroupAuxParams>
}

export interface PresetGroupAxisParams {
  GroupAxis: Partial<GroupAxisParams>
}

export interface PresetLineAreasParams {
  LineAreas: Partial<LineAreasParams>
}

export interface PresetLinesParams {
  Lines: Partial<LinesParams>
}

export interface PresetScalingAreaParams {
  ScalingArea: Partial<ScalingAreaParams>
}

export interface PresetValueAxisParams {
  ValueAxis: Partial<ValueAxisParams>
}

export interface PresetValueStackAxisParams {
  ValueStackAxis: Partial<ValueStackAxisParams>
}

// -- multiGrid --
// multiGrid的全部plugin參數
export type PresetMultiGridPluginParams = PresetMultiBarsParams
  & PresetMultiBarStackParams
  & PresetMultiBarsTriangleParams
  & PresetMultiDotsParams
  & PresetMultiGridLegendParams
  & PresetMultiGroupAxisParams
  & PresetMultiLineAreasParams
  & PresetMultiLinesParams
  & PresetMultiValueAxisParams
  & PresetMultiValueStackAxisParams
  & PresetOverlappingValueAxesParams
  & PresetOverlappingValueStackAxesParams

// multiGrid分開grid
export type PresetMultiGridSepratedPluginParams = Omit<PresetMultiGridPluginParams, 'OverlappingValueAxes' | 'OverlappingValueStackAxes'>

// multiGrid重疊grid
export type PresetMultiGridOverlappedPluginParams = Omit<PresetMultiGridPluginParams, 'PresetMultiGroupAxisParams' | 'PresetMultiValueAxisParams'>

export interface PresetMultiBarsParams {
  MultiBars: Partial<MultiBarsParams>
}

export interface PresetMultiBarStackParams {
  MultiBarStack: Partial<MultiBarStackParams>
}

export interface PresetMultiBarsTriangleParams {
  MultiBarsTriangle: Partial<MultiBarsTriangleParams>
}

export interface PresetMultiDotsParams {
  MultiDots: Partial<MultiDotsParams>
}

export interface PresetMultiGridLegendParams {
  MultiGridLegend: DeepPartial<MultiGridLegendParams>
}

export interface PresetMultiGroupAxisParams {
  MultiGroupAxis: Partial<MultiGroupAxisParams>
}

export interface PresetMultiLineAreasParams {
  MultiLineAreas: Partial<MultiLineAreasParams>
}

export interface PresetMultiLinesParams {
  MultiLines: Partial<MultiLinesParams>
}

export interface PresetMultiValueAxisParams {
  MultiValueAxis: Partial<MultiValueAxisParams>
}

export interface PresetMultiValueStackAxisParams {
  MultiValueStackAxis: Partial<MultiValueStackAxisParams>
}

export interface PresetOverlappingValueAxesParams {
  OverlappingValueAxes: Partial<OverlappingValueAxesParams>
}

export interface PresetOverlappingValueStackAxesParams {
  OverlappingValueStackAxes: Partial<OverlappingValueStackAxesParams>
}

// -- tree --
export type PresetTreePluginParams = PresetTreeLegendParams & PresetTreeMapParams

export interface PresetTreeLegendParams {
  TreeLegend: Partial<TreeLegendParams>
}

export interface PresetTreeMapParams {
  TreeMap: Partial<TreeMapParams>
}

// -- noneData --
// noneData的全部plugin參數
export type PresetNoneDataPluginParams = PresetTooltipParams

export interface PresetTooltipParams {
  Tooltip: Partial<TooltipParams>
}