import type {
  AxisPosition,
  ColorType,
  ChartParams,
  ComputedDatumBase,
  ComputedDatumBaseValue,
  ComputedDatumBaseSeries,
  ComputedDatumBaseCategory } from '../../lib/core-types'
import { getMinMax } from './commonUtils'

// 取得最小及最大值 - datum格式陣列資料
export function getMinMaxValue (data: (ComputedDatumBase & ComputedDatumBaseValue)[]): [number, number] {
  const arr = data
    .filter(d => d.value != null && d.visible != false)
    .map(d => d.value as number)
  return getMinMax(arr)
}

// 取得colorType顏色
export function getColor (colorType: ColorType, fullChartParams: ChartParams) {
  const colors = fullChartParams.colors[fullChartParams.colorScheme]
  // 對應series資料中第1個顏色
  if (colorType === 'label') {
    return colors.label[0]
  }
  // 對應colorType設定的顏色
  // return colors[colorType] != null
  //   ? colors[colorType]
  //   : colors.primary
  return colorType == 'none'
    ? 'none'
    : colors[colorType] != undefined
      ? colors[colorType]
      : colors.primary // 如果比對不到
}

export function getSeriesValueColor () {

}

export function getCategoryValueColor ({ datum, colorType, fullChartParams }: { datum: ComputedDatumBaseCategory, colorType: ColorType, fullChartParams: ChartParams }) {

}

// // 取得Series顏色 @Q@ 待重構完後刪除
// export function getSeriesColor (seriesIndex: number, fullChartParams: ChartParams) {
//   const colorIndex = seriesIndex < fullChartParams.colors[fullChartParams.colorScheme].series.length
//     ? seriesIndex
//     : seriesIndex % fullChartParams.colors[fullChartParams.colorScheme].series.length
//   return fullChartParams.colors[fullChartParams.colorScheme].series[colorIndex]
// }

// 取得Datum顏色 @Q@ 待重構完後刪除
export function getDatumColor ({ datum, colorType, fullChartParams }: { datum: ComputedDatumBase, colorType: ColorType, fullChartParams: ChartParams }) {
  // 對應series資料中的顏色
  if (colorType === 'label') {
    if ((datum as unknown as ComputedDatumBaseSeries).color) {
      return (datum as unknown as ComputedDatumBaseSeries).color
    } else {
      // 非series類型的資料則回傳陣列中第1個顏色
      return fullChartParams.colors[fullChartParams.colorScheme].label[0]
    }
  }
  // 對應colorType設定的顏色
  return colorType == 'none'
    ? 'none' 
    : fullChartParams.colors[fullChartParams.colorScheme][colorType] != undefined
      ? fullChartParams.colors[fullChartParams.colorScheme][colorType]
      : fullChartParams.colors[fullChartParams.colorScheme].primary
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