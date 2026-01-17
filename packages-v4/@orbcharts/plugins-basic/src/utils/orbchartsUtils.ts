import type {
  // AxisPosition,
  ColorType,
  Theme,
  ModelDatumBase,
  ModelDatumSeries,
  ModelType,
  
  // ChartParams,
  // ComputedDatumBase,
  // ComputedDatumBaseValue,
  // ComputedDatumBaseSeries,
  // ComputedDatumBaseCategory
} from '../../../core/src/types'
import { Layout, GraphicContainer, ContainerPosition, ContainerPositionScaled } from '../types/PluginParams'
import { getMinMax } from './commonUtils'
import { isLightColor } from './d3Utils'
import type { AxisPosition } from '../types/PluginParams'
import type { ComputedDatum } from '../types/ComputedData'

// 取得最小及最大值 - datum格式陣列資料
export function getMinMaxValue<T extends ModelType> (data: ComputedDatum<T>[]): [number, number] {
  const arr = data
    .filter(d => d.value != null && d.visible != false)
    .map(d => d.value as number)
  return getMinMax(arr)
}

export function getColorScheme (themeColorScheme: 'light' | 'dark' | 'auto') {
  if (themeColorScheme === 'auto') {
    const MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    return MediaQueryList.matches ? 'dark' : 'light'
  } else {
    return themeColorScheme
  }
}

// 取得colorType顏色
export function getColor (colorType: ColorType, fullChartParams: Theme) {
  const colorScheme = getColorScheme(fullChartParams.colorScheme)
  const colors = fullChartParams.colors[colorScheme]
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
export function getDatumColor ({ datum, colorType, fullChartParams }: { datum: ModelDatumBase, colorType: ColorType, fullChartParams: Theme }) {
  const colors = fullChartParams.colors[getColorScheme(fullChartParams.colorScheme)]

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

export function getClassName (pluginName: string, elementName: string, modifier?: string) {
  const modifierText = modifier ? `--${modifier}` : ''
  return `orbcharts-${pluginName}__${elementName}${modifierText}`
}

export function getUniID (pluginName: string, elementName: string) {
  const textLength = 5
  // 英文+數字
  const randomText: string = Math.random().toString(36).substr(2, textLength)
  
  return getClassName(pluginName, elementName, randomText)
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

export function calcContainerPosition (layout: Layout, container: GraphicContainer, amount: number): ContainerPosition[] {
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

export function calcContainerPositionScaled (layout: Layout, container: GraphicContainer, amount: number): ContainerPositionScaled[] {
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