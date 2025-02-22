import type { TreeMapParams, TreeLegendParams, TreeTooltipParams } from '../../lib/plugins-basic-types'

export const DEFAULT_TREE_MAP_PARAMS: TreeMapParams = {
  paddingInner: 2,
  paddingOuter: 2,
  labelColorType: 'labelContrast',
  squarifyRatio: 1.618034, // 黃金比例
  sort: (a, b) => b.value - a.value
}
DEFAULT_TREE_MAP_PARAMS.sort.toString = () => `(a, b) => b.value - a.value`

export const DEFAULT_TREE_LEGEND_PARAMS: TreeLegendParams = {
  // position: 'right',
  // justify: 'end',
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

export const DEFAULT_TREE_TOOLTIP_PARAMS: TreeTooltipParams = {
  backgroundColorType: 'background',
  strokeColorType: 'primary',
  backgroundOpacity: 0.8,
  textColorType: 'primary',
  offset: [20, 5],
  padding: 10,
  renderFn: (eventData, { styles, utils }) => {
    const hasCategoryLabel = eventData.categoryLabel ? true : false
    const hasDatumLabel = eventData.datum.label ? true : false
    const valueText = utils.toCurrency(eventData.datum.value)
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
      ? utils.measureTextWidth(`${eventData.categoryLabel}${valueText}`, styles.textSizePx) + styles.textSizePx * 1.5
      : 0
    const datumLabelTextWidth = hasDatumLabel
      ? utils.measureTextWidth(`${eventData.datum.label}${valueText}`, styles.textSizePx)
      : 0
    const maxTextWidth = Math.max(categoryLabelTextWidth, datumLabelTextWidth)
    const lineEndX = hasDatumLabel
      ? maxTextWidth + styles.textSizePx * 0.5
      : 0
    const valueTextAnchor = hasDatumLabel ? 'end' : 'start'
    const datumSvg = `<text font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
    ${datumLabelSvg}<tspan font-weight="bold" text-anchor="${valueTextAnchor}" x="${lineEndX}">${valueText}</tspan>
  </text>`

    return `${categorySvg}
  <g ${hasCategoryLabel ? `transform="translate(0, ${styles.textSizePx * 2})"` : ''}>
    ${datumSvg}
  </g>`
  },
}
DEFAULT_TREE_TOOLTIP_PARAMS.renderFn.toString = () => `(eventData, { styles, utils }) => {
  const hasCategoryLabel = eventData.categoryLabel ? true : false
  const hasDatumLabel = eventData.datum.label ? true : false
  const valueText = utils.toCurrency(eventData.datum.value)
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
    ? utils.measureTextWidth(\`\${eventData.categoryLabel}\${valueText}\`, styles.textSizePx) + styles.textSizePx * 1.5
    : 0
  const datumLabelTextWidth = hasDatumLabel
    ? utils.measureTextWidth(\`\${eventData.datum.label}\${valueText}\`, styles.textSizePx)
    : 0
  const maxTextWidth = Math.max(categoryLabelTextWidth, datumLabelTextWidth)
  const lineEndX = hasDatumLabel
    ? maxTextWidth + styles.textSizePx * 0.5
    : 0
  const valueTextAnchor = hasDatumLabel ? 'end' : 'start'
  const datumSvg = \`<text font-size="\${styles.textSizePx}" dominant-baseline="hanging" fill="\${styles.textColor}">
  \${datumLabelSvg}<tspan font-weight="bold" text-anchor="\${valueTextAnchor}" x="\${lineEndX}">\${valueText}</tspan>
</text>\`

  return \`\${categorySvg}
<g \${hasCategoryLabel ? \`transform="translate(0, \${styles.textSizePx * 2})"\` : ''}>
  \${datumSvg}
</g>\`
}`