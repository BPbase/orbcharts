import * as d3 from 'd3'
import { DATA_FORMATTER_VALUE_AXIS_DEFAULT } from '../defaults'

// scaleLinear - 連續資料對應到比例尺座標上
export const createAxisLinearScale = ({
  maxValue = 1,
  minValue = 0,
  axisWidth,
  scaleDomain = DATA_FORMATTER_VALUE_AXIS_DEFAULT.scaleDomain,
  scaleRange = DATA_FORMATTER_VALUE_AXIS_DEFAULT.scaleRange,
}: {
  maxValue: number
  minValue: number
  axisWidth: number
  scaleDomain: [number | 'auto', number | 'auto']
  scaleRange: [number, number] // 0-1
}) => {
  // -- 無值補上預設值 --
  const domainMin: number | 'auto' = scaleDomain[0] ?? DATA_FORMATTER_VALUE_AXIS_DEFAULT.scaleDomain[0]
  const domainMax: number | 'auto' = scaleDomain[1] ?? DATA_FORMATTER_VALUE_AXIS_DEFAULT.scaleDomain[1]
  const rangeMin: number = scaleRange[0] ?? DATA_FORMATTER_VALUE_AXIS_DEFAULT.scaleRange[0]
  const rangeMax: number = scaleRange[1] ?? DATA_FORMATTER_VALUE_AXIS_DEFAULT.scaleRange[1]

  // -- 'auto'提換成實際值 --
  const domainMinValue = domainMin === 'auto' ? minValue : domainMin
  const domainMaxValue = domainMax === 'auto' ? maxValue : domainMax
  
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
  return d3.scaleLinear()
    .domain([axisDomainMinValue, axisDomainMaxValue])
    .range([0, axisWidth])
}

// scalePoint - 非連續資料對應到比例尺座標上
export const createAxisPointScale = ({ axisLabels, axisWidth, padding = 0.5 }: {
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

// scaleQuantize - 比例尺座標對應非連續資料索引
export const createAxisQuantizeScale = ({ axisLabels, axisWidth, padding = 0.5, reverse = false }:{
  axisLabels: string[] | Date[],
  axisWidth: number
  padding?: number
  reverse?: boolean
}) => {
  const rangePadding = 0

  let range: number[] = axisLabels.map((d: string | Date, i: number) => i)
  if (reverse) {
    range.reverse()
  }
  // if (reverse) {
  //   range = axisLabels.map((d: string | Date, i: number) => axisLabels.length - 1 - i)
  // } else {
  //   range = axisLabels.map((d: string | Date, i: number) => i)
  // }

  return d3.scaleQuantize<number>()
    .domain([- rangePadding, axisWidth + rangePadding])
    .range(range)
}
