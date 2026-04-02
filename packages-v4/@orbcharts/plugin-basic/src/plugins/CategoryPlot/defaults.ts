import type {
  CategoryPlotPluginParams,
  RaisedBubblesParams,
  CategoryPlotCategoryAxisParams,
  CategoryPlotValueAxisParams,
  CategoryZoomParams,
  CategoryAuxParams
} from './types'
import { DEFAULT_VALUE_AXIS } from '../../const/sharedPluginParams'

export const DEFAULT_CATEGORY_PLOT_PARAMS: CategoryPlotPluginParams = {
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
  position: 'left',
  categoryAxis: {
    scaleDomain: [0, 'max'],
    scalePadding: 0.5,
    label: ''
  },
  valueAxis: { ...DEFAULT_VALUE_AXIS },
  datasetIndex: 0
}
DEFAULT_CATEGORY_PLOT_PARAMS.visibleFilter.toString = () => '(datum) => true'

export const DEFAULT_RAISED_BUBBLES_PARAMS: RaisedBubblesParams = {
  bubble: {
    sizeAdjust: 0.8,
    arcScaleType: 'area',
    valueLinearOpacity: [0.5, 1],
    showZeroValue: false
  },
  itemLabel: {
    padding: 6,
    colorType: 'primary'
  }
}

export const DEFAULT_CATEGORY_PLOT_CATEGORY_AXIS_PARAMS: CategoryPlotCategoryAxisParams = {
  labelOffset: [0, 0],
  labelColorType: 'primary',
  axisLineVisible: true,
  axisLineColorType: 'primary',
  ticks: 'all',
  tickFormat: text => text,
  tickLineVisible: true,
  tickPadding: 20,
  tickFullLine: false,
  tickFullLineDasharray: 'none',
  tickColorType: 'secondary',
  tickTextRotate: 0,
  tickTextColorType: 'primary'
}
DEFAULT_CATEGORY_PLOT_CATEGORY_AXIS_PARAMS.tickFormat.toString = () => `text => text`

export const DEFAULT_CATEGORY_PLOT_VALUE_AXIS_PARAMS: CategoryPlotValueAxisParams = {
  labelOffset: [0, 0],
  labelColorType: 'primary',
  axisLineVisible: false,
  axisLineColorType: 'primary',
  ticks: null,
  tickFormat: num => {
    if (num === null || Number.isNaN(num) == true) {
      return (num as any) || 0
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
  tickTextRotate: 0,
  tickTextColorType: 'primary'
}
DEFAULT_CATEGORY_PLOT_VALUE_AXIS_PARAMS.tickFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',')
  return parts.join('.')
}`

export const DEFAULT_CATEGORY_ZOOM_PARAMS: CategoryZoomParams = {}

export const DEFAULT_CATEGORY_AUX_PARAMS: CategoryAuxParams = {
  showLine: true,
  showLabel: true,
  lineDashArray: '3, 3',
  lineColorType: 'primary',
  labelColorType: 'primary',
  labelTextColorType: 'background',
  labelTextFormat: text => text,
  labelPadding: 20,
  labelRotate: 0
}
DEFAULT_CATEGORY_AUX_PARAMS.labelTextFormat.toString = () => `text => text`
