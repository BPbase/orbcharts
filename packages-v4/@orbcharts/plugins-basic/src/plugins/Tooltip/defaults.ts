import type { TooltipParams, TooltipPluginParams } from './types'
import type { EventData, ModelDatumMultivariate, ModelDatumSeries } from '../../../../core/src/types'

export const DEFAULT_SERIES_TOOLTIP_PLUGIN_PARAMS: TooltipPluginParams = {
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
  visibleFilter: (datum: ModelDatumSeries) => true,
  sort: null,
  datasetIndex: 0
}
DEFAULT_SERIES_TOOLTIP_PLUGIN_PARAMS.visibleFilter.toString = () => '(datum) => true'

export const DEFAULT_SERIES_TOOLTIP_PARAMS: TooltipParams = {
  backgroundColorType: 'background',
  strokeColorType: 'primary',
  backgroundOpacity: 0.8,
  textColorType: 'primary',
  offset: [20, 5],
  padding: 10,
  // renderFn: (eventData, { styles, utils }) => {
  //   const hasSeriesLabel = eventData.target.series.slice(0, 7) === 'series_' ? false : true
  //   const hasDatumLabel = eventData.target.name.slice(0, 7) === 'series_' ? false : true
  //   const valueText = utils.toCurrency(eventData.target.value)
  //   const bulletWidth = styles.textSizePx * 0.7
  //   const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
  //   const seriesSvg = hasSeriesLabel
  //     ? `<rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${offset - 1}" rx="${bulletWidth / 2}" fill="${eventData.target.color}"></rect>
  // <text x="${styles.textSizePx * 1.5}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
  //   <tspan>${eventData.target.name}</tspan>
  // </text>`
  //     : ''
  //   const datumLabelSvg = hasDatumLabel
  //     ? `<tspan>${eventData.target.name}</tspan>  `
  //     : ''
  //   const seriesLabelTextWidth = hasSeriesLabel
  //     ? utils.measureTextWidth(`${eventData.target.series}${valueText}`, styles.textSizePx) + styles.textSizePx * 1.5
  //     : 0
  //   const datumLabelTextWidth = hasDatumLabel
  //     ? utils.measureTextWidth(`${eventData.target.name}${valueText}`, styles.textSizePx)
  //     : 0
  //   const maxTextWidth = Math.max(seriesLabelTextWidth, datumLabelTextWidth)
  //   const lineEndX = hasDatumLabel
  //     ? maxTextWidth + styles.textSizePx * 1.5
  //     : 0
  //   const valueTextAnchor = hasDatumLabel ? 'end' : 'start'
  //   const datumSvg = `<text font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
  //   ${datumLabelSvg}<tspan font-weight="bold" text-anchor="${valueTextAnchor}" x="${lineEndX}">${valueText}</tspan>
  // </text>`

  //   return `${seriesSvg}
  // <g ${hasSeriesLabel ? `transform="translate(0, ${styles.textSizePx * 2})"` : ''}>
  //   ${datumSvg}
  // </g>`
  // },
  renderFn: (eventData, { styles, utils, categoryData }) => {
    function renderSeriesData () {
      const hasSeriesLabel = eventData.target.series.slice(0, 7) === 'series_' ? false : true
      const hasDatumLabel = eventData.target.name.slice(0, 7) === 'series_' ? false : true
      const valueText = utils.toCurrency(eventData.target.value)
      const bulletWidth = styles.textSizePx * 0.7
      const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
      const seriesSvg = hasSeriesLabel
        ? `<rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${offset - 1}" rx="${bulletWidth / 2}" fill="${eventData.target.color}"></rect>
  <text x="${styles.textSizePx * 1.5}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
    <tspan>${eventData.target.name}</tspan>
  </text>`
        : ''
      const datumLabelSvg = hasDatumLabel
        ? `<tspan>${eventData.target.name}</tspan>  `
        : ''
      const seriesLabelTextWidth = hasSeriesLabel
        ? utils.measureTextWidth(`${eventData.target.series}${valueText}`, styles.textSizePx) + styles.textSizePx * 1.5
        : 0
      const datumLabelTextWidth = hasDatumLabel
        ? utils.measureTextWidth(`${eventData.target.name}${valueText}`, styles.textSizePx)
        : 0
      const maxTextWidth = Math.max(seriesLabelTextWidth, datumLabelTextWidth)
      const lineEndX = hasDatumLabel
        ? maxTextWidth + styles.textSizePx * 1.5
        : 0
      const valueTextAnchor = hasDatumLabel ? 'end' : 'start'
      const datumSvg = `<text font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
  ${datumLabelSvg}<tspan font-weight="bold" text-anchor="${valueTextAnchor}" x="${lineEndX}">${valueText}</tspan>
</text>`

      return `${seriesSvg}
<g ${hasSeriesLabel ? `transform="translate(0, ${styles.textSizePx * 2})"` : ''}>
  ${datumSvg}
</g>`
    }
    function renderGridData () {
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
    function renderMultivariateData () {
      const hasCategoryLabel = eventData.target.category === '' ? false : true
      const hasDatumLabel = eventData == null || eventData.target.name.slice(0, 11) === 'multiValue_' ? false : true
      const bulletWidth = styles.textSizePx * 0.7
      const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
      const categorySvg = hasCategoryLabel
        ? `<rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${offset - 1}" rx="${bulletWidth / 2}" fill="${eventData.target.color}"></rect>
<text x="${styles.textSizePx * 1.5}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
  <tspan>${eventData.target.category}</tspan>
</text>`
        : ''

      const datumLabelSvg = hasDatumLabel
        ? `<text font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
  <tspan>${eventData.target.name}</tspan>
</text>`
        : ''

      const maxTextWidth = (() => {
        const categoryLabelTextWidth = utils.measureTextWidth(eventData.target.category, styles.textSizePx)
        const datumLabelTextWidth = hasDatumLabel ? utils.measureTextWidth(eventData.target.name, styles.textSizePx) : 0
        const valueDetailTextWidth = (eventData.target as ModelDatumMultivariate).multivariate.reduce((acc, detail) => {
          const text = `${detail.name}${utils.toCurrency(detail.value)}`
          const _maxTextWidth = utils.measureTextWidth(text, styles.textSizePx)
          return _maxTextWidth > acc ? _maxTextWidth : acc
        }, 0)
        return Math.max(categoryLabelTextWidth, datumLabelTextWidth, valueDetailTextWidth)
      })()

      const valueDetailSvg = (eventData.target as ModelDatumMultivariate).multivariate.map((detail, i) => {
        const y = (i * styles.textSizePx * 1.5) + (datumLabelSvg ? styles.textSizePx * 2 : 0)
        const lineEndX = maxTextWidth + styles.textSizePx * 3
        return `<text x="0" y="${y}" font-weight="bold" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
  <tspan>${detail.name}</tspan>
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
    }
    function renderGraphData () {
      const hasCategoryLabel = eventData.target.category ? true : false
      const hasDatumLabel = eventData.target.name ? true : false
      const valueText = utils.toCurrency(eventData.target.value)
      const bulletWidth = styles.textSizePx * 0.7
      const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
      const categorySvg = hasCategoryLabel
        ? `<rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${offset - 1}" rx="${bulletWidth / 2}" fill="${eventData.target.color}"></rect>
<text x="${styles.textSizePx * 1.5}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
  <tspan>${eventData.target.category}</tspan>
</text>`
        : ''
      const datumLabelSvg = hasDatumLabel
        ? `<tspan>${eventData.target.name}</tspan>  `
        : ''
      const categoryLabelTextWidth = hasCategoryLabel
        ? utils.measureTextWidth(`${eventData.target.category}${valueText}`, styles.textSizePx) + styles.textSizePx * 1.5
        : 0
      const datumLabelTextWidth = hasDatumLabel
        ? utils.measureTextWidth(`${eventData.target.name}${valueText}`, styles.textSizePx)
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
    }
    function renderTreeData () {
      const hasCategoryLabel = eventData.target.category ? true : false
      const hasDatumLabel = eventData.target.name ? true : false
      const valueText = utils.toCurrency(eventData.target.value)
      const bulletWidth = styles.textSizePx * 0.7
      const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
      const categorySvg = hasCategoryLabel
        ? `<rect width="${bulletWidth}" height="${bulletWidth}" x="${offset}" y="${offset - 1}" rx="${bulletWidth / 2}" fill="${eventData.target.color}"></rect>
<text x="${styles.textSizePx * 1.5}" font-size="${styles.textSizePx}" dominant-baseline="hanging" fill="${styles.textColor}">
  <tspan>${eventData.target.category}</tspan>
</text>`
        : ''
      const datumLabelSvg = hasDatumLabel
        ? `<tspan>${eventData.target.name}</tspan>  `
        : ''
      const categoryLabelTextWidth = hasCategoryLabel
        ? utils.measureTextWidth(`${eventData.target.category}${valueText}`, styles.textSizePx) + styles.textSizePx * 1.5
        : 0
      const datumLabelTextWidth = hasDatumLabel
        ? utils.measureTextWidth(`${eventData.target.name}${valueText}`, styles.textSizePx)
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
    }
    if (eventData.target.modelType === 'series') {
      return renderSeriesData()
    } else if (eventData.target.modelType === 'grid') {
      return renderGridData()
    } else if (eventData.target.modelType === 'multivariate') {
      return renderMultivariateData()
    } else if (eventData.target.modelType === 'graph') {
      return renderGraphData()
    } else if (eventData.target.modelType === 'tree') {
      return renderTreeData()
    }
    return ''
  }
}
DEFAULT_SERIES_TOOLTIP_PARAMS.renderFn.toString = () => `(eventData, { styles, utils }) => {
  function renderSeriesData () {
    const hasSeriesLabel = eventData.target.series.slice(0, 7) === 'series_' ? false : true
    const hasDatumLabel = eventData.target.name.slice(0, 7) === 'series_' ? false : true
    const valueText = utils.toCurrency(eventData.target.value)
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
    const seriesSvg = hasSeriesLabel
      ? \`<rect width="$\{bulletWidth}" height="$\{bulletWidth}" x="$\{offset}" y="$\{offset - 1}" rx="$\{bulletWidth / 2}" fill="$\{eventData.target.color}"></rect>
<text x="$\{styles.textSizePx * 1.5}" font-size="$\{styles.textSizePx}" dominant-baseline="hanging" fill="$\{styles.textColor}">
  <tspan>$\{eventData.target.name}</tspan>
</text>\`
      : ''
    const datumLabelSvg = hasDatumLabel
      ? \`<tspan>$\{eventData.target.name}</tspan>  \`
      : ''
    const seriesLabelTextWidth = hasSeriesLabel
      ? utils.measureTextWidth(\`$\{eventData.target.series}$\{valueText}\`, styles.textSizePx) + styles.textSizePx * 1.5
      : 0
    const datumLabelTextWidth = hasDatumLabel
      ? utils.measureTextWidth(\`$\{eventData.target.name}$\{valueText}\`, styles.textSizePx)
      : 0
    const maxTextWidth = Math.max(seriesLabelTextWidth, datumLabelTextWidth)
    const lineEndX = hasDatumLabel
      ? maxTextWidth + styles.textSizePx * 1.5
      : 0
    const valueTextAnchor = hasDatumLabel ? 'end' : 'start'
    const datumSvg = \`<text font-size="$\{styles.textSizePx}" dominant-baseline="hanging" fill="$\{styles.textColor}">
  $\{datumLabelSvg}<tspan font-weight="bold" text-anchor="$\{valueTextAnchor}" x="$\{lineEndX}">$\{valueText}</tspan>
</text>\`

    return \`$\{seriesSvg}
<g $\{hasSeriesLabel ? \`transform="translate(0, $\{styles.textSizePx * 2})"\` : ''}>
  $\{datumSvg}
</g>\`
  }
  function renderGridData () \{
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)

    const titleSvg = \`<g><text dominant-baseline="hanging" font-size="$\{styles.textSizePx}" fill="$\{styles.textColor}">$\{eventData.target.category}</text></g>\`
    const categoryLabelTextWidth = utils.measureTextWidth(eventData.target.category, styles.textSizePx)
    const listTextWidth = categoryData.reduce((acc, category) => \{
      const text = \`$\{category.series}$\{utils.toCurrency(category.value)}\`
      const _maxTextWidth = utils.measureTextWidth(text, styles.textSizePx)
      return _maxTextWidth > acc ? _maxTextWidth : acc
    }, 0)
    const maxTextWidth = Math.max(categoryLabelTextWidth, listTextWidth)
    const lineEndX = maxTextWidth + styles.textSizePx * 3
    const contentSvg = categoryData
      .map((category, i) => \{
        const y = i * styles.textSizePx * 1.5
        const isHighlight = category.id === (eventData.target && eventData.target.id)
        return \`<g transform="translate(0, $\{styles.textSizePx * 2})">
  <rect width="$\{bulletWidth}" height="$\{bulletWidth}" x="$\{offset}" y="$\{y + offset}" rx="$\{bulletWidth / 2}" fill="$\{category.color}"></rect>
  <text x="$\{styles.textSizePx * 1.5}" y="$\{y}" font-size="$\{styles.textSizePx}" dominant-baseline="hanging" fill="$\{styles.textColor}">
    <tspan font-weight="$\{isHighlight ? 'bold' : ''}">$\{category.series}</tspan>
    <tspan font-weight="bold" text-anchor="end" x="$\{lineEndX}">$\{utils.toCurrency(category.value)}</tspan>
  </text>
</g>\`
      })
      .join('')
    return \`$\{titleSvg}
$\{contentSvg}\`
  }
  function renderMultivariateData () \{
    const hasCategoryLabel = eventData.target.category === '' ? false : true
    const hasDatumLabel = eventData == null || eventData.target.name.slice(0, 11) === 'multiValue_' ? false : true
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
    const categorySvg = hasCategoryLabel
      ? \`<rect width="$\{bulletWidth}" height="$\{bulletWidth}" x="$\{offset}" y="$\{offset - 1}" rx="$\{bulletWidth / 2}" fill="$\{eventData.target.color}"></rect>
<text x="$\{styles.textSizePx * 1.5}" font-size="$\{styles.textSizePx}" dominant-baseline="hanging" fill="$\{styles.textColor}">
  <tspan>$\{eventData.target.category}</tspan>
</text>\`
      : ''

    const datumLabelSvg = hasDatumLabel
      ? \`<text font-size="$\{styles.textSizePx}" dominant-baseline="hanging" fill="$\{styles.textColor}">
  <tspan>$\{eventData.target.name}</tspan>
</text>\`
      : ''

    const maxTextWidth = (() => \{
      const categoryLabelTextWidth = utils.measureTextWidth(eventData.target.category, styles.textSizePx)
      const datumLabelTextWidth = hasDatumLabel ? utils.measureTextWidth(eventData.target.name, styles.textSizePx) : 0
      const valueDetailTextWidth = (eventData.target as ModelDatumMultivariate).multivariate.reduce((acc, detail) => \{
        const text = \`$\{detail.name}$\{utils.toCurrency(detail.value)}\`
        const _maxTextWidth = utils.measureTextWidth(text, styles.textSizePx)
        return _maxTextWidth > acc ? _maxTextWidth : acc
      }, 0)
      return Math.max(categoryLabelTextWidth, datumLabelTextWidth, valueDetailTextWidth)
    })()

    const valueDetailSvg = (eventData.target as ModelDatumMultivariate).multivariate.map((detail, i) => \{
      const y = (i * styles.textSizePx * 1.5) + (datumLabelSvg ? styles.textSizePx * 2 : 0)
      const lineEndX = maxTextWidth + styles.textSizePx * 3
      return \`<text x="0" y="$\{y}" font-weight="bold" font-size="$\{styles.textSizePx}" dominant-baseline="hanging" fill="$\{styles.textColor}">
  <tspan>$\{detail.name}</tspan>
  <tspan text-anchor="end" x="$\{lineEndX}">$\{utils.toCurrency(detail.value)}</tspan>
</text>\`
    }).join('')

    const datumDetailSvg = datumLabelSvg || valueDetailSvg
      ? \`<g $\{hasCategoryLabel ? \`transform="translate(0, $\{styles.textSizePx * 2})"\` : ''}>
  $\{datumLabelSvg}
  $\{valueDetailSvg}
</g>\`
      : ''

    return \`$\{categorySvg}
$\{datumDetailSvg}\`
  }
  function renderGraphData () \{
    const hasCategoryLabel = eventData.target.category ? true : false
    const hasDatumLabel = eventData.target.name ? true : false
    const valueText = utils.toCurrency(eventData.target.value)
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
    const categorySvg = hasCategoryLabel
      ? \`<rect width="$\{bulletWidth}" height="$\{bulletWidth}" x="$\{offset}" y="$\{offset - 1}" rx="$\{bulletWidth / 2}" fill="$\{eventData.target.color}"></rect>
<text x="$\{styles.textSizePx * 1.5}" font-size="$\{styles.textSizePx}" dominant-baseline="hanging" fill="$\{styles.textColor}">
  <tspan>$\{eventData.target.category}</tspan>
</text>\`
      : ''
    const datumLabelSvg = hasDatumLabel
      ? \`<tspan>$\{eventData.target.name}</tspan>  \`
      : ''
    const categoryLabelTextWidth = hasCategoryLabel
      ? utils.measureTextWidth(\`$\{eventData.target.category}$\{valueText}\`, styles.textSizePx) + styles.textSizePx * 1.5
      : 0
    const datumLabelTextWidth = hasDatumLabel
      ? utils.measureTextWidth(\`$\{eventData.target.name}$\{valueText}\`, styles.textSizePx)
      : 0
    const maxTextWidth = Math.max(categoryLabelTextWidth, datumLabelTextWidth)
    const lineEndX = hasDatumLabel
      ? maxTextWidth + styles.textSizePx * 0.5
      : 0
    const valueTextAnchor = hasDatumLabel ? 'end' : 'start'
    const datumSvg = \`<text font-size="$\{styles.textSizePx}" dominant-baseline="hanging" fill="$\{styles.textColor}">
  $\{datumLabelSvg}<tspan font-weight="bold" text-anchor="$\{valueTextAnchor}" x="$\{lineEndX}">$\{valueText}</tspan>
</text>\`

    return \`$\{categorySvg}
<g $\{hasCategoryLabel ? \`transform="translate(0, $\{styles.textSizePx * 2})"\` : ''}>
  $\{datumSvg}
</g>\`
  }
  function renderTreeData () \{
    const hasCategoryLabel = eventData.target.category ? true : false
    const hasDatumLabel = eventData.target.name ? true : false
    const valueText = utils.toCurrency(eventData.target.value)
    const bulletWidth = styles.textSizePx * 0.7
    const offset = (styles.textSizePx / 2) - (bulletWidth / 2)
    const categorySvg = hasCategoryLabel
      ? \`<rect width="$\{bulletWidth}" height="$\{bulletWidth}" x="$\{offset}" y="$\{offset - 1}" rx="$\{bulletWidth / 2}" fill="$\{eventData.target.color}"></rect>
<text x="$\{styles.textSizePx * 1.5}" font-size="$\{styles.textSizePx}" dominant-baseline="hanging" fill="$\{styles.textColor}">
  <tspan>$\{eventData.target.category}</tspan>
</text>\`
      : ''
    const datumLabelSvg = hasDatumLabel
      ? \`<tspan>$\{eventData.target.name}</tspan>  \`
      : ''
    const categoryLabelTextWidth = hasCategoryLabel
      ? utils.measureTextWidth(\`$\{eventData.target.category}$\{valueText}\`, styles.textSizePx) + styles.textSizePx * 1.5
      : 0
    const datumLabelTextWidth = hasDatumLabel
      ? utils.measureTextWidth(\`$\{eventData.target.name}$\{valueText}\`, styles.textSizePx)
      : 0
    const maxTextWidth = Math.max(categoryLabelTextWidth, datumLabelTextWidth)
    const lineEndX = hasDatumLabel
      ? maxTextWidth + styles.textSizePx * 0.5
      : 0
    const valueTextAnchor = hasDatumLabel ? 'end' : 'start'
    const datumSvg = \`<text font-size="$\{styles.textSizePx}" dominant-baseline="hanging" fill="$\{styles.textColor}">
  $\{datumLabelSvg}<tspan font-weight="bold" text-anchor="$\{valueTextAnchor}" x="$\{lineEndX}">$\{valueText}</tspan>
</text>\`

    return \`$\{categorySvg}
<g $\{hasCategoryLabel ? \`transform="translate(0, $\{styles.textSizePx * 2})"\` : ''}>
  $\{datumSvg}
</g>\`
  }
  if (eventData.target.modelType === 'series') \{
    return renderSeriesData()
  } else if (eventData.target.modelType === 'grid') \{
    return renderGridData()
  } else if (eventData.target.modelType === 'multivariate') \{
    return renderMultivariateData()
  } else if (eventData.target.modelType === 'graph') \{
    return renderGraphData()
  } else if (eventData.target.modelType === 'tree') \{
    return renderTreeData()
  }
  return ''
}`