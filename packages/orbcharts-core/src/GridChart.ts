import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DEFAULT_DATA_FORMATTER_GRID } from './defaults'
import { dataFormatterValidator } from './grid/dataFormatterValidator'
import { computedDataFn } from './grid/computedDataFn'
import { dataValidator } from './grid/dataValidator'
import { contextObserverCallback } from './grid/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class GridChart extends AbstractChart<'grid'> implements ChartEntity<'grid'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'grid'>) {
    super(
      {
        defaultDataFormatter: DEFAULT_DATA_FORMATTER_GRID,
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