import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DATA_FORMATTER_TREE_DEFAULT } from './defaults'
import { dataFormatterValidator } from './tree/dataFormatterValidator'
import { computedDataFn } from './tree/computedDataFn'
import { dataValidator } from './tree/dataValidator'
import { contextObserverCallback } from './tree/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class TreeChart extends AbstractChart<'tree'> implements ChartEntity<'tree'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'tree'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_TREE_DEFAULT,
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