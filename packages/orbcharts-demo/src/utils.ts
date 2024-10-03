import * as core from '@orbcharts/core'
import * as pluginsBasic from '@orbcharts/plugins-basic'
import * as presetsBasic from '@orbcharts/presets-basic'
import type { DemoItem, DemoData } from './types'
import { demoList } from './demoList'

// 取得demo資料
export async function getDemoData <T extends core.ChartType>({ chartType, pluginNames, presetName }: {
  chartType: T
  pluginNames: (keyof typeof pluginsBasic)[]
  presetName: keyof typeof presetsBasic
}): Promise<DemoData<T> | null> {
  const chartTypeItem = demoList.find((item) => item.chartType === chartType)
  const mainPluginsItem = chartTypeItem?.list.find((item) => item.mainPluginNames.join(',') === pluginNames.join(','))
  const demoItem: DemoItem | null = mainPluginsItem?.list.find((item) => item.presetName === presetName) ?? null
  if (!demoItem) {
    return null
  }

  // plugins
  const plugins = demoItem.allPluginNames.map((plugin) => {
    const Plugin = pluginsBasic[plugin] as core.PluginConstructor<any, string, any>
    return new Plugin()
  })
  // data
  const { default: data } = await demoItem.getData()
  // preset
  const preset = presetsBasic[presetName] as any

  return { preset, plugins, data }
}

// 依plugins取得demo列表資料
export function getPluginDemoList (chartType: core.ChartType, pluginNames: (keyof typeof pluginsBasic)[]) {
  return demoList
    .find(demo => demo.chartType === chartType)!.list
    .find(mainPluginsItem => mainPluginsItem.mainPluginNames.join(',') === pluginNames.join(','))!.list
}