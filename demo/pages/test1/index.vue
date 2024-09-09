<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { SeriesChart } from '../../../packages/orbcharts-core/src'
import { Pie, PieLabels, Bubbles, Tooltip } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_GRID_HORIZONTAL } from '../../../packages/orbcharts-presets-basic/src/index'
import { seriesData2 } from '../../const/data/seriesData2'

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


  // bars.params$.next({
    
  // })

  chart.dataFormatter$.next({
    separateSeries: true,
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
  })

  setTimeout(() => {
    chart.dataFormatter$.next({
      separateSeries: false
    })
    setTimeout(() => {
      chart.dataFormatter$.next({
        separateSeries: true
      })
    }, 2000)
  }, 2000)

  chart.chartParams$.subscribe(data => {
    console.log(data)
  })


  chart.chartParams$.next({
    // highlightTarget: 'series'
  })
  
  chart.plugins$.next([pie, pieLabels, new Tooltip()])
  
  chart.data$.next(seriesData2)
  
  

  
})

</script>