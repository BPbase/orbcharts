export type ModelType = 'series' | 'grid' | 'multivariate' | 'graph' | 'tree'

export interface ModelDatumBase {
  id: string
  index: number // 在同類別中的索引
  name: string // 原始資料的 name 欄位
  data: any // 原始資料的 data 欄位
  value: number | null // 經過 aggregate 後的數值
  color: string // 經過色彩對應後的顏色（hex）
  // rawData: RawDataColumn // 原始資料
}

export interface ModelDatumSeries extends ModelDatumBase {
  series: string
  seriesIndex: number
}

export interface ModelDatumGrid extends ModelDatumBase {
  series: string
  seriesIndex: number
  category: string
  categoryIndex: number
}

export interface ModelDatumMultivariate extends ModelDatumBase {
  series: string
  seriesIndex: number
  category: string
  categoryIndex: number
  multivariate: Array<{
    index: number // 維度
    label: string // multivariate 的 label
    value: number | null
  }>
}

export interface ModelDatumGraphNode extends ModelDatumBase {
  series: string
  seriesIndex: number
  category: string
  categoryIndex: number
}

export interface ModelDatumGraphEdge extends ModelDatumBase {
  source: string // 來源節點名稱
  sourceIndex: number // 來源節點在所有節點中的索引
  target: string // 目標節點名稱
  targetIndex: number // 目標節點在所有節點中的索引
}

export interface ModelDatumTree extends ModelDatumBase {
  parent: string | null // 父節點名稱
  parentIndex: number | null // 父節點在所有節點中的索引
  depth: number // 節點深度（根節點為 0）
  seq: number // 同一層級中的順序
  children: ModelDatumTree[] // 子節點
  series: string
  seriesIndex: number
  category: string
  categoryIndex: number
}

export type ModelDatum<T extends ModelType> = T extends 'series' ? ModelDatumSeries
  : T extends 'grid' ? ModelDatumGrid
  : T extends 'multivariate' ? ModelDatumMultivariate
  : T extends 'graph' ? ModelDatumGraphNode
  : T extends 'tree' ? ModelDatumTree
  : unknown

export type ModelDataSeries = ModelDatum<'series'>[][]

export type ModelDataGrid = ModelDatum<'grid'>[][]

export type ModelDataMultivariate = ModelDatum<'multivariate'>[][]

export interface ModelDataGraph {
  nodes: ModelDatumGraphNode[]
  edges: ModelDatumGraphEdge[]
}

export type ModelDataTree = ModelDatum<'tree'>

export type ModelData<T extends ModelType = ModelType> = T extends 'series' ? ModelDataSeries
  : T extends 'grid' ? ModelDataGrid
  : T extends 'multivariate' ? ModelDataMultivariate
  : T extends 'graph' ? ModelDataGraph
  : T extends 'tree' ? ModelDataTree
  : unknown