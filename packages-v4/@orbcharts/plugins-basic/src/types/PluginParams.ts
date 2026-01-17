
export type AxisPosition = 'top' | 'bottom' | 'left' | 'right'

export interface GraphicContainer {
  // gap: number
  columnAmount: number
  rowAmount: number
  columnGap: number | 'auto'
  rowGap: number | 'auto'
}

export interface ContainerPosition {
  slotIndex: number
  rowIndex: number
  columnIndex: number
  // translate: [number, number]
  startX: number
  startY: number
  centerX: number
  centerY: number
  width: number
  height: number
}

// container - 有縮放的
export interface ContainerPositionScaled {
  slotIndex: number
  rowIndex: number
  columnIndex: number
  translate: [number, number]
  scale: [number, number]
}

export interface Padding {
  top: number
  right: number
  bottom: number
  left: number
}

export interface Layout extends Padding {
  width: number;
  height: number;
  rootWidth: number;
  rootHeight: number;
}

export type HighlightTarget = 'series' | 'group' | 'category' | 'datum' | 'none'

export interface GraphicStyles {
  padding: Padding,
  highlightTarget: HighlightTarget
  highlightDefault: string | null
  unhighlightedOpacity: number
  transitionDuration: number
  transitionEase: string
}