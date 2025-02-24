import type { PresetPartial } from '../../lib/core-types'
import type { PresetMultiValuePluginParams, PresetNoneDataPluginParams } from '../types'

export const PRESET_SCATTER_SEPARATE_CATEGORY: PresetPartial<'multiValue', Partial<PresetMultiValuePluginParams>
& Partial<PresetNoneDataPluginParams>> = {
  name: 'PRESET_SCATTER_SEPARATE_CATEGORY',
  description: 'Scatter with separate category',
  descriptionZh: '分開顯示category的散布圖',
  chartParams: {
    colors: {
      light: {
        label:[
          "#16B59B",
          "#0088FF",
          "#FF3232",
          "#8E6BC9",
          "#904026",
          "#E23D93",
          "#F38428",
          "#6BDC51",
          "#C50669",
          "#4B25B3"
        ],
      },
      dark: {
        label: [
          "#7DD3C4",
          "#4BABFF",
          "#FF6C6C",
          "#AA93D2",
          "#D58C75",
          "#FF8DC8",
          "#F9B052",
          "#ACE1A0",
          "#F35CAA",
          "#6F3BD5"
        ]
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
  pluginParams: {
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
