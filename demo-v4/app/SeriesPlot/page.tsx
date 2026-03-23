'use client'

import { useState, useEffect, useRef } from 'react'
import type { RawData } from '@orbcharts/core/types'
import { OrbCharts } from '@orbcharts/core/index'
import { SeriesPlot, Tooltip } from '@orbcharts/plugins-basic/index'

const data: RawData = [
  { series: 'A', category: 'category1', value: 30, name: 'a' },
  { series: 'A', category: 'category2', value: 20, name: 'a' },
  { series: 'A', category: 'category3', value: 45, name: 'a' },
  // { series: 'A', category: 'category1', value: 50 },
  // { series: 'A', category: 'category2', value: 30 },
  // { series: 'A', category: 'category3', value: 40 },
  // { series: 'A', category: 'category1', value: 20 },
  // { series: 'A', category: 'category2', value: 30 },
  // { series: 'A', category: 'category3', value: 40 },
  { series: 'B', category: 'category1', value: 70 },
  { series: 'B', category: 'category2', value: 80 },
  { series: 'B', category: 'category3', value: 90 },
  { series: 'C', category: 'category1', value: 45 },
  { series: 'C', category: 'category2', value: 55 },
  { series: 'C', category: 'category3', value: 65 },
  { series: 'D', category: 'category2', value: 85 },
  { series: 'D', category: 'category3', value: 105 },
  // { series: 'D', category: 'category3', value: 75 },
]

export default function Grid() {

  const domRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<OrbCharts | null>(null)

  useEffect(() => {
    
    // console.log(domRef.current)

    const seriesPlot = new SeriesPlot({
      Bars: {},
      ValueAxis: {},
      CategoryAxis: {},
      CategoryZoom: {},
      styles: {
        padding: {
          top: 60,
          right: 60,
          bottom: 60,
          left: 60
        },
        highlightTarget: 'datum',
        highlightDefault: null,
        unhighlightedOpacity: 0.3,
        transitionDuration: 800,
        transitionEase: 'easeCubic'
      },
      visibleFilter: (datum: any) => true,
      // seriesLabels: [],
      container: {
        columnAmount: 1,
        rowAmount: 1,
        columnGap: 'auto',
        rowGap: 'auto',
      },
      separateSeries: false,
      datasetIndex: 0
    })

    const tooltip = new Tooltip({
      Tooltip: {}
    })
    // tooltip.showOnly(['Tooltip'])

    const chart = new OrbCharts(domRef.current!, {
      data: data,
      encoding: {
        
      },
      // plugins: [],
      theme: {
        // colorScheme: 'light',
        // colors: {
        //   light: {
        //     data: [
        //       "#0088FF",
        //       "#FF3232",
        //       "#38BEA8",
        //       "#6F3BD5",
        //       "#314285",
        //       "#42C724",
        //       "#D52580",
        //       "#F4721B",
        //       "#D117EA",
        //       "#7E7D7D"
        //     ],
        //     primary: '#000000',
        //     secondary: '#e0e0e0',
        //     dataContrast: ['#ffffff', '#000000'],
        //     background: '#FFFFFF'
        //   },
        //   dark: {
        //     data: [
        //       "#4BABFF",
        //       "#FF6C6C",
        //       "#7DD3C4",
        //       "#8E6BC9",
        //       "#5366AC",
        //       "#86DC72",
        //       "#FF72BB",
        //       "#F9B052",
        //       "#EF76FF",
        //       "#C4C4C4"
        //     ],
        //     primary: '#FFFFFF',
        //     secondary: '#e0e0e0',
        //     dataContrast: ['#ffffff', '#000000'],
        //     background: '#000000'
        //   }
        // },
        // fontSize: '0.875rem'
      },
      plugins: [seriesPlot, tooltip]
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
    //   },
    // })

    // seriesPlugin.showOnly(['Pie'])
    
    // chart.updateEncoding({})
    // chart.updateTheme({})
    // chart.setPlugins([seriesPlugin])
    // chart.setData(data)
    chart.context.gridData$.subscribe(data => {
      console.log('Grid Data Updated:', data)
    })
    
    console.log(chart)

  }, [])

  return <div ref={domRef}></div>
}