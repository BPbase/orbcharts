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

  const chart = new detail.chart(el!, {
    preset: detail.preset
  })

  chart!.plugins$.next(plugins)

  chart!.data$.next(detail.data as any)
})

</script>