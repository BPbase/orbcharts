<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { MultiValueChart } from '../../../packages/orbcharts-core/src'
import { ScatterBubbles, XYAxes, XYAux, XZoom, MultiValueLegend, MultiValueTooltip } from '../../../packages/orbcharts-plugins-basic/src'
// import { PRESET_MULTI_GRID_2_GRID_SLOT } from '../../../packages/orbcharts-presets-basic/src/index'
import multiValue1 from '../../../packages/orbcharts-demo/src/data/multiValue1'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new MultiValueChart(el!)

  chart!.dataFormatter$.next({
    xAxis: {
      label: 'xxxxxxx'
    },
    yAxis: {
      label: 'yyyyyyy'
    },
    separateCategory: true,
    container: {
      rowGap: 80
    }
  })

  // setTimeout(() => {
  //   chart!.dataFormatter$.next({
  //     xAxis: {
  //       label: 'xxxxxxx'
  //     },
  //     yAxis: {
  //       label: 'yyyyyyy'
  //     },
  //     separateCategory: true,
  //     // container: {
  //     //   columnAmount: 1,
  //     //   rowAmount: 3
  //     // }
  //   })
  // }, 2000)

  const scatterBubbles = new ScatterBubbles()
  const xyAux = new XYAux()
  const xyAxes = new XYAxes()
  const xyZoom = new XZoom()
  const multiValueLegend = new MultiValueLegend()
  const multiValueTooltip = new MultiValueTooltip()

  chart!.plugins$.next([ scatterBubbles, xyAux, xyAxes, xyZoom, multiValueLegend, multiValueTooltip ])



  chart.chartParams$.next({
    // highlightTarget: 'category'
    padding: {
      bottom: 120
    }
  })

  chart!.data$.next(multiValue1)


})

</script>