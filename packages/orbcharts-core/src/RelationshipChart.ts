import type {
  ChartEntity,
  ChartOptionsPartial } from './types'
import { DATA_FORMATTER_RELATIONAL_DEFAULT} from './defaults'
import { computeRelationshipData } from './relationship/computeRelationshipData'
import { createRelationshipContextObserver } from './relationship/createRelationshipContextObserver'
import { AbstractChart } from './AbstractChart'

export class RelationshipChart extends AbstractChart<'relationship'> implements ChartEntity<'relationship'> {
  constructor (element: HTMLElement | Element, options?: ChartOptionsPartial<'relationship'>) {
    super(
      {
        defaultDataFormatter: DATA_FORMATTER_RELATIONAL_DEFAULT,
        computedDataFn: computeRelationshipData,
        contextObserverFn: createRelationshipContextObserver
      },
      element,
      options
    )
  }
}