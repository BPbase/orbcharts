import * as d3 from 'd3'
import type { ChartType } from '../types/Chart'
import type { ChartParams } from '../types/ChartParams'
import type { DatumBase, DatumValue } from '../types/Data'
import type { DataSeries, DataSeriesDatum, DataSeriesValue } from '../types/DataSeries'
import type { DataGrid, DataGridDatum, DataGridValue } from '../types/DataGrid'
import type { DataMultiGrid } from '../types/DataMultiGrid'
import type { DataMultiValue, DataMultiValueDatum, DataMultiValueValue } from '../types/DataMultiValue'
import type { SeriesType, DataFormatterGrid } from '../types/DataFormatterGrid'
import type { ComputedDatumSeriesValue } from '../types/ComputedData'
import type { ComputedDatumSeries } from '../types/ComputedDataSeries'
import type { ComputedDatumGrid, ComputedDataGrid } from '../types/ComputedDataGrid'
import type { ComputedDataMultiGrid } from '../types/ComputedDataMultiGrid'
// import type { ComputedDatumMultiGrid } from '../types/ComputedDataMultiGrid'
import { isObject } from './commonUtils'

export function formatValueToLabel (value: any, valueFormatter: string | ((text: d3.NumberValue) => string)) {
  if (valueFormatter! instanceof Function == true) {
    return (valueFormatter as ((text: d3.NumberValue) => string))(value)
  }
  return d3.format(valueFormatter as string)!(value)
}

export function createDefaultDatumId (chartTypeOrPrefix: string, levelOneIndex: number, levelTwoIndex: number, levelThreeIndex?: number) {
  let text = `${chartTypeOrPrefix}_${levelOneIndex}_${levelTwoIndex}`
  if (levelThreeIndex != null) {
    text += `_${levelThreeIndex}`
  }
  return text
}

export function createDefaultSeriesLabel (chartTypeOrPrefix: string, seriesIndex: number) {
  return `${chartTypeOrPrefix}_series${seriesIndex}`
}

export function createDefaultGroupLabel (chartTypeOrPrefix: string, groupIndex: number) {
  return `${chartTypeOrPrefix}_group${groupIndex}`
}

export function createGridSeriesLabels ({ transposedDataGrid, dataFormatter, chartType = 'grid', gridIndex = 0 }: {
  transposedDataGrid: DataGridDatum[][],
  dataFormatter: DataFormatterGrid
  chartType?: ChartType
  gridIndex?: number
}) {
  const labels = dataFormatter.grid.seriesType === 'row'
    ? dataFormatter.grid.rowLabels
    : dataFormatter.grid.columnLabels
  return transposedDataGrid.map((_, rowIndex) => {
    return labels[rowIndex] != null
      ? labels[rowIndex]
      : createDefaultSeriesLabel(`${chartType}_grid${gridIndex}`, rowIndex)
  })
}

export function createGridGroupLabels ({ transposedDataGrid, dataFormatter, chartType = 'grid', gridIndex = 0 }: {
  transposedDataGrid: DataGridDatum[][],
  dataFormatter: DataFormatterGrid
  chartType?: ChartType
  gridIndex?: number
}) {
  if (transposedDataGrid[0] == null) {
    return []
  }
  const labels = dataFormatter.grid.seriesType === 'row'
    ? dataFormatter.grid.columnLabels
    : dataFormatter.grid.rowLabels
  return transposedDataGrid[0].map((_, columnLabels) => {
    return labels[columnLabels] != null
      ? labels[columnLabels]
      : createDefaultGroupLabel(`${chartType}_grid${gridIndex}`, columnLabels)
  })
}

// 取得最小及最大值 - 數字陣列
export function getMinAndMax (data: number[]): [number, number] {
  const defaultMinAndMax: [number, number] = [0, 0] // default
  if (!data.length) {
    return defaultMinAndMax
  }
  const minAndMax: [number, number] = data.reduce((prev, current) => {
    // [min, max]
    return [
      current < prev[0] ? current : prev[0],
      current > prev[1] ? current : prev[1]
    ]
  }, [data[0], data[0]])
  return minAndMax
}

// 取得最小及最大值 - datum格式陣列資料
export function getMinAndMaxValue (data: DatumValue[]): [number, number] {
  const arr = data
    .filter(d => d != null && d.value != null)
    .map(d => d.value )
  return getMinAndMax(arr)
}

