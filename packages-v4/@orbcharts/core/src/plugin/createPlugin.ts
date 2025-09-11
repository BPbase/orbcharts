import type { ChartContext, DeepPartial, DefinePluginConfig, ExtendableContext, PluginEntity } from '../types'
import {
  BehaviorSubject,
  combineLatest,
  switchMap,
  filter
} from 'rxjs'

function createSvg (element: HTMLElement | Element): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  svg.setAttribute('xmls', 'http://www.w3.org/2000/svg')
  svg.setAttribute('version', '1.1')
  svg.style.position = 'absolute'
  svg.classList.add('orbcharts__svg-root')
  element.appendChild(svg)
  return svg
}

function createCanvas (element: HTMLElement | Element): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.style.position = 'absolute'
  canvas.classList.add('orbcharts__canvas-root')
  element.appendChild(canvas)
  return canvas
}

export const createPlugin = <
  DefaultParams,
  ExtendContext extends ExtendableContext
>(config: DefinePluginConfig<DefaultParams, ExtendContext>): PluginEntity<DefaultParams, ExtendContext> => {
  // let params: DefaultParams = config.layers.reduce((acc, layer) => {
  //   acc[layer.name as keyof DefaultParams as string] = layer.defaultParams
  //   return acc
  // }, {} as Record<string, any>) as DefaultParams

  // 全部的layers
  const allLayerInstances = {
    ...config.layers.reduce((acc, layer) => {
      acc[layer.name as keyof DefaultParams] = layer
      return acc
    }, {} as Record<keyof DefaultParams, typeof config.layers[number]>)
  }

  // 要顯示的 layers
  const showedLayerNames$ = new BehaviorSubject<Set<keyof DefaultParams>>(new Set()) // 一開始先不顯示

  const context$ = new BehaviorSubject<ChartContext<ExtendContext> | null>(null)

  // const showAllLayers = () => {
  //   const AllLayerNamesSet = new Set(Object.keys(config.layers) as (keyof DefaultParams)[])
  //   showedLayerNames$.next(AllLayerNamesSet)
  // }

  // const defulatAllLayerParams = config.layers.reduce((acc, layer) => {
  //   acc[layer.name as keyof DefaultParams as string] = layer.defaultParams
  //   return acc
  // }, {} as Record<string, any>) as DefaultParams
  // const allLayerParams$ = new BehaviorSubject<DefaultParams>(Object.assign({}, defulatAllLayerParams))

  // const showedLayerParams$ = 

  const subscription = combineLatest({
    context: context$,
    showedLayerNames: showedLayerNames$
  }).pipe(
    switchMap(async d => d),
    filter(({ context }) => context !== null)
  ).subscribe(({ context, showedLayerNames }) => {
    // init layers
    config.layers.forEach((layer) => {
      if (showedLayerNames.has(layer.name as keyof DefaultParams)) {
        layer.enable({ svg: svgElement, canvas: canvasElement }, context)
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
    show: (names: (keyof DefaultParams) | (keyof DefaultParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      showedLayerNames$.next(new Set([...Array.from(showedLayerNames$.getValue()), ...names]))
    },
    showOnly: (names: (keyof DefaultParams) | (keyof DefaultParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      showedLayerNames$.next(new Set([...names]))
    },
    // showAll: () => {
    //   showAllLayers()
    // },
    hide: (names: (keyof DefaultParams) | (keyof DefaultParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      showedLayerNames$.next(new Set([...Array.from(showedLayerNames$.getValue()).filter(name => !names.includes(name))]))
    },
    // hideAll: () => {
    //   showedLayerNames$.next(new Set())
    // },
    toggle: (names: (keyof DefaultParams) | (keyof DefaultParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      Array.from(showedLayerNames$.getValue()).forEach(shown => {
        if (names.includes(shown)) {
          names.splice(names.indexOf(shown), 1)
        } else {
          names.push(shown)
        }
      })
      showedLayerNames$.next(new Set(names))
    },
    // layer params
    // setLayers: (partial: DeepPartial<DefaultParams>) => {
    //   params = { ...params, ...partial }
    // },
    update: (patch: DeepPartial<DefaultParams>) => {
      Object.keys(patch).forEach((key) => {
        const layer = allLayerInstances[key as keyof DefaultParams]
        if (layer) {
          layer.update((patch as Record<string, any>)[key])
        }
      })
    },
    forceReplace: (full: DefaultParams) => {
      Object.keys(full).forEach((key) => {
        const layer = allLayerInstances[key as keyof DefaultParams]
        if (layer) {
          layer.forceReplace((full as Record<string, any>)[key])
        }
      })
    },
    // layer: <LayerName extends keyof DefaultParams>(name: LayerName) => ({
    //   // set: (partial: DeepPartial<DefaultParams[LayerName]>) => {
    //   //   if (params[name]) {
    //   //     params[name] = { ...params[name], ...partial }
    //   //   }
    //   // },
    //   update: (patch: DeepPartial<DefaultParams[LayerName]>) => {
    //     if (params[name]) {
    //       params[name] = { ...params[name], ...patch }
    //     }
    //   },
    //   replace: (full: DefaultParams[LayerName]) => {
    //     params[name] = full
    //   },
    //   show: () => {
    //     // implementation for showing this layer
    //   },
    //   hide: () => {
    //     // implementation for hiding this layer
    //   },
    //   toggle: () => {
    //     // implementation for toggling this layer
    //   }
    // }),
    injectContext: (context) => {
      // initialization logic using context
      if (config.extendContext) {
        const extension = config.extendContext(context)
        Object.assign(context, extension)
      }
      // config.layers.forEach((layer) => {
      //   layer.injectContext(Object.assign({}, context))
      // })

      // 顯示
      // showAllLayers()
    },
    destroy: () => {
      subscription.unsubscribe()
      context$.complete()
      showedLayerNames$.complete()
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