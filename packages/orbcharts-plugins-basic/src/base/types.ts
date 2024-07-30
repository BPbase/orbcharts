export interface BasePluginFn {
  (pluginName: string, context: any): () => void // return unsubscribe function
}