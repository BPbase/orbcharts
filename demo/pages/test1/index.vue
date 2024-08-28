<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { GridChart } from '../../../packages/orbcharts-core/src'
import { Bars, GroupAxis, ValueAxis, Tooltip } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_GRID_HORIZONTAL } from '../../../packages/orbcharts-presets-basic/src/index'
import { gridData1 } from '../../const/data/gridData1'

// import { GridChart, PRESET_GRID_HORIZONTAL, MultiBars } from 'orbcharts'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new GridChart(el!, {
    preset: PRESET_GRID_HORIZONTAL
  })

  const bars = new Bars()

  bars.params$.next({
    
  })

  chart.plugins$.next([bars, new GroupAxis(), new ValueAxis(), new Tooltip()])

  chart.data$.next(gridData1)

  chart.chartParams$.next({
    padding: {
      
    }
  })

})

</script>