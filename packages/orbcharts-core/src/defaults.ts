import type {
  ChartOptionsPartial,
  DataSeries,
  DataGrid,
  DataMultiGrid,
  DataMultiValue,
  DataTree,
  DataRelationship,
  DataFormatterValueAxis,
  DataFormatterGroupAxis,
  DataFormatterContainer,
  DataFormatterSeries,
  DataFormatterGrid,
  DataFormatterGridGrid,
  DataFormatterMultiGrid,
  DataFormatterMultiGridGrid,
  DataFormatterMultiValue,
  DataFormatterTree,
  DataFormatterRelationship,
  ChartParams,
  Padding
} from '../lib/core-types'

export const CHART_OPTIONS_DEFAULT: ChartOptionsPartial<any> = {
  // preset: {} // 預設為空
  width: 'auto',
  height: 'auto'
}

// export const GLOBAL_DEFAULT: ChartGlobalDefault = {
//   colors: ['#67B7DC', '#6794DC', '#6771DC', '#8067DC', '#A367DC', '#C767DC', '#DC67CE', '#DC67AB', '#DC6788', '#DC6967', '#DC8C67', '#DCAF67'],
//   padding: {
//     top: 50,
//     right: 70,
//     bottom: 50,
//     left: 70
//   },
//   // chartWidth: '100%',
//   // chartHeight: 500
// }

// export const COLORS_DEFAULT = ['#67B7DC', '#6794DC', '#6771DC', '#8067DC', '#A367DC', '#C767DC', '#DC67CE', '#DC67AB', '#DC6788', '#DC6967', '#DC8C67', '#DCAF67']
// ['#ff7ab9', '#66dec8', '#84c8ff', '#30ad1b', '#f8c43e', '#fa5640', '#9d79d7', '#ea4f98']

export const PADDING_DEFAULT: Padding = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
}

export const CHART_PARAMS_DEFAULT: ChartParams = {
  padding: PADDING_DEFAULT,
  highlightTarget: 'datum',
  highlightDefault: null,
  colorScheme: 'light',
  colors: {
    light: {
      series: ['#67B7DC', '#6794DC', '#6771DC', '#8067DC', '#A367DC', '#C767DC', '#DC67CE', '#DC67AB', '#DC6788', '#DC6967', '#DC8C67', '#DCAF67'],
      // primary: '#454545',
      primary: '#1b1e23',
      secondary: '#e1e1e1',
      white: '#ffffff',
      background: '#ffffff'
    },
    dark: {
      series: ['#67B7DC', '#6794DC', '#6771DC', '#8067DC', '#A367DC', '#C767DC', '#DC67CE', '#DC67AB', '#DC6788', '#DC6967', '#DC8C67', '#DCAF67'],
      primary: '#f0f0f0',
      secondary: '#e1e1e1',
      white: '#ffffff',
      background: '#000000'
    }
  },
  styles: {
    // textSize: 14,
    textSize: '0.875rem',
    unhighlightedOpacity: 0.3
  },
  transitionDuration: 800,
  transitionEase: 'easeCubic'
}

export const CHART_WIDTH_DEFAULT = 800

export const CHART_HEIGHT_DEFAULT = 500

// -- Data --

export const DATA_SERIES_DEFAULT: DataSeries = []

export const DATA_GRID_DEFAULT: DataGrid = []

export const DATA_MULTI_GRID_DEFAULT: DataMultiGrid = []

export const DATA_MULTI_VALUE_DEFAULT: DataMultiValue = []

export const DATA_TREE_DEFAULT: DataTree = []

export const DATA_RELATIONA_DEFAULTL: DataRelationship = {
  nodes: [],
  edges: []
}

// -- Data Formatter --

export const DATA_FORMATTER_VALUE_AXIS_DEFAULT: DataFormatterValueAxis = {
  position: 'left',
  scaleDomain: ['auto', 'auto'],
  scaleRange: [0, 0.9],
  label: '',
}

export const DATA_FORMATTER_GROUP_AXIS_DEFAULT: DataFormatterGroupAxis = {
  position: 'bottom',
  scaleDomain: [0, 'max'],
  scalePadding: 0.5,
  label: ''
}

export const DATA_FORMATTER_CONTAINER_DEFAULT: DataFormatterContainer = {
  gap: 120,
  rowAmount: 1,
  columnAmount: 1
}

