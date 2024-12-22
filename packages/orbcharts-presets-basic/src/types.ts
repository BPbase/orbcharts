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
  StackedBarParams,
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
  StackedValueAxisParams,

  // -- multiGrid --
  MultiBarsParams,
  MultiStackedBarParams,
  MultiBarsTriangleParams,
  MultiDotsParams,
  MultiGridLegendParams,
  MultiGridTooltipParams,
  MultiGroupAxisParams,
  MultiLineAreasParams,
  MultiLinesParams,
  MultiValueAxisParams,
  MultiStackedValueAxisParams,
  OverlappingValueAxesParams,
  OverlappingStackedValueAxesParams,

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
  ForceDirectedBubblesParams,
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
  & PresetStackedBarParams
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
  & PresetStackedValueAxisParams

export interface PresetBarsParams {
  Bars: Partial<BarsParams>
}

export interface PresetBarsPNParams {
  BarsPN: Partial<BarsPNParams>
}

export interface PresetStackedBarParams {
  StackedBar: Partial<StackedBarParams>
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

export interface PresetStackedValueAxisParams {
  StackedValueAxis: Partial<StackedValueAxisParams>
}

// -- multiGrid --
// multiGrid的全部plugin參數
export type PresetMultiGridPluginParams = PresetMultiBarsParams
  & PresetMultiStackedBarParams
  & PresetMultiBarsTriangleParams
  & PresetMultiDotsParams
  & PresetMultiGridLegendParams
  & PresetMultiGridTooltipParams
  & PresetMultiGroupAxisParams
  & PresetMultiLineAreasParams
  & PresetMultiLinesParams
  & PresetMultiValueAxisParams
  & PresetMultiStackedValueAxisParams
  & PresetOverlappingValueAxesParams
  & PresetOverlappingStackedValueAxesParams

// multiGrid分開grid
export type PresetMultiGridSepratedPluginParams = Omit<PresetMultiGridPluginParams, 'OverlappingValueAxes' | 'OverlappingStackedValueAxes'>

// multiGrid重疊grid
export type PresetMultiGridOverlappedPluginParams = Omit<PresetMultiGridPluginParams, 'PresetMultiGroupAxisParams' | 'PresetMultiValueAxisParams'>

export interface PresetMultiBarsParams {
  MultiBars: Partial<MultiBarsParams>
}

export interface PresetMultiStackedBarParams {
  MultiStackedBar: Partial<MultiStackedBarParams>
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

export interface PresetMultiStackedValueAxisParams {
  MultiStackedValueAxis: Partial<MultiStackedValueAxisParams>
}

export interface PresetOverlappingValueAxesParams {
  OverlappingValueAxes: Partial<OverlappingValueAxesParams>
}

export interface PresetOverlappingStackedValueAxesParams {
  OverlappingStackedValueAxes: Partial<OverlappingStackedValueAxesParams>
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

export interface PresetMultiStackedValueAxisParams {
  MultiStackedValueAxis: Partial<MultiStackedValueAxisParams>
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
  & PresetForceDirectedBubblesParams
  & PresetRelationshipLegendParams
  & PresetRelationshipTooltipParams

export interface PresetForceDirectedParams {
  ForceDirected: DeepPartial<ForceDirectedParams>
}

export interface PresetForceDirectedBubblesParams {
  ForceDirectedBubbles: DeepPartial<ForceDirectedBubblesParams>
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