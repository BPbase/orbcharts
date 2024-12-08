import type {
  ScatterParams,
  MultiValueAxesParams
} from '../../lib/plugins-basic-types'

export const DEFAULT_SCATTER_PARAMS: ScatterParams = {
  radius: 4,
  fillColorType: 'series',
  strokeColorType: 'series',
  strokeWidth: 2,
}

export const DEFAULT_MULTI_VALUE_AXES_PARAMS: MultiValueAxesParams = {
  xAxis: {
    labelOffset: [0, 0],
    labelColorType: 'primary',
    axisLineVisible: false,
    axisLineColorType: 'primary',
    ticks: null,
    tickFormat: ',.0f',
    tickLineVisible: true,
    tickPadding: 20,
    tickFullLine: true,
    tickFullLineDasharray: 'none',
    tickColorType: 'secondary',
    tickTextColorType: 'primary'
  },
  yAxis: {
    labelOffset: [0, 0],
    labelColorType: 'primary',
    axisLineVisible: false,
    axisLineColorType: 'primary',
    ticks: null,
    tickFormat: ',.0f',
    tickLineVisible: true,
    tickPadding: 20,
    tickFullLine: true,
    tickFullLineDasharray: 'none',
    tickColorType: 'secondary',
    tickTextColorType: 'primary'
  }
}