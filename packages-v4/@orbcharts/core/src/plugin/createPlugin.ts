import type {
  PluginEntity,
} from '../types'
import type { DefinePluginConfig, ExtendableContext } from '../types/Plugin'


export const createPlugin = <DefaultParams>(config: DefinePluginConfig<DefaultParams>): PluginEntity<DefaultParams> => {
  // let params = { ...config.defaultParams } as DefaultParams
  let params: DefaultParams = config.layers.reduce((acc, layer) => {
    acc[layer.name as keyof DefaultParams] = layer.defaultParams
    return acc
  }, {} as DefaultParams)
  // if (config.validator) {
  //   const validation = config.validator(params)
  //   if (!validation.valid) {
  //     console.error(`Plugin "${config.name}" params validation failed:`, validation.errors)
  //   }
  // }

  // let contextExtension: ExtendableContext = {}
  // if (config.extendContext) {
  //   contextExtension = config.extendContext
  // }

  // let params = {
  //   [config.name]: params
  // } as DefaultParams

  return {
    // name: `${config.name}-${Math.random().toString(36).substr(2, 9)}`,
    name: config.name,
    // info: {
    //   name: config.name,
    //   layers: [config.name]
    // } as PluginInfo,
    // layerIndex: config.layerIndex,
    // contextExtension,
    // layer visibility controls
    show: (names: (keyof DefaultParams)[]) => {
      // implementation for showing layers
    },
    hide: (names: (keyof DefaultParams)[]) => {
      // implementation for hiding layers
    },
    toggle: (names: (keyof DefaultParams)[]) => {
      // implementation for toggling layers
    },
    showOnly: (name: (keyof DefaultParams)) => {
      // implementation for showing only specified layers
    },
    // layer params
    setLayers: (partial) => {
      params = { ...params, ...partial }
    },
    updateLayers: (patch) => {
      params = { ...params, ...patch }
    },
    replaceLayers: (full) => {
      params = full
    },
    layer: (name) => ({
      set: (partial) => {
        if (params[name]) {
          params[name] = { ...params[name], ...(partial as DefaultParams) }
        }
      },
      update: (patch) => {
        if (params[name]) {
          params[name] = { ...params[name], ...(patch as DefaultParams) }
        }
      },
      replace: (full: DefaultParams) => {
        params = full
      },
      show: () => {
        // implementation for showing this layer
      },
      hide: () => {
        // implementation for hiding this layer
      },
      toggle: () => {
        // implementation for toggling this layer
      }
    }),
    // // outputs
    // layers$: new Observable<Record<string, DefaultParams>>(subscriber => {
    //   subscriber.next(params)
    // })
  } as PluginEntity<DefaultParams>
}