
import { Observable, Subject } from 'rxjs'
import type { ColorType, ModelDatumSeries, EventData } from '../../../../core/src/types'
import type { AxisPosition, ContainerPosition, ContainerPositionScaled, Container, GraphicStyles, Layout, VisibleFilter, XYAxis, CategoryAxis } from '../../types/PluginParams'
import type { ComputedData, ComputedDatumTree } from '../../types/'

export interface HierarchyPlotExtendContext {
  layout$: Observable<Layout>
  computedData$: Observable<ComputedData<'tree'>>
  fontSizePx$: Observable<number>
  treeHighlight$: Observable<ComputedDatumTree[]>
  categoryLabels$: Observable<string[]>
  CategoryDataMap$: Observable<Map<string, ComputedDatumTree[]>>
  visibleComputedData$: Observable<ComputedData<'tree'>>
}

// plugin params
export interface HierarchyPlotPluginParams {
  styles: GraphicStyles
  visibleFilter: VisibleFilter<'grid'>
  datasetIndex: number
}

// all layer params
export interface HierarchyPlotAllLayerParams {
  TreeMap: TreeMapParams
}

// -- layer params --
export interface TreeMapParams {
  paddingInner: number
  paddingOuter: number
  labelColorType: ColorType
  squarifyRatio: number
  sort: (a: ComputedDatumTree, b: ComputedDatumTree) => number
}
