import type {
  RacingPlotPluginParams,
  RacingBarsParams,
  RacingValueLabelsParams,
  RacingSeriesLabelsParams,
  CounterTextParams,
  ValueAxisParams
} from './types'

export const DEFAULT_RACING_PLOT_PARAMS: RacingPlotPluginParams = {
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
DEFAULT_RACING_PLOT_PARAMS.visibleFilter.toString = () => '(datum) => true'

export const DEFAULT_RACING_BARS_PARAMS: RacingBarsParams = {
  bar: {
    barWidth: null,
    barPadding: 4,
    barRadius: 4
  }
}

export const DEFAULT_RACING_VALUE_LABELS_PARAMS: RacingValueLabelsParams = {
  valueLabel: {
    padding: 8,
    colorType: 'primary',
    format: text => text
  }
}
;(DEFAULT_RACING_VALUE_LABELS_PARAMS.valueLabel.format as Function).toString = () => 'text => text'

export const DEFAULT_RACING_SERIES_LABELS_PARAMS: RacingSeriesLabelsParams = {
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

export const DEFAULT_COUNTER_TEXT_PARAMS: CounterTextParams = {
  renderFn: (categoryLabel, frameIndex, data) => categoryLabel,
  textAttrs: [{}],
  textStyles: [{ 'font-size': '3em', 'font-weight': 'bold' }],
  paddingRight: 0,
  paddingBottom: 0
}
DEFAULT_COUNTER_TEXT_PARAMS.renderFn.toString = () =>
  '(categoryLabel, frameIndex, data) => categoryLabel'

export const DEFAULT_VALUE_AXIS_PARAMS: ValueAxisParams = {
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
;(DEFAULT_VALUE_AXIS_PARAMS.tickFormat as Function).toString = () => 'text => text'
