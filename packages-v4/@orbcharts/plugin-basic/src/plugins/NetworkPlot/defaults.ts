import type {
  ForceDirectedParams,
  ForceDirectedBubbleParams,
} from './types'
import { NetworkPlotPluginParams } from './types'

export const DEFAULT_NETWORK_PLOT_PLUGIN_PARAMS: NetworkPlotPluginParams = {
  styles: {
    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    highlightTarget: 'datum',
    highlightDefault: null,
    unhighlightedOpacity: 0.3,
    transitionDuration: 800,
    transitionEase: 'easeCubic'
  },
  visibleFilter: (datum) => true,
  datasetIndex: 0
}

export const DEFAULT_NETWORK_PLOT_FORCE_DIRECTED_PARAMS: ForceDirectedParams = {
  // node: {
  //   pointRadius: 10,
  //   pointFillColorType: 'label',
  //   pointStrokeColorType: 'label',
  //   pointStrokeWidth: 1,
  //   pointStyleFn: (node) => '',
  //   labelColorType: 'primary',
  //   labelSizeFixed: false,
  //   labelStyleFn: (node) => 'text-shadow:0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff'
  // },
  // edge: {
  //   arrowColorType: 'primary',
  //   arrowStrokeWidth: 1.5,
  //   arrowWidth: 5,
  //   arrowHeight: 5,
  //   arrowStyleFn: (node) => '',
  //   labelColorType: 'secondary',
  //   labelSizeFixed: false,
  //   labelStyleFn: (node) => ''
  // },
  point: {
    radius: 10,
    fillColorType: 'data',
    strokeColorType: 'data',
    strokeWidth: 1,
    styleFn: (node) => '',
  },
  pointLabel: {
    colorType: 'primary',
    sizeFixed: false,
    // styleFn: (node) => 'text-shadow:0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff'
    styleFn: (node) => ''
  },
  arrow: {
    colorType: 'primary',
    strokeWidth: 1.5,
    pointerWidth: 5,
    pointerHeight: 5,
    styleFn: (node) => '',
  },
  arrowLabel: {
    colorType: 'primary',
    sizeFixed: false,
    styleFn: (node) => ''
  },
  force: {
    nodeStrength: -500, // 泡泡引力
    linkDistance: 100, // 連結長度
    velocityDecay: 0.1, // 衰減數
    alphaDecay: 0.05
    // collisionSpacing: 2 // 泡泡間距
  },
  zoomable: true,
  transform: {
    x: 0,
    y: 0,
    k: 1
  },
  scaleExtent: {
    min: 0,
    max: Infinity
  }
}
DEFAULT_NETWORK_PLOT_FORCE_DIRECTED_PARAMS.point.styleFn.toString = () => `(node) => ''`
DEFAULT_NETWORK_PLOT_FORCE_DIRECTED_PARAMS.pointLabel.styleFn.toString = () => `(node) => ''`
DEFAULT_NETWORK_PLOT_FORCE_DIRECTED_PARAMS.arrow.styleFn.toString = () => `(edge) => ''`
DEFAULT_NETWORK_PLOT_FORCE_DIRECTED_PARAMS.arrowLabel.styleFn.toString = () => `(edge) => ''`

export const DEFAULT_NETWORK_PLOT_FORCE_DIRECTED_BUBBLE_PARAMS: ForceDirectedBubbleParams = {
  bubble: {
    radiusMin: 15,
    radiusMax: 45,
    arcScaleType: 'area',
    fillColorType: 'data',
    strokeColorType: 'data',
    strokeWidth: 1,
    styleFn: (node) => '',
  },
  bubbleLabel: {
    fillRate: 0.9,
    lineHeight: 1,
    maxLineLength: 6,
    wordBreakAll: true,
    colorType: 'dataContrast',
    styleFn: (node) => ''
  },
  arrow: {
    colorType: 'primary',
    strokeWidthMin: 1.5,
    strokeWidthMax: 4.5,
    pointerWidth: 5,
    pointerHeight: 5,
    styleFn: (node) => '',
  },
  arrowLabel: {
    colorType: 'primary',
    sizeFixed: false,
    styleFn: (node) => ''
  },
  force: {
    nodeStrength: -500, // 泡泡引力
    linkDistance: 130, // 連結長度
    velocityDecay: 0.1, // 衰減數
    alphaDecay: 0.05
    // collisionSpacing: 2 // 泡泡間距
  },
  zoomable: true,
  transform: {
    x: 0,
    y: 0,
    k: 1
  },
  scaleExtent: {
    min: 0,
    max: Infinity
  }
}
DEFAULT_NETWORK_PLOT_FORCE_DIRECTED_BUBBLE_PARAMS.bubble.styleFn.toString = () => `(node) => ''`
DEFAULT_NETWORK_PLOT_FORCE_DIRECTED_BUBBLE_PARAMS.bubbleLabel.styleFn.toString = () => `(node) => ''`
DEFAULT_NETWORK_PLOT_FORCE_DIRECTED_BUBBLE_PARAMS.arrow.styleFn.toString = () => `(edge) => ''`
DEFAULT_NETWORK_PLOT_FORCE_DIRECTED_BUBBLE_PARAMS.arrowLabel.styleFn.toString = () => `(edge) => ''`

