import type { BarsParams, BarsTriangleParams, DotsParams, GridLegendParams, GridSeparableGraphicPluginParams, GridTooltipParams, GroupAuxParams, GroupAxisParams, GroupZoomParams, LineAreasParams, LinesParams, StackedBarsParams, StackedValueAxisParams, ValueAxisParams } from './types'

export const DEFAULT_GRID_SEPARABLE_GRAPHIC_PARAMS: GridSeparableGraphicPluginParams = {
  styles: {
    padding: {
      top: 60,
      right: 60,
      bottom: 60,
      left: 60
    },
    highlightTarget: 'datum',
    highlightDefault: null,
    unhighlightedOpacity: 0.3,
    transitionDuration: 800,
    transitionEase: 'easeCubic'
  },
  visibleFilter: (datum) => true,
  container: {
    columnAmount: 1,
    rowAmount: 1,
    columnGap: 'auto',
    rowGap: 'auto'
  },
  valueAxis: {
    position: 'left',
    scaleDomain: ['auto', 'auto'],
    scaleRange: [0, 0.9],
    label: '',
  },
  categoryAxis: {
    position: 'bottom',
    scaleDomain: [0, 'max'],
    scalePadding: 0.5,
    label: ''
  },
  separateSeries: false,
  datasetIndex: 0
}
DEFAULT_GRID_SEPARABLE_GRAPHIC_PARAMS.visibleFilter.toString = () => '(datum) => true'

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
  strokeColorType: 'data',
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

export const DEFAULT_STACKED_BARS_PARAMS: StackedBarsParams = {
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
  // tickFormat: v => v,
  tickFormat: num => {
    if (num === null || Number.isNaN(num) == true) {
      return num || 0
    }
    const parts = num.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  },
  tickLineVisible: true,
  tickPadding: 20,
  tickFullLine: true,
  tickFullLineDasharray: 'none',
  tickColorType: 'secondary',
  tickTextRotate: 0,
  tickTextColorType: 'primary'
}
DEFAULT_VALUE_AXIS_PARAMS.tickFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}`

export const DEFAULT_STACKED_VALUE_AXIS_PARAMS: StackedValueAxisParams = {
  ...DEFAULT_VALUE_AXIS_PARAMS
}

export const DEFAULT_GROUP_ZOOM_PARAMS: GroupZoomParams = {

}

export const DEFAULT_GRID_LEGEND_PARAMS: GridLegendParams = {
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
  renderFn: (eventData, { styles, utils, categoryData }) => {
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)

    const titleSvg = `<g><text dominant-baseline="hanging" font-size="${styles.textSizePx}" fill="${styles.textColor}">${eventData.target.category}</text></g>`
    const categoryLabelTextWidth = utils.measureTextWidth(eventData.target.category, styles.textSizePx)
    const listTextWidth = categoryData.reduce((acc, category) => {
      const text = `${category.series}${utils.toCurrency(category.value)}`
      const _maxTextWidth = utils.measureTextWidth(text, styles.textSizePx)
      return _maxTextWidth > acc ? _maxTextWidth : acc
    }, 0)
    const maxTextWidth = Math.max(categoryLabelTextWidth, listTextWidth)
    const lineEndX = maxTextWidth + styles.textSizePx * 3
    const contentSvg = categoryData
      .map((category, i) => {
        const y = i * styles.textSizePx * 1.5
        const isHighlight = category.id === (eventData.target && eventData.target.id)
        return `<g transform="translate(0, ${styles.textSizePx * 2})">
  <rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${y + offset}" rx="${bulletWidth / 2}" fill="${category.color}"></rect>
  <text x="${styles.textSizePx * 1.5}" y="${y}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
    <tspan font-weight="${isHighlight ? 'bold' : ''}">${category.series}</tspan>
    <tspan font-weight="bold" text-anchor="end" x="${lineEndX}">${utils.toCurrency(category.value)}</tspan>
  </text>
</g>`
      })
      .join('')
    return `${titleSvg}
${contentSvg}`
  }
}
DEFAULT_GRID_TOOLTIP_PARAMS.renderFn.toString = () => `(eventData, { styles, utils, categoryData }) => {
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)

    const titleSvg = \`<g><text dominant-baseline="hanging" font-size="\${styles.textSizePx}" fill="\${styles.textColor}">\${eventData.target.category}</text></g>\`
    const categoryLabelTextWidth = utils.measureTextWidth(eventData.target.category, styles.textSizePx)
    const listTextWidth = categoryData.reduce((acc, category) => {
      const text = \`\${category.series}\${utils.toCurrency(category.value)}\`
      const _maxTextWidth = utils.measureTextWidth(text, styles.textSizePx)
      return _maxTextWidth > acc ? _maxTextWidth : acc
    }, 0)
    const maxTextWidth = Math.max(categoryLabelTextWidth, listTextWidth)
    const lineEndX = maxTextWidth + styles.textSizePx * 3
    const contentSvg = categoryData
      .map((category, i) => {
        const y = i * styles.textSizePx * 1.5
        const isHighlight = category.id === (eventData.target && eventData.target.id)
        return \`<g transform="translate(0, \${styles.textSizePx * 2})">
  <rect width="\${bulletWidth}" height="\${bulletWidth}" x="\${offset}" y="\${y + offset}" rx="\${bulletWidth / 2}" fill="\${category.color}"></rect>
  <text x="\${styles.textSizePx * 1.5}" y="\${y}" font-size="\${styles.textSizePx}" dominant-baseline="hanging" fill="\${styles.textColor}">
    <tspan font-weight="\${isHighlight ? 'bold' : ''}">\${category.series}</tspan>
    <tspan font-weight="bold" text-anchor="end" x="\${lineEndX}">\${utils.toCurrency(category.value)}</tspan>
  </text>
</g>\`
      })
      .join('')
    return \`\${titleSvg}
\${contentSvg}\`
}`


