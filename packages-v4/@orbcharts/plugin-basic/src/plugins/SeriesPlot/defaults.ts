import type { BarsParams, BarsTriangleParams, DotsParams, SeriesPlotPluginParams, CategoryAuxParams, CategoryAxisParams, CategoryZoomParams, LineAreasParams, LinesParams, StackedBarsParams, StackedValueAxisParams, ValueAxisParams } from './types'
import { DEFAULT_CATEGORY_AXIS, DEFAULT_CONTAINER, DEFAULT_VALUE_AXIS } from '../../const/sharedPluginParams'

export const DEFAULT_SERIES_PLOT_PARAMS: SeriesPlotPluginParams = {
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
  valueAxis: { ...DEFAULT_VALUE_AXIS },
  categoryAxis: { ...DEFAULT_CATEGORY_AXIS},
  separateSeries: false,
  datasetIndex: 0
}
DEFAULT_SERIES_PLOT_PARAMS.visibleFilter.toString = () => '(datum) => true'

export const DEFAULT_LINES_PARAMS: LinesParams = {
  lineCurve: 'curveLinear',
  lineWidth: 2
}

export const DEFAULT_LINE_AREAS_PARAMS: LineAreasParams = {
  lineCurve: 'curveLinear',
  linearGradientOpacity: [1, 0]
}

export const DEFAULT_DOTS_PARAMS: DotsParams = {
  radius: 4,
  fillColorType: 'background',
  strokeColorType: 'data',
  strokeWidth: 2,
  // strokeWidthWhileHighlight: 3,
  onlyShowHighlighted: false
}

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

export const DEFAULT_BARS_PARAMS: BarsParams = {
  // barType: 'rect',
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 40,
  barRadius: false,
}

export const DEFAULT_BARS_DIVERGING_PARAMS: BarsParams = {
  ...DEFAULT_BARS_PARAMS
}

export const DEFAULT_STACKED_BARS_PARAMS: StackedBarsParams = {
  barWidth: 0,
  barGroupPadding: 10,
  barRadius: false,
}

export const DEFAULT_BARS_TRIANGLE_PARAMS: BarsTriangleParams = {
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 20,
  linearGradientOpacity: [1, 0]
}

export const DEFAULT_CATEGORY_AXIS_PARAMS: CategoryAxisParams = {
  // labelAnchor: 'start',
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
  tickTextColorType: 'primary',
}
DEFAULT_CATEGORY_AXIS_PARAMS.tickFormat.toString = () => `text => text`

export const DEFAULT_VALUE_AXIS_PARAMS: ValueAxisParams = {
  // labelAnchor: 'end',
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
  tickTextRotate: 0,
  tickTextColorType: 'primary'
}
DEFAULT_VALUE_AXIS_PARAMS.tickFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}`

export const DEFAULT_STACKED_VALUE_AXIS_PARAMS: StackedValueAxisParams = {
  ...DEFAULT_VALUE_AXIS_PARAMS
}

export const DEFAULT_CATEGORY_ZOOM_PARAMS: CategoryZoomParams = {

}
