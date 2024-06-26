import type {
  LinesPluginParams,
  GroupAreaPluginParams,
  DotsPluginParams,
  BarsPluginParams,
  BarStackPluginParams,
  BarsTrianglePluginParams,
  GroupingAxisParams,
  ValueAxisParams,
  ValueStackAxisParams,
  ScalingAreaParams } from './types'

export const DEFAULT_LINES_PLUGIN_PARAMS: LinesPluginParams = {
  lineCurve: 'curveLinear',
  lineWidth: 2
}

export const DEFAULT_DOTS_PLUGIN_PARAMS: DotsPluginParams = {
  radius: 4,
  fillColorType: 'white',
  strokeColorType: 'series',
  strokeWidth: 2,
  onlyShowHighlighted: false
}

export const DEFAULT_GROUP_AREA_PLUGIN_PARAMS: GroupAreaPluginParams = {
  showLine: true,
  showLabel: true,
  lineDashArray: '3, 3',
  lineColorType: 'primary',
  labelColorType: 'primary',
  labelTextColorType: 'background',
  labelTextFormat: text => text,
  labelPadding: 24,
}

export const DEFAULT_BARS_PLUGIN_PARAMS: BarsPluginParams = {
  // barType: 'rect',
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 40,
  barRadius: false,
}

export const DEFAULT_BAR_STACK_PLUGIN_PARAMS: BarStackPluginParams = {
  barWidth: 0,
  barGroupPadding: 10,
  barRadius: false,
}

export const DEFAULT_BARS_TRIANGLE_PLUGIN_PARAMS: BarsTrianglePluginParams = {
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 20,
  linearGradientOpacity: [1, 0]
}

export const DEFAULT_GROUPING_AXIS_PLUGIN_PARAMS: GroupingAxisParams = {
  // labelAnchor: 'start',
  labelOffset: [0, 0],
  labelColorType: 'primary',
  axisLineVisible: true,
  axisLineColorType: 'primary',
  tickFormat: text => text,
  tickLineVisible: true,
  tickPadding: 20,
  tickFullLine: false,
  tickFullLineDasharray: 'none',
  tickColorType: 'secondary',
  tickTextRotate: 0,
  tickTextColorType: 'primary'
}

export const DEFAULT_VALUE_AXIS_PLUGIN_PARAMS: ValueAxisParams = {
  // labelAnchor: 'end',
  labelOffset: [0, 0],
  labelColorType: 'primary',
  axisLineVisible: false,
  axisLineColorType: 'primary',
  ticks: 4,
  tickFormat: ',.0f',
  tickLineVisible: true,
  tickPadding: 20,
  tickFullLine: true,
  tickFullLineDasharray: 'none',
  tickColorType: 'secondary',
  tickTextRotate: 0,
  tickTextColorType: 'primary'
}

export const DEFAULT_VALUE_STACK_AXIS_PLUGIN_PARAMS: ValueStackAxisParams = DEFAULT_VALUE_AXIS_PLUGIN_PARAMS

export const DEFAULT_SCALING_AREA_PLUGIN_PARAMS: ScalingAreaParams = {

}