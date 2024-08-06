export interface BasePluginFn<Context> {
  (pluginName: string, context: Context): () => void // return unsubscribe function
}