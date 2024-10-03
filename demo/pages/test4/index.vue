<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { TreeChart } from '../../../packages/orbcharts-core/src'
import { TreeMap, TreeLegend, Tooltip } from '../../../packages/orbcharts-plugins-basic/src'
// import { PRESET_MULTI_GRID_2_GRID_SLOT } from '../../../packages/orbcharts-presets-basic/src/index'
import treeData1 from '../../../packages/orbcharts-demo/src/data/treeData1'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new TreeChart(el!)

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
  const treeMap = new TreeMap()
  const treeLegend = new TreeLegend()
  const tooltip = new Tooltip()
  chart!.plugins$.next([ treeMap, treeLegend, tooltip])


  // chart.dataFormatter$.next({
  //   visibleFilter: (datum, context) => {
  //     if (datum.id === 'Movies.Action.Avatar ') {
  //       return false
  //     }
  //     return true
  //   }
  // })
  // chart.dataFormatter$.next({
  // })
  treeLegend.params$.next({
    // textColorType: 'series'
  })

  treeMap.params$.next({
  })

  chart.chartParams$.next({
    highlightTarget: 'category'
  })

  chart!.data$.next(treeData1)


})

</script>