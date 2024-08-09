<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import * as core from '../../../../packages/orbcharts-core/src'
import * as pluginsBasic from '../../../../packages/orbcharts-plugins-basic/src'
import * as presetsBasic from '../../../../packages/orbcharts-presets-basic/src/index'
// import type { ChartType } from '../../../../packages/orbcharts-core/src'
import { demoDetail } from '@/const/demoDetail'
import type { DemoDetailItem } from '@/const/demoDetail'

interface PageParams {
  chartType: core.ChartType
  pluginName: keyof typeof pluginsBasic
  presetName: keyof typeof presetsBasic
}

const route = useRoute()
const pageParams = route.params as any as PageParams

const detail: DemoDetailItem<any> | null = demoDetail[pageParams.chartType]
  && demoDetail[pageParams.chartType]![pageParams.pluginName]
  && demoDetail[pageParams.chartType]![pageParams.pluginName]![pageParams.presetName]
    ? demoDetail[pageParams.chartType]![pageParams.pluginName]![pageParams.presetName]!
    : null


onMounted(() => {
  if (!detail) {
    return
  }

  const el = document.querySelector('#chart')

  const plugins = detail.plugins.map((plugin) => {
    return new plugin()
  })
// console.log('detail.preset', detail.preset)
  const chart = new detail.chart(el!, {
    preset: detail.preset
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

  // let i = 0
  // setInterval(() => {
  //   if (i % 2 == 0) {
  //     chart!.dataFormatter$.next({
  //       container: {
  //         columnAmount: 2
  //       },
  //       multiGrid: [
  //         {
  //           slotIndex: 0
  //         },
  //         {
  //           slotIndex:1
  //         }
  //       ]
  //     })
  //   } else {
  //     chart!.dataFormatter$.next({
  //       container: {
  //         columnAmount: 1
  //       },
  //       multiGrid: [
  //         {
  //           slotIndex: 0
  //         },
  //         {
  //           slotIndex:0
  //         }
  //       ]
  //     })
  //   }
    
  //   i++
  // }, 2000)

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

  chart!.plugins$.next(plugins)

  chart!.data$.next(detail.data as any)

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