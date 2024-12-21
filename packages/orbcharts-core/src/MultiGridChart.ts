import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DEFAULT_DATA_FORMATTER_MULTI_GRID } from './defaults'
import { dataFormatterValidator } from './multiGrid/dataFormatterValidator'
import { computedDataFn } from './multiGrid/computedDataFn'
import { dataValidator } from './multiGrid/dataValidator'
import { contextObserverCallback } from './multiGrid/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class MultiGridChart extends AbstractChart<'multiGrid'> implements ChartEntity<'multiGrid'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'multiGrid'>) {
    super(
      {
        defaultDataFormatter: DEFAULT_DATA_FORMATTER_MULTI_GRID,
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