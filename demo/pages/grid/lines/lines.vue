<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script lang="ts" setup>
import { GridChart } from '../../../../packages/orbcharts-core/src'
import { Lines, GridLegend } from '../../../../packages/orbcharts-plugins-basic/src'

onMounted(() => {
  const el = document.querySelector('#chart')

  const chart = new GridChart(el!)

  const lines = new Lines()

  const gridLegend = new GridLegend()

  chart.plugins$.next([lines, gridLegend])

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