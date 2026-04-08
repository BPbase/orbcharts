import type {
  // AxisPosition,
  ColorType,
  Theme,
  ModelDatum,
  ModelDatumBase,
  ModelDatumSeries,
  ModelType,
  
  // ChartParams,
  // ComputedDatumBase,
  // ComputedDatumBaseValue,
  // ComputedDatumBaseSeries,
  // ComputedDatumBaseCategory
} from '@orbcharts/core'
import { Layout, Container, ContainerPosition, ContainerPositionScaled } from '../types/PluginParams'
import { getMinMax } from './commonUtils'
import { isLightColor } from './d3Utils'
import { createLayerClassName } from '@orbcharts/core'
import type { AxisPosition } from '../types/PluginParams'
import type { ComputedDatum } from '../types/ComputedData'

// 取得最小及最大值 - datum格式陣列資料
export function getMinMaxValue<T extends ModelType> (data: ComputedDatum<T>[]): [number, number] {
  const arr = data
    .filter(d => d.value != null && d.visible != false)
    .map(d => d.value as number)
  return getMinMax(arr)
}

// // 取得最小及最大值 - Series Data
// export function getMinMaxSeries (data: ModelDatum<'series'>[][]): [number, number] {
//   const flatData: ModelDatum<'series'>[] = data[0] && Array.isArray((data as (DataSeriesValue | DataSeriesDatum)[][])[0])
//     ? data.flat()
//     : data as (DataSeriesValue | DataSeriesDatum)[]
//   const arr = flatData
//     .filter(d => (d == null || (isPlainObject(d) && (d as DataSeriesDatum).value == null)) === false) // 過濾掉null &
//     .map(d => typeof d === 'number' ? d : d.value )
//   return getMinMax(arr)
// }

// // 取得最小及最大值 - Grid Data
// export function getMinMaxGrid (data: DataGrid): [number, number] {
//   const flatData: (DataGridValue | DataGridDatum)[] = data.flat()
//   const arr = flatData
//     .filter(d => (d == null || (isPlainObject(d) && (d as DataGridDatum).value == null)) === false) // 過濾掉null
//     .map(d => typeof d === 'number' ? d : d.value )
//   return getMinMax(arr)
// }

// // 取得最小及最大值 - MultiGrid Data
// export function getMinMaxMultiGrid (data: DataMultiGrid): [number, number] {
//   const flatData: (DataGridValue | DataGridDatum)[] = data.flat().flat()
//   const arr = flatData
//     .filter(d => (d == null || (isPlainObject(d) && (d as DataGridDatum).value == null)) === false) // 過濾掉null
//     .map(d => typeof d === 'number' ? d : d.value )
//   return getMinMax(arr)
// }

// // 取得最小及最大值 - MultiValue Data
// export function getMinMaxMultiValue (data: DataMultiValue, valueIndex: number): [number, number] {
//   const arr: number[] = data
//     .map(d => {
//       if (Array.isArray(d)) {
//         return d[valueIndex] ?? null
//       } else if (isPlainObject(d)) {
//         return (d as DataMultiValueDatum).value[valueIndex] ?? null
//       } else {
//         return null
//       }
//     })
//     .filter(d => d != null)
//   return getMinMax(arr)
// }

// export function getMinMaxMultiValueXY ({ data, minX, maxX, minY, maxY }: {
//   data: ComputedXYDatumMultiValue[][]
//   minX: number
//   maxX: number
//   minY: number
//   maxY: number
// }) {
//   let filteredData: ComputedXYDatumMultiValue[][] = []
//   let minXDatum: ComputedXYDatumMultiValue | null = null
//   let maxXDatum: ComputedXYDatumMultiValue | null = null
//   let minYDatum: ComputedXYDatumMultiValue | null = null
//   let maxYDatum: ComputedXYDatumMultiValue | null = null
  
//   for (let categoryData of data) {
//     for (let datum of categoryData) {
//       if (datum.axisX >= minX && datum.axisX <= maxX && datum.axisY >= minY && datum.axisY <= maxY) {
//         filteredData.push(categoryData)
//         if (minXDatum == null || datum.axisX < minXDatum.axisX) {
//           minXDatum = datum
//         }
//         if (maxXDatum == null || datum.axisX > maxXDatum.axisX) {
//           maxXDatum = datum
//         }
//         if (minYDatum == null || datum.axisY < minYDatum.axisY) {
//           minYDatum = datum
//         }
//         if (maxYDatum == null || datum.axisY > maxYDatum.axisY) {
//           maxYDatum = datum
//         }
//       }
//     }
//   }

//   return {
//     minXDatum,
//     maxXDatum,
//     minYDatum,
//     maxYDatum,
//     filteredData
//   }
// }

export function getColorScheme (themeColorScheme: 'light' | 'dark' | 'auto') {
  if (themeColorScheme === 'auto') {
    const MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    return MediaQueryList.matches ? 'dark' : 'light'
  } else {
    return themeColorScheme
  }
}

// 取得colorType顏色
export function getColor (colorType: ColorType, theme: Theme) {
  const colorScheme = getColorScheme(theme.colorScheme)
  const colors = theme.colors[colorScheme]
  if (colorType === 'data') {
    return colors.data[0] // default label color
  } else if (colorType === 'dataContrast') {
    return isLightColor(colors.data[0]) // default label color
      ? colors.dataContrast[1]
      : colors.dataContrast[0]
  }
  return colorType == 'none'
    ? 'none'
    : colors[colorType] != undefined
      ? colors[colorType]
      : colors.primary // 如果比對不到
}

// export function getSeriesValueColor () {

// }

