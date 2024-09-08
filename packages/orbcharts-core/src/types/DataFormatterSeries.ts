import { DataSeriesDatum, DataSeriesValue, DataSeries } from './DataSeries'
import { DataFormatterBase, DataFormatterBasePartial, VisibleFilter, DataFormatterContainer } from './DataFormatter'

export interface DataFormatterSeries extends DataFormatterBase<'series'> {
  visibleFilter: VisibleFilter<'series'>
  sort: ((a: DataSeriesDatum | DataSeriesValue, b: DataSeriesDatum | number) => number) | null
  seriesLabels: string[]
  container: DataFormatterContainer
  separateSeries: boolean
  sumSeries: boolean
}

export interface DataFormatterSeriesPartial extends DataFormatterBasePartial<'series'> {
  visibleFilter?: VisibleFilter<'series'>
  sort?: ((a: DataSeriesDatum | DataSeriesValue, b: DataSeriesDatum | number) => number) | null
  seriesLabels?: string[]
  container?: Partial<DataFormatterContainer>
  separateSeries?: boolean
  sumSeries?: boolean
}
