import type {
  ForceDirectedParams,
  ForceDirectedBubblesParams,
  RelationshipLegendParams,
  RelationshipTooltipParams
} from '../../lib/plugins-basic-types'


export const DEFAULT_FORCE_DIRECTED_PARAMS: ForceDirectedParams = {
  // node: {
  //   dotRadius: 10,
  //   dotFillColorType: 'label',
  //   dotStrokeColorType: 'label',
  //   dotStrokeWidth: 1,
  //   dotStyleFn: (node) => '',
  //   labelColorType: 'primary',
  //   labelSizeFixed: false,
  //   labelStyleFn: (node) => 'text-shadow:0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff'
  // },
  // edge: {
  //   arrowColorType: 'primary',
  //   arrowStrokeWidth: 1.5,
  //   arrowWidth: 5,
  //   arrowHeight: 5,
  //   arrowStyleFn: (node) => '',
  //   labelColorType: 'secondary',
  //   labelSizeFixed: false,
  //   labelStyleFn: (node) => ''
  // },
  dot: {
    radius: 10,
    fillColorType: 'label',
    strokeColorType: 'label',
    strokeWidth: 1,
    styleFn: (node) => '',
  },
  dotLabel: {
    colorType: 'primary',
    sizeFixed: false,
    styleFn: (node) => 'text-shadow:0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff'
  },
  arrow: {
    colorType: 'primary',
    strokeWidth: 1.5,
    pointerWidth: 5,
    pointerHeight: 5,
    styleFn: (node) => '',
  },
  arrowLabel: {
    colorType: 'primary',
    sizeFixed: false,
    styleFn: (node) => ''
  },
  force: {
    nodeStrength: -500, // 泡泡引力
    linkDistance: 100, // 連結長度
    velocityDecay: 0.1, // 衰減數
    alphaDecay: 0.05
    // collisionSpacing: 2 // 泡泡間距
  },
  zoomable: true,
  transform: {
    x: 0,
    y: 0,
    k: 1
  },
  scaleExtent: {
    min: 0,
    max: Infinity
  }
}
DEFAULT_FORCE_DIRECTED_PARAMS.dot.styleFn.toString = () => `(node) => ''`
DEFAULT_FORCE_DIRECTED_PARAMS.dotLabel.styleFn.toString = () => `(node) => 'text-shadow:0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff'`
DEFAULT_FORCE_DIRECTED_PARAMS.arrow.styleFn.toString = () => `(edge) => ''`
DEFAULT_FORCE_DIRECTED_PARAMS.arrowLabel.styleFn.toString = () => `(edge) => ''`

export const DEFAULT_FORCE_DIRECTED_BUBBLES_PARAMS: ForceDirectedBubblesParams = {
  bubble: {
    radiusMin: 15,
    radiusMax: 45,
    arcScaleType: 'area',
    fillColorType: 'label',
    strokeColorType: 'label',
    strokeWidth: 1,
    styleFn: (node) => '',
  },
  bubbleLabel: {
    fillRate: 0.9,
    lineHeight: 1,
    maxLineLength: 6,
    wordBreakAll: true,
    colorType: 'primary',
    styleFn: (node) => ''
  },
  arrow: {
    colorType: 'primary',
    strokeWidthMin: 1.5,
    strokeWidthMax: 4.5,
    pointerWidth: 5,
    pointerHeight: 5,
    styleFn: (node) => '',
  },
  arrowLabel: {
    colorType: 'primary',
    sizeFixed: false,
    styleFn: (node) => ''
  },
  force: {
    nodeStrength: -500, // 泡泡引力
    linkDistance: 130, // 連結長度
    velocityDecay: 0.1, // 衰減數
    alphaDecay: 0.05
    // collisionSpacing: 2 // 泡泡間距
  },
  zoomable: true,
  transform: {
    x: 0,
    y: 0,
    k: 1
  },
  scaleExtent: {
    min: 0,
    max: Infinity
  }
}
DEFAULT_FORCE_DIRECTED_BUBBLES_PARAMS.bubble.styleFn.toString = () => `(node) => ''`
DEFAULT_FORCE_DIRECTED_BUBBLES_PARAMS.bubbleLabel.styleFn.toString = () => `(node) => ''`
DEFAULT_FORCE_DIRECTED_BUBBLES_PARAMS.arrow.styleFn.toString = () => `(edge) => ''`
DEFAULT_FORCE_DIRECTED_BUBBLES_PARAMS.arrowLabel.styleFn.toString = () => `(edge) => ''`


