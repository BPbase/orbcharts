<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { GridChart } from '../../../packages/orbcharts-core/src'
import { Bars, Lines, LineAreas, GroupAxis, ValueAxis, ScalingArea, Tooltip } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_GRID_HORIZONTAL } from '../../../packages/orbcharts-presets-basic/src/index'
import { gridData1 } from '../../const/data/gridData1'

// import { GridChart, PRESET_GRID_HORIZONTAL, MultiBars } from 'orbcharts'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new GridChart(el!, {
    // preset: {
    //     "chartParams": {
            
    //         "highlightTarget": "series"
    //     },
    // }
  })

  // chart.dataFormatter$.next({
  //   grid: {
  //     groupAxis: {
  //       position: 'left'
  //     },
  //     valueAxis: {
  //       position: 'bottom'
  //     }
  //   }
  // })

  // const bars = new Bars()

  // bars.params$.next({
    
  // })

  chart.dataFormatter$.next({
    grid: {
      groupAxis: {
        scalePadding: 0
      }
    }
  })
  chart.chartParams$.subscribe(data => {
    console.log(data)
  })

  const lines = new Lines()

  const lineAreas = new LineAreas()

  chart.chartParams$.next({
    highlightTarget: 'series'
  })
  
  chart.plugins$.next([lines, lineAreas, new GroupAxis(), new ValueAxis(), new ScalingArea(), new Tooltip()])
  
  chart.data$.next(gridData1)
  
  

  
})

</script>