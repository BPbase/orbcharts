import * as core from '../../packages/orbcharts-core/src/index'
import * as pluginsBasic from '../../packages/orbcharts-plugins-basic/src/index'
import * as presetsBasic from '../../packages/orbcharts-presets-basic/src/index'
import { seriesData1 } from './data/seriesData1'
import { gridData1 } from './data/gridData1'
import { gridData2 } from './data/gridData2'
import { gridData3 } from './data/gridData3'
import { gridData4 } from './data/gridData4'
import { multiGridData1 } from './data/multiGridData1'
import { multiGridData2 } from './data/multiGridData2'
import { multiGridData3 } from './data/multiGridData3'
import { multiGridData4 } from './data/multiGridData4'
import { treeData1 } from './data/treeData1'

type KeyOfOrbChartsCore = keyof typeof core
type KeyOfOrbChartsPluginsBasic = keyof typeof pluginsBasic
type KeyOfOrbChartsPresetsBasic = keyof typeof presetsBasic

export type DemoDetail = Partial<{
  [T in core.ChartType]: Partial<{
    [key in KeyOfOrbChartsPluginsBasic]: Partial<{
      [key in KeyOfOrbChartsPresetsBasic | 'none']: DemoDetailItem<T>
    }>
  }>
}>

export interface DemoDetailItem<T extends core.ChartType> {
  chart: ChartConstructor<T>
  plugins: core.PluginConstructor<T, any, any>[]
  preset: core.PresetPartial<T>
  data: core.DataTypeMap<T>
}

export interface ChartConstructor<T extends core.ChartType> {
  new (element: HTMLElement | Element, options?: core.ChartOptionsPartial<T>)
    : T extends 'series' ? core.SeriesChart
      : T extends 'grid' ? core.GridChart
      : T extends 'multiGrid' ? core.MultiGridChart
      : T extends 'multiValue' ? core.MultiValueChart
      : T extends 'relationship' ? core.RelationshipChart
      : T extends 'tree' ? core.TreeChart
      : undefined
}

