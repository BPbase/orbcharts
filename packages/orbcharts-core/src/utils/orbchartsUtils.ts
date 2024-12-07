import * as d3 from 'd3'
import type {
  ChartType,
  ChartParams,
  DatumValue,
  DataSeries,
  DataSeriesDatum,
  DataSeriesValue,
  DataGrid,
  DataGridDatum,
  DataGridValue,
  DataMultiGrid,
  DataMultiValue,
  DataMultiValueDatum,
  DataMultiValueValue,
  DataFormatterContainer,
  SeriesDirection,
  DataFormatterGridGrid,
  ContainerPosition,
  ContainerPositionScaled,
  Layout
} from '../../lib/core-types'
import { isPlainObject } from './commonUtils'

export function formatValueToLabel (value: any, valueFormatter: string | ((text: d3.NumberValue) => string)) {
  if (valueFormatter! instanceof Function == true) {
    return (valueFormatter as ((text: d3.NumberValue) => string))(value)
  }
  return d3.format(valueFormatter as string)!(value)
}

export function createDefaultDatumId (chartTypeOrPrefix: string, levelOneIndex: number, levelTwoIndex?: number, levelThreeIndex?: number) {
  let text = `${chartTypeOrPrefix}_${levelOneIndex}`
  if (levelTwoIndex != null) {
    text += `_${levelTwoIndex}`
  }
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

export function createDefaultCategoryLabel (chartTypeOrPrefix: string) {
  return `${chartTypeOrPrefix}_category`
}

export function createGridSeriesLabels ({ transposedDataGrid, dataFormatterGrid, chartType = 'grid' }: {
  transposedDataGrid: DataGridDatum[][],
  dataFormatterGrid: DataFormatterGridGrid
  chartType?: ChartType
}) {
  const labels = dataFormatterGrid.seriesDirection === 'row'
    ? dataFormatterGrid.rowLabels
    : dataFormatterGrid.columnLabels
  return transposedDataGrid.map((_, rowIndex) => {
    return labels[rowIndex] != null
      ? labels[rowIndex]
      : createDefaultSeriesLabel(chartType, rowIndex)
  })
}

export function createMultiGridSeriesLabels ({ transposedDataGrid, dataFormatterGrid, chartType = 'multiGrid', gridIndex = 0 }: {
  transposedDataGrid: DataGridDatum[][],
  dataFormatterGrid: DataFormatterGridGrid
  chartType?: ChartType
  gridIndex?: number
}) {
  const labels = dataFormatterGrid.seriesDirection === 'row'
    ? dataFormatterGrid.rowLabels
    : dataFormatterGrid.columnLabels
  return transposedDataGrid.map((_, rowIndex) => {
    return labels[rowIndex] != null
      ? labels[rowIndex]
      : createDefaultSeriesLabel(`${chartType}_grid${gridIndex}`, rowIndex)
  })
}

export function createGridGroupLabels ({ transposedDataGrid, dataFormatterGrid, chartType = 'grid' }: {
  transposedDataGrid: DataGridDatum[][],
  dataFormatterGrid: DataFormatterGridGrid
  chartType?: ChartType
}) {
  if (transposedDataGrid[0] == null) {
    return []
  }
  const labels = dataFormatterGrid.seriesDirection === 'row'
    ? dataFormatterGrid.columnLabels
    : dataFormatterGrid.rowLabels
  return transposedDataGrid[0].map((_, columnLabels) => {
    return labels[columnLabels] != null
      ? labels[columnLabels]
      : createDefaultGroupLabel(chartType, columnLabels)
  })
}

export function createMultiGridGroupLabels ({ transposedDataGrid, dataFormatterGrid, chartType = 'multiGrid', gridIndex = 0 }: {
  transposedDataGrid: DataGridDatum[][],
  dataFormatterGrid: DataFormatterGridGrid
  chartType?: ChartType
  gridIndex?: number
}) {
  if (transposedDataGrid[0] == null) {
    return []
  }
  const labels = dataFormatterGrid.seriesDirection === 'row'
    ? dataFormatterGrid.columnLabels
    : dataFormatterGrid.rowLabels
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
    .filter(d => (d == null || (isPlainObject(d) && (d as DataSeriesDatum).value == null)) === false) // 過濾掉null &
    .map(d => typeof d === 'number' ? d : d.value )
  return getMinAndMax(arr)
}

// 取得最小及最大值 - Grid Data
export function getMinAndMaxGrid (data: DataGrid): [number, number] {
  const flatData: (DataGridValue | DataGridDatum)[] = data.flat()
  const arr = flatData
    .filter(d => (d == null || (isPlainObject(d) && (d as DataGridDatum).value == null)) === false) // 過濾掉null
    .map(d => typeof d === 'number' ? d : d.value )
  return getMinAndMax(arr)
}

// 取得最小及最大值 - MultiGrid Data
export function getMinAndMaxMultiGrid (data: DataMultiGrid): [number, number] {
  const flatData: (DataGridValue | DataGridDatum)[] = data.flat().flat()
  const arr = flatData
    .filter(d => (d == null || (isPlainObject(d) && (d as DataGridDatum).value == null)) === false) // 過濾掉null
    .map(d => typeof d === 'number' ? d : d.value )
  return getMinAndMax(arr)
}

// 取得最小及最大值 - MultiValue Data
export function getMinAndMaxMultiValue (data: DataMultiValue, valueIndex: number): [number, number] {
  const arr: number[] = data
    .map(d => {
      if (Array.isArray(d)) {
        return d[valueIndex] ?? null
      } else if (isPlainObject(d)) {
        return (d as DataMultiValueDatum).value[valueIndex] ?? null
      } else {
        return null
      }
    })
    .filter(d => d != null)
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

// 轉置成seriesDirection為main的陣列格式
export function transposeData<T> (seriesDirection: SeriesDirection, data: T[][]): T[][] {
  if (seriesDirection === 'row') {
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

// export function calcSeriesContainerPosition (layout: Layout, container: DataFormatterContainer, rowIndex: number, columnIndex: number) {
//   const { gap, rowAmount, columnAmount } = container
//   const width = (layout.width - (gap * (columnAmount - 1))) / columnAmount
//   const height = (layout.height - (gap * (rowAmount - 1))) / rowAmount
//   const x = columnIndex * width + (columnIndex * gap)
//   const y = rowIndex * height + (rowIndex * gap)
//   // const translate: [number, number] = [x, y]
  
//   return {
//     // translate,
//     startX: x,
//     startY: y,
//     centerX: x + width / 2,
//     centerY: y + height / 2,
//     width,
//     height
//   }
// }

// 計算預設欄列數量
// 規則1.rowAmount*columnAmount要大於或等於amount，並且數字要盡可能小
// 規則2.columnAmount要大於或等於rowAmount，並且數字要盡可能小
function calcGridDimensions (amount: number): { rowAmount: number; columnAmount: number } {
  let rowAmount = Math.floor(Math.sqrt(amount))
  let columnAmount = Math.ceil(amount / rowAmount)
  while (rowAmount * columnAmount < amount) {
    columnAmount++
  }
  return { rowAmount, columnAmount }
}

export function calcSeriesContainerLayout (layout: Layout, container: DataFormatterContainer, amount: number): ContainerPosition[] {
  const { gap } = container
  const { rowAmount, columnAmount } = (container.rowAmount * container.columnAmount) >= amount
    // 如果container設定的rowAmount和columnAmount的乘積大於或等於amount，則使用目前設定
    ? container
    // 否則計算一個合適的預設值
    : calcGridDimensions(amount)

  return new Array(amount).fill(null).map((_, index) => {
    const columnIndex = index % columnAmount
    const rowIndex = Math.floor(index / columnAmount)

    const width = (layout.width - (gap * (columnAmount - 1))) / columnAmount
    const height = (layout.height - (gap * (rowAmount - 1))) / rowAmount
    const x = columnIndex * width + (columnIndex * gap)
    const y = rowIndex * height + (rowIndex * gap)
    // const translate: [number, number] = [x, y]
    
    return {
      slotIndex: index,
      rowIndex,
      columnIndex,
      // translate,
      startX: x,
      startY: y,
      centerX: x + width / 2,
      centerY: y + height / 2,
      width,
      height
    }
  })
}

// export function calcGridContainerPosition (layout: Layout, container: DataFormatterContainer, rowIndex: number, columnIndex: number) {
//   const { gap, rowAmount, columnAmount } = container
//   const width = (layout.width - (gap * (columnAmount - 1))) / columnAmount
//   const height = (layout.height - (gap * (rowAmount - 1))) / rowAmount
//   const x = columnIndex * width + (columnIndex * gap)
//   const y = rowIndex * height + (rowIndex * gap)
//   const translate: [number, number] = [x, y]
//   const scale: [number, number] = [width / layout.width, height / layout.height]

//   return {
//     translate,
//     scale
//   }
// }

export function calcGridContainerLayout (layout: Layout, container: DataFormatterContainer, amount: number): ContainerPositionScaled[] {
  const { gap } = container
  const { rowAmount, columnAmount } = (container.rowAmount * container.columnAmount) >= amount
    // 如果container設定的rowAmount和columnAmount的乘積大於或等於amount，則使用目前設定
    ? container
    // 否則計算一個合適的預設值
    : calcGridDimensions(amount)

  return new Array(amount).fill(null).map((_, index) => {
    const columnIndex = index % columnAmount
    const rowIndex = Math.floor(index / columnAmount)
    
    const width = (layout.width - (gap * (columnAmount - 1))) / columnAmount
    const height = (layout.height - (gap * (rowAmount - 1))) / rowAmount
    const x = columnIndex * width + (columnIndex * gap)
    const y = rowIndex * height + (rowIndex * gap)
    const translate: [number, number] = [x, y]
    const scale: [number, number] = [width / layout.width, height / layout.height]

    return {                      
      slotIndex: index,
      rowIndex,
      columnIndex,
      translate,
      scale
    }
  })
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


