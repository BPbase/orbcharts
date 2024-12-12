import type {
  PresetSeriesPluginParams,
  PresetGridPluginParams,
  PresetMultiGridPluginParams,
  PresetMultiValuePluginParams,
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
  BarStack: {},
  BarsTriangle: {},
  Dots: {},
  GridLegend: {},
  GridTooltip: {},
  GroupAux: {},
  GroupAxis: {},
  LineAreas: {},
  Lines: {},
  GridZoom: {},
  ValueAxis: {},
  ValueStackAxis: {},
}

export const ALL_PLUGIN_PARAMS_MULTI_GRID: PresetMultiGridPluginParams = {
  MultiBars: {},
  MultiBarStack: {},
  MultiBarsTriangle: {},
  MultiDots: {},
  MultiGridLegend: {},
  MultiGridTooltip: {},
  MultiGroupAxis: {},
  MultiLineAreas: {},
  MultiLines: {},
  MultiValueAxis: {},
  MultiValueStackAxis: {},
  OverlappingValueAxes: {},
  OverlappingValueStackAxes: {},
}

export const ALL_PLUGIN_PARAMS_MULTI_VALUE: PresetMultiValuePluginParams = {
  MultiValueLegend: {},
  MultiValueTooltip: {},
  Scatter: {},
  ScatterBubbles: {},
  XYAxes: {},
  XYAux: {},
  XYZoom: {}
}

export const ALL_PLUGIN_PARAMS_TREE: PresetTreePluginParams = {
  TreeLegend: {},
  TreeMap: {},
  TreeTooltip: {},
}

export const ALL_PLUGIN_PARAMS_NONE_DATA: PresetNoneDataPluginParams = {
  // Tooltip: {},
}