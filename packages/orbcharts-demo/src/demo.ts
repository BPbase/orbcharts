import type { DemoChartTypeItem } from './types'
// type nonePresetTitle = '[none preset]'

export const DEMO_LIST: DemoChartTypeItem<any>[] = [
  {
    title: 'Series',
    chartType: 'series',
    list: [
      {
        title: 'Bubbles',
        description: 'Bubble Chart',
        descriptionZh: '泡泡圖',
        mainPluginNames: ['Bubbles'],
        list: [
          {
            title: 'PRESET_BUBBLES_BASIC',
            presetName: 'PRESET_BUBBLES_BASIC',
            description: 'Basic bubble chart',
            descriptionZh: '基本泡泡圖',
            allPluginNames: ['Bubbles', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData3')
          },
          {
            title: 'PRESET_BUBBLES_SIMPLE',
            presetName: 'PRESET_BUBBLES_SIMPLE',
            description: 'Simple bubble chart',
            descriptionZh: '簡單泡泡圖',
            allPluginNames: ['Bubbles', 'SeriesTooltip'],
            getData: () => import('./data/seriesData3')
          },
          {
            title: 'PRESET_BUBBLES_SCALING_BY_RADIUS',
            presetName: 'PRESET_BUBBLES_SCALING_BY_RADIUS',
            description: 'Bubble chart scaled by radius size',
            descriptionZh: '以半徑尺寸為比例的泡泡圖',
            allPluginNames: ['Bubbles', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData3')
          },
          {
            title: 'PRESET_BUBBLES_SEPARATE_SERIES',
            presetName: 'PRESET_BUBBLES_SEPARATE_SERIES',
            description: 'Bubble chart showing series separately',
            descriptionZh: '分開顯示Series的泡泡圖',
            allPluginNames: ['Bubbles', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData3')
          },
          {
            title: 'PRESET_BUBBLES_SEPARATE_LABEL',
            presetName: 'PRESET_BUBBLES_SEPARATE_LABEL',
            description: 'Bubble chart showing all data separately',
            descriptionZh: '全部資料分開顯示的泡泡圖',
            allPluginNames: ['Bubbles', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData4')
          },
          {
            title: 'PRESET_BUBBLES_SEPARATE_ALL',
            presetName: 'PRESET_BUBBLES_SEPARATE_ALL',
            description: 'Bubble chart showing all data separately',
            descriptionZh: '全部資料分開顯示的泡泡圖',
            allPluginNames: ['Bubbles', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData3')
          },
          {
            title: 'PRESET_BUBBLES_SUM_SERIES',
            presetName: 'PRESET_BUBBLES_SUM_SERIES',
            description: 'Bubble chart of combined Series data',
            descriptionZh: '合併Series資料的泡泡圖',
            allPluginNames: ['Bubbles', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData3')
          },
        ]
      },
      {
        title: 'Pie',
        description: 'Pie Chart',
        descriptionZh: '圓餅圖',
        mainPluginNames: ['Pie'],
        list: [
          {
            title: 'PRESET_PIE_BASIC',
            presetName: 'PRESET_PIE_BASIC',
            description: 'Basic pie chart',
            descriptionZh: '基本圓餅圖',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_PIE_SIMPLE',
            presetName: 'PRESET_PIE_SIMPLE',
            description: 'Simple pie chart',
            descriptionZh: '簡單圓餅圖',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_PIE_WITH_INNER_LABELS',
            presetName: 'PRESET_PIE_WITH_INNER_LABELS',
            description: 'Pie chart with inner data labels',
            descriptionZh: '圓餅圖及內部資料標籤',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_PIE_DONUT',
            presetName: 'PRESET_PIE_DONUT',
            description: 'Donut chart',
            descriptionZh: '甜甜圈圖',
            allPluginNames: ['Pie', 'PieLabels', 'PieEventTexts', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_PIE_HALF_DONUT',
            presetName: 'PRESET_PIE_HALF_DONUT',
            description: 'Half donut chart',
            descriptionZh: '半圓甜甜圈圖',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_PIE_GAUGE',
            presetName: 'PRESET_PIE_GAUGE',
            description: 'Gauge chart',
            descriptionZh: '儀表圖',
            allPluginNames: ['Pie', 'Indicator', 'PieEventTexts', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData4')
          },
          // {
          //   title: 'PRESET_SERIES_DESC',
          //   presetName: 'PRESET_SERIES_DESC',
          //   allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'Tooltip'],
          //   getData: () => import('./data/seriesData2')
          // },
          {
            title: 'PRESET_PIE_SEPARATE_SERIES',
            presetName: 'PRESET_PIE_SEPARATE_SERIES',
            description: 'Separate pie chart of Series',
            descriptionZh: '分開顯示Series的圓餅圖',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_PIE_SEPARATE_LABEL',
            presetName: 'PRESET_PIE_SEPARATE_LABEL',
            description: 'Separate pie chart of Label',
            descriptionZh: '分開顯示Label的圓餅圖',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData4')
          },
          {
            title: 'PRESET_PIE_SUM_SERIES',
            presetName: 'PRESET_PIE_SUM_SERIES',
            description: 'Pie chart of combined Series data',
            descriptionZh: '合併Series資料的圓餅圖',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
        ]
      },
      {
        title: 'Rose',
        description: 'Rose Chart',
        descriptionZh: '玫瑰圖',
        mainPluginNames: ['Rose'],
        list: [
          {
            title: 'PRESET_ROSE_BASIC',
            presetName: 'PRESET_ROSE_BASIC',
            description: 'Basic Rose chart',
            descriptionZh: '基本Rose參數',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_ROSE_SIMPLE',
            presetName: 'PRESET_ROSE_SIMPLE',
            description: 'Simple Rose chart',
            descriptionZh: '簡單Rose參數',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_ROSE_SCALING_BY_RADIUS',
            presetName: 'PRESET_ROSE_SCALING_BY_RADIUS',
            description: 'Rose chart with radius scaling',
            descriptionZh: '以半徑尺寸為比例的玫瑰圖',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          // {
          //   title: 'PRESET_SERIES_DESC',
          //   presetName: 'PRESET_SERIES_DESC',
          //   allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'Tooltip'],
          //   getData: () => import('./data/seriesData2')
          // },
          {
            title: 'PRESET_ROSE_SEPARATE_SERIES',
            presetName: 'PRESET_ROSE_SEPARATE_SERIES',
            description: 'Separate rose chart of Series',
            descriptionZh: '分開顯示Series的玫瑰圖',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_ROSE_SEPARATE_LABEL',
            presetName: 'PRESET_ROSE_SEPARATE_LABEL',
            description: 'Separate rose chart of Label',
            descriptionZh: '分開顯示Label的玫瑰圖',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData4')
          },
          {
            title: 'PRESET_ROSE_SEPARATE_ALL',
            presetName: 'PRESET_ROSE_SEPARATE_ALL',
            description: 'Separate rose chart of all data',
            descriptionZh: '全部資料分開顯示的玫瑰圖',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_ROSE_SUM_SERIES',
            presetName: 'PRESET_ROSE_SUM_SERIES',
            description: 'Rose chart of combined Series data',
            descriptionZh: '合併Series資料的玫瑰圖',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'SeriesTooltip'],
            getData: () => import('./data/seriesData2')
          },
          // {
          //   title: 'PRESET_ROSE_SEPARATE_SERIES_AND_SUM_SERIES',
          //   presetName: 'PRESET_ROSE_SEPARATE_SERIES_AND_SUM_SERIES',
          //   description: 'Separate and sum Series data',
          //   descriptionZh: '分開顯示Series並合併Series資料',
          //   allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'SeriesTooltip'],
          //   getData: () => import('./data/seriesData2')
          // },
        ]
      }
    ]
  },
  {
    title: 'Grid',
    chartType: 'grid',
    list: [
      {
        title: 'Bars',
        description: 'Bar Chart',
        descriptionZh: '長條圖',
        mainPluginNames: ['Bars'],
        list: [
          {
            title: 'PRESET_GRID_BASIC',
            presetName: 'PRESET_GRID_BASIC',
            description: 'Basic Grid',
            descriptionZh: '基本Grid',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_SIMPLE',
            presetName: 'PRESET_GRID_SIMPLE',
            description: 'Simple Grid',
            descriptionZh: '簡單Grid',
            allPluginNames: ['GroupAxis', 'Bars', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            presetName: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            description: 'Rotate axis label',
            descriptionZh: '傾斜標籤',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_HORIZONTAL',
            presetName: 'PRESET_GRID_HORIZONTAL',
            description: 'Horizontal Grid',
            descriptionZh: '橫向圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_BARS_ROUND',
            presetName: 'PRESET_BARS_ROUND',
            description: 'Rounded bars',
            descriptionZh: '圓角長條圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_BARS_HORIZONTAL_AND_ROUND',
            presetName: 'PRESET_BARS_HORIZONTAL_AND_ROUND',
            description: 'Horizontal bars with round corners',
            descriptionZh: '橫向圓角長條圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_BARS_THIN',
            presetName: 'PRESET_BARS_THIN',
            description: 'Thin bars',
            descriptionZh: '細長條圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_BARS_HORIZONTAL_AND_THIN',
            presetName: 'PRESET_BARS_HORIZONTAL_AND_THIN',
            description: 'Horizontal thin bars',
            descriptionZh: '橫向細長長條圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          // {
          //   chartType: 'grid',
          //   pluginName: 'Bars',
          //   presetName: 'PRESET_GRID_2_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'Bars',
          //   presetName: 'PRESET_GRID_3_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'Bars',
          //   presetName: 'PRESET_GRID_4_SERIES_SLOT'
          // },
          {
            title: 'PRESET_GRID_SEPARATE_SERIES',
            presetName: 'PRESET_GRID_SEPARATE_SERIES',
            description: 'Separate Series',
            descriptionZh: '分開顯示Series',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
        ]
      },
      {
        title: 'BarsPN',
        description: 'Positive and Negative Bar Chart',
        descriptionZh: '正負長條圖',
        mainPluginNames: ['BarsPN'],
        list: [
          {
            title: 'PRESET_GRID_PN_SCALE',
            presetName: 'PRESET_GRID_PN_SCALE',
            description: 'Positive negative scale',
            descriptionZh: '正負值分向圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'BarsPN', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData4')
          },
          {
            title: 'PRESET_GRID_PN_SCALE_SIMPLE',
            presetName: 'PRESET_GRID_PN_SCALE_SIMPLE',
            description: 'Simple positive negative scale',
            descriptionZh: '簡單正負值分向圖',
            allPluginNames: ['GroupAxis', 'BarsPN', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData4')
          },
        ]
      },
      {
        title: 'StackedBars',
        description: 'Stacked Bar Chart',
        descriptionZh: '堆疊長條圖',
        mainPluginNames: ['StackedBars'],
        list: [
          {
            title: 'PRESET_GRID_BASIC',
            presetName: 'PRESET_GRID_BASIC',
            description: 'Basic Grid',
            descriptionZh: '基本Grid',
            allPluginNames: ['GroupAxis', 'StackedValueAxis', 'StackedBars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_SIMPLE',
            presetName: 'PRESET_GRID_SIMPLE',
            description: 'Simple Grid',
            descriptionZh: '簡單Grid',
            allPluginNames: ['GroupAxis', 'StackedBars', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            presetName: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            description: 'Rotate axis label',
            descriptionZh: '傾斜標籤',
            allPluginNames: ['GroupAxis', 'StackedValueAxis', 'StackedBars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_HORIZONTAL',
            presetName: 'PRESET_GRID_HORIZONTAL',
            description: 'Horizontal Grid',
            descriptionZh: '橫向圖',
            allPluginNames: ['GroupAxis', 'StackedValueAxis', 'StackedBars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          // {
          //   chartType: 'grid',
          //   pluginName: 'StackedBars',
          //   presetName: 'PRESET_GRID_2_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'StackedBars',
          //   presetName: 'PRESET_GRID_3_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'StackedBars',
          //   presetName: 'PRESET_GRID_4_SERIES_SLOT'
          // },
          {
            title: 'PRESET_GRID_SEPARATE_SERIES',
            presetName: 'PRESET_GRID_SEPARATE_SERIES',
            description: 'Separate Series',
            descriptionZh: '分開顯示Series',
            allPluginNames: ['GroupAxis', 'StackedValueAxis', 'StackedBars', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
        ]
      },
      {
        title: 'BarsTriangle',
        description: 'Triangle Bar Chart',
        descriptionZh: '三角形長條圖',
        mainPluginNames: ['BarsTriangle'],
        list: [
          {
            title: 'PRESET_GRID_BASIC',
            presetName: 'PRESET_GRID_BASIC',
            description: 'Basic Grid',
            descriptionZh: '基本Grid',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'BarsTriangle', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_SIMPLE',
            presetName: 'PRESET_GRID_SIMPLE',
            description: 'Simple Grid',
            descriptionZh: '簡單Grid',
            allPluginNames: ['GroupAxis', 'BarsTriangle', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            presetName: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            description: 'Rotate axis label',
            descriptionZh: '傾斜標籤',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'BarsTriangle', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_HORIZONTAL',
            presetName: 'PRESET_GRID_HORIZONTAL',
            description: 'Horizontal Grid',
            descriptionZh: '橫向圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'BarsTriangle', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          // {
          //   chartType: 'grid',
          //   pluginName: 'BarsTriangle',
          //   presetName: 'PRESET_GRID_2_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'BarsTriangle',
          //   presetName: 'PRESET_GRID_3_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'BarsTriangle',
          //   presetName: 'PRESET_GRID_4_SERIES_SLOT'
          // },
          {
            title: 'PRESET_GRID_SEPARATE_SERIES',
            presetName: 'PRESET_GRID_SEPARATE_SERIES',
            description: 'Separate Series',
            descriptionZh: '分開顯示Series',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'BarsTriangle', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
        ]
      },
      {
        title: 'Lines',
        description: 'Line Chart',
        descriptionZh: '折線圖',
        mainPluginNames: ['Lines'],
        list: [
          {
            title: 'PRESET_LINES_BASIC',
            presetName: 'PRESET_LINES_BASIC',
            description: 'Basic Line',
            descriptionZh: '基本折線圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINES_SIMPLE',
            presetName: 'PRESET_LINES_SIMPLE',
            description: 'Simple line',
            descriptionZh: '簡單折線圖',
            allPluginNames: ['GroupAxis', 'Lines', 'Dots', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINES_ROTATE_AXIS_LABEL',
            presetName: 'PRESET_LINES_ROTATE_AXIS_LABEL',
            description: 'Line chart with slanted labels',
            descriptionZh: '傾斜標籤的折線圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData5')
          },
          // {
          //   chartType: 'grid',
          //   pluginName: 'Lines',
          //   presetName: 'PRESET_LINES_TENSE_TICKS',
          // },
          {
            title: 'PRESET_LINES_LOOSE_TICKS',
            presetName: 'PRESET_LINES_LOOSE_TICKS',
            description: 'Loose Ticks Line',
            descriptionZh: '寬鬆標籤的折線圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData5')
          },
          {
            title: 'PRESET_LINES_HORIZONTAL',
            presetName: 'PRESET_LINES_HORIZONTAL',
            description: 'Horizontal Line',
            descriptionZh: '橫向折線圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINES_CURVE',
            presetName: 'PRESET_LINES_CURVE',
            description: 'Curve Line',
            descriptionZh: '弧線折線圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          // {
          //   title: 'PRESET_LINES_HIGHLIGHT_GROUP_DOTS',
          //   presetName: 'PRESET_LINES_HIGHLIGHT_GROUP_DOTS',
          //   allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
          //   getData: () => import('./data/gridData1')
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'Lines',
          //   presetName: 'PRESET_GRID_2_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'Lines',
          //   presetName: 'PRESET_GRID_3_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'Lines',
          //   presetName: 'PRESET_GRID_4_SERIES_SLOT'
          // },
          {
            title: 'PRESET_GRID_SEPARATE_SERIES',
            presetName: 'PRESET_GRID_SEPARATE_SERIES',
            description: 'Separate Series',
            descriptionZh: '分開顯示Series',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'GroupAux', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
        ]
      },
      {
        title: 'LineAreas',
        description: 'Area Chart',
        descriptionZh: '區域圖',
        mainPluginNames: ['LineAreas'],
        list: [
          {
            title: 'PRESET_LINE_AREAS_BASIC',
            presetName: 'PRESET_LINE_AREAS_BASIC',
            description: 'Basic LineArea',
            descriptionZh: '基本折線區域圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINE_AREAS_SIMPLE',
            presetName: 'PRESET_LINE_AREAS_SIMPLE',
            description: 'Simple LineArea',
            descriptionZh: '簡單折線區域圖',
            allPluginNames: ['GroupAxis', 'LineAreas', 'Lines','Dots', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINE_AREAS_ROTATE_AXIS_LABEL',
            presetName: 'PRESET_LINE_AREAS_ROTATE_AXIS_LABEL',
            description: 'Rotate Axis Label LineArea',
            descriptionZh: '傾斜標籤的折線區域圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData5')
          },
          // {
          //   chartType: 'grid',
          //   pluginName: 'LineAreas',
          //   presetName: 'PRESET_LINE_AREAS_TENSE_TICKS',
          // },
          {
            title: 'PRESET_LINE_AREAS_LOOSE_TICKS',
            presetName: 'PRESET_LINE_AREAS_LOOSE_TICKS',
            description: 'Loose Ticks LineArea',
            descriptionZh: '寬鬆標籤的折線區域圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData5')
          },
          {
            title: 'PRESET_LINE_AREAS_HORIZONTAL',
            presetName: 'PRESET_LINE_AREAS_HORIZONTAL',
            description: 'Horizontal LineArea',
            descriptionZh: '橫向折線區域圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINE_AREAS_CURVE',
            presetName: 'PRESET_LINE_AREAS_CURVE',
            description: 'Curve LineArea',
            descriptionZh: '弧線的折線區域圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
          // {
          //   title: 'PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS',
          //   presetName: 'PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS',
          //   allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
          //   getData: () => import('./data/gridData1')
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'LineAreas',
          //   presetName: 'PRESET_LINE_AREAS_2_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'LineAreas',
          //   presetName: 'PRESET_LINE_AREAS_3_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'LineAreas',
          //   presetName: 'PRESET_LINE_AREAS_4_SERIES_SLOT'
          // },
          {
            title: 'PRESET_LINE_AREAS_SEPARATE_SERIES',
            presetName: 'PRESET_LINE_AREAS_SEPARATE_SERIES',
            description: 'Separate Series LineArea',
            descriptionZh: '分開顯示Series的折線區域圖',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'GroupAux', 'Dots', 'GroupZoom', 'GridLegend', 'GridTooltip'],
            getData: () => import('./data/gridData1')
          },
        ]
      }
    ]
  },
  {
    title: 'MultiGrid',
    chartType: 'multiGrid',
    list: [
      {
        title: 'MultiBars',
        description: 'Multi Bar Chart',
        descriptionZh: '多組長條圖',
        mainPluginNames: ['MultiBars'],
        list: [
          {
            title: 'PRESET_MULTI_GRID_DIVERGING',
            presetName: 'PRESET_MULTI_GRID_DIVERGING',
            description: 'Diverging Grid',
            descriptionZh: '雙向Grid',
            allPluginNames: ['MultiGroupAxis', 'MultiValueAxis', 'MultiBars', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData1')
          },
          {
            title: 'PRESET_MULTI_GRID_DIVERGING_SIMPLE',
            presetName: 'PRESET_MULTI_GRID_DIVERGING_SIMPLE',
            description: 'Simple diverging Grid',
            descriptionZh: '簡單雙向Grid',
            allPluginNames: ['MultiGroupAxis', 'MultiBars', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData0')
          },
          {
            title: 'PRESET_MULTI_GRID_SEPARATE_GRID',
            presetName: 'PRESET_MULTI_GRID_SEPARATE_GRID',
            description: 'Separate Grid',
            descriptionZh: '分開顯示Grid圖表',
            allPluginNames: ['MultiGroupAxis', 'MultiValueAxis', 'MultiBars', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData1')
          },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiBars',
          //   presetName: 'PRESET_MULTI_GRID_2_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiBars',
          //   presetName: 'PRESET_MULTI_GRID_3_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiBars',
          //   presetName: 'PRESET_MULTI_GRID_4_GRID_SLOT'
          // },
        ]
      },
      {
        title: 'MultiStackedBars',
        description: 'Multi Stacked Bar Chart',
        descriptionZh: '多組堆疊長條圖',
        mainPluginNames: ['MultiStackedBars'],
        list: [
          {
            title: 'PRESET_MULTI_GRID_SEPARATE_GRID',
            presetName: 'PRESET_MULTI_GRID_SEPARATE_GRID',
            description: 'Separate Grid',
            descriptionZh: '分開顯示Grid圖表',
            allPluginNames: ['MultiGroupAxis', 'MultiStackedValueAxis', 'MultiStackedBars', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData3')
          },
          {
            title: 'PRESET_MULTI_GRID_SEPARATE_GRID_SIMPLE',
            presetName: 'PRESET_MULTI_GRID_SEPARATE_GRID_SIMPLE',
            description: 'Simple separate grid',
            descriptionZh: '簡單的分開顯示Grid圖表',
            allPluginNames: ['MultiGroupAxis', 'MultiStackedBars', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData0')
          },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiStackedBars',
          //   presetName: 'PRESET_MULTI_GRID_2_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiStackedBars',
          //   presetName: 'PRESET_MULTI_GRID_3_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiStackedBars',
          //   presetName: 'PRESET_MULTI_GRID_4_GRID_SLOT'
          // },
        ]
      },
      {
        title: 'MultiBarsTriangle',
        description: 'Multi Triangle Bar Chart',
        descriptionZh: '多組三角形長條圖',
        mainPluginNames: ['MultiBarsTriangle'],
        list: [
          {
            title: 'PRESET_MULTI_GRID_SEPARATE_GRID',
            presetName: 'PRESET_MULTI_GRID_SEPARATE_GRID',
            description: 'Separate Grid',
            descriptionZh: '分開顯示Grid圖表',
            allPluginNames: ['MultiGroupAxis', 'MultiValueAxis', 'MultiBarsTriangle', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData3')
          },
          {
            title: 'PRESET_MULTI_GRID_SEPARATE_GRID_SIMPLE',
            presetName: 'PRESET_MULTI_GRID_SEPARATE_GRID_SIMPLE',
            description: 'Simple separate grid',
            descriptionZh: '簡單的分開顯示Grid圖表',
            allPluginNames: ['MultiGroupAxis', 'MultiBarsTriangle', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData0')
          },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiBarsTriangle',
          //   presetName: 'PRESET_MULTI_GRID_2_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiBarsTriangle',
          //   presetName: 'PRESET_MULTI_GRID_3_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiBarsTriangle',
          //   presetName: 'PRESET_MULTI_GRID_4_GRID_SLOT'
          // },
        ]
      },
      {
        title: 'MultiLines',
        description: 'Multi Line Chart',
        descriptionZh: '多組折線圖',
        mainPluginNames: ['MultiLines'],
        list: [
          {
            title: 'PRESET_MULTI_LINES_SEPARATE_GRID',
            presetName: 'PRESET_MULTI_LINES_SEPARATE_GRID',
            description: 'Separate Grid line',
            descriptionZh: '分開顯示Grid的折線圖',
            allPluginNames: ['MultiGroupAxis', 'MultiValueAxis', 'MultiLines', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData3')
          },
          {
            title: 'PRESET_MULTI_LINES_SEPARATE_GRID_SIMPLE',
            presetName: 'PRESET_MULTI_LINES_SEPARATE_GRID_SIMPLE',
            description: 'Simple separate grid line',
            descriptionZh: '簡單的分開顯示Grid的折線圖',
            allPluginNames: ['MultiGroupAxis', 'MultiLines', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData0')
          },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiLines',
          //   presetName: 'PRESET_MULTI_LINES_2_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiLines',
          //   presetName: 'PRESET_MULTI_LINES_3_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiLines',
          //   presetName: 'PRESET_MULTI_LINES_4_GRID_SLOT'
          // },
        ]
      },
      {
        title: 'MultiLineAreas',
        description: 'Multi Area Chart',
        descriptionZh: '多組區域圖',
        mainPluginNames: ['MultiLineAreas'],
        list: [
          {
            title: 'PRESET_MULTI_LINE_AREAS_SEPARATE_GRID',
            presetName: 'PRESET_MULTI_LINE_AREAS_SEPARATE_GRID',
            description: 'Separate Grid line areas',
            descriptionZh: '分開顯示Grid的折線區域圖',
            allPluginNames: ['MultiGroupAxis', 'MultiValueAxis', 'MultiLineAreas', 'MultiLines', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData3')
          },
          {
            title: 'PRESET_MULTI_LINE_AREAS_SEPARATE_GRID_SIMPLE',
            presetName: 'PRESET_MULTI_LINE_AREAS_SEPARATE_GRID_SIMPLE',
            description: 'Simple separate grid line areas',
            descriptionZh: '簡單的分開顯示Grid的折線區域圖',
            allPluginNames: ['MultiGroupAxis', 'MultiLineAreas', 'MultiLines', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData0')
          },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiLineAreas',
          //   presetName: 'PRESET_MULTI_LINE_AREAS_2_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiLineAreas',
          //   presetName: 'PRESET_MULTI_LINE_AREAS_3_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiLineAreas',
          //   presetName: 'PRESET_MULTI_LINE_AREAS_4_GRID_SLOT'
          // },
        ]
      },
      {
        title: 'MultiBars, MultiLines',
        description: 'Dual-Axis Bar and Line Chart',
        descriptionZh: '雙圖軸長條及折線圖',
        mainPluginNames: ['MultiBars', 'MultiLines'],
        list: [
          {
            title: 'PRESET_MULTI_GRID_BASIC',
            presetName: 'PRESET_MULTI_GRID_BASIC',
            description: 'Basic MultiGrid',
            descriptionZh: '基本MultiGrid',
            allPluginNames: ['MultiGroupAxis', 'OverlappingValueAxes', 'MultiBars', 'MultiLines', 'MultiDots', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData1')
          },
          {
            title: 'PRESET_MULTI_GRID_SIMPLE',
            presetName: 'PRESET_MULTI_GRID_SIMPLE',
            description: 'Simple MultiGrid',
            descriptionZh: '簡單MultiGrid',
            allPluginNames: ['MultiGroupAxis', 'MultiBars', 'MultiLines', 'MultiDots', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData0')
          },
          {
            title: 'PRESET_MULTI_GRID_ROUND_STYLE',
            presetName: 'PRESET_MULTI_GRID_ROUND_STYLE',
            description: 'MultiGrid with round style',
            descriptionZh: 'MultiGrid圓弧風格',
            allPluginNames: ['MultiGroupAxis', 'OverlappingValueAxes', 'MultiBars', 'MultiLines', 'MultiDots','MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData1')
          },
        ]
      },
      {
        title: 'MultiStackedBars, MultiLines',
        description: 'Dual-Axis Stacked Bar and Line Chart',
        descriptionZh: '雙圖軸堆疊長條及折線圖',
        mainPluginNames: ['MultiStackedBars', 'MultiLines'],
        list: [
          {
            title: 'PRESET_MULTI_GRID_BASIC',
            presetName: 'PRESET_MULTI_GRID_BASIC',
            description: 'Basic MultiGrid',
            descriptionZh: '基本MultiGrid',
            allPluginNames: ['MultiGroupAxis', 'OverlappingStackedValueAxes', 'MultiStackedBars', 'MultiLines', 'MultiDots', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData1')
          },
          {
            title: 'PRESET_MULTI_GRID_SIMPLE',
            presetName: 'PRESET_MULTI_GRID_SIMPLE',
            description: 'Simple MultiGrid',
            descriptionZh: '簡單MultiGrid',
            allPluginNames: ['MultiGroupAxis', 'MultiStackedBars', 'MultiLines', 'MultiDots', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData0')
          },
        ]
      },
      {
        title: 'MultiBarsTriangle, MultiLines',
        description: 'Dual-Axis Triangle Bar and Line Chart',
        descriptionZh: '雙圖軸三角形長條及折線圖',
        mainPluginNames: ['MultiBarsTriangle', 'MultiLines'],
        list: [
          {
            title: 'PRESET_MULTI_GRID_BASIC',
            presetName: 'PRESET_MULTI_GRID_BASIC',
            description: 'Basic MultiGrid',
            descriptionZh: '基本MultiGrid',
            allPluginNames: ['MultiGroupAxis', 'OverlappingValueAxes', 'MultiBarsTriangle', 'MultiLines', 'MultiDots', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData1')
          },
          {
            title: 'PRESET_MULTI_GRID_SIMPLE',
            presetName: 'PRESET_MULTI_GRID_SIMPLE',
            description: 'Simple MultiGrid',
            descriptionZh: '簡單MultiGrid',
            allPluginNames: ['MultiGroupAxis', 'MultiBarsTriangle', 'MultiLines', 'MultiDots', 'MultiGridLegend', 'MultiGridTooltip'],
            getData: () => import('./data/multiGridData0')
          },
        ]
      }
    ]
  },
  {
    title: 'MultiValue',
    chartType: 'multiValue',
    list: [
      {
        title: 'Scatter',
        description: 'Scatter Chart',
        descriptionZh: '散佈圖',
        mainPluginNames: ['Scatter'],
        list: [
          {
            title: 'PRESET_SCATTER_BASIC',
            presetName: 'PRESET_SCATTER_BASIC',
            description: 'Basic scatter',
            descriptionZh: '基本散布圖',
            allPluginNames: ['Scatter', 'MultiValueLegend', 'MultiValueTooltip', 'XYAxes', 'XYAux', 'XZoom'],
            getData: () => import('./data/multiValue1')
          },
          {
            title: 'PRESET_SCATTER_SIMPLE',
            presetName: 'PRESET_SCATTER_SIMPLE',
            description: 'Simple scatter',
            descriptionZh: '簡單散布圖',
            allPluginNames: ['Scatter', 'MultiValueTooltip', 'XYAxes'],
            getData: () => import('./data/multiValue0')
          },
          {
            title: 'PRESET_SCATTER_SEPARATE_CATEGORY',
            presetName: 'PRESET_SCATTER_SEPARATE_CATEGORY',
            description: 'Scatter with separate category',
            descriptionZh: '分開顯示category的散布圖',
            allPluginNames: ['Scatter', 'MultiValueLegend', 'MultiValueTooltip', 'XYAxes', 'XYAux', 'XZoom'],
            getData: () => import('./data/multiValue1')
          },
        ]
      },
      {
        title: 'ScatterBubbles',
        description: 'Scatter Bubbles Chart',
        descriptionZh: '泡泡散佈圖',
        mainPluginNames: ['ScatterBubbles'],
        list: [
          {
            title: 'PRESET_SCATTER_BUBBLES_BASIC',
            presetName: 'PRESET_SCATTER_BUBBLES_BASIC',
            description: 'Basic scatter bubbles',
            descriptionZh: '基本的散布泡泡圖',
            allPluginNames: ['ScatterBubbles', 'MultiValueLegend', 'MultiValueTooltip', 'XYAxes', 'XYAux', 'XZoom'],
            getData: () => import('./data/multiValue1')
          },
          {
            title: 'PRESET_SCATTER_BUBBLES_SIMPLE',
            presetName: 'PRESET_SCATTER_BUBBLES_SIMPLE',
            description: 'Simple scatter bubbles',
            descriptionZh: '簡單的散布泡泡圖',
            allPluginNames: ['ScatterBubbles', 'MultiValueTooltip', 'XYAxes'],
            getData: () => import('./data/multiValue0')
          },
          {
            title: 'PRESET_SCATTER_BUBBLES_LINEAR_OPACITY',
            presetName: 'PRESET_SCATTER_BUBBLES_LINEAR_OPACITY',
            description: 'Scatter bubbles with linear opacity',
            descriptionZh: '漸變透明度的散布泡泡圖',
            allPluginNames: ['ScatterBubbles', 'MultiValueLegend', 'MultiValueTooltip', 'XYAxes', 'XYAux', 'XZoom'],
            getData: () => import('./data/multiValue1')
          },
          {
            title: 'PRESET_SCATTER_BUBBLES_SCALING_BY_RADIUS',
            presetName: 'PRESET_SCATTER_BUBBLES_SCALING_BY_RADIUS',
            description: 'Scatter bubbles with radius scaling',
            descriptionZh: '以半徑尺寸為比例的散布泡泡圖',
            allPluginNames: ['ScatterBubbles', 'MultiValueLegend', 'MultiValueTooltip', 'XYAxes', 'XYAux', 'XZoom'],
            getData: () => import('./data/multiValue1')
          },
          {
            title: 'PRESET_SCATTER_BUBBLES_SEPARATE_CATEGORY',
            presetName: 'PRESET_SCATTER_BUBBLES_SEPARATE_CATEGORY',
            description: 'Scatter bubbles with separate category',
            descriptionZh: '分開顯示category的散布泡泡圖',
            allPluginNames: ['ScatterBubbles', 'MultiValueLegend', 'MultiValueTooltip', 'XYAxes', 'XYAux', 'XZoom'],
            getData: () => import('./data/multiValue1')
          },
        ]
      },
      {
        title: 'OrdinalBubbles',
        description: 'Ordinal Bubbles Chart',
        descriptionZh: '序數泡泡圖',
        mainPluginNames: ['OrdinalBubbles'],
        list: [
          {
            title: 'PRESET_ORDINAL_BUBBLES_BASIC',
            presetName: 'PRESET_ORDINAL_BUBBLES_BASIC',
            description: 'Basic ordinal bubbles',
            descriptionZh: '基本的序數泡泡圖',
            allPluginNames: ['OrdinalBubbles', 'OrdinalAxis', 'OrdinalAux', 'OrdinalZoom', 'MultiValueLegend', 'MultiValueTooltip'],
            getData: () => import('./data/multiValueData_channel')
          },
          {
            title: 'PRESET_ORDINAL_BUBBLES_SIMPLE',
            presetName: 'PRESET_ORDINAL_BUBBLES_SIMPLE',
            description: 'Simple ordinal bubbles',
            descriptionZh: '簡單的序數泡泡圖',
            allPluginNames: ['OrdinalBubbles', 'OrdinalAxis', 'MultiValueLegend'],
            getData: () => import('./data/multiValueData_channel_short')
          },
          {
            title: 'PRESET_ORDINAL_BUBBLES_LINEAR_OPACITY',
            presetName: 'PRESET_ORDINAL_BUBBLES_LINEAR_OPACITY',
            description: 'Ordinal bubbles with linear opacity',
            descriptionZh: '漸變透明度的序數泡泡圖',
            allPluginNames: ['OrdinalBubbles', 'OrdinalAxis', 'OrdinalAux', 'OrdinalZoom', 'MultiValueLegend', 'MultiValueTooltip'],
            getData: () => import('./data/multiValueData_channel')
          },
          {
            title: 'PRESET_ORDINAL_BUBBLES_SCALING_BY_RADIUS',
            presetName: 'PRESET_ORDINAL_BUBBLES_SCALING_BY_RADIUS',
            description: 'Ordinal bubbles with radius scaling',
            descriptionZh: '以半徑尺寸為比例的序數泡泡圖',
            allPluginNames: ['OrdinalBubbles', 'OrdinalAxis', 'OrdinalAux', 'OrdinalZoom', 'MultiValueLegend', 'MultiValueTooltip'],
            getData: () => import('./data/multiValueData_channel')
          },
          {
            title: 'PRESET_ORDINAL_BUBBLES_ALL_ITEMS',
            presetName: 'PRESET_ORDINAL_BUBBLES_ALL_ITEMS',
            description: 'Ordinal bubbles for all items',
            descriptionZh: '顯示全部項目的序數泡泡圖',
            allPluginNames: ['OrdinalBubbles', 'OrdinalAxis', 'OrdinalAux', 'OrdinalZoom', 'MultiValueLegend', 'MultiValueTooltip'],
            getData: () => import('./data/multiValueData_channel')
          },
          {
            title: 'PRESET_ORDINAL_BUBBLES_SEPARATE_CATEGORY',
            presetName: 'PRESET_ORDINAL_BUBBLES_SEPARATE_CATEGORY',
            description: 'Ordinal bubbles with separate category',
            descriptionZh: '分開顯示category的序數泡泡圖',
            allPluginNames: ['OrdinalBubbles', 'OrdinalAxis', 'OrdinalAux', 'OrdinalZoom', 'MultiValueLegend', 'MultiValueTooltip'],
            getData: () => import('./data/multiValueData_channel_short')
          },
        ]
      },
      {
        title: 'RacingBars',
        description: 'Racing Bars Chart',
        descriptionZh: '賽跑長條圖',
        mainPluginNames: ['RacingBars'],
        list: [
          {
            title: 'PRESET_RACING_BARS_BASIC',
            presetName: 'PRESET_RACING_BARS_BASIC',
            description: 'Basic racing bars',
            descriptionZh: '基本賽跑長條圖',
            allPluginNames: ['RacingBars', 'MultiValueLegend', 'MultiValueTooltip', 'RacingValueAxis', 'RacingCounterTexts'],
            getData: () => import('./data/multiValueData_brand')
          },
          {
            title: 'PRESET_RACING_BARS_SIMPLE',
            presetName: 'PRESET_RACING_BARS_SIMPLE',
            description: 'Simple racing bars',
            descriptionZh: '簡單賽跑長條圖',
            allPluginNames: ['RacingBars', 'MultiValueTooltip', 'RacingValueAxis', 'RacingCounterTexts'],
            getData: () => import('./data/multiValueData_brand_short')
          },
          {
            title: 'PRESET_RACING_BARS_FAST',
            presetName: 'PRESET_RACING_BARS_FAST',
            description: 'Fast racing bars',
            descriptionZh: '快速的賽跑長條圖',
            allPluginNames: ['RacingBars', 'MultiValueLegend', 'MultiValueTooltip', 'RacingValueAxis', 'RacingCounterTexts'],
            getData: () => import('./data/multiValueData_brand')
          },
          {
            title: 'PRESET_RACING_BARS_FASTER',
            presetName: 'PRESET_RACING_BARS_FASTER',
            description: 'Faster racing bars',
            descriptionZh: '更快速的賽跑長條圖',
            allPluginNames: ['RacingBars', 'MultiValueLegend', 'MultiValueTooltip', 'RacingValueAxis', 'RacingCounterTexts'],
            getData: () => import('./data/multiValueData_brand')
          },
          {
            title: 'PRESET_RACING_BARS_LOOP',
            presetName: 'PRESET_RACING_BARS_LOOP',
            description: 'Looping racing bars',
            descriptionZh: '循環的賽跑長條圖',
            allPluginNames: ['RacingBars', 'MultiValueLegend', 'MultiValueTooltip', 'RacingValueAxis', 'RacingCounterTexts'],
            getData: () => import('./data/multiValueData_brand_short')
          },
          {
            title: 'PRESET_RACING_BARS_STOP',
            presetName: 'PRESET_RACING_BARS_STOP',
            description: 'Stopped racing bars',
            descriptionZh: '停止的賽跑長條圖',
            allPluginNames: ['RacingBars', 'MultiValueLegend', 'MultiValueTooltip', 'RacingValueAxis', 'RacingCounterTexts'],
            getData: () => import('./data/multiValueData_brand')
          },
          {
            title: 'PRESET_RACING_BARS_OUTSIDE_LABELS',
            presetName: 'PRESET_RACING_BARS_OUTSIDE_LABELS',
            description: 'Racing bars with labels outside',
            descriptionZh: '標籤在外面的賽跑長條圖',
            allPluginNames: ['RacingBars', 'MultiValueLegend', 'MultiValueTooltip', 'RacingValueAxis', 'RacingCounterTexts'],
            getData: () => import('./data/multiValueData_brand')
          },
          {
            title: 'PRESET_RACING_BARS_ALL_ITEMS',
            presetName: 'PRESET_RACING_BARS_ALL_ITEMS',
            description: 'Racing bars for all items',
            descriptionZh: '顯示全部項目的賽跑長條圖',
            allPluginNames: ['RacingBars', 'MultiValueLegend', 'MultiValueTooltip', 'RacingValueAxis', 'RacingCounterTexts'],
            getData: () => import('./data/multiValueData_brand')
          },
          {
            title: 'PRESET_RACING_BARS_SEPARATE_CATEGORY',
            presetName: 'PRESET_RACING_BARS_SEPARATE_CATEGORY',
            description: 'Racing bars with separate category',
            descriptionZh: '分開顯示category的賽跑長條圖',
            allPluginNames: ['RacingBars', 'MultiValueLegend', 'MultiValueTooltip', 'RacingValueAxis', 'RacingCounterTexts'],
            getData: () => import('./data/multiValue1')
          },
        ]
      }
    ]
  },
  {
    title: 'Relationship',
    chartType: 'relationship',
    list: [
      {
        title: 'ForceDirected',
        description: 'Force Directed Chart',
        descriptionZh: '力導向圖',
        mainPluginNames: ['ForceDirected'],
        list: [
          {
            title: 'PRESET_FORCE_DIRECTED_BASIC',
            presetName: 'PRESET_FORCE_DIRECTED_BASIC',
            description: 'Basic force directed chart',
            descriptionZh: '基本力導向圖',
            allPluginNames: ['ForceDirected', 'RelationshipLegend', 'RelationshipTooltip'],
            getData: () => import('./data/relationshipData1')
          },
          {
            title: 'PRESET_FORCE_DIRECTED_SIMPLE',
            presetName: 'PRESET_FORCE_DIRECTED_SIMPLE',
            description: 'Simple force directed chart',
            descriptionZh: '簡單力導向圖',
            allPluginNames: ['ForceDirected', 'RelationshipTooltip'],
            getData: () => import('./data/relationshipData1')
          },
          {
            title: 'PRESET_FORCE_DIRECTED_FIX_FONT_SIZE',
            presetName: 'PRESET_FORCE_DIRECTED_FIX_FONT_SIZE',
            description: 'Force directed chart with fixed font size',
            descriptionZh: '固定字體大小的力導向圖',
            allPluginNames: ['ForceDirected', 'RelationshipLegend', 'RelationshipTooltip'],
            getData: () => import('./data/relationshipData1')
          },
          {
            title: 'PRESET_FORCE_DIRECTED_NONE_ARROW',
            presetName: 'PRESET_FORCE_DIRECTED_NONE_ARROW',
            description: 'Force directed chart without arrows',
            descriptionZh: '沒有箭頭的力導向圖',
            allPluginNames: ['ForceDirected', 'RelationshipLegend', 'RelationshipTooltip'],
            getData: () => import('./data/relationshipData1')
          },
          {
            title: 'PRESET_FORCE_DIRECTED_NONE_ZOOM',
            presetName: 'PRESET_FORCE_DIRECTED_NONE_ZOOM',
            description: 'Force directed chart without mouse drag and zoom control',
            descriptionZh: '無滑鼠托曳及縮放控制的力導向圖',
            allPluginNames: ['ForceDirected', 'RelationshipLegend', 'RelationshipTooltip'],
            getData: () => import('./data/relationshipData1')
          }
        ]
      },
      {
        title: 'ForceDirectedBubbles',
        description: 'Force Directed Bubbles Chart',
        descriptionZh: '力導向泡泡圖',
        mainPluginNames: ['ForceDirectedBubbles'],
        list: [
          {
            title: 'PRESET_FORCE_DIRECTED_BUBBLES_BASIC',
            presetName: 'PRESET_FORCE_DIRECTED_BUBBLES_BASIC',
            description: 'Basic force directed bubbles chart',
            descriptionZh: '基本力導向泡泡圖',
            allPluginNames: ['ForceDirectedBubbles', 'RelationshipLegend', 'RelationshipTooltip'],
            getData: () => import('./data/relationshipData1')
          },
          {
            title: 'PRESET_FORCE_DIRECTED_BUBBLES_SIMPLE',
            presetName: 'PRESET_FORCE_DIRECTED_BUBBLES_SIMPLE',
            description: 'Simple force directed bubbles chart',
            descriptionZh: '簡單力導向泡泡圖',
            allPluginNames: ['ForceDirectedBubbles', 'RelationshipTooltip'],
            getData: () => import('./data/relationshipData1')
          },
          {
            title: 'PRESET_FORCE_DIRECTED_BUBBLES_FIX_ARROW_WIDTH',
            presetName: 'PRESET_FORCE_DIRECTED_BUBBLES_FIX_ARROW_WIDTH',
            description: 'Force-directed bubble chart with fixed arrow width',
            descriptionZh: '固定箭頭寬度的力導向泡泡圖',
            allPluginNames: ['ForceDirectedBubbles', 'RelationshipLegend', 'RelationshipTooltip'],
            getData: () => import('./data/relationshipData1')
          },
          {
            title: 'PRESET_FORCE_DIRECTED_BUBBLES_NONE_ARROW',
            presetName: 'PRESET_FORCE_DIRECTED_BUBBLES_NONE_ARROW',
            description: 'Force-directed bubble chart without arrows',
            descriptionZh: '沒有箭頭的力導向泡泡圖',
            allPluginNames: ['ForceDirectedBubbles', 'RelationshipLegend', 'RelationshipTooltip'],
            getData: () => import('./data/relationshipData1')
          },
          {
            title: 'PRESET_FORCE_DIRECTED_BUBBLES_NONE_ZOOM',
            presetName: 'PRESET_FORCE_DIRECTED_BUBBLES_NONE_ZOOM',
            description: 'Force Directed bubbles chart without mouse drag and zoom control',
            descriptionZh: '無滑鼠托曳及縮放控制的力導向泡泡圖',
            allPluginNames: ['ForceDirectedBubbles', 'RelationshipLegend', 'RelationshipTooltip'],
            getData: () => import('./data/relationshipData1')
          }
        ]
      }
    ]
  },
  {
    title: 'Tree',
    chartType: 'tree',
    list: [
      {
        title: 'TreeMap',
        description: 'Tree Map Chart',
        descriptionZh: '樹狀圖',
        mainPluginNames: ['TreeMap'],
        list: [
          {
            title: 'PRESET_TREE_MAP_BASIC',
            presetName: 'PRESET_TREE_MAP_BASIC',
            description: 'Basic tree map',
            descriptionZh: '基本樹狀矩形圖',
            allPluginNames: ['TreeMap', 'TreeLegend', 'TreeTooltip'],
            getData: () => import('./data/treeData1')
          },
          {
            title: 'PRESET_TREE_MAP_SIMPLE',
            presetName: 'PRESET_TREE_MAP_SIMPLE',
            description: 'Simple tree map',
            descriptionZh: '簡單樹狀矩形圖',
            allPluginNames: ['TreeMap', 'TreeTooltip'],
            getData: () => import('./data/treeData0')
          },
        ]
      },
    ]
  }
]