<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { GridChart } from '../../../packages/orbcharts-core/src'
import { GroupAxis, ValueAxis, Bars, ScalingArea, Tooltip, GridLegend } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_GRID_SEPARATE_SERIES } from '../../../packages/orbcharts-presets-basic/src/index'
import { gridData3 } from '../../const/data/gridData3'

useHead({
  title: 'Demo 0',
  // meta: [{
  //   name: 'description',
  //   content: 'description'
  // }]
})

let intervalId: any

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new GridChart(el!, {
    preset: PRESET_GRID_SEPARATE_SERIES
  })

  // chart!.dataFormatter$.next({
  //   type: '',
  //   container: {
  //     columnAmount: 3
  //   },
  //   multiGrid: [
  //     {
  //       slotIndex: 0
  //     },
  //     {
  //       slotIndex:1
  //     }
  //   ]
  // })

  let i = 0
  intervalId = setInterval(() => {
    if (i % 2 == 1) {
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 2,
          columnAmount: 2
        },
        grid: {
          separateSeries: true
        }
      })
    } else if (i % 2 == 0) {
      chart!.dataFormatter$.next({
        container: {
          rowAmount: 1,
          columnAmount: 1
        },
        grid: {
          separateSeries: false
        }
      })
    }
    // else {
    //   chart!.dataFormatter$.next({
    //     grid: {
    //       gridData: {
    //         seriesDirection: 'column'
    //       }
    //     }
    //   })
    // }
    
    i++
  }, 2000)

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

  chart!.plugins$.next([ new GroupAxis(), new ValueAxis(), new Bars(), new ScalingArea(), new Tooltip(), new GridLegend() ])

  chart!.data$.next(gridData3)

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

onUnmounted(() => {
  clearInterval(intervalId)
})

</script>