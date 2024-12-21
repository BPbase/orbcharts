import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DEFAULT_DATA_FORMATTER_MULTI_VALUE } from './defaults'
import { dataFormatterValidator } from './multiValue/dataFormatterValidator'
import { computedDataFn } from './multiValue/computedDataFn'
import { dataValidator } from './multiValue/dataValidator'
import { contextObserverCallback } from './multiValue/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class MultiValueChart extends AbstractChart<'multiValue'> implements ChartEntity<'multiValue'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'multiValue'>) {
    super(
      {
        defaultDataFormatter: DEFAULT_DATA_FORMATTER_MULTI_VALUE,
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