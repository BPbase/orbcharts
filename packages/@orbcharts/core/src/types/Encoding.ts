


export interface EncodingDataset {
  from: string
  sort: 'original' | 'alphabetical' | string[]
  ignore?: boolean
}

export interface EncodingSeries {
  from: string
  sort: 'original' | 'alphabetical' | string[]
  ignore?: boolean
}

export interface EncodingCategory {
  from: string
  sort: 'original' | 'alphabetical' | string[]
  ignore?: boolean
}

export interface EncodingValue {
  from: string
  sort: 'original' | 'asc' | 'desc'
  aggregate: 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count' | 'none'
}

export interface EncodingMultivariateItem {
  from: string
  name: string
}

export type EncodingMultivariate = EncodingMultivariateItem[]

export interface EncodingColor {
  by: 'index' | 'series' | 'category' | 'dataset'
}

export interface Encoding {
  dataset: EncodingDataset
  series: EncodingSeries
  category: EncodingCategory
  value: EncodingValue
  multivariate: EncodingMultivariate
  color: EncodingColor
}