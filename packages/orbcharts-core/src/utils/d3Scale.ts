import * as d3 from 'd3'
import { DEFAULT_DATA_FORMATTER_VALUE_AXIS } from '../defaults'

// scaleLinear - 連續資料 -> 座標
export const createValueToAxisScale = ({
  maxValue = 1,
  minValue = 0,
  axisWidth,
  scaleDomain = DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleDomain,
  scaleRange = DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleRange,
  reverse = false
}: {
  maxValue: number
  minValue: number
  axisWidth: number
  scaleDomain: [number | 'min' | 'auto', number | 'max' | 'auto']
  scaleRange: [number, number] // 0-1
  reverse?: boolean
}) => {
  // if (minValue === maxValue) {
  //   maxValue += 1 // 避免最大及最小值相同造成無法計算scale
  //   minValue -= 1
  // }
  
  // -- 無值補上預設值 --
  const domainMin: number | 'min' | 'auto' = scaleDomain[0] ?? DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleDomain[0]
  const domainMax: number | 'max' | 'auto' = scaleDomain[1] ?? DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleDomain[1]
  const rangeMin: number = scaleRange[0] ?? DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleRange[0]
  const rangeMax: number = scaleRange[1] ?? DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleRange[1]

  // -- 'auto' | 'max' | 'min' 替換成實際值 --
  let domainMinValue: number = (() => {
    if (domainMin === 'auto') {
      return minValue < 0 ? minValue : 0
    } else if (domainMin === 'min') {
      return minValue
    } else {
      return domainMin
    }
  })()
  
  let domainMaxValue: number = (() => {
    if (domainMax === 'auto') {
      return maxValue >= 0 ? maxValue : 0
    } else if (domainMax === 'max') {
      return maxValue
    } else {
      return domainMax
    }
  })()
  // let rangeMinValue = axisWidth * rangeMin
  // let rangeMaxValue = axisWidth * rangeMax

  // -- 計算padding --
  // if (padding > 0) {
  //   const stepAmount = maxValue - minValue + (padding * 2)
  //   const eachStepWidth = axisWidth / stepAmount
  //   const paddingWidth = eachStepWidth * padding
  //   rangeMinValue += paddingWidth
  //   rangeMaxValue -= paddingWidth
  // }

  // -- 依場景大小換算 --
  const axisDomainMinValue = maxValue - (maxValue - domainMinValue) / (1 - rangeMin)
  const axisDomainMaxValue = domainMaxValue / rangeMax
  
  // return d3.scaleLinear()
  //   .domain([domainMinValue, domainMaxValue])
  //   .range([rangeMinValue, rangeMaxValue])
  if (reverse) {
    return d3.scaleLinear()
      .domain([axisDomainMinValue, axisDomainMaxValue])
      .range([axisWidth, 0])
  } else {
    console.log('domain', [axisDomainMinValue, axisDomainMaxValue])
    return d3.scaleLinear()
      .domain([axisDomainMinValue, axisDomainMaxValue])
      .range([0, axisWidth])
  }
}

// scaleLinear - 座標 -> 連續資料
export const createAxisToValueScale = ({
  maxValue = 1,
  minValue = 0,
  axisWidth,
  scaleDomain = DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleDomain,
  scaleRange = DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleRange,
  reverse = false
}: {
  maxValue: number
  minValue: number
  axisWidth: number
  scaleDomain: [number | 'min' | 'auto', number | 'max' | 'auto']
  scaleRange: [number, number] // 0-1
  reverse?: boolean
}) => {
  if (minValue === maxValue) {
    maxValue += 1 // 避免最大及最小值相同造成無法計算scale
    minValue -= 1
  }
  
  // -- 無值補上預設值 --
  const domainMin: number | 'min' | 'auto' = scaleDomain[0] ?? DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleDomain[0]
  const domainMax: number | 'max' | 'auto' = scaleDomain[1] ?? DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleDomain[1]
  const rangeMin: number = scaleRange[0] ?? DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleRange[0]
  const rangeMax: number = scaleRange[1] ?? DEFAULT_DATA_FORMATTER_VALUE_AXIS.scaleRange[1]

  // -- 'auto' | 'max' | 'min' 替換成實際值 --
  let domainMinValue: number = (() => {
    if (domainMin === 'auto') {
      return minValue < 0 ? minValue : 0
    } else if (domainMin === 'min') {
      return minValue
    } else {
      return domainMin
    }
  })()
  
  let domainMaxValue: number = (() => {
    if (domainMax === 'auto') {
      return maxValue >= 0 ? maxValue : 0
    } else if (domainMax === 'max') {
      return maxValue
    } else {
      return domainMax
    }
  })()
  // let rangeMinValue = axisWidth * rangeMin
  // let rangeMaxValue = axisWidth * rangeMax

  // -- 計算padding --
  // if (padding > 0) {
  //   const stepAmount = maxValue - minValue + (padding * 2)
  //   const eachStepWidth = axisWidth / stepAmount
  //   const paddingWidth = eachStepWidth * padding
  //   rangeMinValue += paddingWidth
  //   rangeMaxValue -= paddingWidth
  // }

  // -- 依場景大小換算 --
  const axisDomainMinValue = maxValue - (maxValue - domainMinValue) / (1 - rangeMin)
  const axisDomainMaxValue = domainMaxValue / rangeMax
  
  // return d3.scaleLinear()
  //   .domain([domainMinValue, domainMaxValue])
  //   .range([rangeMinValue, rangeMaxValue])
  if (reverse) {
    return d3.scaleLinear()
      .domain([axisWidth, 0])
      .range([axisDomainMinValue, axisDomainMaxValue])
  } else {
    return d3.scaleLinear()
      .domain([0, axisWidth])
      .range([axisDomainMinValue, axisDomainMaxValue])
  }
}

// scalePoint - 非連續資料 -> 座標
export const createLabelToAxisScale = ({ axisLabels, axisWidth, padding = 0.5 }: {
  axisLabels: string[]
  axisWidth: number
  padding?: number
  // reverse?: boolean  
}) => {
  let range: [d3.NumberValue, d3.NumberValue] = [0, axisWidth]

  return d3.scalePoint()
      .domain(axisLabels)
      .range(range)
      .padding(padding)
}

// scaleQuantize - 座標 -> 非連續資料索引
export const createAxisToLabelIndexScale = ({ axisLabels, axisWidth, padding = 0, reverse = false }:{
  axisLabels: string[] | Date[],
  axisWidth: number
  padding?: number
  reverse?: boolean
}) => {

  let range: number[] = axisLabels.map((d: string | Date, i: number) => i)
  if (reverse) {
    range.reverse()
  }
  // if (reverse) {
  //   range = axisLabels.map((d: string | Date, i: number) => axisLabels.length - 1 - i)
  // } else {
  //   range = axisLabels.map((d: string | Date, i: number) => i)
  // }
  const step = range.length - 1 + (padding * 2) // 圖軸刻度分段數量
  const stepWidth = axisWidth / step
  const rangePadding = stepWidth * padding - (stepWidth * 0.5) // 實際要計算的範圍是圖軸左右那邊增加0.5

  // console.log('rangePadding', rangePadding)
  return d3.scaleQuantize<number>()
    .domain([rangePadding, axisWidth - rangePadding])
    .range(range)
}
