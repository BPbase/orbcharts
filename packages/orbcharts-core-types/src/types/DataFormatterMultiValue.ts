// import { DataMultiValueDatum, DataMultiValue } from './DataMultiValue'
import {
  DataFormatterBase,
  DataFormatterBasePartial,
  DataFormatterAxis,
  VisibleFilter,
  DataFormatterContainer
} from './DataFormatter'

export interface DataFormatterMultiValue extends DataFormatterBase<'multiValue'> {
  visibleFilter: VisibleFilter<'multiValue'>
  // labelFormat: (datum: unknown) => string
  categoryLabels: string[]
  valueLabels: string[]
  // multiValue: Array<DataFormatterMultiValueMultiValue>
  xAxis: DataFormatterAxis
  yAxis: DataFormatterAxis
  container: DataFormatterContainer
  separateCategory: boolean
}

export interface DataFormatterMultiValuePartial extends DataFormatterBasePartial<'multiValue'> {
  visibleFilter?: VisibleFilter<'multiValue'>
  categoryLabels?: string[]
  valueLabels?: string[]
  // multiValue?: Array<Partial<DataFormatterMultiValueMultiValue>>
  xAxis?: Partial<DataFormatterAxis>
  yAxis?: Partial<DataFormatterAxis>
  container?: Partial<DataFormatterContainer>
  separateCategory?: boolean
}

// multiValue欄位
export interface DataFormatterMultiValueMultiValue {
  // unitLabel: string
}