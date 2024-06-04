import { DataMultiValueDatum, DataMultiValue } from './DataMultiValue'
import { DataFormatterBase, DataFormatterValueAxis } from './DataFormatter'

export interface DataFormatterMultiValue
  extends DataFormatterBase<'multiValue'> {
  // labelFormat: (datum: unknown) => string
  multiValue: Array<DataFormatterMultiValueMultiValue>
  xAxis: DataFormatterValueAxis
  yAxis: DataFormatterValueAxis
}

export type DataFormatterMultiValuePartial = Partial<DataFormatterMultiValue> | Partial<{
  multiValue: Array<Partial<DataFormatterMultiValueMultiValue>>
}>

// multiValue欄位
export interface DataFormatterMultiValueMultiValue {
  unitLabel: string
}