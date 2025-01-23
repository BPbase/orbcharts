import type {
  LinesParams,
  LineAreasParams,
  GroupAuxParams,
  DotsParams,
  BarsParams,
  StackedBarParams,
  BarsTriangleParams,
  GroupAxisParams,
  ValueAxisParams,
  StackedValueAxisParams,
  GridTooltipParams,
  GridZoomParams,
  GridLegendParams
} from '../../lib/plugins-basic-types'
// import { measureTextWidth } from '../utils/commonUtils'

export const DEFAULT_LINES_PARAMS: LinesParams = {
  lineCurve: 'curveLinear',
  lineWidth: 2
}

export const DEFAULT_LINE_AREAS_PARAMS: LineAreasParams = {
  lineCurve: 'curveLinear',
  linearGradientOpacity: [1, 0]
}

export const DEFAULT_DOTS_PARAMS: DotsParams = {
  radius: 4,
  fillColorType: 'background',
  strokeColorType: 'label',
  strokeWidth: 2,
  // strokeWidthWhileHighlight: 3,
  onlyShowHighlighted: false
}

export const DEFAULT_GROUP_AUX_PARAMS: GroupAuxParams = {
  showLine: true,
  showLabel: true,
  lineDashArray: '3, 3',
  lineColorType: 'primary',
  labelColorType: 'primary',
  labelTextColorType: 'background',
  labelTextFormat: text => text,
  labelPadding: 20,
  labelRotate: 0
}
DEFAULT_GROUP_AUX_PARAMS.labelTextFormat.toString = () => `text => text`

export const DEFAULT_BARS_PARAMS: BarsParams = {
  // barType: 'rect',
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 40,
  barRadius: false,
}

export const DEFAULT_BARS_DIVERGING_PARAMS: BarsParams = {
  ...DEFAULT_BARS_PARAMS
}

export const DEFAULT_STACKED_BAR_PARAMS: StackedBarParams = {
  barWidth: 0,
  barGroupPadding: 10,
  barRadius: false,
}

export const DEFAULT_BARS_TRIANGLE_PARAMS: BarsTriangleParams = {
  barWidth: 0,
  barPadding: 1,
  barGroupPadding: 20,
  linearGradientOpacity: [1, 0]
}

export const DEFAULT_GROUP_AXIS_PARAMS: GroupAxisParams = {
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
}
DEFAULT_GROUP_AXIS_PARAMS.tickFormat.toString = () => `text => text`

export const DEFAULT_VALUE_AXIS_PARAMS: ValueAxisParams = {
  // labelAnchor: 'end',
  labelOffset: [0, 0],
  labelColorType: 'primary',
  axisLineVisible: false,
  axisLineColorType: 'primary',
  ticks: null,
  // tickFormat: ',.0f',
  tickFormat: v => v,
  tickLineVisible: true,
  tickPadding: 20,
  tickFullLine: true,
  tickFullLineDasharray: 'none',
  tickColorType: 'secondary',
  tickTextRotate: 0,
  tickTextColorType: 'primary'
}
DEFAULT_VALUE_AXIS_PARAMS.tickFormat.toString = () => 'v => v'

export const DEFAULT_STACKED_VALUE_AXIS_PARAMS: StackedValueAxisParams = {
  ...DEFAULT_VALUE_AXIS_PARAMS
}

export const DEFAULT_GRID_ZOOM_PARAMS: GridZoomParams = {

}

export const DEFAULT_GRID_LEGEND_PARAMS: GridLegendParams = {
  // position: 'right',
  // justify: 'end',
  placement: 'bottom',
  padding: 28,
  // offset: [0, 0],
  backgroundFill: 'none',
  backgroundStroke: 'none',
  gap: 10,
  listRectWidth: 14,
  listRectHeight: 14,
  listRectRadius: 0,
  // highlightEvent: false
  textColorType: 'primary'
}

