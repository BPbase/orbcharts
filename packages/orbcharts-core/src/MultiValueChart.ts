import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DATA_FORMATTER_MULTI_VALUE_DEFAULT } from './defaults'
import { dataFormatterValidator } from './multiValue/dataFormatterValidator'
import { computedDataFn } from './multiValue/computedDataFn'
import { dataValidator } from './multiValue/dataValidator'
import { contextObserverCallback } from './multiValue/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class MultiValueChart extends AbstractChart<'multiValue'> implements ChartEntity<'multiValue'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'multiValue'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_MULTI_VALUE_DEFAULT,
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