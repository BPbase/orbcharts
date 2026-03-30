import type { ModelType, RenderDatumGraphEdge } from '../../../core/src/types'
import type {
  ModelDatumBase,
  ModelDatumSeries,
  ModelDatumGrid,
  ModelDatumMultivariate,
  ModelDatumGraphNode,
  ModelDatumGraphEdge,
  ModelDatumTree,
  RenderDatumBase,
} from '../../../core/src/types'


export interface ComputedDatumSeries extends RenderDatumBase<'series'> {
  visible: boolean
  seq: number
}

export interface ComputedDatumGrid extends RenderDatumBase<'grid'> {
  visible: boolean
}

export interface ComputedDatumMultivariate extends RenderDatumBase<'multivariate'> {
  visible: boolean
}

export interface ComputedDatumGraphNode extends RenderDatumBase<'graph'> {
  visible: boolean
}

export interface ComputedDatumGraphEdge extends RenderDatumGraphEdge {
  visible: boolean
}

export interface ComputedDatumTree extends RenderDatumBase<'tree'> {
  visible: boolean
  children: ComputedDatumTree[]
}

export type ComputedDatum<T extends ModelType> = T extends 'series' ? ComputedDatumSeries
  : T extends 'grid' ? ComputedDatumGrid
  : T extends 'multivariate' ? ComputedDatumMultivariate
  : T extends 'graph' ? ComputedDatumGraphNode
  : T extends 'tree' ? ComputedDatumTree
  : unknown

export type ComputedData<T extends ModelType> = T extends 'series' ? ComputedDatumSeries[]
  : T extends 'grid' ? ComputedDatumGrid[][]
  : T extends 'multivariate' ? ComputedDatumMultivariate[][]
  : T extends 'graph' ? {
      nodes: ComputedDatumGraphNode[]
      edges: ComputedDatumGraphEdge[]
    }
  : T extends 'tree' ? ComputedDatumTree
  : unknown