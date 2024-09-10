import type { ComputedDatumSeries } from './ComputedDataSeries'
import type { DataFormatterBase, DataFormatterBasePartial, VisibleFilter, DataFormatterContainer } from './DataFormatter'

export interface DataFormatterSeries extends DataFormatterBase<'series'> {
  visibleFilter: VisibleFilter<'series'>
  sort: ((a: ComputedDatumSeries, b: ComputedDatumSeries) => number) | null
  seriesLabels: string[]
  container: DataFormatterContainer
  separateSeries: boolean
  sumSeries: boolean
}

export interface DataFormatterSeriesPartial extends DataFormatterBasePartial<'series'> {
  visibleFilter?: VisibleFilter<'series'>
  sort?: ((a: ComputedDatumSeries, b: ComputedDatumSeries) => number) | null
  seriesLabels?: string[]
  container?: Partial<DataFormatterContainer>
  separateSeries?: boolean
  sumSeries?: boolean
}
