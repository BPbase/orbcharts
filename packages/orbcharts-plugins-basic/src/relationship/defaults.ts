import type {
  ForceDirectedParams
} from '../../lib/plugins-basic-types'


export const DEFAULT_FORCE_DIRECTED_PARAMS: ForceDirectedParams = {
  node: {
    dotRadius: 6,
    dotFillColorType: 'series',
    dotStrokeColorType: 'series',
    dotStrokeWidth: 1,
    dotStyleFn: (node) => '',
    labelColorType: 'white',
    labelStyleFn: (node) => 'text-shadow:0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff'
  },
  edge: {
    arrowColorType: 'primary',
    arrowStrokeWidth: 2,
    arrowWidth: 10,
    arrowHeight: 10,
    arrowStyleFn: (node) => '',
    labelColorType: 'primary',
    labelStyleFn: (node) => ''
  },
  force: {
    strength: 0.08, // 泡泡引力
    velocityDecay: 0.3, // 衰減數
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
