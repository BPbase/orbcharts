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
  StackedBarsParams,
  BarsTriangleParams,
  DotsParams,
  GridLegendParams,
  GroupAuxParams,
  GroupAxisParams,
  LineAreasParams,
  LinesParams,
  GridTooltipParams,
  GroupZoomParams,
  ValueAxisParams,
  StackedValueAxisParams,

  // -- multiGrid --
  MultiBarsParams,
  MultiStackedBarsParams,
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
  OrdinalAuxParams,
  OrdinalAxisParams,
  OrdinalBubblesParams,
  OrdinalZoomParams,
  RacingBarsParams,
  RacingCounterTextsParams,
  RacingValueAxisParams,
  ScatterParams,
  ScatterBubblesParams,
  XYAuxParams,
  XYAxesParams,
  XZoomParams,

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
import type { DeepPartial } from '../lib/core-types'

// type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>

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
  Bubbles: DeepPartial<BubblesParams>
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
  & PresetStackedBarsParams
  & PresetBarsTriangleParams
  & PresetDotsParams
  & PresetGridLegendParams
  & PresetGridTooltipParams
  & PresetGroupAuxParams
  & PresetGroupAxisParams
  & PresetLineAreasParams
  & PresetLinesParams
  & PresetGroupZoomParams
  & PresetValueAxisParams
  & PresetStackedValueAxisParams

export interface PresetBarsParams {
  Bars: Partial<BarsParams>
}

export interface PresetBarsPNParams {
  BarsPN: Partial<BarsPNParams>
}

export interface PresetStackedBarsParams {
  StackedBars: Partial<StackedBarsParams>
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

export interface PresetGroupZoomParams {
  GroupZoom: Partial<GroupZoomParams>
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
  & PresetMultiStackedBarsParams
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

export interface PresetMultiStackedBarsParams {
  MultiStackedBars: Partial<MultiStackedBarsParams>
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
  & PresetOrdinalAuxParams
  & PresetOrdinalAxisParams
  & PresetOrdinalBubblesParams
  & PresetOrdinalZoomParams
  & PresetRacingBarsParams
  & PresetRacingCounterTextsParams
  & PresetRacingValueAxisParams
  & PresetScatterParams
  & PresetScatterBubblesParams
  & PresetXYAuxParams
  & PresetXYAxesParams
  & PresetXZoomParams

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

export interface PresetOrdinalAuxParams {
  OrdinalAux: Partial<OrdinalAuxParams>
}

export interface PresetOrdinalAxisParams {
  OrdinalAxis: Partial<OrdinalAxisParams>
}

export interface PresetOrdinalBubblesParams {
  OrdinalBubbles: DeepPartial<OrdinalBubblesParams>
}

export interface PresetOrdinalZoomParams {
  OrdinalZoom: Partial<OrdinalZoomParams>
}

export interface PresetRacingBarsParams {
  RacingBars: DeepPartial<RacingBarsParams>
}

export interface PresetRacingCounterTextsParams {
  RacingCounterTexts: Partial<RacingCounterTextsParams>
}

export interface PresetRacingValueAxisParams {
  RacingValueAxis: Partial<RacingValueAxisParams>
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
  XYAxes: DeepPartial<XYAxesParams>
}

export interface PresetXZoomParams {
  XZoom: Partial<XZoomParams>
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