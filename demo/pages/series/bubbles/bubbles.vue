<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script lang="ts" setup>
import { SeriesChart } from '../../../../packages/orbcharts-core/src'
import { Bubbles } from '../../../../packages/orbcharts-plugins-basic/src'

onMounted(() => {
  const el = document.querySelector('#chart')

  const chart = new SeriesChart(el!)

  const bubbles = new Bubbles()

  chart.plugins$.next([bubbles])

  chart.data$.next([15,38,25,17,26,72,64,29])
})


</script>