import type { PresetPartial } from '../../lib/core-types'
import type {
  PresetMultiGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'

type PresetMultiGridRoundPluginParams = Omit<PresetMultiGridPluginParams, 'MultiBarsTriangle'>

export const PRESET_MULTI_GRID_ROUND_STYLE: PresetPartial<'multiGrid', Partial<PresetMultiGridRoundPluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_MULTI_GRID_ROUND_STYLE',
  description: 'MultiGrid with round style',
  descriptionZh: 'MultiGrid圓弧風格',
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
      bottom: 100,
      left: 80
    },
    highlightTarget: 'series'
  },
  pluginParams: {
    MultiBars: {
      barWidth: 0,
      barPadding: 1,
      barGroupPadding: 10,
      barRadius: true,
    },
    MultiStackedBars: {},
    MultiDots: {},
    MultiGridLegend: {
      placement: 'bottom',
      padding: 14,
      gridList: [
        {
          listRectRadius: 7,
        },
        {
          listRectHeight: 2,
        }
      ]
    },
    MultiGroupAxis: {},
    MultiLineAreas: {},
    MultiLines: {
      lineCurve: 'curveMonotoneX',
      lineWidth: 3
    },
    MultiValueAxis: {},
    MultiStackedValueAxis: {},
    OverlappingValueAxes: {},
    OverlappingStackedValueAxes: {},
  }
}
