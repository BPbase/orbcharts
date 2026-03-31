import type {
  TreeMapParams
} from './types'
import { HierarchyPlotPluginParams } from './types'

export const DEFAULT_HIERARCHY_PLOT_PARAMS: HierarchyPlotPluginParams = {
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
  visibleFilter: (datum) => true,
  datasetIndex: 0
}

export const DEFAULT_TREE_MAP_PARAMS: TreeMapParams = {
  paddingInner: 2,
  paddingOuter: 2,
  labelColorType: 'dataContrast',
  squarifyRatio: 1.618034, // 黃金比例
  sort: (a, b) => b.value - a.value
}
DEFAULT_TREE_MAP_PARAMS.sort.toString = () => `(a, b) => b.value - a.value`