// export function getCategoryValueColor ({ datum, colorType, fullChartParams }: { datum: ComputedDatumBaseCategory, colorType: ColorType, fullChartParams: ChartParams }) {

// }

// // 取得Series顏色
// export function getSeriesColor (seriesIndex: number, fullChartParams: ChartParams) {
//   const colorIndex = seriesIndex < fullChartParams.colors[fullChartParams.colorScheme].series.length
//     ? seriesIndex
//     : seriesIndex % fullChartParams.colors[fullChartParams.colorScheme].series.length
//   return fullChartParams.colors[fullChartParams.colorScheme].series[colorIndex]
// }

// 取得Datum顏色
export function getDatumColor ({ datum, colorType, theme }: { datum: ModelDatumBase, colorType: ColorType, theme: Theme }) {
  const colors = theme.colors[getColorScheme(theme.colorScheme)]

  if (colorType === 'data') {
    const datumColor: string | undefined = (datum as unknown as ModelDatumSeries).color
    if (datumColor) {
      return datumColor
    } else {
      // default label color
      return colors.data[0]
    }
  } else if (colorType === 'dataContrast') {
    const datumColor: string | undefined = (datum as unknown as ModelDatumSeries).color
    if (datumColor) {
      return isLightColor(datumColor)
        ? colors.dataContrast[1]
        : colors.dataContrast[0]
    } else {
      // default label color
      return  isLightColor(colors.data[0])
        ? colors.dataContrast[1]
        : colors.dataContrast[0]
    }
  }
  // 對應colorType設定的顏色
  return colorType == 'none'
    ? 'none' 
    : colors[colorType] != undefined
      ? colors[colorType]
      : colors.primary
}

export function seriesColorPredicate (seriesIndex: number, theme: Theme) {
  const colorScheme = getColorScheme(theme.colorScheme)
  return seriesIndex < theme.colors[colorScheme].data.length
    ? theme.colors[colorScheme].data[seriesIndex]
    : theme.colors[colorScheme].data[
      seriesIndex % theme.colors[colorScheme].data.length
    ]
}

export function createClassName (pluginName: string, layerName: string, elementName: string, modifier?: string) {
  const modifierText = modifier ? `--${modifier}` : ''
  return `${createLayerClassName(pluginName, layerName)}__${elementName}${modifierText}`
}

export function createUniID (pluginName: string, layerName: string, elementName: string) {
  const textLength = 5
  // 英文+數字
  const randomText: string = Math.random().toString(36).substr(2, textLength)
  
  return createClassName(pluginName, layerName, elementName, randomText)
}


export function calcAxesSize ({ xAxisPosition, yAxisPosition, width, height }: {
  xAxisPosition: AxisPosition
  yAxisPosition: AxisPosition
  width: number
  height: number
}) {
  if ((xAxisPosition === 'bottom' || xAxisPosition === 'top') && (yAxisPosition === 'left' || yAxisPosition === 'right')) {
    return { width, height }
  } else if ((xAxisPosition === 'left' || xAxisPosition === 'right') && (yAxisPosition === 'bottom' || yAxisPosition === 'top')) {
    return {
      width: height,
      height: width
    }
  }
}

// export function getTicks (minValue: number, maxValue: number, defaultTicks: number | null) {
//   let valueLength = maxValue - minValue
//   if (defaultTicks === null) {
//     if (valueLength <= 1) {
//       return 1
//     } else {
//       // d3.js自動判斷
//       return null
//     }
//   } else if (valueLength < defaultTicks) {
//     return Math.ceil(valueLength)
//   } else {
//     return defaultTicks
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

export function calcContainerPosition (layout: Layout, container: Container, amount: number): ContainerPosition[] {
  // const { gap } = container
  const columnGap = container.columnGap === 'auto'
    ? layout.left + layout.right
    : container.columnGap
  const rowGap = container.rowGap === 'auto'
    ? layout.top + layout.bottom
    : container.rowGap
  const { rowAmount, columnAmount } = (container.rowAmount * container.columnAmount) >= amount
    // 如果container設定的rowAmount和columnAmount的乘積大於或等於amount，則使用目前設定
    ? container
    // 否則計算一個合適的預設值
    : calcGridDimensions(amount)

  return new Array(amount).fill(null).map((_, index) => {
    const columnIndex = index % columnAmount
    const rowIndex = Math.floor(index / columnAmount)

    const width = (layout.width - (columnGap * (columnAmount - 1))) / columnAmount
    const height = (layout.height - (rowGap * (rowAmount - 1))) / rowAmount
    const x = columnIndex * width + (columnIndex * columnGap)
    const y = rowIndex * height + (rowIndex * rowGap)
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

export function calcContainerPositionScaled (layout: Layout, container: Container, amount: number): ContainerPositionScaled[] {
  // const { gap } = container
  const columnGap = container.columnGap === 'auto'
    ? layout.left + layout.right
    : container.columnGap
  const rowGap = container.rowGap === 'auto'
    ? layout.top + layout.bottom
    : container.rowGap
  const { rowAmount, columnAmount } = (container.rowAmount * container.columnAmount) >= amount
    // 如果container設定的rowAmount和columnAmount的乘積大於或等於amount，則使用目前設定
    ? container
    // 否則計算一個合適的預設值
    : calcGridDimensions(amount)
  
  return new Array(amount).fill(null).map((_, index) => {
    const columnIndex = index % columnAmount
    const rowIndex = Math.floor(index / columnAmount)
    
    const width = (layout.width - (columnGap * (columnAmount - 1))) / columnAmount
    const height = (layout.height - (rowGap * (rowAmount - 1))) / rowAmount
    const x = columnIndex * width + (columnIndex * columnGap)
    const y = rowIndex * height + (rowIndex * rowGap)
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