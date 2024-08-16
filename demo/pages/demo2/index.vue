<template>
    <div id="chart" style="width:100%;height:100vh"></div>
  </template>
  
  <script setup lang="ts">
  import { MultiGridChart } from '../../../packages/orbcharts-core/src'
  import { MultiGridBars, MultiGridLines, MultiGridLegend } from '../../../packages/orbcharts-plugins-basic/src'
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
    const multiGridLines = new MultiGridLines()
    const multiGridLegend = new MultiGridLegend()
    chart!.plugins$.next([ multiGridBars, multiGridLines, multiGridLegend])


    chart!.dataFormatter$.next({
      container: {
        rowAmount: 1,
        columnAmount: 1
      },
      gridList: [
        {
          gridData: {
            seriesType: 'row'
          },
          // groupAxis: {
          //   position: 'left'
          // },
          // valueAxis: {
          //   position: 'bottom'
          // }
        },
        {
          slotIndex: 0
        }
      ]
    })

    multiGridBars.params$.next({
      barRadius: true
    })
    multiGridLines.params$.next({
      lineCurve: 'curveMonotoneX'
    })
  
    // let i = 0
    // let j = 0
    // let iTotal = 9
    // let jTotal = 2
    // setInterval(() => {
    //   console.log('i:', i, ',j:', j)
    //   if (i % iTotal == 0) {
    //     chart!.dataFormatter$.next({
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
    //   } else if (i % iTotal == 1) {
    //     chart!.dataFormatter$.next({
    //       container: {
    //         rowAmount: 1,
    //         columnAmount: 3
    //       },
    //       gridList: [
    //         {
    //           // slotIndex: 0
    //           seriesSlotIndexes: [0, 1]
    //         },
    //         {
    //           slotIndex: 2
    //         }
    //       ]
    //     })
    //   } else if (i % iTotal == 2)  {
    //     chart!.dataFormatter$.next({
    //       container: {
    //         rowAmount: 2,
    //         columnAmount: 2
    //       },
    //       gridList: [
    //         {
    //           seriesSlotIndexes: [0, 1]
    //         },
    //         {
    //           seriesSlotIndexes: [2, 3]
    //         }
    //       ]
    //     })
    //   } else if (i % iTotal == 3)  {
    //     chart!.dataFormatter$.next({
    //       gridList: [
    //         {
    //           gridData: {
    //             seriesType: 'column'
    //           }
    //         },
    //         {
              
    //         }
    //       ]
    //     })
    //   } else if (i % iTotal == 4)  {
    //     chart!.dataFormatter$.next({
    //       container: {
    //         rowAmount: 2,
    //         columnAmount: 3
    //       },
    //       gridList: [
    //         {
    //           gridData: {
    //             seriesType: 'column'
    //           },
    //           seriesSlotIndexes: [0, 1, 2, 3, 4]
    //         },
    //         {
    //           slotIndex: 5
    //         },
    //       ]
    //     })
    //   } else if (i % iTotal == 5)  {
    //     chart!.dataFormatter$.next({
    //       container: {
    //         rowAmount: 2,
    //         columnAmount: 3
    //       },
    //       gridList: [
    //         {
    //           gridData: {
    //             seriesType: 'column'
    //           },
    //           seriesSlotIndexes: [0, 1, 2, 3, 4],
    //           groupAxis: {
    //             position: 'left'
    //           },
    //           valueAxis: {
    //             position: 'bottom'
    //           }
    //         },
    //         {
    //           slotIndex: 5
    //         }
    //       ]
    //     })
    //   } else if (i % iTotal == 6)  {
    //     chart!.dataFormatter$.next({
    //       container: {
    //         rowAmount: 1,
    //         columnAmount: 1
    //       },
    //       gridList: [
    //         {
    //           gridData: {
    //             seriesType: 'column'
    //           },
    //           groupAxis: {
    //             position: 'left'
    //           },
    //           valueAxis: {
    //             position: 'bottom'
    //           }
    //         },
    //         {
    //           slotIndex: 0
    //         }
    //       ]
    //     })
    //   } else if (i % iTotal == 7)  {
    //     if (j % jTotal == 0) {
    //       multiGridBars.params$.next({
    //         barRadius: true
    //       })
    //       multiGridLines.params$.next({
    //         lineCurve: 'curveMonotoneX'
    //       })
    //     } else if (j % jTotal == 1) {
    //       multiGridBars.params$.next({
    //       })
    //       multiGridLines.params$.next({
    //       })
    //     }
    //     j++
        
    //   } else if (i % iTotal == 8)  {
    //     chart!.dataFormatter$.next({
    //       container: {
    //         rowAmount: 1,
    //         columnAmount: 1
    //       },
    //       gridList: [
    //         {
    //           slotIndex: 0
    //         },
    //         {
    //           slotIndex: 0
    //         }
    //       ]
    //     })
        
    //   }
      
    //   i++
    // }, 1200)
  
    // chart!.dataFormatter$.next({
    //   container: {
    //     columnAmount: 1
    //   },
    //   multiGrid: [
    //     {
    //       slotIndex: 0
    //     },
    //     {
    //       slotIndex: 0
    //     }
    //   ]
    // })
  
  
  
    
    // chart!.chartParams$.next({
    //   "padding": {
    //     "top": 80,
    //     "right": 80,
    //     "bottom": 80,
    //     "left": 80
    //   }
    // })
    // chart!.dataFormatter$.next({
    //   valueAxis: {
    //     position: 'bottom',
    //     scaleDomain: [0, 'auto'],
    //     scaleRange: [0, 0.9],
    //     label: ''
    //   },
    //   groupAxis: {
    //     position: 'left',
    //     scaleDomain: [0, 'auto'],
    //     scalePadding: 0.5,
    //     label: ''
    //   },
    // })
  
    
  
    chart!.data$.next(multiGridData1)
  
    // chart!.dataFormatter$.next({
    //   valueAxis: {
    //     position: 'bottom',
    //     scaleDomain: [0, 'auto'],
    //     scaleRange: [0, 0.9],
    //     label: ''
    //   },
    //   groupAxis: {
    //     position: 'left',
    //     scaleDomain: [0, 'auto'],
    //     scalePadding: 0.5,
    //     label: ''
    //   },
    // })
  })
  
  </script>