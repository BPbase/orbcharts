import * as orbCharts from '../../packages/orbcharts/src/index'
import * as orbChartsPluginsBasic from '../../packages/orbcharts-plugins-basic/src/index'
import * as orbChartsPresetsBasic from '../../packages/orbcharts-presets-basic/src/index'

type KeyOfOrbCharts = keyof typeof orbCharts
type KeyOfOrbChartsPluginsBasic = keyof typeof orbChartsPluginsBasic
type KeyOfOrbChartsPresetsBasic = keyof typeof orbChartsPresetsBasic

// export const demoList = [
//   {
//     chartType: 'grid',
//     pluginNames: [],
//     presetName: 'default'
//   },
// ]

interface DemoChartTypeItem {
  title: 'Series' | 'Grid' | 'MultiGrid' | 'MultiValue' | 'Relationship' | 'Tree'
  list: DemoPluginItem[]
}

interface DemoPluginItem {
  // title: KeyOfOrbChartsPluginsBasic
  title: string
  list: DemoPresetItem[]
}

interface DemoPresetItem {
  // title: KeyOfOrbChartsPresetsBasic
  // path: string
  chartType: 'series' | 'grid' | 'multiGrid' | 'multiValue' | 'relationship' | 'tree'
  pluginName: KeyOfOrbChartsPluginsBasic
  presetName: KeyOfOrbChartsPresetsBasic
}

// type nonePresetTitle = '[none preset]'

export const demoList: DemoChartTypeItem[] = [
  {
    title: 'Series',
    list: [
      {
        title: 'Bubbles',
        list: [
          {
            chartType: 'series',
            pluginName: 'Bubbles',
            presetName: 'PRESET_BUBBLES_BASIC'
          },
          {
            chartType: 'series',
            pluginName: 'Bubbles',
            presetName: 'PRESET_BUBBLES_SCALING_BY_RADIUS'
          },
        ]
      },
      {
        title: 'Pie',
        list: [
          {
            chartType: 'series',
            pluginName: 'Pie',
            presetName: 'PRESET_PIE_BASIC'
          },
          {
            chartType: 'series',
            pluginName: 'Pie',
            presetName: 'PRESET_PIE_WITH_INNER_LABELS'
          },
          {
            chartType: 'series',
            pluginName: 'Pie',
            presetName: 'PRESET_PIE_DONUT'
          },
          {
            chartType: 'series',
            pluginName: 'Pie',
            presetName: 'PRESET_PIE_HALF_DONUT'
          },
        ]
      },
    ]
  },
  {
    title: 'Grid',
    list: [
      {
        title: 'Bars',
        list: [
          {
            chartType: 'grid',
            pluginName: 'Bars',
            presetName: 'PRESET_GRID_BASIC'
          },
          {
            chartType: 'grid',
            pluginName: 'Bars',
            presetName: 'PRESET_GRID_ROTATE_AXIS_LABEL'
          },
          {
            chartType: 'grid',
            pluginName: 'Bars',
            presetName: 'PRESET_GRID_HORIZONTAL'
          },
          {
            chartType: 'grid',
            pluginName: 'Bars',
            presetName: 'PRESET_BARS_ROUND'
          },
          {
            chartType: 'grid',
            pluginName: 'Bars',
            presetName: 'PRESET_BARS_HORIZONTAL_AND_ROUND'
          },
          {
            chartType: 'grid',
            pluginName: 'Bars',
            presetName: 'PRESET_BARS_THIN'
          },
          {
            chartType: 'grid',
            pluginName: 'Bars',
            presetName: 'PRESET_BARS_HORIZONTAL_AND_THIN'
          },
          {
            chartType: 'grid',
            pluginName: 'Bars',
            presetName: 'PRESET_GRID_2_SERIES_SLOT'
          },
          {
            chartType: 'grid',
            pluginName: 'Bars',
            presetName: 'PRESET_GRID_3_SERIES_SLOT'
          },
          {
            chartType: 'grid',
            pluginName: 'Bars',
            presetName: 'PRESET_GRID_4_SERIES_SLOT'
          },
        ]
      },
      {
        title: 'BarStack',
        list: [
          {
            chartType: 'grid',
            pluginName: 'BarStack',
            presetName: 'PRESET_GRID_BASIC'
          },
          {
            chartType: 'grid',
            pluginName: 'BarStack',
            presetName: 'PRESET_GRID_ROTATE_AXIS_LABEL'
          },
          {
            chartType: 'grid',
            pluginName: 'BarStack',
            presetName: 'PRESET_GRID_HORIZONTAL'
          },
          {
            chartType: 'grid',
            pluginName: 'BarStack',
            presetName: 'PRESET_GRID_2_SERIES_SLOT'
          },
          {
            chartType: 'grid',
            pluginName: 'BarStack',
            presetName: 'PRESET_GRID_3_SERIES_SLOT'
          },
          {
            chartType: 'grid',
            pluginName: 'BarStack',
            presetName: 'PRESET_GRID_4_SERIES_SLOT'
          },
        ]
      },
      {
        title: 'BarsTriangle',
        list: [
          {
            chartType: 'grid',
            pluginName: 'BarsTriangle',
            presetName: 'PRESET_GRID_BASIC'
          },
          {
            chartType: 'grid',
            pluginName: 'BarsTriangle',
            presetName: 'PRESET_GRID_ROTATE_AXIS_LABEL'
          },
          {
            chartType: 'grid',
            pluginName: 'BarsTriangle',
            presetName: 'PRESET_GRID_HORIZONTAL'
          },
          {
            chartType: 'grid',
            pluginName: 'BarsTriangle',
            presetName: 'PRESET_GRID_2_SERIES_SLOT'
          },
          {
            chartType: 'grid',
            pluginName: 'BarsTriangle',
            presetName: 'PRESET_GRID_3_SERIES_SLOT'
          },
          {
            chartType: 'grid',
            pluginName: 'BarsTriangle',
            presetName: 'PRESET_GRID_4_SERIES_SLOT'
          },
        ]
      },
      {
        title: 'Lines',
        list: [
          {
            chartType: 'grid',
            pluginName: 'Lines',
            presetName: 'PRESET_LINES_BASIC'
          },
          {
            chartType: 'grid',
            pluginName: 'Lines',
            presetName: 'PRESET_LINES_ROTATE_AXIS_LABEL'
          },
          {
            chartType: 'grid',
            pluginName: 'Lines',
            presetName: 'PRESET_LINES_HORIZONTAL'
          },
          {
            chartType: 'grid',
            pluginName: 'Lines',
            presetName: 'PRESET_LINES_CURVE'
          },
          {
            chartType: 'grid',
            pluginName: 'Lines',
            presetName: 'PRESET_LINES_HIGHLIGHT_GROUP_DOTS'
          },
          {
            chartType: 'grid',
            pluginName: 'Lines',
            presetName: 'PRESET_GRID_2_SERIES_SLOT'
          },
          {
            chartType: 'grid',
            pluginName: 'Lines',
            presetName: 'PRESET_GRID_3_SERIES_SLOT'
          },
          {
            chartType: 'grid',
            pluginName: 'Lines',
            presetName: 'PRESET_GRID_4_SERIES_SLOT'
          },
        ]
      }
    ]
  },
  {
    title: 'MultiGrid',
    list: [
      {
        title: 'MultiGridBars',
        list: [
          {
            chartType: 'multiGrid',
            pluginName: 'MultiGridBars',
            presetName: 'PRESET_MULTI_GRID_BASIC'
          },
        ]
      }
    ]
  }
]