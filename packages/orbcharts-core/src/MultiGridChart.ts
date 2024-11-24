import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DATA_FORMATTER_MULTI_GRID_DEFAULT } from './defaults'
import { dataFormatterValidator } from './multiGrid/dataFormatterValidator'
import { computedDataFn } from './multiGrid/computedDataFn'
import { dataValidator } from './multiGrid/dataValidator'
import { contextObserverCallback } from './multiGrid/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class MultiGridChart extends AbstractChart<'multiGrid'> implements ChartEntity<'multiGrid'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'multiGrid'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_MULTI_GRID_DEFAULT,
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