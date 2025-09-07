
export interface ThemeColorScheme {
  data: string[],
  primary: string,
  secondary: string,
  dataContrast: string[],
  background: string
}

export interface Theme {
  colorScheme: 'light' | 'dark' | 'auto'
  colors: {
    light: ThemeColorScheme,
    dark: ThemeColorScheme
  },
  fontSize: string | number
}

export type ColorType = 'none' | keyof ThemeColorScheme