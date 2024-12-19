import type {
  ForceDirectedParams
} from '../../lib/plugins-basic-types'


export const DEFAULT_FORCE_DIRECTED_PARAMS: ForceDirectedParams = {
  node: {
    dotRadius: 10,
    dotFillColorType: 'series',
    dotStrokeColorType: 'series',
    dotStrokeWidth: 1,
    dotStyleFn: (node) => '',
    labelColorType: 'primary',
    labelSizeFixed: false,
    labelStyleFn: (node) => 'text-shadow:0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff'
  },
  edge: {
    arrowColorType: 'primary',
    arrowStrokeWidth: 1.5,
    arrowWidth: 5,
    arrowHeight: 5,
    arrowStyleFn: (node) => '',
    labelColorType: 'primary',
    labelSizeFixed: false,
    labelStyleFn: (node) => ''
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
