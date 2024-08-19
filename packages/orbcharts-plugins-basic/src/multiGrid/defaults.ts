import type {
  MultiGridLegendParams,
  MultiBarsParams,
  MultiBarStackParams,
  MultiBarsTriangleParams,
  MultiLinesParams,
  MultiDotsParams,
  MultiGroupAxis,
  MultiValueAxis
} from './types'

export const DEFAULT_MULTI_GRID_LEGEND_PARAMS: MultiGridLegendParams = {
  position: 'right',
  justify: 'end',
  padding: 28,
  backgroundFill: 'none',
  backgroundStroke: 'none',
  gap: 10,
  listRectWidth: 14,
  listRectHeight: 14,
  listRectRadius: 0,
  gridList: [
    {
      listRectWidth: 14,
      listRectHeight: 14,
      listRectRadius: 0,
    }
  ]
}

export const DEFAULT_MULTI_GRID_GROUP_AXIS_PARAMS: MultiGroupAxis = {
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
  tickTextColorType: 'primary',
  // gridIndex: 0
  gridIndexes: [0]
}

export const DEFAULT_MULTI_GRID_VALUE_AXIS_PARAMS: MultiValueAxis = {
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
  tickTextColorType: 'primary',
  // gridIndex: 0
  gridIndexes: [0]
}

export const DEFAULT_MULTI_GRID_BARS_PARAMS: MultiBarsParams = {
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 40,
  barRadius: false,
  // gridIndex: 0
  gridIndexes: [0]
}

export const DEFAULT_MULTI_GRID_BAR_STACK_PARAMS: MultiBarStackParams = {
  barWidth: 0,
  barGroupPadding: 10,
  barRadius: false,
  // gridIndex: 0
  gridIndexes: [0]
}

export const DEFAULT_MULTI_GRID_BARS_TRIANGLE_PARAMS: MultiBarsTriangleParams = {
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 20,
  linearGradientOpacity: [1, 0],
  // gridIndex: 0
  gridIndexes: [0]
}

export const DEFAULT_MULTI_GRID_LINES_PARAMS: MultiLinesParams = {
  lineCurve: 'curveLinear',
  lineWidth: 2,
  // gridIndex: 0
  gridIndexes: [1]
}

export const DEFAULT_MULTI_GRID_DOTS_PARAMS: MultiDotsParams = {
  radius: 4,
  fillColorType: 'white',
  strokeColorType: 'series',
  strokeWidth: 2,
  onlyShowHighlighted: false,
  // gridIndex: 0
  gridIndexes: [1]
}
