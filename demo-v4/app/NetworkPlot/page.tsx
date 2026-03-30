'use client'

import { useState, useEffect, useRef } from 'react'
import type { RawData } from '@orbcharts/core/types'
import { OrbCharts } from '@orbcharts/core/index'
import { NetworkPlot, Tooltip, Legend } from '@orbcharts/plugins-basic/index'

const rawData: RawData = [
    {
        "id": "id0",
        "name": "label0",
        "value": 19800000,
        "series": "series1"
    },
    {
        "id": "id1",
        "value": 0,
        "series": "series2"
    },
    {
        "id": "id2",
        "value": 0,
        "series": "series2"
    },
    {
        "id": "id3",
        "name": "label1",
        "value": 5114269,
        "series": "series1"
    },
    {
        "id": "id4",
        "name": "label2",
        "value": 1093200,
        "series": "series1"
    },
    {
        "id": "id5",
        "name": "label3",
        "value": 32007217,
        "series": "series1"
    },
    {
        "id": "id6",
        "value": 0,
        "series": "series2"
    },
    {
        "id": "id7",
        "name": "label4",
        "value": 18743266,
        "series": "series1"
    },
    {
        "id": "id8",
        "value": 0,
        "series": "series2"
    },
    {
        "id": "id9",
        "name": "label5",
        "value": 1000000,
        "series": "series1"
    },
    {
        "id": "id10",
        "value": 0,
        "series": "series2"
    },
    {
        "id": "id11",
        "name": "label6",
        "value": 4631703,
        "series": "series1"
    },
    {
        "id": "id12",
        "value": 0,
        "series": "series2"
    },
    {
        "id": "id13",
        "name": "label7",
        "value": 3399144,
        "series": "series1"
    },
    {
        "id": "id14",
        "name": "label8",
        "series": "series2",
        "source": "id5",
        "target": "id0",
        "value": 100
    },
    {
        "id": "id15",
        "name": "",
        "series": "series2",
        "source": "id5",
        "target": "id3",
        "value": 100
    },
    {
        "id": "id16",
        "name": "",
        "series": "series2",
        "source": "id5",
        "target": "id4",
        "value": 50
    },
    {
        "id": "id17",
        "name": "",
        "series": "series2",
        "source": "id11",
        "target": "id5",
        "value": 20.752235715203
    },
    {
        "id": "id18",
        "name": "",
        "series": "series2",
        "source": "id7",
        "target": "id5",
        "value": 27.472781543551
    },
    {
        "id": "id19",
        "name": "",
        "series": "series1",
        "source": "id6",
        "target": "id5",
        "value": 0
    },
    {
        "id": "id20",
        "name": "",
        "series": "series1",
        "source": "id1",
        "target": "id5",
        "value": 0
    },
    {
        "id": "id21",
        "name": "",
        "series": "series1",
        "source": "id8",
        "target": "id5",
        "value": 0
    },
    {
        "id": "id22",
        "name": "",
        "series": "series1",
        "source": "id12",
        "target": "id5",
        "value": 0
    },
    {
        "id": "id23",
        "name": "",
        "series": "series2",
        "source": "id11",
        "target": "id7",
        "value": 100
    },
    {
        "id": "id24",
        "name": "",
        "series": "series2",
        "source": "id0",
        "target": "id9",
        "value": 100
    },
    {
        "id": "id25",
        "name": "",
        "series": "series1",
        "source": "id10",
        "target": "id11",
        "value": 29.495571697929
    },
    {
        "id": "id26",
        "name": "label20",
        "series": "series1",
        "source": "id2",
        "target": "id11",
        "value": 20.208972073742
    },
    {
        "id": "id27",
        "name": "",
        "series": "series2",
        "source": "id5",
        "target": "id13",
        "value": 100
    }
]

export default function NetworkPlotPage() {

  const domRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<OrbCharts | null>(null)

  useEffect(() => {
    
    // console.log(domRef.current)

    const networkPlot = new NetworkPlot({
      ForceDirectedBubbles: {}
      // styles: {
      //   padding: {
      //     top: 60,
      //     right: 60,
      //     bottom: 60,
      //     left: 60
      //   },
      //   highlightTarget: 'datum',
      //   highlightDefault: null,
      //   unhighlightedOpacity: 0.3,
      //   transitionDuration: 800,
      //   transitionEase: 'easeCubic'
      // },
      // visibleFilter: (datum: any) => true,
      // sort: null,
      // // seriesLabels: [],
      // container: {
      //   columnAmount: 1,
      //   rowAmount: 1,
      //   columnGap: 'auto',
      //   rowGap: 'auto',
      // },
      // separateSeries: false,
      // separateName: false,
      // // sumSeries: false,
      // datasetIndex: 0
    })

    const tooltip = new Tooltip({
      Tooltip: {}
    })

    const legend = new Legend({
      Legend: {}
    })

    const chart = new OrbCharts(domRef.current!, {
      data: rawData,
      encoding: {
        // value: {
        //   sort: 'asc'
        // },
        // color: {
        //   from: 'series'
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
      plugins: [networkPlot, tooltip, legend]
    })

    const subscription = chart.context.graphData$.subscribe(data => {
      console.log('Graph Data Updated:', data)
    })

    return () => {
      subscription.unsubscribe()
      chart.destroy()
    }

  }, [])

  return <div ref={domRef}></div>
}