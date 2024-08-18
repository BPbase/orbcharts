<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { MultiGridChart } from '../../../packages/orbcharts-core/src'
import { MultiGridBars, MultiGridLines, MultiGridDots, MultiGridLegend, MultiGridGroupAxis, MultiGridValueAxis, Tooltip } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_MULTI_GRID_2_GRID_SLOT } from '../../../packages/orbcharts-presets-basic/src/index'
import { multiGridData1 } from '../../const/data/multiGridData1'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new MultiGridChart(el!, {
    // preset: PRESET_MULTI_GRID_2_GRID_SLOT
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
  const multiGridBars = new MultiGridBars()
  const multiGridLegend = new MultiGridLegend()
  const tooltip = new Tooltip()
  chart!.plugins$.next([ multiGridBars, multiGridLegend, tooltip])

  chart.chartParams$.next({
    highlightTarget: 'series'
  })

  multiGridBars.params$.next({
    gridIndexes: [0]
  })

  setTimeout(() => {
    multiGridBars.params$.next({
      gridIndexes: [0, 1]
    })
    chart!.dataFormatter$.next({
      container: {
        rowAmount: 2,
        columnAmount: 1
      },
      gridList: [
        {
        },
        {
          slotIndex: 1
        }
      ]
    })
    setTimeout(() => {
      multiGridBars.params$.next({
        gridIndexes: [0]
      })
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 1,
          columnAmount: 1
        },
        gridList: [
          {
          },
          {
            slotIndex: 0
          }
        ]
      })
    }, 2000)
  }, 2000)

  

  // chart!.dataFormatter$.next({
  //   container: {
  //     rowAmount: 2,
  //     columnAmount: 2
  //   },
  //   gridList: [
  //     {
  //       gridData: {
  //         // seriesType: 'column'
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
  //   //         seriesType: 'column'
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
  //             // seriesType: 'column'
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
  
  

  // multiGridBars.params$.next({
  //   barRadius: true
  // })
  // multiGridLines.params$.next({
  //   lineCurve: 'curveMonotoneX'
  // })

  chart!.data$.next(multiGridData1)


})

</script>