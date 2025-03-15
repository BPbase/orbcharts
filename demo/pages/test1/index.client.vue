<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { SeriesChart } from '../../../packages/orbcharts-core/src'
import { Rose, RoseLabels, Pie, PieLabels, Bubbles, SeriesTooltip, SeriesLegend } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_GRID_HORIZONTAL } from '../../../packages/orbcharts-presets-basic/src/index'
import seriesData4 from '../../../packages/orbcharts-demo/src/data/seriesData4'

// import { GridChart, PRESET_GRID_HORIZONTAL, MultiBars } from 'orbcharts'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new SeriesChart(el!, {
    // preset: {
    //     "chartParams": {
            
    //         "highlightTarget": "series"
    //     },
    // }
  })

  // chart.dataFormatter$.next({
  //   grid: {
  //     groupAxis: {
  //       position: 'left'
  //     },
  //     valueAxis: {
  //       position: 'bottom'
  //     }
  //   }
  // })

  const pie = new Pie()

  const pieLabels = new PieLabels()

  const bubbles = new Bubbles()

  const rose = new Rose()
  
  const roseLabels = new RoseLabels()

  const seriesLegend = new SeriesLegend()

  rose.params$.next({
    arcScaleType: 'area'
  })
  // bars.params$.next({
    
  // })

  // roseLabels.params$.next({
  //   labelColorType: 'series'
  // })

  

  chart.dataFormatter$.next({
    // sumSeries: true,
    // separateSeries: true
    // container: {
    //   rowAmount: 1,
    //   columnAmount: 3
    // }
    // visibleFilter: (datum, context) => {
    //   if (datum.id === 'series_0_0') {
    //     return false
    //   }
    //   return true
    // }
    seriesLabels: ['已婚', '未婚'],
    // separateSeries: true,
    separateLabel: true
  })

  // seriesLegend.params$.next({
  //   position: 'bottom'
  // })

  // setTimeout(() => {
  //   chart.dataFormatter$.next({
  //     sumSeries: true,
  //     separateSeries: false
  //   })
  //   // chart.dataFormatter$.next({
  //   //   sumSeries: false,
  //   //   separateSeries: true
  //   // })
  //   // setTimeout(() => {
  //   //   chart.dataFormatter$.next({
  //   //     sumSeries: true,
  //   //     separateSeries: true
  //   //   })
  //   //   setTimeout(() => {
  //   //     chart.dataFormatter$.next({
  //   //       sumSeries: true,
  //   //       separateSeries: false
  //   //     })
  //   //     setTimeout(() => {
  //   //       chart.dataFormatter$.next({
  //   //         sumSeries: false,
  //   //         separateSeries: false
  //   //       })
  //   //     }, 2000)
  //   //   }, 2000)
  //   // }, 2000)
  //   chart.plugins$.next([rose, roseLabels, new SeriesTooltip()])

  //   setTimeout(() => {
  //     chart.plugins$.next([rose, roseLabels, new SeriesLegend(), new SeriesTooltip()])
  //   }, 2000)

  // }, 2000)

  chart.chartParams$.subscribe(data => {
    console.log(data)
  })


  chart.chartParams$.next({
    // highlightTarget: 'series'
  })
  
  chart.plugins$.next([pie, pieLabels, seriesLegend, new SeriesTooltip()])

  // setTimeout(() => {
    pie.params$.next({
      innerRadius: 0.5
    })
  // })
  
  chart.data$.next(seriesData4)
  
  

  
})

</script>