export const DEFAULT_GRID_TOOLTIP_PARAMS: GridTooltipParams = {
  backgroundColorType: 'background',
  strokeColorType: 'primary',
  backgroundOpacity: 0.8,
  textColorType: 'primary',
  offset: [20, 5],
  padding: 10,
//   renderFn: (eventData, { styles }) => {
//     const bulletWidth = styles.textSizePx * 0.7
//     const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
//     if (eventData.highlightTarget === 'group') {
//       const titleSvg = `<g><text dominant-baseline="hanging" font-size="${styles.textSizePx}">${eventData.groupLabel}</text></g>`
//       const maxLengthText = eventData.group.reduce((acc, group) => {
//         const text = `${group.seriesLabel}${group.value}`
//         return text.length > acc.length ? text : acc
//       }, '')
//       const maxTextWidth = measureTextWidth(maxLengthText, styles.textSizePx)
//       const lineEndX = maxTextWidth + styles.textSizePx * 2
//       const contentSvg = eventData.group
//         .map((group, i) => {
//           const y = i * styles.textSizePx * 1.5
//           return `<g transform="translate(0, ${styles.textSizePx * 2})">
//   <rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${y + offset}" rx="${bulletWidth / 2}" fill="${group.color}"></rect>
//   <text x="${styles.textSizePx * 1.5}" y="${y}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
//     <tspan>${group.seriesLabel}</tspan>
//     <tspan font-weight="bold" text-anchor="end" x="${lineEndX}">${group.value}</tspan>
//   </text>
// </g>`
//         })
//         .join('')
//       return `${titleSvg}
// ${contentSvg}`
//     } else if (eventData.highlightTarget === 'series') {
//       const titleSvg = `<g><text dominant-baseline="hanging" font-size="${styles.textSizePx}">${eventData.groupLabel}</text></g>`
//       const textWidth = measureTextWidth(`${eventData.seriesLabel}${eventData.datum.value}`, styles.textSizePx)
//       const lineEndX = textWidth + styles.textSizePx * 2
//       const contentSvg = `<g transform="translate(0, ${styles.textSizePx * 2})">
//   <rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${offset}" rx="${bulletWidth / 2}" fill="${eventData.datum.color}"></rect>
//   <text x="${styles.textSizePx * 1.5}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
//     <tspan>${eventData.seriesLabel}</tspan>
//     <tspan font-weight="bold" text-anchor="end" x="${lineEndX}">${eventData.datum.value}</tspan>
//   </text>
// </g>`
//       return `${titleSvg}
// ${contentSvg}`
//     } else {
//       const textWidth = measureTextWidth(`${eventData.datum.label}${eventData.datum.value}`, styles.textSizePx)
//       const lineEndX = textWidth + styles.textSizePx * 2
//       return `<g>
//   <rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${offset}" rx="${bulletWidth / 2}" fill="${eventData.datum.color}"></rect>
//   <text x="${styles.textSizePx * 1.5}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
//     <tspan>${eventData.datum.label}</tspan>
//     <tspan font-weight="bold" text-anchor="end" x="${lineEndX}">${eventData.datum.value}</tspan>
//   </text>
// </g>`
//     }
//   },
  renderFn: (eventData, { styles, utils }) => {
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)

    const titleSvg = `<g><text dominant-baseline="hanging" font-size="${styles.textSizePx}" fill="${styles.textColor}">${eventData.groupLabel}</text></g>`
    const groupLabelTextWidth = utils.measureTextWidth(eventData.groupLabel, styles.textSizePx)
    const listTextWidth = eventData.group.reduce((acc, group) => {
      const text = `${group.seriesLabel}${group.value}`
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
    <tspan font-weight="bold" text-anchor="end" x="${lineEndX}">${group.value}</tspan>
  </text>
</g>`
      })
      .join('')
    return `${titleSvg}
${contentSvg}`
  }
}
DEFAULT_GRID_TOOLTIP_PARAMS.renderFn.toString = () => `(eventData, { styles, utils }) => {
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)

    const titleSvg = \`<g><text dominant-baseline="hanging" font-size="\${styles.textSizePx}" fill="\${styles.textColor}">\${eventData.groupLabel}</text></g>\`
    const groupLabelTextWidth = utils.measureTextWidth(eventData.groupLabel, styles.textSizePx)
    const listTextWidth = eventData.group.reduce((acc, group) => {
      const text = \`\${group.seriesLabel}\${group.value}\`
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
    <tspan font-weight="bold" text-anchor="end" x="\${lineEndX}">\${group.value}</tspan>
  </text>
</g>\`
      })
      .join('')
    return \`\${titleSvg}
\${contentSvg}\`
}`