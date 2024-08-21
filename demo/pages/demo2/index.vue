<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { MultiGridChart } from '../../../packages/orbcharts-core/src'
import { MultiBars, MultiLines, MultiDots, MultiGridLegend, MultiGroupAxis, MultiValueAxis, OverlappingValueAxes, Tooltip } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_MULTI_GRID_2_GRID_SLOT } from '../../../packages/orbcharts-presets-basic/src/index'
import { multiGridData1 } from '../../const/data/multiGridData1'

let intervalId: any

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
  const multiBars = new MultiBars()
  const multiLines = new MultiLines()
  const multiDots = new MultiDots()
  const multiGridLegend = new MultiGridLegend()
  const multiGroupAxis = new MultiGroupAxis()
  const multiValueAxis = new MultiValueAxis()
  const overlappingValueAxes = new OverlappingValueAxes()
  const tooltip = new Tooltip()
  chart!.plugins$.next([ multiGroupAxis, overlappingValueAxes, multiBars, multiLines, multiDots, multiGridLegend, tooltip])

  multiGridLegend.params$.next({
    position: 'bottom',
    justify: 'center'
  })

  chart.chartParams$.next({
    padding: {
      bottom: 120
    },
    highlightTarget: 'series'
  })

  multiValueAxis.params$.next({
    gridIndexes: [0, 1]
  })

  // chart!.dataFormatter$.next({
  //   container: {
  //     rowAmount: 2,
  //     columnAmount: 1
  //   },
  //   gridList: [
  //     {
  //       gridData: {
  //         seriesDirection: 'column'
  //       },
  //       groupAxis: {
  //         position: 'left'
  //       },
  //       valueAxis: {
  //         position: 'bottom'
  //       }
  //     },
  //     {
  //       slotIndex: 1
  //     }
  //   ]
  // })

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
  const play = true
  let i = 0
  let j = 0
  const iMax = 8 // 8
  const jMax = 1 // 1
  intervalId = setInterval(() => {
    console.log('i:', i, ',j:', j)
    if (i == 0) {
      chart.chartParams$.next({
        padding: {
          bottom: 200
        },
        highlightTarget: 'series'
      })
      chart!.plugins$.next([ multiGroupAxis, multiValueAxis, multiBars, multiLines, multiDots, multiGridLegend, tooltip])
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 1,
          columnAmount: 2
        },
        gridList: [
          {
            slotIndex: 0
          },
          {
            slotIndex: 1
          }
        ]
      })
      multiGroupAxis.params$.next({
        gridIndexes: [0, 1],
        tickTextRotate: -30
      })

      multiValueAxis.params$.next({
        gridIndexes: [0, 1]
      })
    } else if (i == 1) {
      chart.chartParams$.next({
        padding: {
          bottom: 200
        },
        highlightTarget: 'series'
      })
      chart!.plugins$.next([ multiGroupAxis, multiValueAxis, multiBars, multiLines, multiDots, multiGridLegend, tooltip])
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 1,
          columnAmount: 3
        },
        gridList: [
          {
            // slotIndex: 0
            seriesSlotIndexes: [0, 1]
          },
          {
            slotIndex: 2
          }
        ]
      })
      multiGroupAxis.params$.next({
        gridIndexes: [0, 1],
        tickTextRotate: -30
      })

      multiValueAxis.params$.next({
        gridIndexes: [0, 1]
      })
    } else if (i == 2)  {
      chart.chartParams$.next({
        padding: {
          bottom: 200
        },
        highlightTarget: 'series'
      })
      chart!.plugins$.next([ multiGroupAxis, multiValueAxis, multiBars, multiLines, multiDots, multiGridLegend, tooltip])
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 2,
          columnAmount: 2
        },
        gridList: [
          {
            seriesSlotIndexes: [0, 1]
          },
          {
            seriesSlotIndexes: [2, 3]
          }
        ]
      })
      multiGroupAxis.params$.next({
        gridIndexes: [0, 1],
        tickTextRotate: -30
      })

      multiValueAxis.params$.next({
        gridIndexes: [0, 1]
      })
    } else if (i == 3)  {
      chart.chartParams$.next({
        padding: {
          bottom: 120
        },
        highlightTarget: 'series'
      })
      chart!.plugins$.next([ multiGroupAxis, multiValueAxis, multiBars, multiLines, multiDots, multiGridLegend, tooltip])
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 2,
          columnAmount: 1
        },
        gridList: [
          {
            gridData: {
              seriesDirection: 'column'
            },
            slotIndex: 0
          },
          {
            gridData: {
              seriesDirection: 'column'
            },
            slotIndex: 1
          }
        ]
      })
      multiGroupAxis.params$.next({
        gridIndexes: [0, 1],
        tickTextRotate: 0
      })
    } else if (i == 4)  {
      chart.chartParams$.next({
        padding: {
          bottom: 120
        },
        highlightTarget: 'series'
      })
      chart!.plugins$.next([ multiGroupAxis, multiValueAxis, multiBars, multiLines, multiDots, multiGridLegend, tooltip])
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 2,
          columnAmount: 3
        },
        gridList: [
          {
            gridData: {
              seriesDirection: 'column'
            },
            seriesSlotIndexes: [0, 1, 2, 3, 4]
          },
          {
            gridData: {
              seriesDirection: 'column'
            },
            slotIndex: 5
          },
        ]
      })
    } else if (i == 5)  {
      chart.chartParams$.next({
        padding: {
          left: 120,
          bottom: 120
        }
      })
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 2,
          columnAmount: 3,
          gap: 120
        },
        gridList: [
          {
            gridData: {
              seriesDirection: 'column'
            },
            seriesSlotIndexes: [0, 1, 2, 3, 4],
            groupAxis: {
              position: 'left'
            },
            valueAxis: {
              position: 'bottom'
            }
          },
          {
            gridData: {
              seriesDirection: 'column'
            },
            slotIndex: 5
          }
        ]
      })
      multiGroupAxis.params$.next({
        tickTextRotate: 0
      })
    } else if (i == 6)  {
      chart!.plugins$.next([ multiGroupAxis, overlappingValueAxes, multiBars, multiLines, multiDots, multiGridLegend, tooltip])
      chart.chartParams$.next({
        padding: {
          left: 120,
          bottom: 120
        }
      })
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 1,
          columnAmount: 2
        },
        gridList: [
          {
            gridData: {
              seriesDirection: 'column'
            },
            groupAxis: {
              position: 'left'
            },
            valueAxis: {
              position: 'bottom'
            }
          },
          {
            gridData: {
              seriesDirection: 'column'
            },
            slotIndex: 1
          }
        ]
      })
      multiGroupAxis.params$.next({
        gridIndexes: [0]
      })

      multiValueAxis.params$.next({
        gridIndexes: [1]
      })
    } else if (i == 7)  {
      chart.chartParams$.next({
        padding: {
          left: 120,
          bottom: 120
        }
      })
      if (j == 0) {
        multiBars.params$.next({
          barRadius: true
        })
        multiLines.params$.next({
          lineCurve: 'curveMonotoneX'
        })
      } else if (j == 1) {
        multiBars.params$.next({
        })
        multiLines.params$.next({
        })
      }
      if (play) {
        j++
      }
      if (j > jMax) {
        j = 0
      }
      
    } else if (i == 8)  {
      chart.chartParams$.next({
        padding: {
          left: 60,
          bottom: 120
        }
      })
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 1,
          columnAmount: 1
        },
        gridList: [
          {
            slotIndex: 0
          },
          {
            slotIndex: 0
          }
        ]
      })
      
    }
    
    if (play) {
      i++
    }
    if (i > iMax) {
      i = 0
    }
  }, 2000)



  chart!.data$.next(multiGridData1)


})

onUnmounted(() => {
  clearInterval(intervalId)
})

</script>