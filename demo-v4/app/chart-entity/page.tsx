'use client'

import { useState, useEffect, useRef } from 'react'
import type { RawData } from '@orbcharts/core/types'
import { OrbCharts } from '@orbcharts/core/index'
import { SeriesSeparableGraphic } from '@orbcharts/plugins-basic/index'

const pieData: RawData = [
  { category: 'A', value: 30 },
  { category: 'A', value: 50 },
  { category: 'A', value: 20 },
  { category: 'B', value: 70 },
  { category: 'C', value: 45 },
  { category: 'D', value: 85 },
]

export default function ChartEntity() {

  const domRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<OrbCharts | null>(null)

  useEffect(() => {
    
    // console.log(domRef.current)

    const seriesPlugin = new SeriesSeparableGraphic({
      Pie: {}
    })

    const chart = new OrbCharts(domRef.current!, {
      data: pieData,
      encoding: {},
      // plugins: [],
      theme: {
        
      },
      plugins: [seriesPlugin]
    })
    
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