import type { DemoChartTypeItem } from './types'
// type nonePresetTitle = '[none preset]'

export const DEMO_LIST: DemoChartTypeItem[] = [
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
            title: 'PRESET_SERIES_BASIC',
            presetName: 'PRESET_SERIES_BASIC',
            allPluginNames: ['Bubbles', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData3')
          },
          {
            title: 'PRESET_BUBBLES_SCALING_BY_RADIUS',
            presetName: 'PRESET_BUBBLES_SCALING_BY_RADIUS',
            allPluginNames: ['Bubbles', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData3')
          },
          {
            title: 'PRESET_BUBBLES_SEPARATE_SERIES',
            presetName: 'PRESET_BUBBLES_SEPARATE_SERIES',
            allPluginNames: ['Bubbles', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData3')
          },
          {
            title: 'PRESET_SERIES_SUM_SERIES',
            presetName: 'PRESET_SERIES_SUM_SERIES',
            allPluginNames: ['Bubbles', 'SeriesLegend', 'Tooltip'],
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
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_PIE_WITH_INNER_LABELS',
            presetName: 'PRESET_PIE_WITH_INNER_LABELS',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_PIE_DONUT',
            presetName: 'PRESET_PIE_DONUT',
            allPluginNames: ['Pie', 'PieLabels', 'PieEventTexts', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_PIE_HALF_DONUT',
            presetName: 'PRESET_PIE_HALF_DONUT',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData2')
          },
          // {
          //   title: 'PRESET_SERIES_DESC',
          //   presetName: 'PRESET_SERIES_DESC',
          //   allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'Tooltip'],
          //   getData: () => import('./data/seriesData2')
          // },
          {
            title: 'PRESET_SERIES_SEPARATE_SERIES',
            presetName: 'PRESET_SERIES_SEPARATE_SERIES',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_SERIES_SUM_SERIES',
            presetName: 'PRESET_SERIES_SUM_SERIES',
            allPluginNames: ['Pie', 'PieLabels', 'SeriesLegend', 'Tooltip'],
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
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_ROSE_SCALING_BY_RADIUS',
            presetName: 'PRESET_ROSE_SCALING_BY_RADIUS',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData2')
          },
          // {
          //   title: 'PRESET_SERIES_DESC',
          //   presetName: 'PRESET_SERIES_DESC',
          //   allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'Tooltip'],
          //   getData: () => import('./data/seriesData2')
          // },
          {
            title: 'PRESET_SERIES_SEPARATE_SERIES',
            presetName: 'PRESET_SERIES_SEPARATE_SERIES',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_SERIES_SUM_SERIES',
            presetName: 'PRESET_SERIES_SUM_SERIES',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData2')
          },
          {
            title: 'PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES',
            presetName: 'PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES',
            allPluginNames: ['Rose', 'RoseLabels', 'SeriesLegend', 'Tooltip'],
            getData: () => import('./data/seriesData2')
          },
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            presetName: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_HORIZONTAL',
            presetName: 'PRESET_GRID_HORIZONTAL',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_BARS_ROUND',
            presetName: 'PRESET_BARS_ROUND',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_BARS_HORIZONTAL_AND_ROUND',
            presetName: 'PRESET_BARS_HORIZONTAL_AND_ROUND',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_BARS_THIN',
            presetName: 'PRESET_BARS_THIN',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_BARS_HORIZONTAL_AND_THIN',
            presetName: 'PRESET_BARS_HORIZONTAL_AND_THIN',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'ScalingArea', 'GridLegend', 'Tooltip'],
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Bars', 'ScalingArea', 'GridLegend', 'Tooltip'],
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'BarsPN', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData4')
          },
        ]
      },
      {
        title: 'BarStack',
        description: 'Stacked Bar Chart',
        descriptionZh: '堆疊長條圖',
        mainPluginNames: ['BarStack'],
        list: [
          {
            title: 'PRESET_GRID_BASIC',
            presetName: 'PRESET_GRID_BASIC',
            allPluginNames: ['GroupAxis', 'ValueStackAxis', 'BarStack', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            presetName: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            allPluginNames: ['GroupAxis', 'ValueStackAxis', 'BarStack', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_HORIZONTAL',
            presetName: 'PRESET_GRID_HORIZONTAL',
            allPluginNames: ['GroupAxis', 'ValueStackAxis', 'BarStack', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          // {
          //   chartType: 'grid',
          //   pluginName: 'BarStack',
          //   presetName: 'PRESET_GRID_2_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'BarStack',
          //   presetName: 'PRESET_GRID_3_SERIES_SLOT'
          // },
          // {
          //   chartType: 'grid',
          //   pluginName: 'BarStack',
          //   presetName: 'PRESET_GRID_4_SERIES_SLOT'
          // },
          {
            title: 'PRESET_GRID_SEPARATE_SERIES',
            presetName: 'PRESET_GRID_SEPARATE_SERIES',
            allPluginNames: ['GroupAxis', 'ValueStackAxis', 'BarStack', 'ScalingArea', 'GridLegend', 'Tooltip'],
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'BarsTriangle', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            presetName: 'PRESET_GRID_ROTATE_AXIS_LABEL',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'BarsTriangle', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_GRID_HORIZONTAL',
            presetName: 'PRESET_GRID_HORIZONTAL',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'BarsTriangle', 'ScalingArea', 'GridLegend', 'Tooltip'],
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'BarsTriangle', 'ScalingArea', 'GridLegend', 'Tooltip'],
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINES_ROTATE_AXIS_LABEL',
            presetName: 'PRESET_LINES_ROTATE_AXIS_LABEL',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'GroupAux', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData5')
          },
          {
            title: 'PRESET_LINES_HORIZONTAL',
            presetName: 'PRESET_LINES_HORIZONTAL',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINES_CURVE',
            presetName: 'PRESET_LINES_CURVE',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINES_HIGHLIGHT_GROUP_DOTS',
            presetName: 'PRESET_LINES_HIGHLIGHT_GROUP_DOTS',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'GroupAux', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'Lines', 'ScalingArea', 'GridLegend', 'Tooltip'],
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINE_AREAS_ROTATE_AXIS_LABEL',
            presetName: 'PRESET_LINE_AREAS_ROTATE_AXIS_LABEL',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'GroupAux', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData5')
          },
          {
            title: 'PRESET_LINE_AREAS_HORIZONTAL',
            presetName: 'PRESET_LINE_AREAS_HORIZONTAL',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINE_AREAS_CURVE',
            presetName: 'PRESET_LINE_AREAS_CURVE',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
          {
            title: 'PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS',
            presetName: 'PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS',
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'GroupAux', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
            getData: () => import('./data/gridData1')
          },
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
            allPluginNames: ['GroupAxis', 'ValueAxis', 'LineAreas', 'Lines', 'Dots', 'ScalingArea', 'GridLegend', 'Tooltip'],
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
            allPluginNames: ['MultiGroupAxis', 'MultiValueAxis', 'MultiBars', 'MultiGridLegend', 'Tooltip'],
            getData: () => import('./data/multiGridData1')
          },
          {
            title: 'PRESET_MULTI_GRID_SEPARATE_GRID',
            presetName: 'PRESET_MULTI_GRID_SEPARATE_GRID',
            allPluginNames: ['MultiGroupAxis', 'MultiValueAxis', 'MultiBars', 'MultiGridLegend', 'Tooltip'],
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
        title: 'MultiBarStack',
        description: 'Multi Stacked Bar Chart',
        descriptionZh: '多組堆疊長條圖',
        mainPluginNames: ['MultiBarStack'],
        list: [
          {
            title: 'PRESET_MULTI_GRID_SEPARATE_GRID',
            presetName: 'PRESET_MULTI_GRID_SEPARATE_GRID',
            allPluginNames: ['MultiGroupAxis', 'MultiValueStackAxis', 'MultiBarStack', 'MultiGridLegend', 'Tooltip'],
            getData: () => import('./data/multiGridData3')
          },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiBarStack',
          //   presetName: 'PRESET_MULTI_GRID_2_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiBarStack',
          //   presetName: 'PRESET_MULTI_GRID_3_GRID_SLOT'
          // },
          // {
          //   chartType: 'multiGrid',
          //   pluginName: 'MultiBarStack',
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
            allPluginNames: ['MultiGroupAxis', 'MultiValueAxis', 'MultiBarsTriangle', 'MultiGridLegend', 'Tooltip'],
            getData: () => import('./data/multiGridData3')
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
            allPluginNames: ['MultiGroupAxis', 'MultiValueAxis', 'MultiLines', 'MultiGridLegend', 'Tooltip'],
            getData: () => import('./data/multiGridData3')
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
            allPluginNames: ['MultiGroupAxis', 'MultiValueAxis', 'MultiLineAreas', 'MultiLines', 'MultiGridLegend', 'Tooltip'],
            getData: () => import('./data/multiGridData3')
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
            allPluginNames: ['MultiGroupAxis', 'OverlappingValueAxes', 'MultiBars', 'MultiLines', 'MultiDots', 'MultiGridLegend', 'Tooltip'],
            getData: () => import('./data/multiGridData1')
          },
          {
            title: 'PRESET_MULTI_GRID_ROUND_STYLE',
            presetName: 'PRESET_MULTI_GRID_ROUND_STYLE',
            allPluginNames: ['MultiGroupAxis', 'OverlappingValueAxes', 'MultiBars', 'MultiLines', 'MultiDots','MultiGridLegend', 'Tooltip'],
            getData: () => import('./data/multiGridData1')
          },
        ]
      },
      {
        title: 'MultiBarStack, MultiLines',
        description: 'Dual-Axis Stacked Bar and Line Chart',
        descriptionZh: '雙圖軸堆疊長條及折線圖',
        mainPluginNames: ['MultiBarStack', 'MultiLines'],
        list: [
          {
            title: 'PRESET_MULTI_GRID_BASIC',
            presetName: 'PRESET_MULTI_GRID_BASIC',
            allPluginNames: ['MultiGroupAxis', 'OverlappingValueStackAxes', 'MultiBarStack', 'MultiLines', 'MultiDots', 'MultiGridLegend', 'Tooltip'],
            getData: () => import('./data/multiGridData1')
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
            allPluginNames: ['MultiGroupAxis', 'OverlappingValueAxes', 'MultiBarsTriangle', 'MultiLines', 'MultiDots', 'MultiGridLegend', 'Tooltip'],
            getData: () => import('./data/multiGridData1')
          },
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
            title: 'PRESET_TREE_BASIC',
            presetName: 'PRESET_TREE_BASIC',
            allPluginNames: ['TreeMap', 'TreeLegend', 'Tooltip'],
            getData: () => import('./data/treeData1')
          },
        ]
      },
    ]
  }
]