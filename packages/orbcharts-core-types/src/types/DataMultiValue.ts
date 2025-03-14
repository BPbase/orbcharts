import type { DatumBase, DatumMultiValue } from './Data'

// export type DataMultiValue = DataMultiValueDatum[][] | DataMultiValueValue[][]
export type DataMultiValue = (DataMultiValueDatum | DataMultiValueValue[])[]

export type DataMultiValueValue = number | null

export interface DataMultiValueDatum extends DatumBase, DatumMultiValue {
  categoryLabel?: string
}


