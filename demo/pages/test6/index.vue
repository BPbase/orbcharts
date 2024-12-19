<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { RelationshipChart } from '../../../packages/orbcharts-core/src'
import { ForceDirected } from '../../../packages/orbcharts-plugins-basic/src'
// import { PRESET_MULTI_GRID_2_GRID_SLOT } from '../../../packages/orbcharts-presets-basic/src/index'
import relationshipData1 from '../../../packages/orbcharts-demo/src/data/relationshipData3.js'

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

  const forceDirected = new ForceDirected()

  chart!.plugins$.next([ forceDirected ])



  chart.chartParams$.next({
    // highlightTarget: 'category'
  })

  chart!.data$.next(relationshipData1)


})

</script>