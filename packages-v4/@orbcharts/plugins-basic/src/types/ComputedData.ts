import type { ModelType } from '../../../core/src/types'
import type {
  ModelDatumBase,
  ModelDatumSeries,
  ModelDatumGrid,
  ModelDatumMultivariate,
  ModelDatumGraphNode,
  ModelDatumGraphEdge,
  ModelDatumTree
} from '../../../core/src/types'


export interface ComputedDatumSeries extends ModelDatumSeries {
  visible: boolean
  seq: number
}

export interface ComputedDatumGrid extends ModelDatumGrid {
  visible: boolean
}

export interface ComputedDatumMultivariate extends ModelDatumMultivariate {
  visible: boolean
}

export interface ComputedDatumGraphNode extends ModelDatumGraphNode {
  visible: boolean
}

export interface ComputedDatumGraphEdge extends ModelDatumGraphEdge {
  visible: boolean
}

export interface ComputedDatumTree extends ModelDatumTree {
  visible: boolean
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