import * as d3 from 'd3'
import { DATA_FORMATTER_VALUE_AXIS } from '../defaults'

// scaleLinear - 連續資料對應到比較尺座標上
export const createAxisLinearScale = ({
  maxValue = 1,
  minValue = 0,
  axisWidth,
  scaleDomain = DATA_FORMATTER_VALUE_AXIS.scaleDomain,
  scaleRange = DATA_FORMATTER_VALUE_AXIS.scaleRange,
}: {
  maxValue: number
  minValue: number
  axisWidth: number
  scaleDomain: [number | 'auto', number | 'auto']
  scaleRange: [number, number] // 0-1
}) => {

  const domainMin: number | 'auto' = scaleDomain[0] ?? DATA_FORMATTER_VALUE_AXIS.scaleDomain[0]
  const domainMax: number | 'auto' = scaleDomain[1] ?? DATA_FORMATTER_VALUE_AXIS.scaleDomain[1]
  const rangeMin: number = scaleRange[0] ?? DATA_FORMATTER_VALUE_AXIS.scaleRange[0]
  const rangeMax: number = scaleRange[1] ?? DATA_FORMATTER_VALUE_AXIS.scaleRange[1]

  // const _minValue = domainMin === 'auto' ? minValue : domainMin
  // const domainMinValue: number = maxValue - (maxValue - _minValue) / (1 - rangeMin)
  // const _maxValue = domainMax === 'auto' ? maxValue : domainMax
  // const domainMaxValue: number = _maxValue / rangeMax

  // return d3.scaleLinear()
  //   .domain([domainMinValue, domainMaxValue])
  //   .range([0, axisWidth])

  const domainMinValue = domainMin === 'auto' ? minValue : domainMin
  const domainMaxValue = domainMax === 'auto' ? maxValue : domainMax
  let rangeMinValue = axisWidth * rangeMin
  let rangeMaxValue = axisWidth * rangeMax
  // if (padding > 0) {
  //   const stepAmount = maxValue - minValue + (padding * 2)
  //   const eachStepWidth = axisWidth / stepAmount
  //   const paddingWidth = eachStepWidth * padding
  //   rangeMinValue += paddingWidth
  //   rangeMaxValue -= paddingWidth
  // }
  
  return d3.scaleLinear()
    .domain([domainMinValue, domainMaxValue])
    .range([rangeMinValue, rangeMaxValue])
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
