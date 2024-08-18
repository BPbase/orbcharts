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
    const multiGridLines = new MultiGridLines()
    const multiGridDots = new MultiGridDots()
    const multiGridLegend = new MultiGridLegend()
    const multiGridGroupAxis = new MultiGridGroupAxis()
    const multiGridValueAxis = new MultiGridValueAxis()
    const tooltip = new Tooltip()
    chart!.plugins$.next([ multiGridGroupAxis, multiGridValueAxis, multiGridBars, multiGridLines, multiGridDots, multiGridLegend, tooltip])

    chart.chartParams$.next({
      highlightTarget: 'series'
    })

    multiGridGroupAxis.params$.next({
      gridIndexes: [0]
    })

    multiGridValueAxis.params$.next({
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
    //         seriesType: 'column'
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
    const play = true
    let i = 0
    let j = 0
    let iMax = 8
    let jMax = 1
    setInterval(() => {
      console.log('i:', i, ',j:', j)
      if (i == 0) {
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
        multiGridGroupAxis.params$.next({
          gridIndexes: [0, 1]
        })

        multiGridValueAxis.params$.next({
          gridIndexes: [0, 1]
        })
      } else if (i == 1) {
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
      } else if (i == 2)  {
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
      } else if (i == 3)  {
        chart!.dataFormatter$.next({
          gridList: [
            {
              gridData: {
                seriesType: 'column'
              }
            },
            {
              
            }
          ]
        })
      } else if (i == 4)  {
        chart!.dataFormatter$.next({
          container: {
            rowAmount: 2,
            columnAmount: 3
          },
          gridList: [
            {
              gridData: {
                seriesType: 'column'
              },
              seriesSlotIndexes: [0, 1, 2, 3, 4]
            },
            {
              slotIndex: 5
            },
          ]
        })
      } else if (i == 5)  {
        chart!.dataFormatter$.next({
          container: {
            rowAmount: 2,
            columnAmount: 3
          },
          gridList: [
            {
              gridData: {
                seriesType: 'column'
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
              slotIndex: 5
            }
          ]
        })
      } else if (i == 6)  {
        chart!.dataFormatter$.next({
          container: {
            rowAmount: 1,
            columnAmount: 1
          },
          gridList: [
            {
              gridData: {
                seriesType: 'column'
              },
              groupAxis: {
                position: 'left'
              },
              valueAxis: {
                position: 'bottom'
              }
            },
            {
              slotIndex: 0
            }
          ]
        })
        multiGridGroupAxis.params$.next({
          gridIndexes: [0]
        })

        multiGridValueAxis.params$.next({
          gridIndexes: [0]
        })
      } else if (i == 7)  {
        if (j == 0) {
          multiGridBars.params$.next({
            barRadius: true
          })
          multiGridLines.params$.next({
            lineCurve: 'curveMonotoneX'
          })
        } else if (j == 1) {
          multiGridBars.params$.next({
          })
          multiGridLines.params$.next({
          })
        }
        if (play) {
          j++
        }
        if (j > jMax) {
          j = 0
        }
        
      } else if (i == 8)  {
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
    }, 1200)
  

  
    chart!.data$.next(multiGridData1)
  

  })
  
  </script>