export const DATA_FORMATTER_SERIES_DEFAULT: DataFormatterSeries = {
  type: 'series',
  visibleFilter: (datum, context) => true,
  sort: null,
  seriesLabels: [],
  container: {
    ...DATA_FORMATTER_CONTAINER_DEFAULT
  },
  separateSeries: false,
  sumSeries: false
  // mapSeries: (datum, rowIndex, columnIndex, { data, dataFormatter }) => {
  //   const seriesIndex = rowIndex >= dataFormatter.seriesLabels.length
  //     ? rowIndex % dataFormatter.seriesLabels.length // 如果index大於所設定的seriesLabels的數量則從頭回來算
  //     : rowIndex
  //   return dataFormatter.seriesLabels[seriesIndex]
  // },
  // colorsPredicate: (datum, rowIndex, columnIndex, { chartParams }) => {
  //   return rowIndex < chartParams.colors[chartParams.colorScheme].series.length
  //     ? chartParams.colors[chartParams.colorScheme].series[rowIndex]
  //     : chartParams.colors[chartParams.colorScheme].series[
  //       rowIndex % chartParams.colors[chartParams.colorScheme].series.length
  //     ]
  // },
}
DATA_FORMATTER_SERIES_DEFAULT.visibleFilter.toString = () => `(datum, context) => true`

export const DATA_FORMATTER_GRID_GRID_DEFAULT: DataFormatterGridGrid = {
  seriesDirection: 'row',
  rowLabels: [],
  columnLabels: [],
  valueAxis: { ...DATA_FORMATTER_VALUE_AXIS_DEFAULT },
  groupAxis: { ...DATA_FORMATTER_GROUP_AXIS_DEFAULT, },
  separateSeries: false,
  // slotIndex: 0,
  // seriesSlotIndexes: null
}

export const DATA_FORMATTER_GRID_DEFAULT: DataFormatterGrid = {
  type: 'grid',
  visibleFilter: (datum, context) => true,
  grid: {
    ...DATA_FORMATTER_GRID_GRID_DEFAULT
  },
  container: {
    ...DATA_FORMATTER_CONTAINER_DEFAULT
  }
}
DATA_FORMATTER_GRID_DEFAULT.visibleFilter.toString = () => `(datum, context) => true`

// export const DATA_FORMATTER_MULTI_GRID_MULTI_GRID_DEFAULT: DataFormatterMultiGridMultiGrid = {
//   ...DATA_FORMATTER_GRID_DEFAULT,
//   slotIndex: 0,
//   seriesSlotIndexes: null
// }

export const DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT: DataFormatterMultiGridGrid = {
  ...DATA_FORMATTER_GRID_GRID_DEFAULT
}

export const DATA_FORMATTER_MULTI_GRID_DEFAULT: DataFormatterMultiGrid = {
  type: 'multiGrid',
  visibleFilter: (datum, context) => true,
  gridList: [
    {
      ...DATA_FORMATTER_MULTI_GRID_GRID_DEFAULT
    },
  ],
  separateGrid: false,
  container: {
    ...DATA_FORMATTER_CONTAINER_DEFAULT
  }
}
DATA_FORMATTER_MULTI_GRID_DEFAULT.visibleFilter.toString = () => `(datum, context) => true`

export const DATA_FORMATTER_MULTI_VALUE_DEFAULT: DataFormatterMultiValue = {
  type: 'multiValue',
  visibleFilter: (datum, context) => true,
  categoryLabels: [],
  multiValue: [],
  xAxis: { ...DATA_FORMATTER_VALUE_AXIS_DEFAULT },
  yAxis: { ...DATA_FORMATTER_VALUE_AXIS_DEFAULT },
}
DATA_FORMATTER_MULTI_VALUE_DEFAULT.visibleFilter.toString = () => `(datum, context) => true`

export const DATA_FORMATTER_TREE_DEFAULT: DataFormatterTree = {
  type: 'tree',
  visibleFilter: (datum, context) => true,
  // labelFormat: (datum: any) => (datum && datum.label) ?? '',
  categoryLabels: []
}
DATA_FORMATTER_TREE_DEFAULT.visibleFilter.toString = () => `(datum, context) => true`

export const DATA_FORMATTER_RELATIONAL_DEFAULT: DataFormatterRelationship = {
  type: 'relationship',
  visibleFilter: (datum, context) => true,
  categoryLabels: []
  // node: {
  //   // labelFormat: (node: any) => (node && node.label) ?? '',
  //   descriptionFormat: (node: any) => (node && node.label) ?? ''
  // },
  // edge: {
  //   // labelFormat: (edge: any) => (edge && edge.label) ?? '',
  //   descriptionFormat: (edge: any) => (edge && edge.label) ?? ''
  // },
}
DATA_FORMATTER_RELATIONAL_DEFAULT.visibleFilter.toString = () => `(datum, context) => true`

