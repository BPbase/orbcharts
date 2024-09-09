<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { SeriesChart } from '../../../packages/orbcharts-core/src'
import { Pie, PieLabels, Bubbles, Tooltip } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_MULTI_GRID_2_GRID_SLOT } from '../../../packages/orbcharts-presets-basic/src/index'
import { seriesData3 } from '../../const/data/seriesData3'

let intervalId: any

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new SeriesChart(el!, {
    // preset: PRESET_MULTI_GRID_2_GRID_SLOT
  })

  const pie = new Pie()
  const pieLabels = new PieLabels()
  const bubbles = new Bubbles()
  const tooltip = new Tooltip()
  // chart!.plugins$.next([ multiGroupAxis, overlappingValueAxes, multiBars, multiLines, multiDots, multiGridLegend, tooltip])

  chart.chartParams$.next({
    padding: {
      top: 200,
      right: 200,
      bottom: 200,
      left: 200
    },
    highlightTarget: 'series'
  })
  chart!.plugins$.next([ bubbles, tooltip])


  const play = true
  let i = 0
  let j = 0
  const iMax = 4 // 4
  const jMax = 1 // 1
  intervalId = setInterval(() => {
    console.log('i:', i, ',j:', j)
    if (i == 0) {
      chart.dataFormatter$.next({
        sumSeries: false,
        separateSeries: true
      })
    } else if (i == 1) {
      chart.dataFormatter$.next({
        sumSeries: true,
        separateSeries: true
      })
    } else if (i == 2)  {
      chart.dataFormatter$.next({
        sumSeries: true,
        separateSeries: false
      })
    } else if (i == 3)  {
      chart.dataFormatter$.next({
        sumSeries: false,
        separateSeries: false
      })
    } else if (i == 4)  {
      chart.dataFormatter$.next({
        sumSeries: false,
        separateSeries: false
      })
      if (j == 0) {
        chart!.plugins$.next([ pie, pieLabels, tooltip])
      } else if (j == 1) {
        chart!.plugins$.next([ bubbles, tooltip])
      }
    }

    
    
    if (play) {
      i++
      if (i > iMax) {
        i = 0
        j++
      }
      if (j > jMax) {
        j = 0
      }
    }
    
  }, 2000)



  chart!.data$.next(seriesData3)


})

onUnmounted(() => {
  clearInterval(intervalId)
})

</script>