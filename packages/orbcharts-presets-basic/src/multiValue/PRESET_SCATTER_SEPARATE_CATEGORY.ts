import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_SCATTER_SEPARATE_CATEGORY: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_SCATTER_SEPARATE_CATEGORY',
  description: 'Scatter with Separate Category',
  descriptionZh: '分開顯示category的散布圖',
  chartParams: {
    colors: {
      light: {
        label:  [
          "#16B59B",
          "#0088FF",
          "#FF3232",
          "#8E6BC9",
          "#904026",
          "#D117EA",
          "#F38428",
          "#6BDC51",
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
  },
  dataFormatter: {
    separateCategory: true
  },
  allPluginParams: {
    XYAxes: {
      xAxis: {
        ticks: 3,
      },
      yAxis: {
        ticks: 3,
      }
    },
    MultiValueLegend: {
      placement: 'bottom',
      padding: 14,
      listRectRadius: 7 // 圓型圖例列點
    }
  }
}
