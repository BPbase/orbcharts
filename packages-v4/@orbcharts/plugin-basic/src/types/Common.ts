


export type ArcScaleType = 'area' | 'radius'

export type Placement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

export interface ContainerSize {
  width: number
  height: number
}

export interface TransformData {
  translate: [number, number]
  scale: [number, number]
  rotate: number
  rotateX: number
  rotateY: number
  value: string
}