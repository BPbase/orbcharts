import type { ChartContext, PluginEntity, DeepPartial, DefinePluginConfig } from '../../../core/src/types'
import type { SeriesExtendContext, SeriesPluginParams, SeriesAllLayerParams } from './types'
import { createSeriesPlugin } from './createSeriesPlugin'

export class SeriesPlugin implements PluginEntity<SeriesPluginParams, SeriesAllLayerParams> {
  name: string
  // layer visibility controls
  show: (names: (keyof SeriesAllLayerParams) | (keyof SeriesAllLayerParams)[]) => void
  showOnly: (names: (keyof SeriesAllLayerParams) | (keyof SeriesAllLayerParams)[]) => void
  showAll: () => void
  hide: (names: (keyof SeriesAllLayerParams) | (keyof SeriesAllLayerParams)[]) => void
  hideAll: () => void
  toggle: (names: (keyof SeriesAllLayerParams) | (keyof SeriesAllLayerParams)[]) => void
  updateParams: (patch: DeepPartial<SeriesPluginParams | SeriesAllLayerParams>) => void // deep-merge with previous
  forceReplaceParams: (full: SeriesPluginParams | SeriesAllLayerParams) => void // replace（特殊需求，可節省效能）
  getParams: () => Readonly<SeriesPluginParams | SeriesAllLayerParams>
  injectContext: (context: ChartContext<{}>) => void
  destroy: () => void
  
  constructor() {
    return createSeriesPlugin()
  }
}