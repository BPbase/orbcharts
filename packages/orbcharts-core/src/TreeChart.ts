import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DATA_FORMATTER_TREE_DEFAULT } from './defaults'
import { computeTreeData } from './tree/computeTreeData'
import { createTreeContextObserver } from './tree/createTreeContextObserver'
import { AbstractChart } from './AbstractChart'

export class TreeChart extends AbstractChart<'tree'> implements ChartEntity<'tree'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'tree'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_TREE_DEFAULT,
        computedDataFn: computeTreeData,
        contextObserverFn: createTreeContextObserver
      },
      element,
      options
    )
  }
}