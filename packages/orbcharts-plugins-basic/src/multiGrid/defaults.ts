import type {
  MultiGridLegendParams,
  MultiBarsParams,
  MultiStackedBarsParams,
  MultiBarsTriangleParams,
  MultiLinesParams,
  MultiLineAreasParams,
  MultiDotsParams,
  MultiGroupAxisParams,
  MultiGridTooltipParams,
  MultiValueAxisParams,
  MultiStackedValueAxisParams,
  OverlappingValueAxesParams,
  OverlappingStackedValueAxesParams
} from '../../lib/plugins-basic-types'
import { measureTextWidth } from '../utils/commonUtils'

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
  // tickFormat: ',.0f',
  tickFormat: num => {
    if (num === null || Number.isNaN(num) == true) {
      return num || 0
    }
    var parts = num.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  },
  tickLineVisible: true,
  tickPadding: 20,
  tickFullLine: true,
  tickFullLineDasharray: 'none',
  tickColorType: 'secondary',
  tickTextRotate: 0,
  tickTextColorType: 'primary',
  gridIndexes: 'all'
}
DEFAULT_MULTI_VALUE_AXIS_PARAMS.tickFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  var parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}`

export const DEFAULT_MULTI_STACKED_VALUE_AXIS_PARAMS: MultiStackedValueAxisParams = {
  ...DEFAULT_MULTI_VALUE_AXIS_PARAMS
}

export const DEFAULT_MULTI_BARS_PARAMS: MultiBarsParams = {
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 40,
  barRadius: false,
  gridIndexes: [0]
}

export const DEFAULT_MULTI_STACKED_BARS_PARAMS: MultiStackedBarsParams = {
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
  fillColorType: 'background',
  strokeColorType: 'label',
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

export const DEFAULT_OVERLAPPING_STACKED_VALUE_AXES_PARAMS: OverlappingStackedValueAxesParams = {
  ...DEFAULT_OVERLAPPING_VALUE_AXES_PARAMS
}

export const DEFAULT_MULTI_GRID_TOOLTIP_PARAMS: MultiGridTooltipParams = {
  backgroundColorType: 'background',
  strokeColorType: 'primary',
  backgroundOpacity: 0.8,
  textColorType: 'primary',
  offset: [20, 5],
  padding: 10,
  renderFn: (eventData, { styles, utils }) => {
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
    
    const titleSvg = `<g><text dominant-baseline="hanging" font-size="${styles.textSizePx}" fill="${styles.textColor}">${eventData.groupLabel}</text></g>`
    const groupLabelTextWidth = utils.measureTextWidth(eventData.groupLabel, styles.textSizePx)
    const listTextWidth = eventData.group.reduce((acc, group) => {
      const text = `${group.seriesLabel}${utils.toCurrency(group.value)}`
      const _maxTextWidth = utils.measureTextWidth(text, styles.textSizePx)
      return _maxTextWidth > acc ? _maxTextWidth : acc
    }, 0)
    const maxTextWidth = Math.max(groupLabelTextWidth, listTextWidth)
    const lineEndX = maxTextWidth + styles.textSizePx * 3
    const contentSvg = eventData.group
      .map((group, i) => {
        const y = i * styles.textSizePx * 1.5
        const isHighlight = group.id === (eventData.datum && eventData.datum.id)
        return `<g transform="translate(0, ${styles.textSizePx * 2})">
  <rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${y + offset}" rx="${bulletWidth / 2}" fill="${group.color}"></rect>
  <text x="${styles.textSizePx * 1.5}" y="${y}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
    <tspan font-weight="${isHighlight ? 'bold' : ''}">${group.seriesLabel}</tspan>
    <tspan font-weight="bold" text-anchor="end" x="${lineEndX}">${utils.toCurrency(group.value)}</tspan>
  </text>
</g>`
      })
      .join('')
    return `${titleSvg}
${contentSvg}`
  }
}
DEFAULT_MULTI_GRID_TOOLTIP_PARAMS.renderFn.toString = () => `(eventData, { styles, utils }) => {
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)

    const titleSvg = \`<g><text dominant-baseline="hanging" font-size="\${styles.textSizePx}" fill="\${styles.textColor}">\${eventData.groupLabel}</text></g>\`
    const groupLabelTextWidth = utils.measureTextWidth(eventData.groupLabel, styles.textSizePx)
    const listTextWidth = eventData.group.reduce((acc, group) => {
      const text = \`\${group.seriesLabel}\${utils.toCurrency(group.value)}\`
      const _maxTextWidth = utils.measureTextWidth(text, styles.textSizePx)
      return _maxTextWidth > acc ? _maxTextWidth : acc
    }, 0)
    const maxTextWidth = Math.max(groupLabelTextWidth, listTextWidth)
    const lineEndX = maxTextWidth + styles.textSizePx * 3
    const contentSvg = eventData.group
      .map((group, i) => {
        const y = i * styles.textSizePx * 1.5
        const isHighlight = group.id === (eventData.datum && eventData.datum.id)
        return \`<g transform="translate(0, \${styles.textSizePx * 2})">
  <rect width="\${bulletWidth}" height="\${bulletWidth}" x="\${offset}" y="\${y + offset}" rx="\${bulletWidth / 2}" fill="\${group.color}"></rect>
  <text x="\${styles.textSizePx * 1.5}" y="\${y}" font-size="\${styles.textSizePx}" dominant-baseline="hanging" fill="\${styles.textColor}">
    <tspan font-weight="\${isHighlight ? 'bold' : ''}">\${group.seriesLabel}</tspan>
    <tspan font-weight="bold" text-anchor="end" x="\${lineEndX}">\${utils.toCurrency(group.value)}</tspan>
  </text>
</g>\`
      })
      .join('')
    return \`\${titleSvg}
\${contentSvg}\`
}`