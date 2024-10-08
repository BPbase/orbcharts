import * as core from '../../packages/orbcharts-core/src'
import * as pluginsBasic from '../../packages/orbcharts-plugins-basic/src'
import * as presetsBasic from '../../packages/orbcharts-presets-basic/src'
import type { DemoItem, DemoData } from '../../packages/orbcharts-demo/src/types'
import { DEMO_LIST } from '../../packages/orbcharts-demo/src'

export async function getDemoData <T extends core.ChartType>({ chartType, pluginNames, presetName }: {
  chartType: T
  pluginNames: (keyof typeof pluginsBasic)[]
  presetName: keyof typeof presetsBasic
}): Promise<DemoData<T> | null> {
  const chartTypeItem = DEMO_LIST.find((item) => item.chartType === chartType)
  const mainPluginsItem = chartTypeItem?.list.find((item) => item.mainPluginNames.join(',') === pluginNames.join(','))
  const demoItem: DemoItem | null = mainPluginsItem?.list.find((item) => item.presetName === presetName) ?? null
  if (!demoItem) {
    return null
  }

  // plugins
  const plugins: core.PluginEntity<T, string, any>[] = demoItem.allPluginNames.map((plugin) => {
    const Plugin = pluginsBasic[plugin] as core.PluginConstructor<any, string, any>
    return new Plugin()
  })
  // data
  const { default: data } = await demoItem.getData()
  // preset
  const preset = presetsBasic[presetName] as any

  return { preset, plugins, data }
}