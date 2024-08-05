import * as core from '../../packages/orbcharts-core/src/index'
import * as pluginsBasic from '../../packages/orbcharts-plugins-basic/src/index'
import * as presetsBasic from '../../packages/orbcharts-presets-basic/src/index'
import { seriesData1 } from './data/seriesData1'
import { gridData1 } from './data/gridData1'

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
  plugins: core.PluginConstructor<any, any, any>[]
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
      'PRESET_SERIES_BASIC': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Bubbles, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_BASIC,
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
      'PRESET_SERIES_BASIC': {
        chart: core.SeriesChart,
        plugins: [pluginsBasic.Pie, pluginsBasic.PieLabels, pluginsBasic.SeriesLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_SERIES_BASIC,
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
        plugins: [pluginsBasic.Bars, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_BASIC,
        data: gridData1
      },
      'PRESET_GRID_ROTATE_AXIS_LABEL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Bars, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_ROTATE_AXIS_LABEL,
        data: gridData1
      },
      'PRESET_GRID_HORIZONTAL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Bars, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_HORIZONTAL,
        data: gridData1
      },
      'PRESET_BARS_ROUND': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Bars, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BARS_ROUND,
        data: gridData1
      },
      'PRESET_BARS_HORIZONTAL_AND_ROUND': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Bars, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BARS_HORIZONTAL_AND_ROUND,
        data: gridData1
      },
      'PRESET_BARS_THIN': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Bars, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BARS_THIN,
        data: gridData1
      },
      'PRESET_BARS_HORIZONTAL_AND_THIN': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Bars, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_BARS_HORIZONTAL_AND_THIN,
        data: gridData1
      },
    },
    'BarStack': {
      'PRESET_GRID_BASIC': {
        chart: core.GridChart,
        plugins: [pluginsBasic.BarStack, pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_BASIC,
        data: gridData1
      },
      'PRESET_GRID_ROTATE_AXIS_LABEL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.BarStack, pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_ROTATE_AXIS_LABEL,
        data: gridData1
      },
      'PRESET_GRID_HORIZONTAL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.BarStack, pluginsBasic.GroupAxis, pluginsBasic.ValueStackAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_HORIZONTAL,
        data: gridData1
      },
    },
    'BarsTriangle': {
      'PRESET_GRID_BASIC': {
        chart: core.GridChart,
        plugins: [pluginsBasic.BarsTriangle, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_BASIC,
        data: gridData1
      },
      'PRESET_GRID_ROTATE_AXIS_LABEL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.BarsTriangle, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_ROTATE_AXIS_LABEL,
        data: gridData1
      },
      'PRESET_GRID_HORIZONTAL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.BarsTriangle, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_GRID_HORIZONTAL,
        data: gridData1
      },
    },
    'Lines': {
      'PRESET_LINES_BASIC': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Lines, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_BASIC,
        data: gridData1
      },
      'PRESET_LINES_ROTATE_AXIS_LABEL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Lines, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_ROTATE_AXIS_LABEL,
        data: gridData1
      },
      'PRESET_LINES_HORIZONTAL': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Lines, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_HORIZONTAL,
        data: gridData1
      },
      'PRESET_LINES_CURVE': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Lines, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Dots, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_CURVE,
        data: gridData1
      },
      'PRESET_LINES_HIGHLIGHT_GROUP_DOTS': {
        chart: core.GridChart,
        plugins: [pluginsBasic.Lines, pluginsBasic.GroupAxis, pluginsBasic.ValueAxis, pluginsBasic.Dots, pluginsBasic.GroupArea, pluginsBasic.ScalingArea, pluginsBasic.GridLegend, pluginsBasic.Tooltip as any],
        preset: presetsBasic.PRESET_LINES_HIGHLIGHT_GROUP_DOTS,
        data: gridData1
      }
    },
  }
}