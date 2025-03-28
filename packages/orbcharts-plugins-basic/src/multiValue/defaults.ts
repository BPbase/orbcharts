import type { ComputedDataTypeMap } from '../../lib/core-types'
import type {
  MultiValueLegendParams,
  MultiValueTooltipParams,
  OrdinalBubblesParams,
  OrdinalAuxParams,
  OrdinalAxisParams,
  OrdinalZoomParams,
  RacingBarsParams,
  RacingCounterTextsParams,
  RacingValueAxisParams,
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
    const hasDatumLabel = eventData.datum == null || eventData.datum.label.slice(0, 11) === 'multiValue_' ? false : true
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
    const categorySvg = hasCategoryLabel
      ? `<rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${offset - 1}" rx="${bulletWidth / 2}" fill="${eventData.datum.color}"></rect>
  <text x="${styles.textSizePx * 1.5}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
    <tspan>${eventData.categoryLabel}</tspan>
  </text>`
      : ''

    const datumLabelSvg = hasDatumLabel
      ? `<text font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
    <tspan>${eventData.datum.label}</tspan>
  </text>`
      : ''

    const maxTextWidth = (() => {
      const categoryLabelTextWidth = utils.measureTextWidth(eventData.categoryLabel, styles.textSizePx)
      const datumLabelTextWidth = hasDatumLabel ? utils.measureTextWidth(eventData.datum.label, styles.textSizePx) : 0
      const valueDetailTextWidth = eventData.valueDetail.reduce((acc, detail) => {
        const text = `${detail.valueLabel}${utils.toCurrency(detail.value)}`
        const _maxTextWidth = utils.measureTextWidth(text, styles.textSizePx)
        return _maxTextWidth > acc ? _maxTextWidth : acc
      }, 0)
      return Math.max(categoryLabelTextWidth, datumLabelTextWidth, valueDetailTextWidth)
    })()

    const valueDetailSvg = eventData.valueDetail.map((detail, i) => {
      const y = (i * styles.textSizePx * 1.5) + (datumLabelSvg ? styles.textSizePx * 2 : 0)
      const lineEndX = maxTextWidth + styles.textSizePx * 3
      return `<text x="0" y="${y}" font-weight="bold" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
      <tspan>${detail.valueLabel}</tspan>
      <tspan text-anchor="end" x="${lineEndX}">${utils.toCurrency(detail.value)}</tspan>
    </text>`
    }).join('')

    const datumDetailSvg = datumLabelSvg || valueDetailSvg
      ? `<g ${hasCategoryLabel ? `transform="translate(0, ${styles.textSizePx * 2})"` : ''}>
    ${datumLabelSvg}
    ${valueDetailSvg}
  </g>`
      : ''

    return `${categorySvg}
${datumDetailSvg}`
  },
}
DEFAULT_MULTI_VALUE_TOOLTIP_PARAMS.renderFn.toString = () => `(eventData, { styles, utils }) => {
  const hasCategoryLabel = eventData.categoryLabel === '' ? false : true
  const hasDatumLabel = eventData.datum == null || eventData.datum.label.slice(0, 11) === 'multiValue_' ? false : true
  const bulletWidth = styles.textSizePx * 0.7
  const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
  const categorySvg = hasCategoryLabel
    ? \`<rect width="\${bulletWidth}" height="\${bulletWidth}" x="\${offset}" y="\${offset - 1}" rx="\${bulletWidth / 2}" fill="\${eventData.datum.color}"></rect>
<text x="\${styles.textSizePx * 1.5}" font-size="\${styles.textSizePx}" dominant-baseline="hanging" fill="\${styles.textColor}">
  <tspan>\${eventData.categoryLabel}</tspan>
</text>\`
    : ''

  const datumLabelSvg = hasDatumLabel
    ? \`<text font-size="\${styles.textSizePx}" dominant-baseline="hanging" fill="\${styles.textColor}">
  <tspan>\${eventData.datum.label}</tspan>
</text>\`
    : ''

  const maxTextWidth = (() => {
    const categoryLabelTextWidth = utils.measureTextWidth(eventData.categoryLabel, styles.textSizePx)
    const datumLabelTextWidth = hasDatumLabel ? utils.measureTextWidth(eventData.datum.label, styles.textSizePx) : 0
    const valueDetailTextWidth = eventData.valueDetail.reduce((acc, detail) => {
      const text = \`\${detail.valueLabel}\${utils.toCurrency(detail.value)}\`
      const _maxTextWidth = utils.measureTextWidth(text, styles.textSizePx)
      return _maxTextWidth > acc ? _maxTextWidth : acc
    }, 0)
    return Math.max(categoryLabelTextWidth, datumLabelTextWidth, valueDetailTextWidth)
  })()

  const valueDetailSvg = eventData.valueDetail.map((detail, i) => {
    const y = (i * styles.textSizePx * 1.5) + (datumLabelSvg ? styles.textSizePx * 2 : 0)
    const lineEndX = maxTextWidth + styles.textSizePx * 3
    return \`<text x="0" y="\${y}" font-weight="bold" font-size="\${styles.textSizePx}" dominant-baseline="hanging" fill="\${styles.textColor}">
    <tspan>\${detail.valueLabel}</tspan>
    <tspan text-anchor="end" x="\${lineEndX}">\${utils.toCurrency(detail.value)}</tspan>
  </text>\`
  }).join('')

  const datumDetailSvg = datumLabelSvg || valueDetailSvg
    ? \`<g \${hasCategoryLabel ? \`transform="translate(0, \${styles.textSizePx * 2})"\` : ''}>
  \${datumLabelSvg}
  \${valueDetailSvg}
</g>\`
    : ''

  return \`\${categorySvg}
\${datumDetailSvg}\`
}`

