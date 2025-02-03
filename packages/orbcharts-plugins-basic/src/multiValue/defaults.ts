import type {
  MultiValueLegendParams,
  MultiValueTooltipParams,
  ScatterParams,
  ScatterBubblesParams,
  XAxisParams,
  XYAuxParams,
  XYAxesParams,
  XZoomParams
} from '../../lib/plugins-basic-types'


export const DEFAULT_MULTI_VALUE_LEGEND_PARAMS: MultiValueLegendParams = {
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

export const DEFAULT_MULTI_VALUE_TOOLTIP_PARAMS: MultiValueTooltipParams = {
  backgroundColorType: 'background',
  strokeColorType: 'primary',
  backgroundOpacity: 0.8,
  textColorType: 'primary',
  offset: [20, 5],
  padding: 10,
  renderFn: (eventData, { styles, utils }) => {
    const hasCategoryLabel = eventData.categoryLabel === '' ? false : true
    const hasDatumLabel = eventData.datum.label.slice(0, 11) === 'multiValue_' ? false : true
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
    const categorySvg = hasCategoryLabel
      ? `<rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${offset - 1}" rx="${bulletWidth / 2}" fill="${eventData.datum.color}"></rect>
  <text x="${styles.textSizePx * 1.5}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
    <tspan>${eventData.categoryLabel}</tspan>
  </text>`
      : ''
    const datumLabelSvg = hasDatumLabel
      ? `<tspan>${eventData.datum.label}</tspan>  `
      : ''
    const datumSvg = `<text font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
    ${datumLabelSvg}<tspan font-weight="bold">${eventData.datum.value}</tspan>
  </text>`

    return `${categorySvg}
  <g ${hasCategoryLabel ? `transform="translate(0, ${styles.textSizePx * 2})"` : ''}>
    ${datumSvg}
  </g>`
  },
}
DEFAULT_MULTI_VALUE_TOOLTIP_PARAMS.renderFn.toString = () => `(eventData, { styles, utils }) => {
    const hasCategoryLabel = eventData.categoryLabel === '' ? false : true
    const hasDatumLabel = eventData.datum.label.slice(0, 11) === 'multiValue_' ? false : true
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
    const categorySvg = hasCategoryLabel
      ? \`<rect width="\${bulletWidth}" height="\${bulletWidth}" x="\${offset}" y="\${offset - 1}" rx="\${bulletWidth / 2}" fill="\${eventData.datum.color}"></rect>
  <text x="\${styles.textSizePx * 1.5}" font-size="\${styles.textSizePx}" dominant-baseline="hanging" fill="\${styles.textColor}">
    <tspan>\${eventData.categoryLabel}</tspan>
  </text>\`
      : ''
    const datumLabelSvg = hasDatumLabel
      ? \`<tspan>\${eventData.datum.label}</tspan>  \`
      : ''
    const datumSvg = \`<text font-size="\${styles.textSizePx}" dominant-baseline="hanging" fill="\${styles.textColor}">
    \${datumLabelSvg}<tspan font-weight="bold">\${eventData.datum.value}</tspan>
  </text>\`

    return \`\${categorySvg}
  <g \${hasCategoryLabel ? \`transform="translate(0, \${styles.textSizePx * 2})"\` : ''}>
    \${datumSvg}
  </g>\`
}`

export const DEFAULT_SCATTER_PARAMS: ScatterParams = {
  radius: 5,
  fillColorType: 'label',
  strokeColorType: 'label',
  strokeWidth: 0,
}

export const DEFAULT_SCATTER_BUBBLES_PARAMS: ScatterBubblesParams = {
  // radius: 5,
  fillColorType: 'label',
  strokeColorType: 'label',
  strokeWidth: 0,
  valueLinearOpacity: [0.8, 0.8],
  arcScaleType: 'area',
  sizeAdjust: 0.5
}

export const DEFAULT_X_AXIS_PARAMS: XAxisParams = {
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
  tickTextColorType: 'primary'
}

export const DEFAULT_X_Y_AUX_PARAMS: XYAuxParams = {
  xAxis: {
    showLine: true,
    showLabel: true,
    lineDashArray: '3, 3',
    lineColorType: 'primary',
    labelColorType: 'primary',
    labelTextColorType: 'background',
    // labelTextFormat: text => text,
    labelTextFormat: (value: number) => String(Math.round(value)),
    labelPadding: 20,
    // labelRotate: 0
  },
  yAxis: {
    showLine: true,
    showLabel: true,
    lineDashArray: '3, 3',
    lineColorType: 'primary',
    labelColorType: 'primary',
    labelTextColorType: 'background',
    // labelTextFormat: text => text,
    labelTextFormat: (value: number) => String(Math.round(value)),
    labelPadding: 20,
    // labelRotate: 0
  }
}
DEFAULT_X_Y_AUX_PARAMS.xAxis.labelTextFormat.toString = () => `(value: number) => String(Math.round(value))`
DEFAULT_X_Y_AUX_PARAMS.yAxis.labelTextFormat.toString = () => `(value: number) => String(Math.round(value))`


export const DEFAULT_X_Y_AXES_PARAMS: XYAxesParams = {
  xAxis: {
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
    tickTextColorType: 'primary'
  },
  yAxis: {
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
    tickTextColorType: 'primary'
  }
}
DEFAULT_X_Y_AXES_PARAMS.xAxis.tickFormat.toString = () => `v => v`
DEFAULT_X_Y_AXES_PARAMS.yAxis.tickFormat.toString = () => `v => v`

export const DEFAULT_X_Y_ZOOM_PARAMS: XZoomParams = {

}