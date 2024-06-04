import type { DatumBase, DatumValue } from './Data'

// export type DataGrid = DataGridDatum[][] | DataGridValue[][]
export type DataGrid = (DataGridDatum | DataGridValue)[][]

export type DataGridValue = number | null

export interface DataGridDatum extends DatumBase, DatumValue {
}


