import type {
  MultiGridLegendParams,
  MultiBarsParams,
  MultiBarStackParams,
  MultiBarsTriangleParams,
  MultiLinesParams,
  MultiLineAreasParams,
  MultiDotsParams,
  MultiGroupAxisParams,
  MultiGridTooltipParams,
  MultiValueAxisParams,
  MultiValueStackAxisParams,
  OverlappingValueAxesParams,
  OverlappingValueStackAxesParams
} from '../../lib/plugins-basic-types'

export const DEFAULT_MULTI_GRID_LEGEND_PARAMS: MultiGridLegendParams = {
  // position: 'right',
  // justify: 'end',
  placement: 'bottom',
  padding: 28,
  backgroundFill: 'none',
  backgroundStroke: 'none',
  gap: 10,
  listRectWidth: 14,
  listRectHeight: 14,
  listRectRadius: 0,
  gridList: [
    {
      listRectWidth: 14,
      listRectHeight: 14,
      listRectRadius: 0,
    }
  ],
  textColorType: 'primary'
}

export const DEFAULT_MULTI_GROUP_AXIS_PARAMS: MultiGroupAxisParams = {
  // labelAnchor: 'start',
  labelOffset: [0, 0],
  labelColorType: 'primary',
  axisLineVisible: true,
  axisLineColorType: 'primary',
  ticks: 'all',
  tickFormat: text => text,
  tickLineVisible: true,
  tickPadding: 20,
  tickFullLine: false,
  tickFullLineDasharray: 'none',
  tickColorType: 'secondary',
  tickTextRotate: 0,
  tickTextColorType: 'primary',
  gridIndexes: [0]
}
DEFAULT_MULTI_GROUP_AXIS_PARAMS.tickFormat.toString = () => `text => text`

export const DEFAULT_MULTI_VALUE_AXIS_PARAMS: MultiValueAxisParams = {
  // labelAnchor: 'end',
  labelOffset: [0, 0],
  labelColorType: 'primary',
  axisLineVisible: false,
  axisLineColorType: 'primary',
  ticks: 4,
  tickFormat: ',.0f',
  tickLineVisible: true,
  tickPadding: 20,
  tickFullLine: true,
  tickFullLineDasharray: 'none',
  tickColorType: 'secondary',
  tickTextRotate: 0,
  tickTextColorType: 'primary',
  gridIndexes: [0]
}

export const DEFAULT_MULTI_VALUE_STACK_AXIS_PARAMS: MultiValueStackAxisParams = {
  ...DEFAULT_MULTI_VALUE_AXIS_PARAMS
}

export const DEFAULT_MULTI_BARS_PARAMS: MultiBarsParams = {
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 40,
  barRadius: false,
  gridIndexes: [0]
}

export const DEFAULT_MULTI_BAR_STACK_PARAMS: MultiBarStackParams = {
  barWidth: 0,
  barGroupPadding: 10,
  barRadius: false,
  gridIndexes: [0]
}

export const DEFAULT_MULTI_BARS_TRIANGLE_PARAMS: MultiBarsTriangleParams = {
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 20,
  linearGradientOpacity: [1, 0],
  gridIndexes: [0]
}

export const DEFAULT_MULTI_LINES_PARAMS: MultiLinesParams = {
  lineCurve: 'curveLinear',
  lineWidth: 2,
  gridIndexes: [1]
}

export const DEFAULT_MULTI_LINE_AREAS_PARAMS: MultiLineAreasParams = {
  lineCurve: 'curveLinear',
  linearGradientOpacity: [1, 0],
  gridIndexes: [1]
}

export const DEFAULT_MULTI_DOTS_PARAMS: MultiDotsParams = {
  radius: 4,
  fillColorType: 'white',
  strokeColorType: 'series',
  strokeWidth: 2,
  onlyShowHighlighted: false,
  gridIndexes: [1]
}

export const DEFAULT_OVERLAPPING_VALUE_AXES_PARAMS: OverlappingValueAxesParams = {
  firstAxis: {
    // labelAnchor: 'end',
    labelOffset: [0, 0],
    labelColorType: 'primary',
    axisLineVisible: false,
    axisLineColorType: 'primary',
    ticks: 4,
    tickFormat: ',.0f',
    tickLineVisible: true,
    tickPadding: 20,
    tickFullLine: true,
    tickFullLineDasharray: 'none',
    tickColorType: 'secondary',
    tickTextRotate: 0,
    tickTextColorType: 'primary',
  },
  secondAxis: {
    // labelAnchor: 'end',
    labelOffset: [0, 0],
    labelColorType: 'primary',
    axisLineVisible: false,
    axisLineColorType: 'primary',
    ticks: 4,
    tickFormat: ',.0f',
    tickLineVisible: true,
    tickPadding: 20,
    tickFullLine: true,
    tickFullLineDasharray: 'none',
    tickColorType: 'secondary',
    tickTextRotate: 0,
    tickTextColorType: 'primary',
  },
  gridIndexes: [0, 1]
}

export const DEFAULT_OVERLAPPING_VALUE_STACK_AXES_PARAMS: OverlappingValueStackAxesParams = {
  ...DEFAULT_OVERLAPPING_VALUE_AXES_PARAMS
}

export const DEFAULT_MULTI_GRID_TOOLTIP_PARAMS: MultiGridTooltipParams = {
  backgroundColorType: 'background',
  strokeColorType: 'primary',
  backgroundOpacity: 0.8,
  textColorType: 'primary',
  offset: [20, 5],
  padding: 10,
  renderFn: (eventData, { styles }) => {
    return `<g>
  <rect width="${styles.textSizePx}" height="${styles.textSizePx}" rx="${styles.textSizePx / 2}" fill="${eventData.datum.color}></rect>
  <text x="${styles.textSizePx * 1.5}" font-size="${styles.textSizePx}" fill="${styles.textColor}">${eventData.datum.label}</text>
</g>`
  },
}
DEFAULT_MULTI_GRID_TOOLTIP_PARAMS.renderFn.toString = () => `(eventData, { styles }) => {
    return \`<g>
  <rect width="\${styles.textSizePx}" height="\${styles.textSizePx}" rx="\${styles.textSizePx / 2}" fill="\${eventData.datum.color}></rect>
  <text x="\${styles.textSizePx * 1.5}" font-size="\${styles.textSizePx}" fill="\${styles.textColor}">\${eventData.datum.label}</text>
</g>\`
}`