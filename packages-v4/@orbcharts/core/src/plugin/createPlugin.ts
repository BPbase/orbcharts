import type {
  DeepPartial,
  ChartContext,
  PluginInfo,
  PluginEntity,
} from '../types'
import { Observable } from 'rxjs'
import type { DefinePluginConfig, ExtendableContextValue } from '../types/Plugin'


export const createPlugin = <DefaultParams>(config: DefinePluginConfig<DefaultParams>): PluginEntity<DefaultParams> => {
  let params = { ...config.defaultParams } as DefaultParams
  // if (config.validator) {
  //   const validation = config.validator(params)
  //   if (!validation.valid) {
  //     console.error(`Plugin "${config.name}" params validation failed:`, validation.errors)
  //   }
  // }

  // let contextExtension: ExtendableContextValue = {}
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
    show: (ids: string[]) => {
      // implementation for showing layers
    },
    hide: (ids: string[]) => {
      // implementation for hiding layers
    },
    toggle: (ids: string[]) => {
      // implementation for toggling layers
    },
    showOnly: (ids: string[]) => {
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