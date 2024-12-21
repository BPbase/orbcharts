// import * as d3 from 'd3'
// import type { DefinePluginConfig } from '../../../lib/core-types'
// import {
//   defineNoneDataPlugin } from '../../../lib/core'
// import { CONTAINER_PLUGIN_PARAMS } from '../defaults'
// import { LAYER_INDEX_OF_BG } from '../../const'

// const pluginName = 'Container'

// const pluginConfig: DefinePluginConfig<typeof pluginName, typeof CONTAINER_PLUGIN_PARAMS> = {
//   name: pluginName,
//   defaultParams: CONTAINER_PLUGIN_PARAMS,
//   layerIndex: LAYER_INDEX_OF_BG,
//   validator: (params, { validateColumns }) => {
//     return {
//       status: 'success',
//       columnName: '',
//       expectToBe: '',
//     }
//   }
// }

// export const Container = defineNoneDataPlugin(pluginConfig)(({ selection }) => {
  
//   return function unsubscribe () {
    
//   }
// })