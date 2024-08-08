import { DataTreeDatum, DataTree } from './DataTree'
import { DataFormatterBase, VisibleFilter } from './DataFormatter'

export interface DataFormatterTree
  extends DataFormatterBase<'tree'> {
    visibleFilter: VisibleFilter<'tree'>
  // labelFormat: (datum: unknown) => string
  // descriptionFormat: (datum: unknown) => string
}

export type DataFormatterTreePartial = Partial<DataFormatterTree>
