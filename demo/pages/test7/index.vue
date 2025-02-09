<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { MultiValueChart } from '../../../packages/orbcharts-core/src'
import { RankingBars, XAxis, MultiValueLegend, MultiValueTooltip } from '../../../packages/orbcharts-plugins-basic/src'
// import { PRESET_MULTI_GRID_2_GRID_SLOT } from '../../../packages/orbcharts-presets-basic/src/index'
import multiValue1 from '../../../packages/orbcharts-demo/src/data/multiValue1'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new MultiValueChart(el!)

  chart!.dataFormatter$.next({
    xAxis: {
      label: 'xxxxxxx'
    },
    yAxis: {
      label: 'yyyyyyy'
    },
    separateCategory: true,
    container: {
      columnAmount: 1,
      rowAmount: 3
    }
  })

  setTimeout(() => {
    chart!.dataFormatter$.next({
      xAxis: {
        label: 'xxxxxxx',
        valueIndex: 1
      },
      yAxis: {
        label: 'yyyyyyy'
      },
      separateCategory: true,
      container: {
        columnAmount: 1,
        rowAmount: 3
      }
    })

    setTimeout(() => {
      chart!.dataFormatter$.next({
        xAxis: {
          label: 'xxxxxxx',
          valueIndex: 2
        },
        yAxis: {
          label: 'yyyyyyy'
        },
        separateCategory: true,
        container: {
          columnAmount: 1,
          rowAmount: 3
        }
      })
    }, 1000)
  }, 1000)

  // setTimeout(() => {
  //   chart!.dataFormatter$.next({
  //     xAxis: {
  //       label: 'xxxxxxx'
  //     },
  //     yAxis: {
  //       label: 'yyyyyyy'
  //     },
  //     separateCategory: true,
  //     // container: {
  //     //   columnAmount: 1,
  //     //   rowAmount: 3
  //     // }
  //   })
  // }, 2000)

  const rankingBars = new RankingBars()
  const xAxis = new XAxis()
  const multiValueLegend = new MultiValueLegend()
  const multiValueTooltip = new MultiValueTooltip()

  chart!.plugins$.next([ rankingBars, xAxis, multiValueLegend, multiValueTooltip ])



  chart.chartParams$.next({
    // highlightTarget: 'category'
  })

  chart!.data$.next(multiValue1)


})

</script>