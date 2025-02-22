<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { GridChart } from '../../../packages/orbcharts-core/src'
import { Bars, StackedBars, BarsTriangle, Lines, LineAreas, Dots, GroupAux, GroupAxis, ValueAxis, StackedValueAxis, GroupZoom, GridTooltip } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_GRID_HORIZONTAL } from '../../../packages/orbcharts-presets-basic/src/index'
// import gridData1 from '../../../packages/orbcharts-demo/src/data/gridData1'
import gridData5 from '../../../packages/orbcharts-demo/src/data/gridData5'

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

  const bars = new Bars()

  const stackedBar = new StackedBars()

  const barsTriangle = new BarsTriangle()

  const lines = new Lines()

  const lineAreas = new LineAreas()

  const dots = new Dots()

  const groupAxis = new GroupAxis()

  const groupAux = new GroupAux()

  groupAux.params$.next({
    // labelPadding: 0
    // labelRotate: 45,
  })

  groupAxis.params$.next({
    // tickTextRotate: 45,
    // tickPadding: 0,
    // tickFormat: (d) => {
    //   console.log(d)
    //   return d === 'test2\ntest2' ? 'yes\ntest' : ''
    // }
    // ticks: 5,
    tickFullLine: true
  })

  const valueAxis = new ValueAxis()

  valueAxis.params$.next({
    // tickFullLine: false
  })

  const stackedValueAxis = new StackedValueAxis()


  // bars.params$.next({
    
  // })

  chart.dataFormatter$.next({
    groupAxis: {
      // position: 'right',
      scalePadding: 0,
      label: 'xxx'
    },
    valueAxis: {
      // position: 'bottom',
      label: 'yyy'
    },
    rowLabels: ['a'],
    columnLabels: ['test1\ntest1', 'test2\ntest2', 'test3\ntest3', 'test4\ntest4', 'test5\ntest5'],
    visibleFilter: (datum, context) => {
      if (datum.id === 'grid_0_0_4') {
        // console.log('grid_0_1_4')
        return false
      }
      return true
    },
    // grid: {
    //   groupAxis: {
    //     position: 'left',
    //   },
    //   valueAxis: {
    //     position: 'bottom',
    //   },
    //   separateSeries: true,
    // },
    // container: {
    //   columnAmount: 1,
    //   rowAmount: 2
    // }
  })
  chart.chartParams$.subscribe(data => {
    console.log(data)
  })


  chart.chartParams$.next({
    highlightTarget: 'group'
  })
  
  chart.plugins$.next([groupAxis, valueAxis, groupAux, lines, lineAreas, dots, new GroupZoom(), new GridTooltip()])
  
  chart.data$.next(gridData5)
  
  // setTimeout(() => {
  //   chart.plugins$.next([groupAxis, valueAxis, new GroupAux(), lines, lineAreas, dots, new Tooltip()])

  // }, 2000)

  
})

</script>