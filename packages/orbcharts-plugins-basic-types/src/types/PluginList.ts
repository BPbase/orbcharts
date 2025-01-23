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
  | 'StackedBar'
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
  | 'StackedValueAxis'

export type PluginListMultiGrid = 'MultiBars'
  | 'MultiStackedBar'
  | 'MultiBarsTriangle'
  | 'MultiDots'
  | 'MultiGridLegend'
  | 'MultiGridTooltip'
  | 'MultiGroupAxis'
  | 'MultiLineAreas'
  | 'MultiLines'
  | 'MultiValueAxis'
  | 'MultiStackedValueAxis'
  | 'OverlappingValueAxes'
  | 'OverlappingStackedValueAxes'

export type PluginListMultiValue = 'MultiValueLegend'
  | 'MultiValueTooltip'
  | 'MultiValueLegend'
  | 'Scatter'
  | 'ScatterBubbles'
  | 'XYAux'
  | 'XYAxes'
  | 'XZoom'

export type PluginListRelationship = 'ForceDirected'
  | 'ForceDirectedBubbles'
  | 'RelationshipLegend'
  | 'RelationshipTooltip'

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
      : T extends 'multiValue'
        ? PluginListMultiValue
        : T extends 'relationshiop'
          ? PluginListRelationship
          : T extends 'tree'
            ? PluginListTree
            // : T extends 'noneData'
            //   ? PluginListNoneData
              : never
