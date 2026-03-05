


export interface EncodingDataset {
  from: string
  sort: 'original' | 'alphabetical' | string[]
}

export interface EncodingSeries {
  from: string
  sort: 'original' | 'alphabetical' | string[]
}

export interface EncodingCategory {
  from: string
  sort: 'original' | 'alphabetical' | string[]
}

export interface EncodingValue {
  from: string
  sort: 'original' | 'asc' | 'desc'
  aggregate: 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count' | 'none'
}

export interface EncodingMultivariateItem {
  from: string
  label: string
}

export type EncodingMultivariate = EncodingMultivariateItem[]

export interface EncodingColor {
  from: 'index' | 'series' | 'category' | 'dataset'
}

export interface Encoding {
  dataset: EncodingDataset
  series: EncodingSeries
  category: EncodingCategory
  value: EncodingValue
  multivariate: EncodingMultivariate
  color: EncodingColor
}