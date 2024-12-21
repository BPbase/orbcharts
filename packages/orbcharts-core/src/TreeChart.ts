import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DEFAULT_DATA_FORMATTER_TREE } from './defaults'
import { dataFormatterValidator } from './tree/dataFormatterValidator'
import { computedDataFn } from './tree/computedDataFn'
import { dataValidator } from './tree/dataValidator'
import { contextObserverCallback } from './tree/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class TreeChart extends AbstractChart<'tree'> implements ChartEntity<'tree'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'tree'>) {
    super(
      {
        defaultDataFormatter: DEFAULT_DATA_FORMATTER_TREE,
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