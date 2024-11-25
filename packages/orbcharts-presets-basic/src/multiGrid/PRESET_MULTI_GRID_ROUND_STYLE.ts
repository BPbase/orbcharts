import type { PresetPartial } from '../../lib/core-types'
import type {
  PresetMultiGridPluginParams,
  PresetNoneDataPluginParams
} from '../types'
import { ALL_PLUGIN_PARAMS_NONE_DATA } from '../params'

type PresetMultiGridRoundPluginParams = Omit<PresetMultiGridPluginParams, 'MultiBarsTriangle'>

export const PRESET_MULTI_GRID_ROUND_STYLE: PresetPartial<'multiGrid', PresetMultiGridRoundPluginParams
& PresetNoneDataPluginParams> = {
  name: 'PRESET_MULTI_GRID_ROUND_STYLE',
  description: 'MultiGrid圓弧風格',
  chartParams: {
    padding: {
      top: 60,
      right: 60,
      bottom: 120,
      left: 60
    },
    highlightTarget: 'series'
  },
  allPluginParams: {
    ...ALL_PLUGIN_PARAMS_NONE_DATA,
    MultiBars: {
      barWidth: 0,
      barPadding: 1,
      barGroupPadding: 10,
      barRadius: true,
    },
    MultiBarStack: {},
    MultiDots: {},
    MultiGridLegend: {
      // position: 'bottom',
      // justify: 'center',
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
    MultiValueStackAxis: {},
    OverlappingValueAxes: {},
    OverlappingValueStackAxes: {},
  }
}
