'use client'

import { useState, useEffect, useRef } from 'react'
import type { RawData } from '@orbcharts/core/types'
import { OrbCharts } from '@orbcharts/core/index'
import { CompositionPlot } from '@orbcharts/plugins-basic/index'

const pieData: RawData = [
  { series: 'A', value: 30, name: 'a' },
  { series: 'A', value: 50 },
  { series: 'B', value: 70 },
  { series: 'A', value: 20 },
  { series: 'C', value: 45 },
  { series: 'D', value: 85 },
  { series: 'C', value: 45 },
  { series: 'D', value: 85 },
]

export default function Series() {

  const domRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<OrbCharts | null>(null)

  useEffect(() => {
    
    // console.log(domRef.current)

    const seriesPlugin = new CompositionPlot({
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
      },
      // Bubbles: {},
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
      sort: null,
      // seriesLabels: [],
      container: {
        columnAmount: 1,
        rowAmount: 1,
        columnGap: 'auto',
        rowGap: 'auto',
      },
      separateSeries: false,
      separateName: false,
      // sumSeries: false,
      datasetIndex: 0
    })

    const chart = new OrbCharts(domRef.current!, {
      data: pieData,
      encoding: {
        value: {
          sort: 'asc'
        },
        // color: {
        //   from: 'category'
        // }
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
    //   },
    // })

    // seriesPlugin.showOnly(['Pie'])
    
    // chart.updateEncoding({})
    // chart.updateTheme({})
    // chart.setPlugins([seriesPlugin])
    // chart.setData(pieData)
    const subscription = chart.context.seriesData$.subscribe(data => {
      console.log('Series Data Updated:', data)
    })
    
    console.log(chart)

    return () => {
      subscription.unsubscribe()
      chart.destroy()
    }

  }, [])

  return <div ref={domRef}></div>
}