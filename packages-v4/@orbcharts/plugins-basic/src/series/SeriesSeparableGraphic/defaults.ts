import type { SeriesSeparableGraphicPluginParams } from './types'
import type { ModelDatumSeries } from '../../../../core/src/types'
import type { PieParams } from './types'

export const DEFAULT_SERIES_SEPARABLE_GRAPHIC_PARAMS: SeriesSeparableGraphicPluginParams = {
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
  visibleFilter: (datum: ModelDatumSeries) => true,
  sort: null,
  // seriesLabels: [],
  container: {
    columnAmount: 1,
    rowAmount: 1,
    columnGap: 'auto',
    rowGap: 'auto',
  },
  separateSeries: false,
  separateName: false,
  // sumSeries: false,
  datasetIndex: 0
}
DEFAULT_SERIES_SEPARABLE_GRAPHIC_PARAMS.visibleFilter.toString = () => '(datum) => true'

export const DEFAULT_PIE_PARAMS: PieParams = {
  outerRadius: 0.85,
  innerRadius: 0,
  outerRadiusWhileHighlight: 0.9,
  startAngle: 0,
  endAngle: Math.PI * 2,
  padAngle: 0,
  strokeColorType: 'background',
  strokeWidth: 1,
  // padRadius: 100,
  cornerRadius: 0,
}

