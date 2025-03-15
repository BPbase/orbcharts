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
  DataFormatterXYAxis,
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

export const DEFAULT_CHART_OPTIONS: ChartOptionsPartial<any> = {
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

export const DEFAULT_PADDING: Padding = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
}

export const DEFAULT_CHART_PARAMS: ChartParams = {
  padding: DEFAULT_PADDING,
  highlightTarget: 'datum',
  highlightDefault: null,
  colorScheme: 'light',
  colors: {
    light: {
      label: [
        "#0088FF",
        "#FF3232",
        "#38BEA8",
        "#6F3BD5",
        "#314285",
        "#42C724",
        "#D52580",
        "#F4721B",
        "#D117EA",
        "#7E7D7D"
      ],
      // label: ['#67B7DC', '#6794DC', '#6771DC', '#8067DC', '#A367DC', '#C767DC', '#DC67CE', '#DC67AB', '#DC6788', '#DC6967', '#DC8C67', '#DCAF67'],
      // label: ['#F3A356', '#7A60F0', '#38B1AF', '#60A2F0', '#F06062', '#FF383C', '#6580EA', '#079F9C', '#9F65EA', '#EA7465', '#EA7465', '#8657D2', '#59B757', '#2797FF', '#D25786', '#F54BA6', '#4BECF5', '#74FD72', '#CA4BF5', '#EFE26E'],
      // label: ['#60A2F0', '#F3A356', '#7A60F0', '#38B1AF', '#F06062', '#FF383C', '#6580EA', '#079F9C', '#9F65EA', '#EA7465', '#EA7465', '#8657D2', '#59B757', '#2797FF', '#D25786', '#F54BA6', '#4BECF5', '#74FD72', '#CA4BF5', '#EFE26E'],
      // primary: '#454545',
      // primary: '#1b1e23',
      primary: '#000000',
      secondary: '#e0e0e0',
      // white: '#ffffff',
      labelContrast: ['#ffffff', '#000000'],
      background: '#ffffff'
    },
    dark: {
      label: [
        "#4BABFF",
        "#FF6C6C",
        "#7DD3C4",
        "#8E6BC9",
        "#5366AC",
        "#86DC72",
        "#FF72BB",
        "#F9B052",
        "#EF76FF",
        "#C4C4C4"
      ],
      // label: ['#67B7DC', '#6794DC', '#6771DC', '#8067DC', '#A367DC', '#C767DC', '#DC67CE', '#DC67AB', '#DC6788', '#DC6967', '#DC8C67', '#DCAF67'],
      // label: ['#67B7DC', '#6794DC', '#38B1AF', '#6771DC', '#8067DC', '#A367DC', '#C767DC', '#DC67CE', '#DC67AB', '#DC6788', '#DC6967', '#DC8C67', '#DCAF67'],
      // label: ['#60A2F0', '#F3A356', '#7A60F0', '#38B1AF', '#F06062', '#FF383C', '#6580EA', '#079F9C', '#9F65EA', '#EA7465', '#EA7465', '#8657D2', '#59B757', '#2797FF', '#D25786', '#F54BA6', '#4BECF5', '#74FD72', '#CA4BF5', '#EFE26E'],
      // primary: '#f0f0f0',
      primary: '#ffffff',
      secondary: '#e0e0e0',
      // white: '#ffffff',
      labelContrast: ['#ffffff', '#000000'],
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

export const DEFAULT_CHART_WIDTH = 800

export const DEFAULT_CHART_HEIGHT = 500

// -- Data --

export const DEFAULT_DATA_SERIES: DataSeries = []

export const DEFAULT_DATA_GRID: DataGrid = []

export const DEFAULT_DATA_MULTI_GRID: DataMultiGrid = []

export const DEFAULT_DATA_MULTI_VALUE: DataMultiValue = []

export const DEFAULT_DATA_TREE: DataTree = []

export const DEFAULTL_DATA_RELATIONA: DataRelationship = {
  nodes: [],
  edges: []
}

// -- Data Formatter --

export const DEFAULT_DATA_FORMATTER_VALUE_AXIS: DataFormatterValueAxis = {
  position: 'left',
  scaleDomain: ['auto', 'auto'],
  scaleRange: [0, 0.9],
  label: '',
}

export const DEFAULT_DATA_FORMATTER_GROUP_AXIS: DataFormatterGroupAxis = {
  position: 'bottom',
  scaleDomain: [0, 'max'],
  scalePadding: 0.5,
  label: ''
}

export const DEFAULT_DATA_FORMATTER_X_Y_AXIS: DataFormatterXYAxis = {
  scaleDomain: ['auto', 'auto'],
  scaleRange: [0, 0.9],
  label: '',
  valueIndex: 0
}

export const DEFAULT_DATA_FORMATTER_CONTAINER: DataFormatterContainer = {
  columnAmount: 1,
  rowAmount: 1,
  columnGap: 'auto',
  rowGap: 'auto'
}

export const DEFAULT_DATA_FORMATTER_SERIES: DataFormatterSeries = {
  type: 'series',
  visibleFilter: (datum, context) => true,
  sort: null,
  seriesLabels: [],
  container: {
    ...DEFAULT_DATA_FORMATTER_CONTAINER
  },
  separateSeries: false,
  separateLabel: false,
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
DEFAULT_DATA_FORMATTER_SERIES.visibleFilter.toString = () => `(datum, context) => true`

export const DEFAULT_DATA_FORMATTER_GRID_GRID: DataFormatterGridGrid = {
  seriesDirection: 'row',
  rowLabels: [],
  columnLabels: [],
  valueAxis: { ...DEFAULT_DATA_FORMATTER_VALUE_AXIS },
  groupAxis: { ...DEFAULT_DATA_FORMATTER_GROUP_AXIS, },
  separateSeries: false,
  // slotIndex: 0,
  // seriesSlotIndexes: null
}

export const DEFAULT_DATA_FORMATTER_GRID: DataFormatterGrid = {
  type: 'grid',
  visibleFilter: (datum, context) => true,
  // grid: {
    ...DEFAULT_DATA_FORMATTER_GRID_GRID,
  // },
  container: {
    ...DEFAULT_DATA_FORMATTER_CONTAINER
  }
}
DEFAULT_DATA_FORMATTER_GRID.visibleFilter.toString = () => `(datum, context) => true`

// export const DATA_FORMATTER_MULTI_GRID_MULTI_GRID_DEFAULT: DataFormatterMultiGridMultiGrid = {
//   ...DEFAULT_DATA_FORMATTER_GRID,
//   slotIndex: 0,
//   seriesSlotIndexes: null
// }

export const DEFAULT_DATA_FORMATTER_MULTI_GRID_GRID: DataFormatterMultiGridGrid = {
  ...DEFAULT_DATA_FORMATTER_GRID_GRID
}

export const DEFAULT_DATA_FORMATTER_MULTI_GRID: DataFormatterMultiGrid = {
  type: 'multiGrid',
  visibleFilter: (datum, context) => true,
  gridList: [
    {
      ...DEFAULT_DATA_FORMATTER_MULTI_GRID_GRID
    },
  ],
  separateGrid: false,
  container: {
    ...DEFAULT_DATA_FORMATTER_CONTAINER
  }
}
DEFAULT_DATA_FORMATTER_MULTI_GRID.visibleFilter.toString = () => `(datum, context) => true`

export const DEFAULT_DATA_FORMATTER_MULTI_VALUE: DataFormatterMultiValue = {
  type: 'multiValue',
  visibleFilter: (datum, context) => true,
  categoryLabels: [],
  valueLabels: [],
  xAxis: {
    ...DEFAULT_DATA_FORMATTER_X_Y_AXIS,
    valueIndex: 0
  },
  yAxis: {
    ...DEFAULT_DATA_FORMATTER_X_Y_AXIS,
    valueIndex: 1
  },
  container: {
    ...DEFAULT_DATA_FORMATTER_CONTAINER
  },
  separateCategory: false
}
DEFAULT_DATA_FORMATTER_MULTI_VALUE.visibleFilter.toString = () => `(datum, context) => true`

export const DEFAULT_DATA_FORMATTER_TREE: DataFormatterTree = {
  type: 'tree',
  visibleFilter: (datum, context) => true,
  // labelFormat: (datum: any) => (datum && datum.label) ?? '',
  categoryLabels: []
}
DEFAULT_DATA_FORMATTER_TREE.visibleFilter.toString = () => `(datum, context) => true`

export const DEFAULT_DATA_FORMATTER_RELATIONSHIP: DataFormatterRelationship = {
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
DEFAULT_DATA_FORMATTER_RELATIONSHIP.visibleFilter.toString = () => `(datum, context) => true`

