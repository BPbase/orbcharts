export interface BaseLayerFn<Context> {
  (context: Context): () => void // return unsubscribe function
}