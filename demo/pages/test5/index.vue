<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { MultiValueChart } from '../../../packages/orbcharts-core/src'
import { Scatter } from '../../../packages/orbcharts-plugins-basic/src'
// import { PRESET_MULTI_GRID_2_GRID_SLOT } from '../../../packages/orbcharts-presets-basic/src/index'
import multiValue1 from '../../../packages/orbcharts-demo/src/data/multiValue1'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new MultiValueChart(el!)

  // chart!.dataFormatter$.next({
  //       container: {
  //         rowAmount: 1,
  //         columnAmount: 2
  //       },
  //       gridList: [
  //         {
  //           slotIndex: 0
  //         },
  //         {
  //           slotIndex: 1
  //         }
  //       ]
  //     })
  const scatter = new Scatter()
  chart!.plugins$.next([ scatter ])



  chart.chartParams$.next({
    highlightTarget: 'category'
  })

  chart!.data$.next(multiValue1)


})

</script>