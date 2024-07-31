import {
  createSeriesPreset,
  createGridPreset,
  createMultiGridPreset,
  createMultiValuePreset,
  createRelationshipPreset,
  createTreePreset } from './createPreset'

export const PRESET_ROUND_BARS = createGridPreset({
  chartParamsId: 'CHART_PARAMS_RIGHT_PADDING',
  allPluginParamsIds: ['BARS_ROUND_PLUGIN_PARAMS']
})
