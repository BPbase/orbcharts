import type {
  PresetSeriesPluginParams,
  PresetGridPluginParams,
  PresetMultiGridPluginParams,
  PresetMultiValuePluginParams,
  PresetRelationshipPluginParams,
  PresetTreePluginParams,
  PresetNoneDataPluginParams
} from './types'

export const ALL_PLUGIN_PARAMS_SERIES: PresetSeriesPluginParams = {
  Bubbles: {},
  Pie: {},
  PieEventTexts: {},
  PieLabels: {},
  Rose: {},
  RoseLabels: {},
  SeriesLegend: {},
  SeriesTooltip: {},
}

export const ALL_PLUGIN_PARAMS_GRID: PresetGridPluginParams = {
  Bars: {},
  BarsPN: {},
  StackedBars: {},
  BarsTriangle: {},
  Dots: {},
  GridLegend: {},
  GridTooltip: {},
  GroupAux: {},
  GroupAxis: {},
  LineAreas: {},
  Lines: {},
  GroupZoom: {},
  ValueAxis: {},
  StackedValueAxis: {},
}

export const ALL_PLUGIN_PARAMS_MULTI_GRID: PresetMultiGridPluginParams = {
  MultiBars: {},
  MultiStackedBars: {},
  MultiBarsTriangle: {},
  MultiDots: {},
  MultiGridLegend: {},
  MultiGridTooltip: {},
  MultiGroupAxis: {},
  MultiLineAreas: {},
  MultiLines: {},
  MultiValueAxis: {},
  MultiStackedValueAxis: {},
  OverlappingValueAxes: {},
  OverlappingStackedValueAxes: {},
}

export const ALL_PLUGIN_PARAMS_MULTI_VALUE: PresetMultiValuePluginParams = {
  MultiValueLegend: {},
  MultiValueTooltip: {},
  RacingBars: {},
  RacingCounterTexts: {},
  RacingValueAxis: {},
  Scatter: {},
  ScatterBubbles: {},
  XYAxes: {},
  XYAux: {},
  XZoom: {}
}

export const ALL_PLUGIN_PARAMS_RELATIONSHIP: PresetRelationshipPluginParams = {
  ForceDirected: {},
  ForceDirectedBubbles: {},
  RelationshipLegend: {},
  RelationshipTooltip: {},
}


export const ALL_PLUGIN_PARAMS_TREE: PresetTreePluginParams = {
  TreeLegend: {},
  TreeMap: {},
  TreeTooltip: {},
}

export const ALL_PLUGIN_PARAMS_NONE_DATA: PresetNoneDataPluginParams = {
  // Tooltip: {},
}