export const demoDetail: DemoDetail = {
  series: {
    'Bubbles': {
      'PRESET_BUBBLES_BASIC': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Bubbles, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BUBBLES_BASIC,
        data: seriesData1
      },
      'PRESET_BUBBLES_SCALING_BY_RADIUS': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Bubbles, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BUBBLES_SCALING_BY_RADIUS,
        data: seriesData1
      },
    },
    'Pie': {
      'PRESET_PIE_BASIC': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_PIE_BASIC,
        data: seriesData1
      },
      'PRESET_PIE_WITH_INNER_LABELS': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_PIE_WITH_INNER_LABELS,
        data: seriesData1
      },
      'PRESET_PIE_DONUT': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.PieEventTexts, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_PIE_DONUT,
        data: seriesData1
      },
      'PRESET_PIE_HALF_DONUT': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_PIE_HALF_DONUT,
        data: seriesData1
      }
    }
  },
  grid: {
    'Bars': {
      'PRESET_GRID_BASIC': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_BASIC,
        data: gridData1
      },
      'PRESET_GRID_ROTATE_AXIS_LABEL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_ROTATE_AXIS_LABEL,
        data: gridData1
      },
      'PRESET_GRID_HORIZONTAL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_HORIZONTAL,
        data: gridData1
      },
      'PRESET_BARS_ROUND': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BARS_ROUND,
        data: gridData1
      },
      'PRESET_BARS_HORIZONTAL_AND_ROUND': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BARS_HORIZONTAL_AND_ROUND,
        data: gridData1
      },
      'PRESET_BARS_THIN': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BARS_THIN,
        data: gridData1
      },
      'PRESET_BARS_HORIZONTAL_AND_THIN': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BARS_HORIZONTAL_AND_THIN,
        data: gridData1
      },
      'PRESET_GRID_2_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_2_SERIES_SLOT,
        data: gridData1
      },
      'PRESET_GRID_3_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_3_SERIES_SLOT,
        data: gridData2
      },
      'PRESET_GRID_4_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_4_SERIES_SLOT,
        data: gridData3
      },
    },
    'BarsDiverging': {
      'PRESET_GRID_DIVERGING_SCALE': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsDiverging, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_DIVERGING_SCALE,
        data: gridData4
      }
    },
    'BarStack': {
      'PRESET_GRID_BASIC': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.BarStack, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_BASIC,
        data: gridData1
      },
      'PRESET_GRID_ROTATE_AXIS_LABEL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.BarStack, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_ROTATE_AXIS_LABEL,
        data: gridData1
      },
      'PRESET_GRID_HORIZONTAL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.BarStack, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_HORIZONTAL,
        data: gridData1
      },
      'PRESET_GRID_2_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.BarStack, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_2_SERIES_SLOT,
        data: gridData1
      },
      'PRESET_GRID_3_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.BarStack, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_3_SERIES_SLOT,
        data: gridData2
      },
      'PRESET_GRID_4_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.BarStack, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_4_SERIES_SLOT,
        data: gridData3
      },
    },
    'BarsTriangle': {
      'PRESET_GRID_BASIC': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsTriangle, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_BASIC,
        data: gridData1
      },
      'PRESET_GRID_ROTATE_AXIS_LABEL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsTriangle, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_ROTATE_AXIS_LABEL,
        data: gridData1
      },
      'PRESET_GRID_HORIZONTAL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsTriangle, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_HORIZONTAL,
        data: gridData1
      },
      'PRESET_GRID_2_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsTriangle, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_2_SERIES_SLOT,
        data: gridData1
      },
      'PRESET_GRID_3_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsTriangle, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_3_SERIES_SLOT,
        data: gridData2
      },
      'PRESET_GRID_4_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsTriangle, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_4_SERIES_SLOT,
        data: gridData3
      },
    },
    'Lines': {
      'PRESET_LINES_BASIC': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_BASIC,
        data: gridData1
      },
      'PRESET_LINES_ROTATE_AXIS_LABEL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_ROTATE_AXIS_LABEL,
        data: gridData1
      },
      'PRESET_LINES_HORIZONTAL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_HORIZONTAL,
        data: gridData1
      },
      'PRESET_LINES_CURVE': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_CURVE,
        data: gridData1
      },
      'PRESET_LINES_HIGHLIGHT_GROUP_DOTS': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.Dots, pluginsBasic.GroupAux, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_HIGHLIGHT_GROUP_DOTS,
        data: gridData1
      },
      'PRESET_GRID_2_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_2_SERIES_SLOT,
        data: gridData1
      },
      'PRESET_GRID_3_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_3_SERIES_SLOT,
        data: gridData2
      },
      'PRESET_GRID_4_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_4_SERIES_SLOT,
        data: gridData3
      },
    },
    'LineAreas': {
      'PRESET_LINE_AREAS_BASIC': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINE_AREAS_BASIC,
        data: gridData1
      },
      'PRESET_LINE_AREAS_ROTATE_AXIS_LABEL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINE_AREAS_ROTATE_AXIS_LABEL,
        data: gridData1
      },
      'PRESET_LINE_AREAS_HORIZONTAL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINE_AREAS_HORIZONTAL,
        data: gridData1
      },
      'PRESET_LINE_AREAS_CURVE': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINE_AREAS_CURVE,
        data: gridData1
      },
      'PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.Dots, pluginsBasic.GroupAux, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS,
        data: gridData1
      },
      'PRESET_GRID_2_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_2_SERIES_SLOT,
        data: gridData1
      },
      'PRESET_GRID_3_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_3_SERIES_SLOT,
        data: gridData2
      },
      'PRESET_GRID_4_SERIES_SLOT': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_4_SERIES_SLOT,
        data: gridData3
      },
    },
  },
  multiGrid: {
    'MultiBars': {
      // 'PRESET_MULTI_GRID_BASIC': {
      //   chart: core.MultiGridChart,
      //   plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.OverlappingValueAxes, pluginsBasic.MultiBars, pluginsBasic.MultiLines, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_MULTI_GRID_BASIC,
      //   data: multiGridData1
      // },
      'PRESET_MULTI_GRID_2_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiBars, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_2_GRID_SLOT,
        data: multiGridData1
      },
      'PRESET_MULTI_GRID_3_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiBars, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_3_GRID_SLOT,
        data: multiGridData2
      },
      'PRESET_MULTI_GRID_4_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiBars, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_4_GRID_SLOT,
        data: multiGridData3
      },
      'PRESET_MULTI_GRID_BASIC': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.OverlappingValueAxes, pluginsBasic.MultiBars, pluginsBasic.MultiLines, pluginsBasic.MultiDots, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_BASIC,
        data: multiGridData1
      },
      'PRESET_MULTI_GRID_ROUND_STYLE': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.OverlappingValueAxes, pluginsBasic.MultiBars, pluginsBasic.MultiLines, pluginsBasic.MultiDots, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_ROUND_STYLE,
        data: multiGridData1
      },
    },
    'MultiBarStack': {
      'PRESET_MULTI_GRID_2_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiBarStack, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_2_GRID_SLOT,
        data: multiGridData1
      },
      'PRESET_MULTI_GRID_3_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiBarStack, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_3_GRID_SLOT,
        data: multiGridData2
      },
      'PRESET_MULTI_GRID_4_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiBarStack, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_4_GRID_SLOT,
        data: multiGridData3
      },
      'PRESET_MULTI_GRID_BASIC': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.OverlappingValueAxes, pluginsBasic.MultiBarStack, pluginsBasic.MultiLines, pluginsBasic.MultiDots, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_BASIC,
        data: multiGridData1
      },
    },
    'MultiBarsTriangle': {
      'PRESET_MULTI_GRID_2_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiBarsTriangle, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_2_GRID_SLOT,
        data: multiGridData1
      },
      'PRESET_MULTI_GRID_3_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiBarsTriangle, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_3_GRID_SLOT,
        data: multiGridData2
      },
      'PRESET_MULTI_GRID_4_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiBarsTriangle, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_4_GRID_SLOT,
        data: multiGridData3
      },
      'PRESET_MULTI_GRID_BASIC': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.OverlappingValueAxes, pluginsBasic.MultiBarsTriangle, pluginsBasic.MultiLines, pluginsBasic.MultiDots, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_BASIC,
        data: multiGridData1
      },
    },
    'MultiLines': {
      'PRESET_MULTI_LINES_2_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiLines, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_LINES_2_GRID_SLOT,
        data: multiGridData1
      },
      'PRESET_MULTI_LINES_3_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiLines, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_LINES_3_GRID_SLOT,
        data: multiGridData2
      },
      'PRESET_MULTI_LINES_4_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiLines, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_LINES_4_GRID_SLOT,
        data: multiGridData3
      },
    },
  },
  tree: {
    'TreeMap': {
      'PRESET_TREE_BASIC': {
        chart: core.TreeChart,
        plugins: [pluginsBasic.TreeMap, pluginsBasic.TreeLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_TREE_BASIC,
        data: treeData1
      },
    }
  }
}