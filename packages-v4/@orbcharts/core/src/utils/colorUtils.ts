import type { Theme } from '../types'

/**
 * 根據索引和主題計算對應的顏色
 * @param index 索引值
 * @param theme 主題設定
 * @returns 對應的顏色（hex 格式）
 */
export function getColorByIndex(index: number, theme: Theme): string {
  // 根據 colorScheme 決定使用哪個色彩方案
  let colorScheme: 'light' | 'dark'
  if (theme.colorScheme === 'auto') {
    // 可以根據系統設定或其他邏輯來決定，這裡預設使用 light
    colorScheme = 'light'
  } else {
    colorScheme = theme.colorScheme
  }

  const dataColors = theme.colors[colorScheme].data
  
  // 使用模運算來循環使用色票
  const colorIndex = index % dataColors.length
  return dataColors[colorIndex]
}

/**
 * 根據不同的 encoding.color.from 計算顏色
 * @param colorFrom 顏色來源類型
 * @param options 包含所有可能索引的選項物件
 * @param theme 主題設定
 * @returns 對應的顏色（hex 格式）
 */
export function getColorByFrom(
  colorFrom: 'index' | 'series' | 'category' | 'dataset',
  options: {
    index?: number
    seriesIndex?: number
    categoryIndex?: number
    datasetIndex?: number
  },
  theme: Theme
): string {
  let targetIndex: number
  
  switch (colorFrom) {
    case 'index':
      targetIndex = options.index ?? 0
      break
    case 'series':
      targetIndex = options.seriesIndex ?? 0
      break
    case 'category':
      targetIndex = options.categoryIndex ?? 0
      break
    case 'dataset':
      targetIndex = options.datasetIndex ?? 0
      break
    default:
      targetIndex = 0
  }
  
  return getColorByIndex(targetIndex, theme)
}
