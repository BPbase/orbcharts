import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DATA_FORMATTER_GRID_DEFAULT } from './defaults'
import { computeGridData } from './grid/computeGridData'
import { createGridContextObserver } from './grid/createGridContextObserver'
import { AbstractChart } from './AbstractChart'

export class GridChart extends AbstractChart<'grid'> implements ChartEntity<'grid'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'grid'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_GRID_DEFAULT,
        computedDataFn: computeGridData,
        contextObserverFn: createGridContextObserver
      },
      element,
      options
    )
  }
}