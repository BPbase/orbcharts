import type {
  ChartEntity,
  ChartOptionsPartial } from './types'
import { DATA_FORMATTER_SERIES_DEFAULT } from './defaults'
import { computeSeriesData } from './series/computeSeriesData'
import { createSeriesContextObserver } from './series/createSeriesContextObserver'
import { AbstractChart } from './AbstractChart'

export class SeriesChart extends AbstractChart<'series'> implements ChartEntity<'series'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'series'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_SERIES_DEFAULT,
        computedDataFn: computeSeriesData,
        contextObserverFn: createSeriesContextObserver
      },
      element,
      options
    )
  }
}