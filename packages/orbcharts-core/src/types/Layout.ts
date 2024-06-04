import type { Padding } from './Padding'

export interface Layout extends Padding {
  width: number
  height: number
  // top: number
  // right: number
  // bottom: number
  // left: number
  rootWidth: number
  rootHeight: number
}