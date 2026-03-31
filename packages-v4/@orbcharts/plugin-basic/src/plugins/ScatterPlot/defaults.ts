import type { ScatterPlotPluginParams, XZoomParams, XYAxesParams, XYAuxParams, ScatterBubblesParams, ScatterParams } from './types'
import { DEFAULT_X_Y_AXIS, DEFAULT_CONTAINER } from '../../const/sharedPluginParams'

export const DEFAULT_SCATTER_PLOT_PARAMS: ScatterPlotPluginParams = {
  styles: {
    padding: {
      top: 20,
      right: 60,
      bottom: 80,
      left: 60
    },
    highlightTarget: 'datum',
    highlightDefault: null,
    unhighlightedOpacity: 0.3,
    transitionDuration: 800,
    transitionEase: 'easeCubic'
  },
  visibleFilter: (datum) => true,
  container: { ...DEFAULT_CONTAINER },
  xAxis: { ...DEFAULT_X_Y_AXIS },
  yAxis: { ...DEFAULT_X_Y_AXIS },
  separateSeries: false,
  datasetIndex: 0
}
DEFAULT_SCATTER_PLOT_PARAMS.visibleFilter.toString = () => '(datum) => true'


export const DEFAULT_SCATTER_PARAMS: ScatterParams = {
  radius: 5,
  fillColorType: 'data',
  strokeColorType: 'data',
  strokeWidth: 0,
}

export const DEFAULT_SCATTER_BUBBLES_PARAMS: ScatterBubblesParams = {
  // radius: 5,
  fillColorType: 'data',
  strokeColorType: 'data',
  strokeWidth: 0,
  valueLinearOpacity: [0.8, 0.8],
  arcScaleType: 'area',
  sizeAdjust: 0.5
}

export const DEFAULT_X_Y_AUX_PARAMS: XYAuxParams = {
  xAxis: {
    showLine: true,
    showLabel: true,
    lineDashArray: '3, 3',
    lineColorType: 'primary',
    labelColorType: 'primary',
    labelTextColorType: 'background',
    // labelTextFormat: text => text,
    // labelTextFormat: (value: number) => String(Math.round(value)),
    labelTextFormat: num => {
      if (num === null || Number.isNaN(num) == true) {
        return num || 0
      }
      const absNum = Math.abs(num)
      if (absNum > 0 && absNum < 1) {
        const strNum = num.toString()
        const match = strNum.match(/0\.(0*)([1-9])/)
        if (match) {
            const precision = match[1].length + 1
            return num.toFixed(precision)
        }
        return num.toString()
      }
      const parts = num.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts[0]
    },
    labelPadding: 20,
    // labelRotate: 0
  },
  yAxis: {
    showLine: true,
    showLabel: true,
    lineDashArray: '3, 3',
    lineColorType: 'primary',
    labelColorType: 'primary',
    labelTextColorType: 'background',
    // labelTextFormat: text => text,
    // labelTextFormat: (value: number) => String(Math.round(value)),
    labelTextFormat: num => {
      if (num === null || Number.isNaN(num) == true) {
        return num || 0
      }
      const absNum = Math.abs(num)
      if (absNum > 0 && absNum < 1) {
        const strNum = num.toString()
        const match = strNum.match(/0\.(0*)([1-9])/)
        if (match) {
            const precision = match[1].length + 1
            return num.toFixed(precision)
        }
        return num.toString()
      }
      const parts = num.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts[0]
    },
    labelPadding: 20,
    // labelRotate: 0
  }
}
DEFAULT_X_Y_AUX_PARAMS.xAxis.labelTextFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const absNum = Math.abs(num)
  if (absNum > 0 && absNum < 1) {
    const strNum = num.toString()
    const match = strNum.match(/0\.(0*)([1-9])/)
    if (match) {
        const precision = match[1].length + 1
        return num.toFixed(precision)
    }
    return num.toString()
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts[0]
}`
DEFAULT_X_Y_AUX_PARAMS.yAxis.labelTextFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const absNum = Math.abs(num)
  if (absNum > 0 && absNum < 1) {
    const strNum = num.toString()
    const match = strNum.match(/0\.(0*)([1-9])/)
    if (match) {
        const precision = match[1].length + 1
        return num.toFixed(precision)
    }
    return num.toString()
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts[0]
}`


export const DEFAULT_X_Y_AXES_PARAMS: XYAxesParams = {
  xAxis: {
    labelOffset: [0, 0],
    labelColorType: 'primary',
    axisLineVisible: false,
    axisLineColorType: 'primary',
    ticks: null,
    // tickFormat: ',.0f',
    // tickFormat: v => v,
    tickFormat: num => {
      if (num === null || Number.isNaN(num) == true) {
        return num || 0
      }
      const parts = num.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    },
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
    // tickFormat: ',.0f',
    // tickFormat: v => v,
    tickFormat: num => {
      if (num === null || Number.isNaN(num) == true) {
        return num || 0
      }
      const parts = num.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    },
    tickLineVisible: true,
    tickPadding: 20,
    tickFullLine: true,
    tickFullLineDasharray: 'none',
    tickColorType: 'secondary',
    tickTextColorType: 'primary'
  }
}
DEFAULT_X_Y_AXES_PARAMS.xAxis.tickFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}`
DEFAULT_X_Y_AXES_PARAMS.yAxis.tickFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}`

export const DEFAULT_X_ZOOM_PARAMS: XZoomParams = {

}
