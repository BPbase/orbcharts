import * as core from '../../packages/orbcharts-core/src/index'
import * as pluginsBasic from '../../packages/orbcharts-plugins-basic/src/index'
import * as presetsBasic from '../../packages/orbcharts-presets-basic/src/index'
import { seriesData1 } from './data/seriesData1'
import { seriesData2 } from './data/seriesData2'
import { seriesData3 } from './data/seriesData3'
import { gridData1 } from './data/gridData1'
import { gridData2 } from './data/gridData2'
import { gridData3 } from './data/gridData3'
import { gridData4 } from './data/gridData4'
import { gridData5 } from './data/gridData5'
import { multiGridData0 } from './data/multiGridData0'
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
  preset: core.PresetPartial<T, any>
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
      'PRESET_SERIES_BASIC': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Bubbles, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_BASIC,
        data: seriesData3
      },
      'PRESET_BUBBLES_SCALING_BY_RADIUS': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Bubbles, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BUBBLES_SCALING_BY_RADIUS,
        data: seriesData3
      },
      'PRESET_BUBBLES_SEPARATE_SERIES': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Bubbles, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BUBBLES_SEPARATE_SERIES,
        data: seriesData3
      },
      'PRESET_SERIES_SUM_SERIES': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Bubbles, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_SUM_SERIES,
        data: seriesData3
      },
    },
    'Pie': {
      'PRESET_SERIES_BASIC': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_BASIC,
        data: seriesData2
      },
      'PRESET_PIE_WITH_INNER_LABELS': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_PIE_WITH_INNER_LABELS,
        data: seriesData2
      },
      'PRESET_PIE_DONUT': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.PieEventTexts, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_PIE_DONUT,
        data: seriesData2
      },
      'PRESET_PIE_HALF_DONUT': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_PIE_HALF_DONUT,
        data: seriesData2
      },
      'PRESET_SERIES_DESC': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_DESC,
        data: seriesData2
      },
      'PRESET_SERIES_SEPARATE_SERIES': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_SEPARATE_SERIES,
        data: seriesData2
      },
      'PRESET_SERIES_SUM_SERIES': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_SUM_SERIES,
        data: seriesData2
      },
    },
    'Rose': {
      'PRESET_SERIES_BASIC': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Rose, pluginsBasic.RoseLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_BASIC,
        data: seriesData2
      },
      'PRESET_ROSE_SCALING_BY_RADIUS': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Rose, pluginsBasic.RoseLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_ROSE_SCALING_BY_RADIUS,
        data: seriesData2
      },
      'PRESET_SERIES_DESC': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Rose, pluginsBasic.RoseLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_DESC,
        data: seriesData2
      },
      'PRESET_SERIES_SEPARATE_SERIES': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Rose, pluginsBasic.RoseLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_SEPARATE_SERIES,
        data: seriesData2
      },
      'PRESET_SERIES_SUM_SERIES': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Rose, pluginsBasic.RoseLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_SUM_SERIES,
        data: seriesData2
      },
      'PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Rose, pluginsBasic.RoseLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_SEPARATE_SERIES_AND_SUM_SERIES,
        data: seriesData2
      },
    },
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
      // 'PRESET_GRID_2_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_2_SERIES_SLOT,
      //   data: gridData1
      // },
      // 'PRESET_GRID_3_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_3_SERIES_SLOT,
      //   data: gridData2
      // },
      // 'PRESET_GRID_4_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_4_SERIES_SLOT,
      //   data: gridData3
      // },
      'PRESET_GRID_SEPARATE_SERIES': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Bars, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_SEPARATE_SERIES,
        data: gridData1
      },
    },
    'BarsPN': {
      'PRESET_GRID_PN_SCALE': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsPN, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_PN_SCALE,
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
      // 'PRESET_GRID_2_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.BarStack, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_2_SERIES_SLOT,
      //   data: gridData1
      // },
      // 'PRESET_GRID_3_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.BarStack, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_3_SERIES_SLOT,
      //   data: gridData2
      // },
      // 'PRESET_GRID_4_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.BarStack, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_4_SERIES_SLOT,
      //   data: gridData3
      // },
      'PRESET_GRID_SEPARATE_SERIES': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.BarStack, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_SEPARATE_SERIES,
        data: gridData1
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
      // 'PRESET_GRID_2_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsTriangle, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_2_SERIES_SLOT,
      //   data: gridData1
      // },
      // 'PRESET_GRID_3_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsTriangle, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_3_SERIES_SLOT,
      //   data: gridData2
      // },
      // 'PRESET_GRID_4_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsTriangle, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_4_SERIES_SLOT,
      //   data: gridData3
      // },
      'PRESET_GRID_SEPARATE_SERIES': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.BarsTriangle, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_SEPARATE_SERIES,
        data: gridData1
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
        data: gridData5
      },
      // 'PRESET_LINES_TENSE_TICKS': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.GroupAux, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_LINES_TENSE_TICKS,
      //   data: gridData5
      // },
      'PRESET_LINES_LOOSE_TICKS': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.GroupAux, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_LOOSE_TICKS,
        data: gridData5
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
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.GroupAux, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_HIGHLIGHT_GROUP_DOTS,
        data: gridData1
      },
      // 'PRESET_GRID_2_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_2_SERIES_SLOT,
      //   data: gridData1
      // },
      // 'PRESET_GRID_3_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_3_SERIES_SLOT,
      //   data: gridData2
      // },
      // 'PRESET_GRID_4_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_GRID_4_SERIES_SLOT,
      //   data: gridData3
      // },
      'PRESET_GRID_SEPARATE_SERIES': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_SEPARATE_SERIES,
        data: gridData1
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
        data: gridData5
      },
      // 'PRESET_LINE_AREAS_TENSE_TICKS': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.GroupAux, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_LINE_AREAS_TENSE_TICKS,
      //   data: gridData5
      // },
      'PRESET_LINE_AREAS_LOOSE_TICKS': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.GroupAux, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINE_AREAS_LOOSE_TICKS,
        data: gridData5
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
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.GroupAux, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINE_AREAS_HIGHLIGHT_GROUP_DOTS,
        data: gridData1
      },
      // 'PRESET_LINE_AREAS_2_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_LINE_AREAS_2_SERIES_SLOT,
      //   data: gridData1
      // },
      // 'PRESET_LINE_AREAS_3_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_LINE_AREAS_3_SERIES_SLOT,
      //   data: gridData2
      // },
      // 'PRESET_LINE_AREAS_4_SERIES_SLOT': {
      //   chart: core.GridChart,
      //   plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
      //   preset: presetsBasic.PRESET_LINE_AREAS_4_SERIES_SLOT,
      //   data: gridData3
      // },
      'PRESET_LINE_AREAS_SEPARATE_GRID': {
        chart: core.GridChart,
        plugins: [pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.LineAreas, pluginsBasic.Lines, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINE_AREAS_SEPARATE_GRID,
        data: gridData1
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
      'PRESET_MULTI_GRID_DIVERGING': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiBars, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_DIVERGING,
        data: multiGridData0
      },
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
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueStackAxis, pluginsBasic.MultiBarStack, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_2_GRID_SLOT,
        data: multiGridData1
      },
      'PRESET_MULTI_GRID_3_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueStackAxis, pluginsBasic.MultiBarStack, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_3_GRID_SLOT,
        data: multiGridData2
      },
      'PRESET_MULTI_GRID_4_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueStackAxis, pluginsBasic.MultiBarStack, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_GRID_4_GRID_SLOT,
        data: multiGridData3
      },
      'PRESET_MULTI_GRID_BASIC': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.OverlappingValueStackAxes, pluginsBasic.MultiBarStack, pluginsBasic.MultiLines, pluginsBasic.MultiDots, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
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
    'MultiLineAreas': {
      'PRESET_MULTI_LINE_AREAS_2_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiLineAreas, pluginsBasic.MultiLines, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_LINE_AREAS_2_GRID_SLOT,
        data: multiGridData1
      },
      'PRESET_MULTI_LINE_AREAS_3_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiLineAreas, pluginsBasic.MultiLines, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_LINE_AREAS_3_GRID_SLOT,
        data: multiGridData2
      },
      'PRESET_MULTI_LINE_AREAS_4_GRID_SLOT': {
        chart: core.MultiGridChart,
        plugins: [pluginsBasic.MultiGroupAxis, pluginsBasic.MultiValueAxis, pluginsBasic.MultiLineAreas, pluginsBasic.MultiLines, pluginsBasic.MultiGridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_MULTI_LINE_AREAS_4_GRID_SLOT,
        data: multiGridData3
      },
    }
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