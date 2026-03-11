import type { Container, CategoryAxis, ValueAxis, XYAxis } from '../types/PluginParams'

export const DEFAULT_VALUE_AXIS: ValueAxis = {
  position: 'left',
  scaleDomain: ['auto', 'auto'],
  scaleRange: [0, 0.9],
  label: '',
}

export const DEFAULT_CATEGORY_AXIS: CategoryAxis = {
  position: 'bottom',
  scaleDomain: [0, 'max'],
  scalePadding: 0.5,
  label: ''
}

export const DEFAULT_X_Y_AXIS: XYAxis = {
  scaleDomain: ['auto', 'auto'],
  scaleRange: [0, 0.9],
  label: '',
  valueIndex: 0
}

export const DEFAULT_CONTAINER: Container = {
  columnAmount: 1,
  rowAmount: 1,
  columnGap: 'auto',
  rowGap: 'auto'
}