import type { DatumBase, DatumValue } from './Data'

// export type DataMultiValue = DataMultiValueDatum[][] | DataMultiValueValue[][]
export type DataMultiValue = (DataMultiValueDatum | DataMultiValueValue)[][]

export type DataMultiValueValue = number

export interface DataMultiValueDatum extends DatumBase, DatumValue {
}


