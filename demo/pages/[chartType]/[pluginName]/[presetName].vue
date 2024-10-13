<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import * as core from '../../../../packages/orbcharts-core/src'
import * as pluginsBasic from '../../../../packages/orbcharts-plugins-basic/src'
import * as presetsBasic from '../../../../packages/orbcharts-presets-basic/src/index'
// import { getDemoData } from '../../../../packages/orbcharts-demo/src'
import { getDemoData } from '@/utils/getDemoData'

interface PageParams {
  chartType: core.ChartType
  pluginName: keyof typeof pluginsBasic
  presetName: keyof typeof presetsBasic
}

const route = useRoute()
const pageParams = route.params as any as PageParams

useHead({
  title: pageParams.pluginName,
  // meta: [{
  //   name: 'description',
  //   content: 'description'
  // }]
})

onMounted(async () => {
  // if (!demoItem) {
  //   return
  // }
  const demoData = await getDemoData({
    chartType: pageParams.chartType,
    pluginNames: pageParams.pluginName.split(',') as (keyof typeof pluginsBasic)[],
    presetName: pageParams.presetName
  })
  if (!demoData) {
    console.error('demoData not found')
    return
  }

  const ChartMap = {
    series: core.SeriesChart,
    grid: core.GridChart,
    multiGrid: core.MultiGridChart,
    multiValue: core.MultiValueChart,
    relationship: core.RelationshipChart,
    tree: core.TreeChart,
  }
  const Chart = ChartMap[pageParams.chartType]
  
  const el = document.querySelector('#chart')
// console.log('demoData.preset', demoData.preset)
  const chart = new Chart(el!, {
    preset: demoData.preset as any
  })

  chart!.plugins$.next(demoData.plugins as any)

  chart!.data$.next(demoData.data as any)

})

</script>