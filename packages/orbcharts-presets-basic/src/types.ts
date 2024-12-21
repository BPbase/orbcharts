import type {
  // -- series --
  BubblesParams,
  PieParams,
  PieEventTextsParams,
  PieLabelsParams,
  RoseParams,
  RoseLabelsParams,
  SeriesLegendParams,
  SeriesTooltipParams,

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
  GridTooltipParams,
  GridZoomParams,
  ValueAxisParams,
  ValueStackAxisParams,

  // -- multiGrid --
  MultiBarsParams,
  MultiBarStackParams,
  MultiBarsTriangleParams,
  MultiDotsParams,
  MultiGridLegendParams,
  MultiGridTooltipParams,
  MultiGroupAxisParams,
  MultiLineAreasParams,
  MultiLinesParams,
  MultiValueAxisParams,
  MultiValueStackAxisParams,
  OverlappingValueAxesParams,
  OverlappingValueStackAxesParams,

  // -- multiValue --
  MultiValueLegendParams,
  MultiValueTooltipParams,  
  ScatterParams,
  ScatterBubblesParams,
  XYAuxParams,
  XYAxesParams,
  XYZoomParams,

  // -- relationship --
  ForceDirectedParams,
  RelationshipLegendParams,
  RelationshipTooltipParams,

  // -- tree --
  TreeLegendParams,
  TreeMapParams,
  TreeTooltipParams,

  // -- noneData --
  // TooltipParams
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
  & PresetSeriesTooltipParams

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

export interface PresetSeriesTooltipParams {
  SeriesTooltip: Partial<SeriesTooltipParams>
}

// -- grid --
// grid的全部plugin參數
export type PresetGridPluginParams = PresetBarsParams
  & PresetBarsPNParams
  & PresetBarStackParams
  & PresetBarsTriangleParams
  & PresetDotsParams
  & PresetGridLegendParams
  & PresetGridTooltipParams
  & PresetGroupAuxParams
  & PresetGroupAxisParams
  & PresetLineAreasParams
  & PresetLinesParams
  & PresetGridZoomParams
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

export interface PresetGridTooltipParams {
  GridTooltip: Partial<GridTooltipParams>
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

export interface PresetGridZoomParams {
  GridZoom: Partial<GridZoomParams>
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
  & PresetMultiGridTooltipParams
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

export interface PresetMultiGridTooltipParams {
  MultiGridTooltip: Partial<MultiGridTooltipParams>
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

// -- multiValue --
export type PresetMultiValuePluginParams = PresetMultiValueLegendParams
  & PresetMultiValueTooltipParams
  & PresetScatterParams
  & PresetScatterBubblesParams
  & PresetXYAuxParams
  & PresetXYAxesParams
  & PresetXYZoomParams

export interface PresetMultiValueAxisParams {
  MultiValueAxis: Partial<MultiValueAxisParams>
}

export interface PresetMultiValueStackAxisParams {
  MultiValueStackAxis: Partial<MultiValueStackAxisParams>
}

export interface PresetMultiValueLegendParams {
  MultiValueLegend: Partial<MultiValueLegendParams>
}

export interface PresetMultiValueTooltipParams {
  MultiValueTooltip: Partial<MultiValueTooltipParams>
}

export interface PresetScatterParams {
  Scatter: Partial<ScatterParams>
}

export interface PresetScatterBubblesParams {
  ScatterBubbles: Partial<ScatterBubblesParams>
}

export interface PresetXYAuxParams {
  XYAux: Partial<XYAuxParams>
}

export interface PresetXYAxesParams {
  XYAxes: Partial<XYAxesParams>
}

export interface PresetXYZoomParams {
  XYZoom: Partial<XYZoomParams>
}

// -- relationship --
export type PresetRelationshipPluginParams = PresetForceDirectedParams
  & PresetRelationshipLegendParams
  & PresetRelationshipTooltipParams

export interface PresetForceDirectedParams {
  ForceDirected: DeepPartial<ForceDirectedParams>
}

export interface PresetRelationshipLegendParams {
  RelationshipLegend: Partial<RelationshipLegendParams>
}

export interface PresetRelationshipTooltipParams {
  RelationshipTooltip: Partial<RelationshipTooltipParams>
}

// -- tree --
export type PresetTreePluginParams = PresetTreeLegendParams
  & PresetTreeMapParams
  & PresetTreeTooltipParams

export interface PresetTreeLegendParams {
  TreeLegend: Partial<TreeLegendParams>
}

export interface PresetTreeMapParams {
  TreeMap: Partial<TreeMapParams>
}

export interface PresetTreeTooltipParams {
  TreeTooltip: Partial<TreeTooltipParams>
}

// -- noneData --
// noneData的全部plugin參數
export type PresetNoneDataPluginParams = {}
// export type PresetNoneDataPluginParams = PresetTooltipParams

// export interface PresetTooltipParams {
//   Tooltip: Partial<TooltipParams>
// }