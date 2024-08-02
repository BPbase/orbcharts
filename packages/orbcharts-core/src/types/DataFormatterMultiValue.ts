import { DataMultiValueDatum, DataMultiValue } from './DataMultiValue'
import { DataFormatterBase, DataFormatterBasePartial, DataFormatterValueAxis } from './DataFormatter'

export interface DataFormatterMultiValue extends DataFormatterBase<'multiValue'> {
  // labelFormat: (datum: unknown) => string
  multiValue: Array<DataFormatterMultiValueMultiValue>
  xAxis: DataFormatterValueAxis
  yAxis: DataFormatterValueAxis
}

export interface DataFormatterMultiValuePartial extends DataFormatterBasePartial<'multiValue'> {
  multiValue?: Array<Partial<DataFormatterMultiValueMultiValue>>
  xAxis?: Partial<DataFormatterValueAxis>
  yAxis?: Partial<DataFormatterValueAxis>
}

// multiValue欄位
export interface DataFormatterMultiValueMultiValue {
  unitLabel: string
}