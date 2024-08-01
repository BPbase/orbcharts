import { DataSeriesDatum, DataSeriesValue, DataSeries } from './DataSeries'
import { DataFormatterBase, DataFormatterContext } from './DataFormatter'
// import { ComputedDatumSeries } from './ComputedDataSeries'

export interface DataFormatterSeries
  extends DataFormatterBase<'series'> {
  // series: DataFormatterSeriesSeries
  unitLabel: string
  seriesLabels: string[]
  // labelFormat: (datum: DataSeriesDatum) => string
  // mapSeries: (datum: DataSeriesDatum | DataSeriesValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'series'>) => string
  colorsPredicate: (datum: DataSeriesDatum | DataSeriesValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'series'>) => string
  sort: ((a: DataSeriesDatum | DataSeriesValue, b: DataSeriesDatum | number) => number) | null
  // colors: Colors
}

export type DataFormatterSeriesPartial = Partial<DataFormatterSeries> & Partial<{
  // series: Partial<DataFormatterSeriesSeries>
}>

// export interface DataFormatterSeriesSeries {
//   unitLabel: string
//   seriesLabels: string[]
//   // labelFormat: (datum: DataSeriesDatum) => string
//   sort: ((computedDatum: ComputedDatumSeries) => number) | null
// }