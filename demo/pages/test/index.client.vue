<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { MultiGridChart } from '../../../packages/orbcharts-core/src'
import { MultiBars, MultiLines, MultiDots, MultiGridLegend, MultiGroupAxis, MultiValueAxis, MultiGridTooltip } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_MULTI_GRID_SEPARATE_GRID } from '../../../packages/orbcharts-presets-basic/src/index'
import multiGridData1 from '../../../packages/orbcharts-demo/src/data/multiGridData1'

onMounted(() => {

  const el = document.querySelector('#chart')

  console.log(PRESET_MULTI_GRID_SEPARATE_GRID)

  const chart = new MultiGridChart(el!, {
    preset: PRESET_MULTI_GRID_SEPARATE_GRID
  })

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
  const multiBars = new MultiBars()
  const multiLines = new MultiLines()
  const multiDots = new MultiDots()
  const multiGroupAxis = new MultiGroupAxis()
  const multiValueAxis = new MultiValueAxis()
  const multiGridLegend = new MultiGridLegend()
  const tooltip = new MultiGridTooltip()
  chart!.plugins$.next([ multiGroupAxis, multiValueAxis, multiBars, multiLines, multiDots, multiGridLegend, tooltip])


  chart.chartParams$.next({
    colorScheme: 'dark',
    colors: {
      
    }
  })

  // chart.chartParams$.next({
  //   highlightTarget: 'series'
  // })

  // multiBars.params$.next({
  //   gridIndexes: [0]
  // })

  // multiLines.params$.next({
  //   gridIndexes: [1]
  // })

  // chart!.dataFormatter$.next({
  //   gridList: [
  //     {
  //       // slotIndex: 0
  //     },
  //     {
  //       slotIndex: 1
  //     }
  //   ],
  //   container: {
  //     rowAmount: 1,
  //     columnAmount: 2,
  //   }
  // })

  // setTimeout(() => {
  //   multiBars.params$.next({
  //     gridIndexes: [0, 1]
  //   })
  //   chart!.dataFormatter$.next({
  //     container: {
  //       rowAmount: 2,
  //       columnAmount: 1
  //     },
  //     gridList: [
  //       {
  //       },
  //       {
  //         slotIndex: 1
  //       }
  //     ]
  //   })
  //   setTimeout(() => {
  //     multiBars.params$.next({
  //       gridIndexes: [0]
  //     })
  //     chart!.dataFormatter$.next({
  //       container: {
  //         rowAmount: 1,
  //         columnAmount: 1
  //       },
  //       gridList: [
  //         {
  //         },
  //         {
  //           slotIndex: 0
  //         }
  //       ]
  //     })
  //   }, 2000)
  // }, 2000)

  

  // chart!.dataFormatter$.next({
  //   container: {
  //     rowAmount: 2,
  //     columnAmount: 2
  //   },
  //   gridList: [
  //     {
  //       gridData: {
  //         // seriesDirection: 'column'
  //       },
  //       seriesSlotIndexes: [0, 1]
  //     },
  //     {
  //       slotIndex: 2
  //     },
  //   ]
  // })

  // setTimeout(() => {
  //   // chart!.dataFormatter$.next({
  //   //   container: {
  //   //     rowAmount: 2,
  //   //     columnAmount: 3
  //   //   },
  //   //   gridList: [
  //   //     {
  //   //       gridData: {
  //   //         seriesDirection: 'column'
  //   //       },
  //   //       seriesSlotIndexes: [0, 1, 2, 3, 4],
  //   //       groupAxis: {
  //   //         position: 'left'
  //   //       },
  //   //       valueAxis: {
  //   //         position: 'bottom'
  //   //       }
  //   //     },
  //   //     {
  //   //       slotIndex: 5
  //   //     }
  //   //   ]
  //   // })

  //   setTimeout(() => {
  //     chart!.dataFormatter$.next({
  //       // container: {
  //       //   rowAmount: 1,
  //       //   columnAmount: 1
  //       // },
  //       gridList: [
  //         {
  //           gridData: {
  //             // seriesDirection: 'column'
  //           },
  //           groupAxis: {
  //             position: 'left'
  //           },
  //           valueAxis: {
  //             position: 'bottom'
  //           }
  //         },
  //         // {
  //         //   slotIndex: 0
  //         // }
  //       ]
  //     })

  //   }, 1200)
  // }, 1200)
  
  

  // multiBars.params$.next({
  //   barRadius: true
  // })
  // multiLines.params$.next({
  //   lineCurve: 'curveMonotoneX'
  // })

  chart!.data$.next(multiGridData1)


})

</script>