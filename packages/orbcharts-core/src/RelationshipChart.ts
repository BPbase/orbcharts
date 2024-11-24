import type {
  ChartEntity,
  ChartOptionsPartial } from '../lib/core-types'
import { DATA_FORMATTER_RELATIONAL_DEFAULT} from './defaults'
import { dataFormatterValidator } from './relationship/dataFormatterValidator'
import { computedDataFn } from './relationship/computedDataFn'
import { dataValidator } from './relationship/dataValidator'
import { contextObserverCallback } from './relationship/contextObserverCallback'
import { AbstractChart } from './AbstractChart'

export class RelationshipChart extends AbstractChart<'relationship'> implements ChartEntity<'relationship'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'relationship'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_RELATIONAL_DEFAULT,
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