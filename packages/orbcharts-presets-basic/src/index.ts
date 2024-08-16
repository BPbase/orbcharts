import {
  createSeriesPreset,
  createGridPreset,
  createMultiGridPreset,
  createMultiValuePreset,
  createRelationshipPreset,
  createTreePreset } from './createPreset'

// -- series --
// 通用 - PRESET_SERIES_[name]
export const PRESET_SERIES_BASIC = createSeriesPreset({
  // chartParamsId: 'CP_RIGHT_PADDING',
  allPluginParamsIds: [],
  description: '基本Series參數'
})
// Bubbles - PRESET_BUBBLES_[name]
export const PRESET_BUBBLES_BASIC = createSeriesPreset({
  // chartParamsId: 'CP_RIGHT_PADDING',
  allPluginParamsIds: ['PP_SERIES_LEGEND_ROUND'],
  description: '基本泡泡圖'
})
export const PRESET_BUBBLES_SCALING_BY_RADIUS = createSeriesPreset({
  // chartParamsId: 'CP_RIGHT_PADDING',
  allPluginParamsIds: ['PP_BUBBLES_SCALING_BY_RADIUS', 'PP_SERIES_LEGEND_ROUND'],
  description: '以半徑尺寸為比例的泡泡圖'
})
// Pie - PRESET_PIE_[name]
export const PRESET_PIE_BASIC = createSeriesPreset({
  // chartParamsId: 'CP_RIGHT_PADDING',
  allPluginParamsIds: ['PP_SERIES_LEGEND_ROUND'],
  description: '基本圓餅圖'
})
export const PRESET_PIE_WITH_INNER_LABELS = createSeriesPreset({
  // chartParamsId: 'CP_RIGHT_PADDING',
  allPluginParamsIds: ['PP_PIE_LABELS_INNER', 'PP_SERIES_LEGEND_ROUND'],
  description: '圓餅圖及內部資料標籤'
})
export const PRESET_PIE_DONUT = createSeriesPreset({
  // chartParamsId: 'CP_RIGHT_PADDING',
  allPluginParamsIds: ['PP_PIE_DONUT', 'PP_SERIES_LEGEND_ROUND'],
  description: '甜甜圈圖'
})
export const PRESET_PIE_HALF_DONUT = createSeriesPreset({
  chartParamsId: 'CP_TOP_AND_NO_BOTTOM_PADDING',
  allPluginParamsIds: ['PP_PIE_HALF_DONUT', 'PP_PIE_LABELS_HALF_ANGLE', 'PP_SERIES_LEGEND_ROUND'],
  description: '半圓甜甜圈圖'
})

