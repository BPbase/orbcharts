import type {
  ForceDirectedParams,
  RelationshipLegendParams,
  RelationshipTooltipParams
} from '../../lib/plugins-basic-types'


export const DEFAULT_FORCE_DIRECTED_PARAMS: ForceDirectedParams = {
  node: {
    dotRadius: 10,
    dotFillColorType: 'label',
    dotStrokeColorType: 'label',
    dotStrokeWidth: 1,
    dotStyleFn: (node) => '',
    labelColorType: 'primary',
    labelSizeFixed: false,
    labelStyleFn: (node) => 'text-shadow:0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff'
  },
  edge: {
    arrowColorType: 'primary',
    arrowStrokeWidth: 1.5,
    arrowWidth: 5,
    arrowHeight: 5,
    arrowStyleFn: (node) => '',
    labelColorType: 'secondary',
    labelSizeFixed: false,
    labelStyleFn: (node) => ''
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
    const datumSvg = `<text font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
    ${datumLabelSvg}<tspan font-weight="bold">${eventData.datum.value}</tspan>
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
  const datumSvg = \`<text font-size="\${styles.textSizePx}" dominant-baseline="hanging" fill="\${styles.textColor}">
  \${datumLabelSvg}<tspan font-weight="bold">\${eventData.datum.value}</tspan>
</text>\`

  return \`\${categorySvg}
<g \${hasCategoryLabel ? \`transform="translate(0, \${styles.textSizePx * 2})"\` : ''}>
  \${datumSvg}
</g>\`
}`