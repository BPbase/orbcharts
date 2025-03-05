<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { MultiValueChart } from '../../../packages/orbcharts-core/src'
import { OrdinalAxis, OrdinalBubbles, OrdinalZoom, MultiValueLegend, MultiValueTooltip } from '../../../packages/orbcharts-plugins-basic/src'
// import { PRESET_MULTI_GRID_2_GRID_SLOT } from '../../../packages/orbcharts-presets-basic/src/index'
// import multiValue1 from '../../../packages/orbcharts-demo/src/data/multiValue1'
import multiValueData_channel from '../../../packages/orbcharts-demo/src/data/multiValueData_channel'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new MultiValueChart(el!)

  let categoryLabels = [
    "news",
    "ptt",
    "facebook"
  ]

  let valueLabels = [
    "2025-02-01",
    "2025-02-02",
    "2025-02-03",
    "2025-02-04",
    "2025-02-05",
    "2025-02-06",
    "2025-02-07",
    "2025-02-08",
    "2025-02-09",
    "2025-02-10",
    "2025-02-11",
    "2025-02-12",
    "2025-02-13",
    "2025-02-14",
    "2025-02-15",
    "2025-02-16",
    "2025-02-17",
    "2025-02-18",
    "2025-02-19",
    "2025-02-20",
    "2025-02-21",
    "2025-02-22",
    "2025-02-23",
    "2025-02-24",
    "2025-02-25",
    "2025-02-26",
    "2025-02-27",
    "2025-02-28"
  ]

  chart.chartParams$.next({
    transitionDuration: 250,
    // highlightTarget: 'category'
    // colors: {
    //   light: {
    //     label: ['#000000']
    //   }
    // }
  })

  chart!.dataFormatter$.next({
    xAxis: {
      label: 'xxxxxxx'
    },
    yAxis: {
      label: 'yyyyyyy'
    },
    valueLabels,
    categoryLabels,
    // separateCategory: true,
    // container: {
    //   columnAmount: 1,
    //   rowAmount: 3
    // }
  })

  // setTimeout(() => {
  //   chart!.dataFormatter$.next({
  //     xAxis: {
  //       label: 'xxxxxxx',
  //       valueIndex: 1
  //     },
  //     yAxis: {
  //       label: 'yyyyyyy'
  //     },
  //     // separateCategory: true,
  //     // container: {
  //     //   columnAmount: 1,
  //     //   rowAmount: 3
  //     // }
  //   })

  //   setTimeout(() => {
  //     chart!.dataFormatter$.next({
  //       xAxis: {
  //         label: 'xxxxxxx',
  //         valueIndex: 2
  //       },
  //       yAxis: {
  //         label: 'yyyyyyy'
  //       },
  //       // separateCategory: true,
  //       // container: {
  //       //   columnAmount: 1,
  //       //   rowAmount: 3
  //       // }
  //     })
  //   }, 250)
  // }, 250)

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

//   const racingBars = new RacingBars()
  const ordinalXAxis = new OrdinalAxis()
  const ordinalBubbles = new OrdinalBubbles()
  const ordinalZoom = new OrdinalZoom()
  const multiValueLegend = new MultiValueLegend()
  const multiValueTooltip = new MultiValueTooltip()

  chart!.plugins$.next([ ordinalXAxis, ordinalBubbles, ordinalZoom, multiValueLegend, multiValueTooltip ])

//   racingBars.params$.next({
//     // timer: {
//     //   active: true,
//     //   period: 250
//     // }
//     // rankingAmount: 'auto',
//     autorun: true,
//     axisLabel: {
      
//     }
//   })

  // racingValueAxis.params$.next({
  //   ticks: 2
  // })

  // chart.chartParams$.next({
  //   // highlightTarget: 'category'
  // })

  chart!.data$.next(multiValueData_channel)


})

</script>