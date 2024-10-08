import type {
  PresetSeriesPluginParams,
  PresetGridPluginParams,
  PresetMultiGridPluginParams,
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
}

export const ALL_PLUGIN_PARAMS_GRID: PresetGridPluginParams = {
  Bars: {},
  BarsPN: {},
  BarStack: {},
  BarsTriangle: {},
  Dots: {},
  GridLegend: {},
  GroupAux: {},
  GroupAxis: {},
  LineAreas: {},
  Lines: {},
  ScalingArea: {},
  ValueAxis: {},
  ValueStackAxis: {},
}

export const ALL_PLUGIN_PARAMS_MULTI_GRID: PresetMultiGridPluginParams = {
  MultiBars: {},
  MultiBarStack: {},
  MultiBarsTriangle: {},
  MultiDots: {},
  MultiGridLegend: {},
  MultiGroupAxis: {},
  MultiLineAreas: {},
  MultiLines: {},
  MultiValueAxis: {},
  MultiValueStackAxis: {},
  OverlappingValueAxes: {},
  OverlappingValueStackAxes: {},
}

export const ALL_PLUGIN_PARAMS_TREE: PresetTreePluginParams = {
  TreeLegend: {},
  TreeMap: {},
}

export const ALL_PLUGIN_PARAMS_NONE_DATA: PresetNoneDataPluginParams = {
  Tooltip: {},
}