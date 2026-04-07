import type { PartitionPlotBubbleParams, PartitionPlotPieEventTextParams, PartitionPlotPieLabelParams, PartitionPlotRoseLabelParams, PartitionPlotRoseParams, PartitionPlotPluginParams, PartitionPlotPieParams, PartitionPlotIndicatorParams, } from './types'
import type { EventData, ModelDatumSeries } from '@orbcharts/core'
import { DEFAULT_CONTAINER } from '../../const/sharedPluginParams'

export const DEFAULT_PARTITION_PLOT_PLUGIN_PARAMS: PartitionPlotPluginParams = {
  styles: {
    padding: {
      top: 20,
      right: 20,
      bottom: 60,
      left: 20
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
    ...DEFAULT_CONTAINER
  },
  separateSeries: false,
  separateName: false,
  // sumSeries: false,
  datasetIndex: 0
}
DEFAULT_PARTITION_PLOT_PLUGIN_PARAMS.visibleFilter.toString = () => '(datum) => true'

export const DEFAULT_PARTITION_PLOT_BUBBLE_PARAMS: PartitionPlotBubbleParams = {
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
DEFAULT_PARTITION_PLOT_BUBBLE_PARAMS.bubbleLabel.labelFn.toString = () => `d => String(d.name)`

export const DEFAULT_PIE_PARAMS: PartitionPlotPieParams = {
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


export const DEFAULT_PARTITION_PLOT_PIE_EVENT_TEXT_PARAMS: PartitionPlotPieEventTextParams = {
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
DEFAULT_PARTITION_PLOT_PIE_EVENT_TEXT_PARAMS.renderFn.toString = () => `(eventData) => {
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

export const DEFAULT_PARTITION_PLOT_PIE_LABEL_PARAMS: PartitionPlotPieLabelParams = {
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
DEFAULT_PARTITION_PLOT_PIE_LABEL_PARAMS.labelFn.toString = () => `d => String(d.name)`

export const DEFAULT_ROSE_PARAMS: PartitionPlotRoseParams = {
  outerRadius: 0.95,
  padAngle: 0,
  strokeColorType: 'background',
  strokeWidth: 0.5,
  cornerRadius: 0,
  arcScaleType: 'area',
  angleIncreaseWhileHighlight: 0.05
}

export const DEFAULT_PARTITION_PLOT_ROSE_LABEL_PARAMS: PartitionPlotRoseLabelParams = {
  outerRadius: 0.95,
  labelCentroid: 2.1,
  labelFn: d => String(d.name),
  labelColorType: 'primary',
  arcScaleType: 'area'
}
DEFAULT_PARTITION_PLOT_ROSE_LABEL_PARAMS.labelFn.toString = () => `d => String(d.name)`

export const DEFAULT_PARTITION_PLOT_INDICATOR_PARAMS: PartitionPlotIndicatorParams = {
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