// import { DataMultiValueDatum, DataMultiValue } from './DataMultiValue'
import {
  DataFormatterBase,
  DataFormatterBasePartial,
  DataFormatterXYAxis,
  VisibleFilter,
  DataFormatterContainer
} from './DataFormatter'

export interface DataFormatterMultiValue extends DataFormatterBase<'multiValue'> {
  visibleFilter: VisibleFilter<'multiValue'>
  // labelFormat: (datum: unknown) => string
  categoryLabels: string[]
  valueLabels: string[]
  // multiValue: Array<DataFormatterMultiValueMultiValue>
  xAxis: DataFormatterXYAxis
  yAxis: DataFormatterXYAxis
  container: DataFormatterContainer
  separateCategory: boolean
}

export interface DataFormatterMultiValuePartial extends DataFormatterBasePartial<'multiValue'> {
  visibleFilter?: VisibleFilter<'multiValue'>
  categoryLabels?: string[]
  valueLabels?: string[]
  // multiValue?: Array<Partial<DataFormatterMultiValueMultiValue>>
  xAxis?: Partial<DataFormatterXYAxis>
  yAxis?: Partial<DataFormatterXYAxis>
  container?: Partial<DataFormatterContainer>
  separateCategory?: boolean
}

// multiValue欄位
export interface DataFormatterMultiValueMultiValue {
  // unitLabel: string
}