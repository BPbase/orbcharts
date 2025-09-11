


export interface EncodingDataset {
  from: string
  sort: 'natural' | string[]
}

export interface EncodingSeries {
  from: string
  sort: 'natural' | string[]
}

export interface EncodingCategory {
  from: string
  sort: 'natural' | string[]
}

export interface EncodingValue {
  from: string
  sort: 'natural' | 'asc' | 'desc'
  aggregate: 'sum' | 'mean' | 'median' | 'min' | 'max' | 'count' | 'none'
}

export type EncodingMultiValue = Array<{
  from: string
  label: string
}>

export interface EncodingColor {
  from: 'index' | 'series' | 'category' | 'dataset'
}

export interface Encoding {
  dataset: EncodingDataset
  series: EncodingSeries
  category: EncodingCategory
  value: EncodingValue
  multiValue: EncodingMultiValue
  color: EncodingColor
}