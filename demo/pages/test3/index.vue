<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { GridChart } from '../../../packages/orbcharts-core/src'
import { Bars, GridLegend, GroupAxis, ValueAxis, GridTooltip } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_GRID_BASIC } from '../../../packages/orbcharts-presets-basic/src/index'
import gridData4 from '../../../packages/orbcharts-demo/src/data/gridData4'

onMounted(() => {

  const el = document.querySelector('#chart')

  console.log(PRESET_GRID_BASIC)

  const chart = new GridChart(el!, {
    preset: PRESET_GRID_BASIC
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
  const bars = new Bars()
  const groupAxis = new GroupAxis()
  const valueAxis = new ValueAxis()
  const gridLegend = new GridLegend()
  const tooltip = new GridTooltip()
  chart!.plugins$.next([ groupAxis, valueAxis, bars, gridLegend, tooltip])

  chart.dataFormatter$.next({
    grid: {
      gridData: {
        // seriesDirection: 'column'
      },
      valueAxis: {
        scaleDomain: [0, 'auto'],
        scaleRange: [0.5, 0.95],
        
      }
    }
  })

  bars.params$.next({
    barWidth: 100,
    barPadding: -50
  })

//   multiDots.params$.next({
//     gridIndexes: [0, 1],
//   })

//   multiGridLegend.params$.next({
//     gridList: [
//       {

//       },
//       {
//         listRectHeight: 5
//       }
//     ]
//   })

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

  chart!.data$.next(gridData4)


})

</script>