import * as d3 from 'd3'
import type { ComputedDataSeries, ComputedDatumSeries, EventName, EventSeries, HighlightTarget } from '@orbcharts/core'
// import type { D3PieDatum, PieDatum } from '../types'

// 由d3.pie()建出來的資料格式
export interface D3PieDatum {
  data: any
  index: number,
  value: number,
  startAngle: number,
  endAngle: number,
  padAngle: number,  
}

export interface PieDatum extends D3PieDatum {
  data: ComputedDatumSeries
  id: string
}

export function makePieData ({ data, startAngle, endAngle }: {
  data: ComputedDatumSeries[]
  startAngle: number
  endAngle: number
  // itemLabels: string[]
  // arcLabels: string[]
}): PieDatum[] {
  let pie = d3.pie<any, any>()
    .startAngle(startAngle)
    // .endAngle(startAngle + (endAngle - startAngle) * t)
    .endAngle(endAngle)
    .value(d => d.value)
    // .value((d) => d.visible == false ? 0 : d.value)
    // .sort(null) // 不要排序
    .sort((a, b) => a.seq - b.seq)
    // .sort((a: any, b: any) => {
    //   return b.value - a.value
    // })
    // .sort(d3.ascending)
  const pieData = pie(data)
  return pieData.map((d: D3PieDatum, i: number) => {
    // const itemLabel = d.data.itemLabel
    let _d: any = d
    _d.id = d.data.id
    return _d
    // return {
    //   ...d,
    //   itemIndex: itemLabels.indexOf(itemLabel),
    //   itemLabel,
    //   id: d.data.id,
    // }
  })
}