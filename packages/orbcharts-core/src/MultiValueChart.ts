import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DATA_FORMATTER_MULTI_VALUE_DEFAULT } from './defaults'
import { computeMultiValueData } from './multiValue/computeMultiValueData'
import { createMultiValueContextObserver } from './multiValue/createMultiValueContextObserver'
import { AbstractChart } from './AbstractChart'

export class MultiValueChart extends AbstractChart<'multiValue'> implements ChartEntity<'multiValue'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'multiValue'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_MULTI_VALUE_DEFAULT,
        computedDataFn: computeMultiValueData,
        contextObserverFn: createMultiValueContextObserver
      },
      element,
      options
    )
  }
}