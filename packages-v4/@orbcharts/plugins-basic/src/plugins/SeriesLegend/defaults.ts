import type { SeriesLegendParams, SeriesLegendPluginParams } from './types'

export const DEFAULT_SERIES_LEGEND_PLUGIN_PARAMS: SeriesLegendPluginParams = {
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
    transitionEase: 'easeCubic'
  },
  visibleFilter: (datum) => true,
  sort: null,
  datasetIndex: 0
}
DEFAULT_SERIES_LEGEND_PLUGIN_PARAMS.visibleFilter.toString = () => '(datum) => true'

export const DEFAULT_SERIES_LEGEND_PARAMS: SeriesLegendParams = {
  // position: 'right',
  // justify: 'end',
  placement: 'right-end',
  padding: 28,
  // offset: [0, 0],
  backgroundFill: 'none',
  backgroundStroke: 'none',
  gap: 10,
  listRectWidth: 14,
  listRectHeight: 14,
  listRectRadius: 0,
  // highlightEvent: false
  textColorType: 'primary'
}
