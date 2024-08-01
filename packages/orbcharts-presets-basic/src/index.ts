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
  chartParamsId: 'CHART_PARAMS_BOTTOM_PADDING',
  allPluginParamsIds: ['BARS_ROUND_PLUGIN_PARAMS'],
  description: ''
})
