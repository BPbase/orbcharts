<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script lang="ts" setup>
import { SeriesChart } from '../../../../packages/orbcharts-core/src'
import { Pie, SeriesLegend } from '../../../../packages/orbcharts-plugins-basic/src'
// import { SeriesChart } from 'orbcharts'
// import { Pie } from 'orbcharts'

onMounted(() => {
  const el = document.querySelector('#chart')

  const chart = new SeriesChart(el!)

  const pie = new Pie()

  const seriesLegend = new SeriesLegend()

  chart.plugins$.next([pie, seriesLegend])

  chart.data$.next([15,38,25,17,26,72,64,29,
    // 50, 20, 5, 15, 33, 80, 70, 40, 32, 46, 45
  ])
})


</script>