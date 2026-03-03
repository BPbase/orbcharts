
export function createPluginClassName (pluginName: string) {
  return `orbcharts-${pluginName}`
}

export function createLayerClassName (pluginName: string, layerName: string) {
  // orbcharts-pluginName-layerName
  return `${createPluginClassName(pluginName)}-${layerName}`
}