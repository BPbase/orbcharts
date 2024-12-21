import type { Padding } from './Padding'

export interface ChartParams {
  padding: Padding,
  highlightTarget: HighlightTarget
  highlightDefault: string | null
  colorScheme: 'dark' | 'light'
  colors: {
    light: ColorScheme
    dark: ColorScheme
  }
  styles: Styles
  transitionDuration: number
  transitionEase: string
  // [key: string]: any
}

export type ChartParamsPartial = Partial<ChartParams | {
  padding: Partial<Padding>,
  colors: Partial<{
    light: Partial<ColorScheme>
    dark: Partial<ColorScheme>
  }>
  styles: Partial<Styles>
}>

export type HighlightTarget = 'series' | 'group' | 'category' | 'datum' | 'none'

export interface Styles {
  textSize: string | number
  unhighlightedOpacity: number
}

export interface ColorScheme {
  label: string[]
  primary: string
  secondary: string
  white: string
  background: string
}

export type ColorType = 'none' | keyof ColorScheme
