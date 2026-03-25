import type { ModelType, ModelDatum } from '../../../core/src/types'
// import type { ComputedDatum } from './ComputedData'

export type AxisPosition = 'top' | 'bottom' | 'left' | 'right'

export interface XYAxis {
    scaleDomain: [number | 'min' | 'auto', number | 'max' | 'auto'];
    scaleRange: [number, number];
    label: string;
    // valueIndex: number;
}
export interface ValueAxis {
    position: AxisPosition;
    scaleDomain: [number | 'min' | 'auto', number | 'max' | 'auto'];
    scaleRange: [number, number];
    label: string;
}
export interface CategoryAxis {
    position: AxisPosition;
    scaleDomain: [number, number | 'max'];
    scalePadding: number;
    label: string;
}

export type VisibleFilter<T extends ModelType> = (datum: ModelDatum<T>) => boolean | null;

export interface Container {
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

export type HighlightTarget = 'series' | 'category' | 'datum' | 'none'

export interface GraphicStyles {
  padding: Padding,
  highlightTarget: HighlightTarget
  highlightDefault: string | null
  unhighlightedOpacity: number
  transitionDuration: number
  transitionEase: string
}

