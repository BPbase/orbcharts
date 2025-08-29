<template>
  <div id="chart" style="width:100%;height:100vh"></div>
</template>

<script setup lang="ts">
import { SeriesChart } from '../../../packages/orbcharts-core/src'
import { Indicator, Pie, SeriesTooltip, SeriesLegend } from '../../../packages/orbcharts-plugins-basic/src'
import seriesData4 from '../../../packages/orbcharts-demo/src/data/seriesData4'

onMounted(() => {

  const el = document.querySelector('#chart')

  const chart = new SeriesChart(el!, {
    preset: {
      chartParams: {
        colors: {
          light: {
            label: [
              "#4BABFF",
              "#0088FF",
              "#435399",
              "#86DC72",
              "#42C724",
              "#16B59B",
              "#F9B052",
              "#F4721B",
              "#FF3232",
              "#7E7D7D"
            ]
          }
        }
      },
      dataFormatter: {
        // separateSeries: true,
      },
      pluginParams: {
        Pie: {
          outerRadius: 0.85,
          innerRadius: 0.75,
          startAngle: - Math.PI / 2,
          endAngle: Math.PI / 2,
        },
        Indicator: {
          startAngle: - Math.PI / 2,
          endAngle: Math.PI / 2,
          radius: 0.65,
          value: 15
        }
      }
    }
  })

  const pie = new Pie()

  const seriesLegend = new SeriesLegend()

  

  chart.dataFormatter$.next({
    // sumSeries: true,
    // separateSeries: true
    // container: {
    //   rowAmount: 1,
    //   columnAmount: 3
    // }
    // visibleFilter: (datum, context) => {
    //   if (datum.id === 'series_0_0') {
    //     return false
    //   }
    //   return true
    // }
    seriesLabels: ['0-10%', '10-20%', '20-30%', '30-40%', '40-50%'],
    // separateSeries: true
  })

  const indicator = new Indicator()
  // indicator.params$.next({
  //   value: 1950
  // })
  setTimeout(() => {
    indicator.params$.next({
      value: 970
    })

    setTimeout(() => {
      indicator.params$.next({
        value: 1550
      })
    }, 1000)
  }, 1000)
  
  chart.plugins$.next([indicator, pie, seriesLegend, new SeriesTooltip()])
  
  chart.data$.next(seriesData4)
  
  

  
})

</script>