<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { RelationshipChart } from '../../../packages/orbcharts-core/src'
import { ForceDirectedBubbles, RelationshipLegend, RelationshipTooltip } from '../../../packages/orbcharts-plugins-basic/src'
// import { PRESET_MULTI_GRID_2_GRID_SLOT } from '../../../packages/orbcharts-presets-basic/src/index'
import relationshipData1 from '../../../packages/orbcharts-demo/src/data/relationshipData1.js'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new RelationshipChart(el!)

  // chart!.dataFormatter$.next({
  //   xAxis: {
  //     label: 'xxxxxxx'
  //   },
  //   yAxis: {
  //     label: 'yyyyyyy'
  //   }
  // })

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

  const forceDirectedBubbles = new ForceDirectedBubbles()
  const relationshipLegend = new RelationshipLegend()
  const relationshipTooltip = new RelationshipTooltip()

  chart!.plugins$.next([ forceDirectedBubbles, relationshipLegend, relationshipTooltip ])



  chart.chartParams$.next({
    // highlightTarget: 'category'
  })

  chart!.data$.next(relationshipData1)


})

</script>