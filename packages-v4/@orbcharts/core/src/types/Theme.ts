
export interface Colors {
  data: string[],
  primary: string,
  secondary: string,
  dataContrast: string[],
  background: string
}

export type ColorScheme = 'light' | 'dark'

export interface Theme {
  colorScheme: ColorScheme | 'auto'
  colors: {
    light: Colors,
    dark: Colors
  },
  fontSize: string | number
}

export type ColorType = 'none' | keyof Colors