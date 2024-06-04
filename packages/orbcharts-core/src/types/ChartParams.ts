import type { Padding } from './Padding'


export interface ChartParams {
  padding: Padding,
  // colors: string[],
  highlightTarget: HighlightTarget
  // highlightDefault: HighlightDefault
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

export type ChartParamsPartial = {
  padding?: Partial<Padding>,
  colors?: {
    light?: Partial<ColorScheme>
    dark?: Partial<ColorScheme>
  }
  styles?: Partial<Styles>
}

// export interface HighlightDefault {
//   id: string | null
//   label: string | null
// }

export type HighlightTarget = 'series' | 'group' | 'datum' | 'none'

export interface Styles {
  textSize: number
  unhighlightedOpacity: number
}

export interface ColorScheme {
  series: string[]
  primary: string
  secondary: string
  white: string
  background: string
}

export type ColorType = keyof ColorScheme
