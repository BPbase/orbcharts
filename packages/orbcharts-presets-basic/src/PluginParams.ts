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
  OverlappingValueStackAxesParams } from '@orbcharts/plugins-basic'

// -- series --
export type PresetSeriesPluginParams = PresetBubblesParams
  | PresetPieParams
  | PresetPieEventTextsParams
  | PresetPieLabelsParams
  | PresetRoseParams
  | PresetRoseLabelsParams
  | PresetSeriesLegendParams

export interface PresetBubblesParams {
  bubbles: Partial<BubblesParams>
}

export interface PresetPieParams {
  pie: Partial<PieParams>
}

export interface PresetPieEventTextsParams {
  pieEventTexts: Partial<PieEventTextsParams>
}

export interface PresetPieLabelsParams {
  pieLabels: Partial<PieLabelsParams>
}

export interface PresetRoseParams {
  rose: Partial<RoseParams>
}

export interface PresetRoseLabelsParams {
  roseLabels: Partial<RoseLabelsParams>
}

export interface PresetSeriesLegendParams {
  seriesLegend: Partial<SeriesLegendParams>
}

// -- grid --
export type PresetGridPluginParams = PresetBarsParams
  | PresetBarsPNParams
  | PresetBarStackParams
  | PresetBarsTriangleParams
  | PresetDotsParams
  | PresetGridLegendParams
  | PresetGroupAuxParams
  | PresetGroupAxisParams
  | PresetLineAreasParams
  | PresetLinesParams
  | PresetScalingAreaParams
  | PresetValueAxisParams
  | PresetValueStackAxisParams

export interface PresetBarsParams {
  bars: Partial<BarsParams>
}

export interface PresetBarsPNParams {
  barsPN: Partial<BarsPNParams>
}

export interface PresetBarStackParams {
  barStack: Partial<BarStackParams>
}

export interface PresetBarsTriangleParams {
  barsTriangle: Partial<BarsTriangleParams>
}

export interface PresetDotsParams {
  dots: Partial<DotsParams>
}

export interface PresetGridLegendParams {
  gridLegend: Partial<GridLegendParams>
}

export interface PresetGroupAuxParams {
  groupAux: Partial<GroupAuxParams>
}

export interface PresetGroupAxisParams {
  groupAxis: Partial<GroupAxisParams>
}

export interface PresetLineAreasParams {
  lineAreas: Partial<LineAreasParams>
}

export interface PresetLinesParams {
  lines: Partial<LinesParams>
}

export interface PresetScalingAreaParams {
  scalingArea: Partial<ScalingAreaParams>
}

export interface PresetValueAxisParams {
  valueAxis: Partial<ValueAxisParams>
}

export interface PresetValueStackAxisParams {
  valueStackAxis: Partial<ValueStackAxisParams>
}

// -- multiGrid --
export type PresetMultiGridPluginParams = PresetMultiBarsParams
  | PresetMultiBarStackParams
  | PresetMultiBarsTriangleParams
  | PresetMultiDotsParams
  | PresetMultiGridLegendParams
  | PresetMultiGroupAxisParams
  | PresetMultiLineAreasParams
  | PresetMultiLinesParams
  | PresetMultiValueAxisParams
  | PresetMultiValueStackAxisParams
  | PresetOverlappingValueAxesParams
  | PresetOverlappingValueStackAxesParams

export interface PresetMultiBarsParams {
  multiBars: Partial<MultiBarsParams>
}

export interface PresetMultiBarStackParams {
  multiBarStack: Partial<MultiBarStackParams>
}

export interface PresetMultiBarsTriangleParams {
  multiBarsTriangle: Partial<MultiBarsTriangleParams>
}

export interface PresetMultiDotsParams {
  multiDots: Partial<MultiDotsParams>
}

export interface PresetMultiGridLegendParams {
  multiGridLegend: Partial<MultiGridLegendParams>
}

export interface PresetMultiGroupAxisParams {
  multiGroupAxis: Partial<MultiGroupAxisParams>
}

export interface PresetMultiLineAreasParams {
  multiLineAreas: Partial<MultiLineAreasParams>
}

export interface PresetMultiLinesParams {
  multiLines: Partial<MultiLinesParams>
}

export interface PresetMultiValueAxisParams {
  multiValueAxis: Partial<MultiValueAxisParams>
}

export interface PresetMultiValueStackAxisParams {
  multiValueStackAxis: Partial<MultiValueStackAxisParams>
}

export interface PresetOverlappingValueAxesParams {
  overlappingValueAxes: Partial<OverlappingValueAxesParams>
}

export interface PresetOverlappingValueStackAxesParams {
  overlappingValueStackAxes: Partial<OverlappingValueStackAxesParams>
}

