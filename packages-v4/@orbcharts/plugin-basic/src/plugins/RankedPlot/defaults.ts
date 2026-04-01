import type {
  RankedPlotPluginParams,
  RankedBubblesParams,
  RankedSeriesAxisParams,
  RankedCategoryAuxParams,
  RankedCategoryAxisParams,
  CategoryZoomParams
} from './types'
import { DEFAULT_CATEGORY_AXIS } from '../../const/sharedPluginParams'

export const DEFAULT_RANKED_PLOT_PARAMS: RankedPlotPluginParams = {
  styles: {
    padding: {
      top: 60,
      right: 60,
      bottom: 60,
      left: 200
    },
    highlightTarget: 'datum',
    highlightDefault: null,
    unhighlightedOpacity: 0.3,
    transitionDuration: 800,
    transitionEase: 'easeCubic'
  },
  visibleFilter: (datum) => true,
  categoryAxis: {
    ...DEFAULT_CATEGORY_AXIS,
    position: 'top',
  },
  rankedAxis: {
    label: '',
    limit: 'auto'
  },
  datasetIndex: 0
}
DEFAULT_RANKED_PLOT_PARAMS.visibleFilter.toString = () => '(datum) => true'

export const DEFAULT_RANKED_BUBBLES_PARAMS: RankedBubblesParams = {
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

export const DEFAULT_RANKED_SERIES_AXIS_PARAMS: RankedSeriesAxisParams = {
  axisLabel: {
    offset: [0, 0],
    colorType: 'primary'
  },
  seriesLabel: {
    padding: 20,
    colorType: 'primary'
  }
}

export const DEFAULT_RANKED_CATEGORY_AUX_PARAMS: RankedCategoryAuxParams = {
  showLine: true,
  showLabel: true,
  lineDashArray: '3, 3',
  lineColorType: 'primary',
  labelColorType: 'primary',
  labelTextColorType: 'background',
  labelTextFormat: text => text,
  labelPadding: 20
}
DEFAULT_RANKED_CATEGORY_AUX_PARAMS.labelTextFormat.toString = () => `text => text`

export const DEFAULT_RANKED_CATEGORY_AXIS_PARAMS: RankedCategoryAxisParams = {
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
DEFAULT_RANKED_CATEGORY_AXIS_PARAMS.tickFormat.toString = () => `text => text`

export const DEFAULT_CATEGORY_ZOOM_PARAMS: CategoryZoomParams = {}
