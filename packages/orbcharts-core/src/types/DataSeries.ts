import type { DatumBase, DatumValue } from './Data'

// export type DataSeries = DataSeriesDatum[][] | DataSeriesDatum[] | DataSeriesValue[][] | DataSeriesValue[]
export type DataSeries = (DataSeriesDatum | DataSeriesValue)[][] | (DataSeriesDatum | DataSeriesValue)[]

export type DataSeriesValue = number | null

export interface DataSeriesDatum extends DatumBase, DatumValue {
}


