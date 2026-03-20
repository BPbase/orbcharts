import type { IndicatorParams, PieEventTextsParams, PieLabelsParams, RoseLabelsParams, RoseParams, CompositionPlotPluginParams, } from './types'
import type { EventData, ModelDatumSeries } from '../../../../core/src/types'
import type { BubblesParams, PieParams } from './types'

export const DEFAULT_SERIES_SEPARABLE_GRAPHIC_PLUGIN_PARAMS: CompositionPlotPluginParams = {
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
DEFAULT_SERIES_SEPARABLE_GRAPHIC_PLUGIN_PARAMS.visibleFilter.toString = () => '(datum) => true'

export const DEFAULT_BUBBLES_PARAMS: BubblesParams = {
  force: {
    strength: 0.08, // 泡泡引力
    velocityDecay: 0.3, // 衰減數
    collisionSpacing: 2 // 泡泡間距
  },
  bubbleLabel: {
    labelFn: d => String(d.name),
    colorType: 'dataContrast',
    fillRate: 0.6,
    lineHeight: 1,
    maxLineLength: 6,
    wordBreakAll: true,
  },
  // highlightRIncrease: 0,
  arcScaleType: 'area'
}
DEFAULT_BUBBLES_PARAMS.bubbleLabel.labelFn.toString = () => `d => String(d.name)`

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


export const DEFAULT_PIE_EVENT_TEXTS_PARAMS: PieEventTextsParams = {
  renderFn: (eventData: EventData) => {
    if (eventData.eventName === 'mouseover' || eventData.eventName === 'mousemove') {
      return [String(eventData.target!.value)]
    }
    return [
      // String(
      //   Math.round(
      //     eventData.data.reduce((acc, seriesData) => {
      //       return acc + seriesData.reduce((_acc, data) => {
      //         return _acc + (data.value ?? 0)
      //       }, 0)
      //     }, 0) * (eventData.tween ?? 1)
      //   )
      // )
    ]
  },
  textAttrs: [
    {
      "transform": "translate(0, 0)"
    }
  ],
  textStyles: [
    {
      "font-weight": "bold",
      "text-anchor": "middle",
      "pointer-events": "none",
      "dominant-baseline": "middle",
      "font-size": 64,
      "fill": "#000"
    }
  ]
}
DEFAULT_PIE_EVENT_TEXTS_PARAMS.renderFn.toString = () => `(eventData) => {
  if (eventData.eventName === 'mouseover' || eventData.eventName === 'mousemove') {
    return [String(eventData.target.value)]
  }
  return [
    String(
      Math.round(
        eventData.data.reduce((acc, seriesData) => {
          return acc + seriesData.reduce((_acc, data) => {
            return _acc + (data.value ?? 0)
          }, 0)
        }, 0) * (eventData.tween ?? 1)
      )
    )
  ]
}`

export const DEFAULT_PIE_LABELS_PARAMS: PieLabelsParams = {
  // solidColor: undefined,
  // colors: DEFAULT_COLORS,
  outerRadius: 0.85,
  outerRadiusWhileHighlight: 0.9,
  // innerRadius: 0,
  // enterDuration: 800,
  startAngle: 0,
  endAngle: Math.PI * 2,
  labelCentroid: 2.1,
  // fontSize: 12,
  labelColorType: 'primary',
  labelFn: d => String(d.name),
}
DEFAULT_PIE_LABELS_PARAMS.labelFn.toString = () => `d => String(d.name)`

export const DEFAULT_ROSE_PARAMS: RoseParams = {
  outerRadius: 0.95,
  padAngle: 0,
  strokeColorType: 'background',
  strokeWidth: 0.5,
  cornerRadius: 0,
  arcScaleType: 'area',
  angleIncreaseWhileHighlight: 0.05
}

export const DEFAULT_ROSE_LABELS_PARAMS: RoseLabelsParams = {
  outerRadius: 0.95,
  labelCentroid: 2.1,
  labelFn: d => String(d.name),
  labelColorType: 'primary',
  arcScaleType: 'area'
}
DEFAULT_ROSE_LABELS_PARAMS.labelFn.toString = () => `d => String(d.name)`

export const DEFAULT_INDICATOR_PARAMS: IndicatorParams = {
  // startAngle: 0,
  // endAngle: Math.PI * 2,
  startAngle: - Math.PI / 2,
  endAngle: Math.PI / 2,
  radius: 0.6,
  indicatorType: 'needle',
  size: 10,
  colorType: 'data',
  // autoHighlight: false,
  value: 0,
}