import type { ChartContext, DeepPartial, DefinePluginConfig, ExtendableContext, PluginEntity } from '../types'
import {
  BehaviorSubject,
} from 'rxjs'

export const createPlugin = <DefaultParams, ExtendContext extends ExtendableContext>(config: DefinePluginConfig<DefaultParams, ExtendContext>): PluginEntity<DefaultParams, ExtendContext> => {
  // let params = { ...config.defaultParams } as DefaultParams
  let params: DefaultParams = config.layers.reduce((acc, layer) => {
    acc[layer.name as keyof DefaultParams as string] = layer.defaultParams
    return acc
  }, {} as Record<string, any>) as DefaultParams

  let _context: ChartContext<ExtendContext> = {} as ChartContext<ExtendContext>

  const allLayers = new Set(Object.keys(params) as (keyof DefaultParams)[])
  const showedLayers$ = new BehaviorSubject<Set<keyof DefaultParams>>(allLayers)

  showedLayers$.subscribe((shown) => {
    // console.log('showedLayers$', Array.from(shown))
    config.layers.forEach((layer) => {
      if (shown.has(layer.name as keyof DefaultParams)) {
        layer.init(_context)
      } else {
        layer.destroy()
      }
    })
  })

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
      // showedLayers$.next(new Set([...Array.from(showedLayers$.getValue()), ...Array.from(allLayers).filter(name => names.includes(name))]))
    },
    hide: (names: (keyof DefaultParams)[]) => {
      // showedLayers$.next(new Set([...Array.from(showedLayers$.getValue()).filter(name => !names.includes(name))]))
    },
    toggle: (name: keyof DefaultParams) => {
      showedLayers$.next(new Set([...Array.from(showedLayers$.getValue()).filter(n => n !== name)]))
    },
    showOnly: (names: (keyof DefaultParams)[]) => {
      showedLayers$.next(new Set([...names]))
    },
    // layer params
    setLayers: (partial: DeepPartial<DefaultParams>) => {
      params = { ...params, ...partial }
    },
    updateLayers: (patch: DeepPartial<DefaultParams>) => {
      params = { ...params, ...patch }
    },
    replaceLayers: (full: DefaultParams) => {
      params = full
    },
    layer: <LayerName extends keyof DefaultParams>(name: LayerName) => ({
      set: (partial: DeepPartial<DefaultParams[LayerName]>) => {
        if (params[name]) {
          params[name] = { ...params[name], ...partial }
        }
      },
      update: (patch: DeepPartial<DefaultParams[LayerName]>) => {
        if (params[name]) {
          params[name] = { ...params[name], ...patch }
        }
      },
      replace: (full: DefaultParams[LayerName]) => {
        params[name] = full
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
    // constructor
    init: (context) => {
      // initialization logic using context
      if (config.extendContext) {
        const extension = config.extendContext(context)
        Object.assign(context, extension)
      }
      _context = context
      config.layers.forEach((layer) => {
        layer.init(_context)
      })
    },
    destroy: () => {
      // cleanup logic
      config.layers.forEach((layer) => {
        layer.destroy()
      })
    },
    // // outputs
    // layers$: new Observable<Record<string, DefaultParams>>(subscriber => {
    //   subscriber.next(params)
    // })
  }
}