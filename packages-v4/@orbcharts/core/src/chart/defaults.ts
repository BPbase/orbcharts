import type { Encoding, Theme, SizeConfig } from '../types'

// export const DEFAULT_CHART_WIDTH = 800

// export const DEFAULT_CHART_HEIGHT = 500

export const DEFAULT_SIZE_CONFIG: SizeConfig = {
  width: 'auto',
  height: 'auto',
  resizeDebounce: 50
}

export const DEFAULT_DATA_ENCODING: Encoding = {
  dataset: {
    from: 'dataset',
    sort: 'original'
  },
  series: {
    from: 'series',
    sort: 'original'
  },
  category: {
    from: 'category',
    sort: 'original'
  },
  value: {
    from: 'value',
    sort: 'original',
    aggregate: 'none'
  },
  multivariate: [
    { from: 'x', name: 'x' },
    { from: 'y', name: 'y' },
    { from: 'z', name: 'z' },
  ],
  color: {
    from: 'series',
  }
}

export const DEFAULT_THEME: Theme = {
  // colorScheme: 'light',
  // colors: {
  //   light: {
  //     data: ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262FD', '#78D3F8', '#9661BC', '#F6903D', '#008685', '#F08BB4'],
  //     primary: '#000000',
  //     secondary: '#595959',
  //     dataContrast: ['#FF4D4F', '#FAAD14', '#52C41A', '#1890FF', '#722ED1', '#EB2F96', '#13C2C2', '#FA541C', '#2F54EB', '#A0D911'],
  //     background: '#FFFFFF'
  //   },
  //   dark: {
  //     data: ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262FD', '#78D3F8', '#9661BC', '#F6903D', '#008685', '#F08BB4'],
  //     primary: '#FFFFFF',
  //     secondary: '#BFBFBF',
  //     dataContrast: ['#FF4D4F', '#FAAD14', '#52C41A', '#1890FF', '#722ED1', '#EB2F96', '#13C2C2', '#FA541C', '#2F54EB', '#A0D911'],
  //     background: '#1F1F1F'
  //   }
  // },
  // fontSize: '12px'
  colorScheme: 'light',
  colors: {
    light: {
      data: [
        // "#0088FF",
        // "#FF3232",
        // "#38BEA8",
        // "#6F3BD5",
        // "#314285",
        // "#42C724",
        // "#D52580",
        // "#F4721B",
        // "#D117EA",
        // "#7E7D7D"
        '#4E79A7', // blue
        '#F28E2B', // orange
        '#E15759', // red
        '#76B7B2', // teal
        '#59A14F', // green
        '#EDC948', // yellow (已調過不刺眼)
        '#B07AA1', // purple
        '#FF9DA7', // pink
        '#9C755F', // brown
        '#BAB0AC', // gray
      ],
      primary: '#000000',
      secondary: '#e0e0e0',
      dataContrast: ['#ffffff', '#000000'],
      background: '#FFFFFF'
    },
    dark: {
      data: [
        // "#4BABFF",
        // "#FF6C6C",
        // "#7DD3C4",
        // "#8E6BC9",
        // "#5366AC",
        // "#86DC72",
        // "#FF72BB",
        // "#F9B052",
        // "#EF76FF",
        // "#C4C4C4"
        '#7EA6E0', // blue (亮化)
        '#FFB86B', // orange
        '#FF7A7A', // red
        '#6ED0CC', // teal
        '#7ED97A', // green
        '#FFE06E', // yellow
        '#D4A5D8', // purple
        '#FFB3BA', // pink
        '#C89F7A', // brown
        '#D3D3D3', // gray
      ],
      primary: '#FFFFFF',
      secondary: '#e0e0e0',
      dataContrast: ['#ffffff', '#000000'],
      background: '#000000'
    }
  },
  fontSize: '0.875rem'
}