// 取得最小及最大值 - Series Data
export function getMinAndMaxSeries (data: DataSeries): [number, number] {
  const flatData: (DataSeriesValue | DataSeriesDatum)[] = data[0] && Array.isArray((data as (DataSeriesValue | DataSeriesDatum)[][])[0])
    ? data.flat()
    : data as (DataSeriesValue | DataSeriesDatum)[]
  const arr = flatData
    .filter(d => (d == null || (isObject(d) && (d as DataSeriesDatum).value == null)) === false) // 過濾掉null &
    .map(d => typeof d === 'number' ? d : d.value )
  return getMinAndMax(arr)
}

// 取得最小及最大值 - Grid Data
export function getMinAndMaxGrid (data: DataGrid): [number, number] {
  const flatData: (DataGridValue | DataGridDatum)[] = data.flat()
  const arr = flatData
    .filter(d => (d == null || (isObject(d) && (d as DataGridDatum).value == null)) === false) // 過濾掉null
    .map(d => typeof d === 'number' ? d : d.value )
  return getMinAndMax(arr)
}

// 取得最小及最大值 - MultiGrid Data
export function getMinAndMaxMultiGrid (data: DataMultiGrid): [number, number] {
  const flatData: (DataGridValue | DataGridDatum)[] = data.flat().flat()
  const arr = flatData
    .filter(d => (d == null || (isObject(d) && (d as DataGridDatum).value == null)) === false) // 過濾掉null
    .map(d => typeof d === 'number' ? d : d.value )
  return getMinAndMax(arr)
}

// 取得最小及最大值 - MultiValue Data
export function getMinAndMaxMultiValue (data: DataMultiValue, valueIndex: number = 2): [number, number] {
  const flatData: (DataMultiValueDatum | DataMultiValueValue)[] = data.flat().filter((d, i) => i == valueIndex)
  const arr = flatData
    .filter(d => (d == null || (isObject(d) && (d as DataMultiValueDatum).value == null)) === false) // 過濾掉null
    .map(d => typeof d === 'number' ? d : d.value )
  return getMinAndMax(arr)
}

// @Q@ 待處理
// // 取得最小及最大值 - Relationship Data
// export function getMinAndMaxRelationship (data: DataRelationship, target: 'nodes' | 'edges' = 'nodes'): [number, number] {

// }

// @Q@ 待處理
// // 取得最小及最大值 - Tree Data
// export function getMinAndMaxTree (data: DataTree): [number, number] {

// }

// 轉置成seriesType為main的陣列格式
export function transposeData<T> (seriesType: SeriesType, data: T[][]): T[][] {
  if (seriesType === 'row') {
    return Object.assign([], data)
  }
  // 取得原始陣列的維度
  const rows = data.length;
  const cols = data.reduce((prev, current) => {
    return Math.max(prev, current.length)
  }, 0)

  // 初始化轉換後的陣列
  const transposedArray = new Array(cols).fill(null).map(() => new Array(rows).fill(null))

  // 遍歷原始陣列，進行轉換
  for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
          transposedArray[j][i] = data[i][j]
      }
  }

  return transposedArray
}


export function seriesColorPredicate (seriesIndex: number, chartParams: ChartParams) {
  return seriesIndex < chartParams.colors[chartParams.colorScheme].series.length
    ? chartParams.colors[chartParams.colorScheme].series[seriesIndex]
    : chartParams.colors[chartParams.colorScheme].series[
      seriesIndex % chartParams.colors[chartParams.colorScheme].series.length
    ]
}

// // multiGrid datum color
// export function multiGridColorPredicate ({ seriesIndex, groupIndex, data, chartParams }: {
//   seriesIndex: number
//   groupIndex: number
//   data: ComputedDataMultiGrid
//   chartParams: ChartParams
// }) {
//   // 累加前面的grid的seriesIndex
//   const accSeriesIndex = data.reduce((prev, current) => {
//     if (current[0] && current[0][0] && groupIndex > current[0][0].gridIndex) {
//       return prev + current[0].length
//     } else if (current[0] && current[0][0] && groupIndex == current[0][0].gridIndex) {
//       return prev + seriesIndex
//     } else {
//       return prev
//     }
//   }, 0)

//   return seriesColorPredicate(accSeriesIndex, chartParams)
// }


