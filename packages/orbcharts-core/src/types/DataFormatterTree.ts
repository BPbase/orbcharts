import { DataTreeDatum, DataTree } from './DataTree'
import { DataFormatterBase } from './DataFormatter'

export interface DataFormatterTree
  extends DataFormatterBase<'tree'> {
  // labelFormat: (datum: unknown) => string
  // descriptionFormat: (datum: unknown) => string
}

export type DataFormatterTreePartial = Partial<DataFormatterTree>
