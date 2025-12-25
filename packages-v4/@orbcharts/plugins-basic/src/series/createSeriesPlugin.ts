import { createPlugin } from '../../../core/src/plugin/createPlugin'
import { PluginEntity } from '../../../core/src/types'
import type { SeriesExtendContext, SeriesPluginParams, SeriesAllLayerParams } from './types'
import { Pie } from './layers/Pie'

export function createSeriesPlugin (): PluginEntity<SeriesPluginParams, SeriesAllLayerParams> {
  const pie = new Pie()

  return createPlugin<SeriesExtendContext, SeriesPluginParams, SeriesAllLayerParams>({
    name: 'series',
    defaultParams: {},
    // validator: (params: PluginParams) => { valid: boolean; errors?: string[] },
    layers: [pie],
    setup: (props) => {
      props.context
      return () => {

      }
    }
  })
}