import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DEFAULT_DATA_FORMATTER_SERIES } from './defaults'
import { dataFormatterValidator } from './series/dataFormatterValidator'
import { computedDataFn } from './series/computedDataFn'
import { dataValidator } from './series/dataValidator'
import { contextObserverCallback } from './series/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class SeriesChart extends AbstractChart<'series'> implements ChartEntity<'series'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'series'>) {
    super(
      {
        defaultDataFormatter: DEFAULT_DATA_FORMATTER_SERIES,
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