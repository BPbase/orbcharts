import {
  createSeriesPreset,
  createGridPreset,
  createMultiGridPreset,
  createMultiValuePreset,
  createRelationshipPreset,
  createTreePreset } from './createPreset'

// -- series --
// Bubbles
// Pie

// -- grid
// Bars
export const PRESET_BARS_ROUND = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING',
  allPluginParamsIds: ['PP_BARS_ROUND'],
  description: '圓角長條圖'
})
export const PRESET_BARS_THIN = createGridPreset({
  chartParamsId: 'CP_BOTTOM_PADDING',
  allPluginParamsIds: ['PP_BARS_THIN'],
  description: '細長條圖'
})