export const DEFAULT_ORDINAL_BUBBLES_PARAMS: OrdinalBubblesParams = {
  bubble: {
    sizeAdjust: 1,
    arcScaleType: 'area',
    valueLinearOpacity: [0.8, 0.8]
    
  },
  itemLabel: {
    padding: 20,
    colorType: 'primary'
  },
  axisLabel: {
    offset: [0, 0],
    colorType: 'primary'
  },
  rankingAmount: 10
}

export const DEFAULT_ORDINAL_AUX_PARAMS: OrdinalAuxParams = {
  showLine: true,
  showLabel: true,
  lineDashArray: '3, 3',
  lineColorType: 'primary',
  labelColorType: 'primary',
  labelTextColorType: 'background',
  // labelTextFormat: text => text,
  // labelTextFormat: (value: number) => String(Math.round(value)),
  labelTextFormat: v => v,
  labelPadding: 20,
  // labelRotate: 0
}
DEFAULT_ORDINAL_AUX_PARAMS.labelTextFormat.toString = () => `v => v`

export const DEFAULT_ORDINAL_AXIS_PARAMS: OrdinalAxisParams = {
  labelOffset: [0, 0],
  labelColorType: 'primary',
  axisLineVisible: false,
  axisLineColorType: 'secondary',
  ticks: 4,
  // ticks: 'all',
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
DEFAULT_ORDINAL_AXIS_PARAMS.tickFormat.toString = () => `v => v`

export const DEFAULT_ORDINAL_ZOOM_PARAMS: OrdinalZoomParams = {

}

export const DEFAULT_RACING_BARS_PARAMS: RacingBarsParams = {
  bar: {
    barWidth: 0,
    barPadding: 8,
    barRadius: false,
  },
  barLabel: {
    position: 'inside',
    padding: 20,
    // rotate: 0,
    colorType: 'labelContrast'
  },
  valueLabel: {
    padding: 20,
    colorType: 'primary',
    // format: num => {
    //   if (num === null || Number.isNaN(num) == true) {
    //     return num || 0
    //   }
    //   const parts = num.toString().split('.')
    //   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    //   return parts.join('.')
    // }
    format: v => v
  },
  axisLabel: {
    offset: [0, 0],
    colorType: 'primary'
  },
  // rankingAmount: 'auto'
  rankingAmount: 10,
  autorun: false,
  loop: false
}
// DEFAULT_RACING_BARS_PARAMS.valueLabel.format.toString = () => `num => {
//     if (num === null || Number.isNaN(num) == true) {
//       return num || 0
//     }
//     const parts = num.toString().split('.')
//     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
//     return parts.join('.')
//   }
// }`
DEFAULT_RACING_BARS_PARAMS.valueLabel.format.toString = () => `v => v`

export const DEFAULT_RACING_COUNTER_TEXTS_PARAMS: RacingCounterTextsParams = {
  renderFn: (valueLabel: string, valueIndex: number, data: ComputedDataTypeMap<'multiValue'>) => {
    return valueLabel
  },
  textAttrs: [
    {
      "transform": "translate(0, 0)"
    }
  ],
  textStyles: [
    {
      "font-weight": "bold",
      "text-anchor": "end",
      "pointer-events": "none",
      "dominant-baseline": "auto",
      "font-size": 64,
      "fill": "#bebebe"
    },
    {
      "text-anchor": "end",
      "pointer-events": "none",
      "dominant-baseline": "auto",
      "font-size": 24,
      "fill": "#bebebe"
    },
  ],
  paddingRight: 0,
  paddingBottom: 0
}
DEFAULT_RACING_COUNTER_TEXTS_PARAMS.renderFn.toString = () => `(valueLabel, valueIndex, data) => {
  return valueLabel
}`

export const DEFAULT_RACING_VALUE_AXIS_PARAMS: RacingValueAxisParams = {
  labelOffset: [0, 0],
  labelColorType: 'primary',
  axisLineVisible: false,
  axisLineColorType: 'secondary',
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
  tickTextColorType: 'primary'
}
DEFAULT_RACING_VALUE_AXIS_PARAMS.tickFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
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
  axisLineColorType: 'secondary',
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
  tickTextColorType: 'primary'
}
DEFAULT_X_AXIS_PARAMS.tickFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}`

export const DEFAULT_X_Y_AUX_PARAMS: XYAuxParams = {
  xAxis: {
    showLine: true,
    showLabel: true,
    lineDashArray: '3, 3',
    lineColorType: 'primary',
    labelColorType: 'primary',
    labelTextColorType: 'background',
    // labelTextFormat: text => text,
    // labelTextFormat: (value: number) => String(Math.round(value)),
    labelTextFormat: num => {
      if (num === null || Number.isNaN(num) == true) {
        return num || 0
      }
      const absNum = Math.abs(num)
      if (absNum > 0 && absNum < 1) {
        const strNum = num.toString()
        const match = strNum.match(/0\.(0*)([1-9])/)
        if (match) {
            const precision = match[1].length + 1
            return num.toFixed(precision)
        }
        return num.toString()
      }
      const parts = num.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts[0]
    },
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
    // labelTextFormat: (value: number) => String(Math.round(value)),
    labelTextFormat: num => {
      if (num === null || Number.isNaN(num) == true) {
        return num || 0
      }
      const absNum = Math.abs(num)
      if (absNum > 0 && absNum < 1) {
        const strNum = num.toString()
        const match = strNum.match(/0\.(0*)([1-9])/)
        if (match) {
            const precision = match[1].length + 1
            return num.toFixed(precision)
        }
        return num.toString()
      }
      const parts = num.toString().split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts[0]
    },
    labelPadding: 20,
    // labelRotate: 0
  }
}
DEFAULT_X_Y_AUX_PARAMS.xAxis.labelTextFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const absNum = Math.abs(num)
  if (absNum > 0 && absNum < 1) {
    const strNum = num.toString()
    const match = strNum.match(/0\.(0*)([1-9])/)
    if (match) {
        const precision = match[1].length + 1
        return num.toFixed(precision)
    }
    return num.toString()
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts[0]
}`
DEFAULT_X_Y_AUX_PARAMS.yAxis.labelTextFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const absNum = Math.abs(num)
  if (absNum > 0 && absNum < 1) {
    const strNum = num.toString()
    const match = strNum.match(/0\.(0*)([1-9])/)
    if (match) {
        const precision = match[1].length + 1
        return num.toFixed(precision)
    }
    return num.toString()
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts[0]
}`


export const DEFAULT_X_Y_AXES_PARAMS: XYAxesParams = {
  xAxis: {
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
    tickTextColorType: 'primary'
  },
  yAxis: {
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
    tickTextColorType: 'primary'
  }
}
DEFAULT_X_Y_AXES_PARAMS.xAxis.tickFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}`
DEFAULT_X_Y_AXES_PARAMS.yAxis.tickFormat.toString = () => `num => {
  if (num === null || Number.isNaN(num) == true) {
    return num || 0
  }
  const parts = num.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}`

export const DEFAULT_X_ZOOM_PARAMS: XZoomParams = {

}