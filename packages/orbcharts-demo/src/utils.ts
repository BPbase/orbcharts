import * as pluginsBasic from '../lib/plugins-basic'
import * as presetsBasic from '../lib/presets-basic'
import type { DemoItem, DemoData } from './types'
import type { ChartType, PluginConstructor } from '../lib/core-types'
import { DEMO_LIST } from './demo'

// 取得demo資料
export async function getDemoData <T extends ChartType>({ chartType, pluginNames, presetName }: {
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
  const plugins = demoItem.allPluginNames.map((plugin) => {
    const Plugin = pluginsBasic[plugin] as PluginConstructor<any, string, any>
    return new Plugin()
  })
  // data
  const { default: data } = await demoItem.getData()
  // preset
  const preset = presetsBasic[presetName] as any

  return { preset, plugins, data }
}

// 依plugins取得demo列表資料
export function getPluginDemoList (chartType: ChartType, pluginNames: (keyof typeof pluginsBasic)[]) {
  return DEMO_LIST
    .find(demo => demo.chartType === chartType)!.list
    .find(mainPluginsItem => mainPluginsItem.mainPluginNames.join(',') === pluginNames.join(','))!.list
}