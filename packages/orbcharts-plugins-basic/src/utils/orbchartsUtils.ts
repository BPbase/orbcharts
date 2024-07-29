import type { AxisPosition, ColorType, ChartParams, ComputedDatumBase, ComputedDatumSeriesValue } from '@orbcharts/core'
import { getMinAndMax } from './commonUtils'

// 取得最小及最大值 - datum格式陣列資料
export function getMinAndMaxValue (data: ComputedDatumBase[]): [number, number] {
  const arr = data
    .filter(d => d.value != null && d.visible != false)
    .map(d => d.value as number)
  return getMinAndMax(arr)
}

// 取得colorType顏色
export function getColor (colorType: ColorType, fullChartParams: ChartParams) {
  const colors = fullChartParams.colors[fullChartParams.colorScheme]
  // 對應series資料中第1個顏色
  if (colorType === 'series') {
    return colors.series[0]
  }
  // 對應colorType設定的顏色
  return colors[colorType] != null
    ? colors[colorType]
    : colors.primary
}

// 取得Series顏色
export function getSeriesColor (seriesIndex: number, fullChartParams: ChartParams) {
  const colorIndex = seriesIndex < fullChartParams.colors[fullChartParams.colorScheme].series.length
    ? seriesIndex
    : seriesIndex % fullChartParams.colors[fullChartParams.colorScheme].series.length
  return fullChartParams.colors[fullChartParams.colorScheme].series[colorIndex]
}

// 取得Datum顏色
export function getDatumColor ({ datum, colorType, fullChartParams }: { datum: ComputedDatumBase, colorType: ColorType, fullChartParams: ChartParams }) {
  // 對應series資料中的顏色
  if (colorType === 'series') {
    if ((datum as unknown as ComputedDatumSeriesValue).color) {
      return (datum as unknown as ComputedDatumSeriesValue).color
    } else {
      // 非series類型的資料則回傳陣列中第1個顏色
      return fullChartParams.colors[fullChartParams.colorScheme].series[0]
    }
  }
  // 對應colorType設定的顏色
  return fullChartParams.colors[fullChartParams.colorScheme][colorType] != null
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