// -- grid --
// 通用 - PRESET_GRID_[name]
export const PRESET_GRID_BASIC = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING',
  allPluginParamsIds: ['PP_GRID_LEGEND_BOTTOM'],
  description: '基本Grid參數'
})
export const PRESET_GRID_ROTATE_AXIS_LABEL = createGridPreset({
  chartParamsId: 'CP_BOTTOM_LONG_PADDING',
  allPluginParamsIds: ['PP_GROUP_AXIS_ROTATE_LABEL', 'PP_GRID_LEGEND_BOTTOM'],
  description: '傾斜標籤'
})
export const PRESET_GRID_HORIZONTAL = createGridPreset({
  chartParamsId: 'CP_BOTTOM_AND_LEFT_PADDING',
  dataFormatterId: 'DF_GRID_BOTTOM_VALUE_AXIS',
  allPluginParamsIds: ['PP_GRID_LEGEND_BOTTOM'],
  description: '橫向圖'
})
export const PRESET_GRID_2_SERIES_SLOT = createGridPreset({
  chartParamsId:  'CP_BOTTOM_LONG_PADDING',
  dataFormatterId: 'DF_GRID_2_SERIES_SLOT',
  allPluginParamsIds: ['PP_GROUP_AXIS_ROTATE_LABEL', 'PP_GRID_LEGEND_BOTTOM'],
  description: '2組Series圖表'
})
export const PRESET_GRID_3_SERIES_SLOT = createGridPreset({
  chartParamsId: 'CP_BOTTOM_LONG_PADDING',
  dataFormatterId: 'DF_GRID_3_SERIES_SLOT',
  allPluginParamsIds: ['PP_GROUP_AXIS_ROTATE_LABEL', 'PP_GRID_LEGEND_BOTTOM', 'PP_GROUP_AXIS_ROTATE_LABEL'],
  description: '3組Series圖表'
})
export const PRESET_GRID_4_SERIES_SLOT = createGridPreset({
  chartParamsId:  'CP_BOTTOM_LONG_PADDING',
  dataFormatterId: 'DF_GRID_4_SERIES_SLOT',
  allPluginParamsIds: ['PP_GROUP_AXIS_ROTATE_LABEL', 'PP_GRID_LEGEND_BOTTOM'],
  description: '4組Series圖表'
})
// Bars - PRESET_BARS_[name]
export const PRESET_BARS_ROUND = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING',
  allPluginParamsIds: ['PP_BARS_ROUND', 'PP_GRID_LEGEND_BOTTOM'],
  description: '圓角長條圖'
})
export const PRESET_BARS_HORIZONTAL_AND_ROUND = createGridPreset({
  chartParamsId: 'CP_BOTTOM_AND_LEFT_PADDING',
  dataFormatterId: 'DF_GRID_BOTTOM_VALUE_AXIS',
  allPluginParamsIds: ['PP_BARS_ROUND', 'PP_GRID_LEGEND_BOTTOM'],
  description: '橫向圓角長條圖'
})
export const PRESET_BARS_THIN = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING',
  allPluginParamsIds: ['PP_BARS_THIN', 'PP_GRID_LEGEND_BOTTOM'],
  description: '細長條圖'
})
export const PRESET_BARS_HORIZONTAL_AND_THIN = createGridPreset({
  chartParamsId: 'CP_BOTTOM_AND_LEFT_PADDING',
  dataFormatterId: 'DF_GRID_BOTTOM_VALUE_AXIS',
  allPluginParamsIds: ['PP_BARS_ROUND', 'PP_GRID_LEGEND_BOTTOM'],
  description: '橫向圓角長條圖'
})
// Lines - PRESET_LINES_[name]
export const PRESET_LINES_BASIC = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT',
  allPluginParamsIds: ['PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
  description: '基本Grid參數'
})
export const PRESET_LINES_ROTATE_AXIS_LABEL = createGridPreset({
  chartParamsId: 'CP_BOTTOM_LONG_PADDING_WITH_SERIES_HIGHLIGHT',
  allPluginParamsIds: ['PP_GROUP_AXIS_ROTATE_LABEL', 'PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
  description: '傾斜標籤'
})
export const PRESET_LINES_HORIZONTAL = createGridPreset({
  chartParamsId: 'CP_BOTTOM_AND_LEFT_PADDING_WITH_SERIES_HIGHLIGHT',
  dataFormatterId: 'DF_GRID_BOTTOM_VALUE_AXIS',
  allPluginParamsIds: ['PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
  description: '橫向圓角長條圖'
})
// export const PRESET_LINES_WITH_SOLID_DOTS = createGridPreset({
//   chartParamsId: 'CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT',
//   allPluginParamsIds: ['PP_DOTS_SOLID', 'PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
//   description: '折線圖及實心圓點'
// })
export const PRESET_LINES_CURVE = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT',
  allPluginParamsIds: ['PP_LINES_CURVE', 'PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
  description: '弧線折線圖'
})
// export const PRESET_LINES_CURVES_WITH_SOLID_DOTS = createGridPreset({
//   chartParamsId: 'CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT',
//   allPluginParamsIds: ['PP_LINES_CURVE', 'PP_DOTS_SOLID', 'PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
//   description: '弧線折線圖及實心圓點'
// })
export const PRESET_LINES_HIGHLIGHT_GROUP_DOTS = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT',
  allPluginParamsIds: ['PP_DOTS_ONLY_SHOW_HIGHLIGHTED', 'PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
  description: '折線圖及Highlight Group圓點'
})

// -- multi-grid --
// 通用 - PRESET_MULTI_GRID_[name]
export const PRESET_MULTI_GRID_BASIC = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM_WITH_RECT_AND_LINE_LIST'],
  description: '基本MultiGrid參數'
})
export const PRESET_MULTI_GRID_2_GRID_SLOT = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING',
  dataFormatterId: 'DF_MULTI_GRID_2_GRID_SLOT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM'],
  description: '2組Grid圖表'
})
export const PRESET_MULTI_GRID_3_GRID_SLOT = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING',
  dataFormatterId: 'DF_MULTI_GRID_3_GRID_SLOT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM'],
  description: '3組Grid圖表'
})
export const PRESET_MULTI_GRID_4_GRID_SLOT = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING',
  dataFormatterId: 'DF_MULTI_GRID_4_GRID_SLOT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM'],
  description: '4組Grid圖表'
})
// MultiGridBars, MultiGridLines - PRESET_BARS_AND_LINES_[name]



// -- multi-value --

// -- relationship --

// -- tree --

