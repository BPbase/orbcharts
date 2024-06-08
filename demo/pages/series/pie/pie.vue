<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script lang="ts" setup>
import { SeriesChart } from '../../../../packages/orbcharts-core/src'
import { Pie } from '../../../../packages/orbcharts-plugins-basic/src'
// import { SeriesChart } from 'orbcharts'
// import { Pie } from 'orbcharts'

onMounted(() => {
  const el = document.querySelector('#chart')

  const chart = new SeriesChart(el!)

  const pie = new Pie()

  chart.plugins$.next([pie])

  chart.data$.next([15,38,25,17,26,72,64,29])
})


</script>