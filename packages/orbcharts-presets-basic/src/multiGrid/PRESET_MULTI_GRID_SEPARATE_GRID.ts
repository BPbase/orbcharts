import type { PresetPartial } from '../../lib/core-types'
import type { 
  PresetMultiGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

export const PRESET_MULTI_GRID_SEPARATE_GRID: PresetPartial<'multiGrid', Partial<PresetMultiGridPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_MULTI_GRID_SEPARATE_GRID',
  description: '2 groups of Grid chart',
  descriptionZh: '2組Grid圖表',
  chartParams: {
    colors: {
      light: {
        label:  [
          "#4BABFF",
          "#94D6CB",
          "#F9B052",
          "#8454D4",
          "#D58C75",
          "#42C724",
          "#FF8B8B",
          "#904026",
          "#C50669",
          "#4B25B3"
        ],
      }
    },
    padding: {
      top: 40,
      right: 40,
      bottom: 140,
      left: 80
    },
  },
  dataFormatter: {
    separateGrid: true,
  },
  pluginParams: {
    MultiGroupAxis: {
      tickTextRotate: -30,
      gridIndexes: 'all'
    },
    MultiValueAxis: {
      gridIndexes: 'all'
    },
    MultiStackedValueAxis: {
      gridIndexes: 'all'
    },
    MultiBars: {
      gridIndexes: 'all'
    },
    MultiStackedBars: {
      gridIndexes: 'all'
    },
    MultiBarsTriangle: {
      gridIndexes: 'all'
    },
    MultiLines: {
      gridIndexes: 'all'
    },
    MultiLineAreas: {
      gridIndexes: 'all'
    },
    MultiDots: {
      gridIndexes: 'all'
    },
    MultiGridLegend: {
      placement: 'bottom',
      padding: 14,
    }
  }
}
