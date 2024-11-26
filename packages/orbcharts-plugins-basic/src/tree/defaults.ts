import type { TreeMapParams, TreeLegendParams, TreeTooltipParams } from '../../lib/plugins-basic-types'

export const DEFAULT_TREE_MAP_PARAMS: TreeMapParams = {
  paddingInner: 2,
  paddingOuter: 2,
  labelColorType: 'primary',
  squarifyRatio: 1.618034, // 黃金比例
  sort: (a, b) => b.value - a.value
}
DEFAULT_TREE_MAP_PARAMS.sort.toString = () => `(a, b) => b.value - a.value`

export const DEFAULT_TREE_LEGEND_PARAMS: TreeLegendParams = {
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
  textColorType: 'primary'
}

export const DEFAULT_TREE_TOOLTIP_PARAMS: TreeTooltipParams = {
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
DEFAULT_TREE_TOOLTIP_PARAMS.renderFn.toString = () => `(eventData, { styles }) => {
    return \`<g>
  <rect width="\${styles.textSizePx}" height="\${styles.textSizePx}" rx="\${styles.textSizePx / 2}" fill="\${eventData.datum.color}></rect>
  <text x="\${styles.textSizePx * 1.5}" font-size="\${styles.textSizePx}" fill="\${styles.textColor}">\${eventData.datum.label}</text>
</g>\`
}`