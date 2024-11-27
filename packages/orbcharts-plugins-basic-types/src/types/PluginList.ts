import type { ChartType } from '../../lib/core-types'

export type PluginListSeries = 'Bubbles'
  | 'Pie'
  | 'PieEventTexts'
  | 'PieLabels'
  | 'Rose'
  | 'RoseLabels'
  | 'SeriesLegend'
  | 'SeriesTooltip'

export type PluginListGrid = 'Bars'
  | 'BarsPN'
  | 'BarStack'
  | 'BarsTriangle'
  | 'Dots'
  | 'GridLegend'
  | 'GridTooltip'
  | 'GridZoom'
  | 'GroupAux'
  | 'GroupAxis'
  | 'LineAreas'
  | 'Lines'
  // | 'ScalingArea'
  | 'ValueAxis'
  | 'ValueStackAxis'

export type PluginListMultiGrid = 'MultiBars'
  | 'MultiBarStack'
  | 'MultiBarsTriangle'
  | 'MultiDots'
  | 'MultiGridLegend'
  | 'MultiGridTooltip'
  | 'MultiGroupAxis'
  | 'MultiLineAreas'
  | 'MultiLines'
  | 'MultiValueAxis'
  | 'MultiValueStackAxis'
  | 'OverlappingValueAxes'
  | 'OverlappingValueStackAxes'

export type PluginListTree = 'TreeLegend'
  | 'TreeMap'
  | 'TreeTooltip'

// export type PluginListNoneData = 'Tooltip'

export type PluginList<T extends ChartType> = T extends 'series'
  ? PluginListSeries
  : T extends 'grid'
    ? PluginListGrid
    : T extends 'multiGrid'
      ? PluginListMultiGrid
      : T extends 'tree'
        ? PluginListTree
        // : T extends 'noneData'
        //   ? PluginListNoneData
          : never
