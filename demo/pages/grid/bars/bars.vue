<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script lang="ts" setup>
import { GridChart } from '../../../../packages/orbcharts-core/src'
import { Bars, GridLegend } from '../../../../packages/orbcharts-plugins-basic/src'
import { PRESET_BARS_ROUND } from '../../../../packages/orbcharts-presets-basic/src'
// import { PRESET_BARS_ROUND } from '@orbcharts/presets-basic'

onMounted(() => {
  const el = document.querySelector('#chart')
console.log(PRESET_BARS_ROUND)
  const chart = new GridChart(el!, {
    preset: PRESET_BARS_ROUND
  })

  const bars = new Bars()

  const gridLegend = new GridLegend()

  chart.plugins$.next([bars, gridLegend])

  chart.data$.next([
    [
      55,
      80,
      50,
      11,
      150
    ],
    [
      35,
      40,
      15,
      65,
      120
    ]
  ])
})


</script>