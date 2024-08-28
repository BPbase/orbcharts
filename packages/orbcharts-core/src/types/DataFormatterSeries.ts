import { DataSeriesDatum, DataSeriesValue, DataSeries } from './DataSeries'
import { DataFormatterBase, DataFormatterBasePartial, VisibleFilter } from './DataFormatter'
// import { ComputedDatumSeries } from './ComputedDataSeries'

export interface DataFormatterSeries extends DataFormatterBase<'series'> {
  visibleFilter: VisibleFilter<'series'>
  // series: DataFormatterSeriesSeries
  // unitLabel: string
  seriesLabels: string[]
  // labelFormat: (datum: DataSeriesDatum) => string
  // mapSeries: (datum: DataSeriesDatum | DataSeriesValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'series'>) => string
  // colorsPredicate: (datum: DataSeriesDatum | DataSeriesValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'series'>) => string
  sort: ((a: DataSeriesDatum | DataSeriesValue, b: DataSeriesDatum | number) => number) | null
  // colors: Colors
}

export interface DataFormatterSeriesPartial extends DataFormatterBasePartial<'series'> {
  // series: Partial<DataFormatterSeriesSeries>
  // unitLabel?: string
  seriesLabels?: string[]
  // colorsPredicate?: (datum: DataSeriesDatum | DataSeriesValue, rowIndex: number, columnIndex: number, context: DataFormatterContext<'series'>) => string
  sort?: ((a: DataSeriesDatum | DataSeriesValue, b: DataSeriesDatum | number) => number) | null
}

// export interface DataFormatterSeriesSeries {
//   unitLabel: string
//   seriesLabels: string[]
//   // labelFormat: (datum: DataSeriesDatum) => string
//   sort: ((computedDatum: ComputedDatumSeries) => number) | null
// }