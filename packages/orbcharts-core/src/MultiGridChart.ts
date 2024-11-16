import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DATA_FORMATTER_MULTI_GRID_DEFAULT } from './defaults'
import { computeMultiGridData } from './multiGrid/computeMultiGridData'
import { createMultiGridContextObserver } from './multiGrid/createMultiGridContextObserver'
import { AbstractChart } from './AbstractChart'

export class MultiGridChart extends AbstractChart<'multiGrid'> implements ChartEntity<'multiGrid'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'multiGrid'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_MULTI_GRID_DEFAULT,
        computedDataFn: computeMultiGridData,
        contextObserverFn: createMultiGridContextObserver
      },
      element,
      options
    )
  }
}