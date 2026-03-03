'use client'

import { useState, useEffect, useRef } from 'react'
import type { RawData } from '@orbcharts/core/types'
import { OrbCharts } from '@orbcharts/core/index'
import { SeriesSeparableGraphic } from '@orbcharts/plugins-basic/index'

const pieData: RawData = [
  { series: 'A', value: 30 },
  { series: 'A', value: 50 },
  { series: 'A', value: 20 },
  { series: 'B', value: 70 },
  { series: 'C', value: 45 },
  { series: 'D', value: 85 },
]

export default function ChartEntity() {

  const domRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<OrbCharts | null>(null)

  useEffect(() => {
    
    // console.log(domRef.current)

    const seriesPlugin = new SeriesSeparableGraphic({
      Pie: {
        outerRadius: 0.85,
        innerRadius: 0.5,
        outerRadiusWhileHighlight: 0.9,
        startAngle: 0,
        endAngle: 6.283185307179586,
        padAngle: 0,
        strokeColorType: "background",
        strokeWidth: 1,
        cornerRadius: 0
      }
    })

    const chart = new OrbCharts(domRef.current!, {
      data: pieData,
      encoding: {},
      // plugins: [],
      theme: {
        
      },
      plugins: [seriesPlugin]
    })

    // seriesPlugin.updateParams({
    //   Pie: {
    //     outerRadius: 0.85,
    //     innerRadius: 0.5,
    //     outerRadiusWhileHighlight: 0.9,
    //     startAngle: 0,
    //     endAngle: 6.283185307179586,
    //     padAngle: 0,
    //     strokeColorType: "background",
    //     strokeWidth: 1,
    //     cornerRadius: 0
    //   }
    // })

    // seriesPlugin.showOnly(['Pie'])
    
    // chart.updateEncoding({})
    // chart.updateTheme({})
    // chart.setPlugins([seriesPlugin])
    // chart.setData(pieData)
    chart.context.seriesData$.subscribe(data => {
      console.log('Series Data Updated:', data)
    })
    
    console.log(chart)

  }, [])

  return <div ref={domRef}></div>
}