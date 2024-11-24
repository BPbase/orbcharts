import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DATA_FORMATTER_GRID_DEFAULT } from './defaults'
import { dataFormatterValidator } from './grid/dataFormatterValidator'
import { computedDataFn } from './grid/computedDataFn'
import { dataValidator } from './grid/dataValidator'
import { contextObserverCallback } from './grid/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class GridChart extends AbstractChart<'grid'> implements ChartEntity<'grid'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'grid'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_GRID_DEFAULT,
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