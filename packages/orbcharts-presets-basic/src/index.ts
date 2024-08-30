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
export const PRESET_GRID_DIVERGING_SCALE = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING',
  dataFormatterId: 'DF_GRID_DIVERGING_SCALE',
  allPluginParamsIds: ['PP_GRID_LEGEND_BOTTOM'],
  description: '正負值分向圖'
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
  allPluginParamsIds: ['PP_BARS_ROUND', 'PP_GRID_LEGEND_BOTTOM_WITH_ROUND_LIST'],
  description: '圓角長條圖'
})
export const PRESET_BARS_HORIZONTAL_AND_ROUND = createGridPreset({
  chartParamsId: 'CP_BOTTOM_AND_LEFT_PADDING',
  dataFormatterId: 'DF_GRID_BOTTOM_VALUE_AXIS',
  allPluginParamsIds: ['PP_BARS_ROUND', 'PP_GRID_LEGEND_BOTTOM_WITH_ROUND_LIST'],
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
  allPluginParamsIds: ['PP_BARS_ROUND', 'PP_GRID_LEGEND_BOTTOM_WITH_ROUND_LIST'],
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
  description: '橫向折線圖'
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
// LineAreas - PRESET_LINE_AREAS_[name]
export const PRESET_LINE_AREAS_BASIC = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT',
  dataFormatterId: 'DF_GRID_NONE_GROUP_SCALE_PADDING',
  allPluginParamsIds: ['PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
  description: '基本Grid參數'
})
export const PRESET_LINE_AREAS_ROTATE_AXIS_LABEL = createGridPreset({
  chartParamsId: 'CP_BOTTOM_LONG_PADDING_WITH_SERIES_HIGHLIGHT',
  dataFormatterId: 'DF_GRID_NONE_GROUP_SCALE_PADDING',
  allPluginParamsIds: ['PP_GROUP_AXIS_ROTATE_LABEL', 'PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
  description: '傾斜標籤'
})
export const PRESET_LINE_AREAS_HORIZONTAL = createGridPreset({
  chartParamsId: 'CP_BOTTOM_AND_LEFT_PADDING_WITH_SERIES_HIGHLIGHT',
  dataFormatterId: 'DF_GRID_BOTTOM_VALUE_AXIS_AND_NONE_GROUP_SCALE_PADDING',
  allPluginParamsIds: ['PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
  description: '橫向折線圖'
})
export const PRESET_LINE_AREAS_CURVE = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT',
  dataFormatterId: 'DF_GRID_NONE_GROUP_SCALE_PADDING',
  allPluginParamsIds: ['PP_LINES_CURVE', 'PP_LINE_AREAS_CURVE', 'PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
  description: '弧線折線圖'
})
export const PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING_WITH_GROUP_HIGHLIGHT',
  dataFormatterId: 'DF_GRID_NONE_GROUP_SCALE_PADDING',
  allPluginParamsIds: ['PP_DOTS_ONLY_SHOW_HIGHLIGHTED', 'PP_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
  description: '折線圖及Highlight Group圓點'
})

// -- multi-grid --
// 通用 - PRESET_MULTI_GRID_[name]
export const PRESET_MULTI_GRID_BASIC = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM_WITH_RECT_AND_LINE_LIST'],
  description: '基本MultiGrid參數'
})
export const PRESET_MULTI_GRID_ROUND_STYLE = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM_WITH_ROUND_AND_LINE_LIST', 'PP_MULTI_BARS_ROUND', 'PP_MULTI_LINES_CURVE'],
  description: 'MultiGrid圓弧風格'
})
export const PRESET_MULTI_GRID_2_GRID_SLOT = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_LONG_PADDING',
  dataFormatterId: 'DF_MULTI_GRID_2_GRID_SLOT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM', 'PP_MULTI_GROUP_AXIS_2_GRID_SLOT', 'PP_MULTI_VALUE_AXIS_2_GRID_SLOT', 'PP_MULTI_BARS_2_GRID_SLOT', 'PP_MULTI_BAR_STACK_2_GRID_SLOT', 'PP_MULTI_BARS_TRIANGLE_2_GRID_SLOT', 'PP_MULTI_LINES_2_GRID_SLOT'],
  description: '2組Grid圖表'
})
export const PRESET_MULTI_GRID_3_GRID_SLOT = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_LONG_PADDING',
  dataFormatterId: 'DF_MULTI_GRID_3_GRID_SLOT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM', 'PP_MULTI_GROUP_AXIS_3_GRID_SLOT', 'PP_MULTI_VALUE_AXIS_3_GRID_SLOT', 'PP_MULTI_BARS_3_GRID_SLOT', 'PP_MULTI_BAR_STACK_3_GRID_SLOT', 'PP_MULTI_BARS_TRIANGLE_3_GRID_SLOT', 'PP_MULTI_LINES_3_GRID_SLOT'],
  description: '3組Grid圖表'
})
export const PRESET_MULTI_GRID_4_GRID_SLOT = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_LONG_PADDING',
  dataFormatterId: 'DF_MULTI_GRID_4_GRID_SLOT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM', 'PP_MULTI_GROUP_AXIS_4_GRID_SLOT', 'PP_MULTI_VALUE_AXIS_4_GRID_SLOT', 'PP_MULTI_BARS_4_GRID_SLOT', 'PP_MULTI_BAR_STACK_4_GRID_SLOT', 'PP_MULTI_BARS_TRIANGLE_4_GRID_SLOT', 'PP_MULTI_LINES_4_GRID_SLOT'],
  description: '4組Grid圖表'
})
// // MultiBars, MultiLines - PRESET_MULTI_BARS_MULTI_LINES_[name]
// export const PRESET_MULTI_BARS_MULTI_LINES_BASIC = createMultiGridPreset({
//   chartParamsId: 'CP_BOTTOM_PADDING_WITH_SERIES_HIGHLIGHT',
//   allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM_WITH_RECT_AND_LINE_LIST'],
//   description: '基本MultiGrid參數'
// })
// MultiLines - PRESET_MULTI_LINES_[name]
// export const PRESET_MULTI_LINES_BASIC = createMultiGridPreset({
//   chartParamsId: 'CP_BOTTOM_PADDING',
//   allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM_WITH_LINE_LIST'],
//   description: '基本MultiGrid參數'
// })
export const PRESET_MULTI_LINES_2_GRID_SLOT = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_LONG_PADDING',
  dataFormatterId: 'DF_MULTI_GRID_2_GRID_SLOT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM_WITH_LINE_LIST', 'PP_MULTI_GROUP_AXIS_2_GRID_SLOT', 'PP_MULTI_VALUE_AXIS_2_GRID_SLOT', 'PP_MULTI_BARS_2_GRID_SLOT', 'PP_MULTI_BAR_STACK_2_GRID_SLOT', 'PP_MULTI_BARS_TRIANGLE_2_GRID_SLOT', 'PP_MULTI_LINES_2_GRID_SLOT'],
  description: '2組折線圖表'
})
export const PRESET_MULTI_LINES_3_GRID_SLOT = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_LONG_PADDING',
  dataFormatterId: 'DF_MULTI_GRID_3_GRID_SLOT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM_WITH_LINE_LIST', 'PP_MULTI_GROUP_AXIS_3_GRID_SLOT', 'PP_MULTI_VALUE_AXIS_3_GRID_SLOT', 'PP_MULTI_BARS_3_GRID_SLOT', 'PP_MULTI_BAR_STACK_3_GRID_SLOT', 'PP_MULTI_BARS_TRIANGLE_3_GRID_SLOT', 'PP_MULTI_LINES_3_GRID_SLOT'],
  description: '3組折線圖表'
})
export const PRESET_MULTI_LINES_4_GRID_SLOT = createMultiGridPreset({
  chartParamsId: 'CP_BOTTOM_LONG_PADDING',
  dataFormatterId: 'DF_MULTI_GRID_4_GRID_SLOT',
  allPluginParamsIds: ['PP_MULTI_GRID_LEGEND_BOTTOM_WITH_LINE_LIST', 'PP_MULTI_GROUP_AXIS_4_GRID_SLOT', 'PP_MULTI_VALUE_AXIS_4_GRID_SLOT', 'PP_MULTI_BARS_4_GRID_SLOT', 'PP_MULTI_BAR_STACK_4_GRID_SLOT', 'PP_MULTI_BARS_TRIANGLE_4_GRID_SLOT', 'PP_MULTI_LINES_4_GRID_SLOT'],
  description: '4組折線圖表'
})

// -- multi-value --

// -- relationship --

// -- tree --
// 通用 - PRESET_TREE_[name]
export const PRESET_TREE_BASIC = createTreePreset({
  chartParamsId: 'CP_BOTTOM_SLIGHT_PADDING',
  allPluginParamsIds: ['PP_TREE_LEGEND_BOTTOM'],
  description: '基本Tree參數'
})