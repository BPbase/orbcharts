<template>
  <div id="chart" style="width:100%;height:100%"></div>
</template>

<script setup lang="ts">
import { GridChart } from '../../../packages/orbcharts-core/src'
import { Bars, BarStack, BarsTriangle, Lines, LineAreas, Dots, GroupAux, GroupAxis, ValueAxis, ValueStackAxis, GridZoom, GridTooltip } from '../../../packages/orbcharts-plugins-basic/src'
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

  const barStack = new BarStack()

  const barsTriangle = new BarsTriangle()

  const lines = new Lines()

  const lineAreas = new LineAreas()

  const dots = new Dots()

  const groupAxis = new GroupAxis()

  // groupAxis.params$.next({
  //   tickFormat: (d) => {
  //     console.log(d)
  //     return d === 'test2\ntest2' ? 'yes\ntest' : ''
  //   }
  // })

  const valueAxis = new ValueAxis()

  const valueStackAxis = new ValueStackAxis()


  // bars.params$.next({
    
  // })

  chart.dataFormatter$.next({
    grid: {
      groupAxis: {
        scalePadding: 0
      },
      valueAxis: {
        position: 'left'
      },
      rowLabels: ['a'],
      columnLabels: ['test1\ntest1', 'test2\ntest2', 'test3\ntest3', 'test4\ntest4', 'test5\ntest5'],
    },
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
  
  chart.plugins$.next([groupAxis, valueAxis, new GroupAux(), lines, lineAreas, dots, new GridZoom(), new GridTooltip()])
  
  chart.data$.next(gridData5)
  
  // setTimeout(() => {
  //   chart.plugins$.next([groupAxis, valueAxis, new GroupAux(), lines, lineAreas, dots, new Tooltip()])

  // }, 2000)

  
})

</script>