export const DEFAULT_RELATIONSHIP_LEGEND_PARAMS: RelationshipLegendParams = {
  placement: 'right-end',
  padding: 28,
  backgroundFill: 'none',
  backgroundStroke: 'none',
  gap: 10,
  listRectWidth: 14,
  listRectHeight: 14,
  listRectRadius: 0,
  textColorType: 'primary'
}

export const DEFAULT_RELATIONSHIP_TOOLTIP_PARAMS: RelationshipTooltipParams = {
  backgroundColorType: 'background',
  strokeColorType: 'primary',
  backgroundOpacity: 0.8,
  textColorType: 'primary',
  offset: [20, 5],
  padding: 10,
  renderFn: (eventData, { styles, utils }) => {
    const hasCategoryLabel = eventData.categoryLabel ? true : false
    const hasDatumLabel = eventData.datum.label ? true : false
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
    const categoryLabelTextWidth = hasCategoryLabel
      ? utils.measureTextWidth(`${eventData.categoryLabel}${eventData.datum.value}`, styles.textSizePx) + styles.textSizePx * 1.5
      : 0
    const datumLabelTextWidth = hasDatumLabel
      ? utils.measureTextWidth(`${eventData.datum.label}${eventData.datum.value}`, styles.textSizePx)
      : 0
    const maxTextWidth = Math.max(categoryLabelTextWidth, datumLabelTextWidth)
    const lineEndX = hasDatumLabel
      ? maxTextWidth + styles.textSizePx * 0.5
      : 0
    const valueTextAnchor = hasDatumLabel ? 'end' : 'start'
    const datumSvg = `<text font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
    ${datumLabelSvg}<tspan font-weight="bold" text-anchor="${valueTextAnchor}" x="${lineEndX}">${eventData.datum.value}</tspan>
  </text>`

    return `${categorySvg}
  <g ${hasCategoryLabel ? `transform="translate(0, ${styles.textSizePx * 2})"` : ''}>
    ${datumSvg}
  </g>`
  },
}
DEFAULT_RELATIONSHIP_TOOLTIP_PARAMS.renderFn.toString = () => `(eventData, { styles, utils }) => {
  const hasCategoryLabel = eventData.categoryLabel ? true : false
    const hasDatumLabel = eventData.datum.label ? true : false
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
    const categoryLabelTextWidth = hasCategoryLabel
      ? utils.measureTextWidth(\`\${eventData.categoryLabel}\${eventData.datum.value}\`, styles.textSizePx) + styles.textSizePx * 1.5
      : 0
    const datumLabelTextWidth = hasDatumLabel
      ? utils.measureTextWidth(\`\${eventData.datum.label}\${eventData.datum.value}\`, styles.textSizePx)
      : 0
    const maxTextWidth = Math.max(categoryLabelTextWidth, datumLabelTextWidth)
    const lineEndX = hasDatumLabel
      ? maxTextWidth + styles.textSizePx * 0.5
      : 0
    const valueTextAnchor = hasDatumLabel ? 'end' : 'start'
    const datumSvg = \`<text font-size="\${styles.textSizePx}" dominant-baseline="hanging" fill="\${styles.textColor}">
    \${datumLabelSvg}<tspan font-weight="bold" text-anchor="\${valueTextAnchor}" x="\${lineEndX}">\${eventData.datum.value}</tspan>
  </text>\`

    return \`\${categorySvg}
  <g \${hasCategoryLabel ? \`transform="translate(0, \${styles.textSizePx * 2})"\` : ''}>
    \${datumSvg}
  </g>\`
}`