<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { SeriesChart } from '../../../packages/orbcharts-core/src'
import { Pie, PieLabels, Rose, RoseLabels, PieEventTexts, Bubbles, SeriesLegend } from '../../../packages/orbcharts-plugins-basic/src'
import { PRESET_BUBBLES_BASIC } from '../../../packages/orbcharts-presets-basic/src/index'
import seriesData3 from '../../../packages/orbcharts-demo/src/data/seriesData3'

useHead({
  title: 'Demo 1',
  // meta: [{
  //   name: 'description',
  //   content: 'description'
  // }]
})

let intervalId: any

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new SeriesChart(el!, {
    preset: PRESET_BUBBLES_BASIC
  })

  const pie = new Pie()
  const pieLabels = new PieLabels()
  const rose = new Rose()
  const roseLabels = new RoseLabels()
  const pieEventTexts = new PieEventTexts()
  const bubbles = new Bubbles()
  const seriesLegend = new SeriesLegend()
  // chart!.plugins$.next([ multiGroupAxis, overlappingValueAxes, multiBars, multiLines, multiDots, multiGridLegend])

  // pieLabels.params$.next({
  //   outerRadius: 1.2
  // })
  // roseLabels.params$.next({
  //   outerRadius: 1.2
  // })

  chart.chartParams$.next({
    // padding: {
    //   top: 60,
    //   right: 120,
    //   bottom: 60,
    //   left: 120
    // },
    // highlightTarget: 'series'
  })
  chart!.plugins$.next([ bubbles, seriesLegend ])
  // bubbles.params$.next({
  //   force: {
  //     strength: 0.1,
  //   }
  // })
  chart.dataFormatter$.next({
    sumSeries: false,
    separateSeries: false,
    seriesLabels: ['關鍵字', '組織團體', '地點', '人物', '企業品牌']
  })


  const play = true
  let i = 0
  let j = 0
  const iMax = 4 // 4
  const jMax = 1 // 1
  intervalId = setInterval(() => {
    // console.log('i:', i, ',j:', j)
    if (i == 0) {
      if (j == 1) {
        chart!.plugins$.next([ pie, pieLabels, seriesLegend ])
        pie.params$.next({
          innerRadius: 0
        })
      }
      chart.dataFormatter$.next({
        separateSeries: true,
        seriesLabels: ['關鍵字', '組織團體', '地點', '人物', '企業品牌'],
        container: {
          columnGap: 0,
          rowGap: 0
        }
      })
    } else if (i == 1) {
      if (j == 1) {
        chart!.plugins$.next([ rose, roseLabels, seriesLegend ])
      } else {
        chart.dataFormatter$.next({
          separateSeries: true,
          separateLabel: true,
          seriesLabels: ['關鍵字', '組織團體', '地點', '人物', '企業品牌'],
          container: {
            columnGap: 0,
            rowGap: 0
          }
        })
      }
      
    } else if (i == 2)  {
      chart.dataFormatter$.next({
        sumSeries: true,
        separateSeries: true,
        seriesLabels: ['關鍵字', '組織團體', '地點', '人物', '企業品牌'],
        container: {
          columnGap: 0,
          rowGap: 0
        }
      })
      
    } else if (i == 3)  {
      chart.dataFormatter$.next({
        sumSeries: true,
        separateLabel: false,
        seriesLabels: ['關鍵字', '組織團體', '地點', '人物', '企業品牌'],
        container: {
          columnGap: 0,
          rowGap: 0
        }
      })
      if (j == 1) {
        pie.params$.next({
          innerRadius: 0.5
        })
        chart!.plugins$.next([ pie, pieLabels, pieEventTexts, seriesLegend ])
        
      }
    } else if (i == 4)  {
      chart.dataFormatter$.next({
        sumSeries: false,
        separateSeries: false,
        seriesLabels: ['關鍵字', '組織團體', '地點', '人物', '企業品牌']
      })
      if (j == 0) {
        pie.params$.next({
          innerRadius: 0
        })
        chart!.plugins$.next([ pie, pieLabels, seriesLegend ])
        
      } else if (j == 1) {
        chart!.plugins$.next([ bubbles, seriesLegend ])
        // bubbles.params$.next({
        //   force: {
        //     strength: 0.1,
        //   }
        // })
      }
    }

    
    
    if (play) {
      i++
      if (i > iMax) {
        i = 0
        j++
      }
      if (j > jMax) {
        j = 0
      }
    }
    
  }, 2000)



  chart!.data$.next(seriesData3)


})

onUnmounted(() => {
  clearInterval(intervalId)
})

</script>