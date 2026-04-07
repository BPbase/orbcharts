import type {
  RacingPlotPluginParams,
  RacingPlotRacingBarParams,
  RacingPlotValueLabelParams,
  RacingPlotSeriesLabelParams,
  RacingPlotCounterTextParams,
  RacingPlotValueAxisParams
} from './types'

export const DEFAULT_RACING_PLOT_PLUGIN_PARAMS: RacingPlotPluginParams = {
  styles: {
    padding: {
      top: 60,
      right: 60,
      bottom: 60,
      left: 60
    },
    highlightTarget: 'datum',
    highlightDefault: null,
    unhighlightedOpacity: 0.3,
    transitionDuration: 800,
    transitionEase: 'easeLinear'
  },
  visibleFilter: (datum) => true,
  datasetIndex: 0,
  valueAxis: {
    position: 'top'
  },
  rankedAxis: {
    label: '',
    limit: 'auto'
  },
  autorun: true,
  loop: false,
  frameInterval: 1000
}
DEFAULT_RACING_PLOT_PLUGIN_PARAMS.visibleFilter.toString = () => '(datum) => true'

export const DEFAULT_RACING_PLOT_RACING_BAR_PARAMS: RacingPlotRacingBarParams = {
  barWidth: null,
  barPadding: 4,
  barRadius: 4
}

export const DEFAULT_RACING_PLOT_VALUE_LABEL_PARAMS: RacingPlotValueLabelParams = {
  padding: 8,
  colorType: 'primary',
  format: text => text
}
;(DEFAULT_RACING_PLOT_VALUE_LABEL_PARAMS.format as Function).toString = () => 'text => text'

export const DEFAULT_RACING_PLOT_SERIES_LABEL_PARAMS: RacingPlotSeriesLabelParams = {
  axisLabel: {
    offset: [0, 0],
    colorType: 'primary'
  },
  seriesLabel: {
    position: 'inside-right',
    padding: 20,
    colorType: 'dataContrast'
  }
}

export const DEFAULT_RACING_PLOT_COUNTER_TEXT_PARAMS: RacingPlotCounterTextParams = {
  renderFn: (categoryLabel, frameIndex, data) => categoryLabel,
  textAttrs: [{}],
  textStyles: [{ 'font-size': '3em', 'font-weight': 'bold' }],
  paddingRight: 0,
  paddingBottom: 0
}
;(DEFAULT_RACING_PLOT_COUNTER_TEXT_PARAMS.renderFn as Function).toString = () =>
  '(categoryLabel, frameIndex, data) => categoryLabel'

export const DEFAULT_RACING_PLOT_VALUE_AXIS_PARAMS: RacingPlotValueAxisParams = {
  labelOffset: [0, 0],
  labelColorType: 'primary',
  axisLineVisible: true,
  axisLineColorType: 'primary',
  ticks: null,
  tickFormat: text => text,
  tickLineVisible: true,
  tickPadding: 20,
  tickFullLine: true,
  tickFullLineDasharray: 'none',
  tickColorType: 'secondary',
  tickTextColorType: 'primary'
}
;(DEFAULT_RACING_PLOT_VALUE_AXIS_PARAMS.tickFormat as Function).toString = () => 'text => text'
