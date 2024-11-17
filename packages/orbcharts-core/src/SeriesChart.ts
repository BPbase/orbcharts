import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DATA_FORMATTER_SERIES_DEFAULT } from './defaults'
import { dataFormatterValidator } from './series/dataFormatterValidator'
import { computedDataFn } from './series/computedDataFn'
import { dataValidator } from './series/dataValidator'
import { contextObserverCallback } from './series/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class SeriesChart extends AbstractChart<'series'> implements ChartEntity<'series'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'series'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_SERIES_DEFAULT,
        dataFormatterValidator,
        computedDataFn,
        dataValidator,
        contextObserverCallback
      },
      element,
      options
    )
  }
}