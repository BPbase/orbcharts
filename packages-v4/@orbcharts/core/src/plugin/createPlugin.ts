import type { ChartContext, DeepPartial, DefinePluginConfig, ExtendableContext, PluginEntity } from '../types'
import {
  BehaviorSubject,
  combineLatest,
  switchMap,
  map,
  filter
} from 'rxjs'
import { handleElementLifecycle } from '../utils/dom-lifecycle'
import { createSvg, createCanvasElement, createSVGGroup, createCanvas } from '../utils/dom'


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

  // 前一次顯示的 layers
  // const previousShowedLayerNames$ = new BehaviorSubject<Set<keyof DefaultParams>>(new Set())
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

  // element 全部保存起來避免重複創建
  const layerSVGElementsRef: Record<string, SVGElement> = {}
  const layerCanvasElementsRef: Record<string, HTMLCanvasElement> = {}
  
  // 儲存主要的 svg 和 canvas 元素引用
  let mainSvgElement: SVGSVGElement | null = null
  let mainCanvasElement: HTMLCanvasElement | null = null

  // context
  const subscription = context$.pipe(
    switchMap(context => {
      // showedLayerNames
      return showedLayerNames$.pipe(
        map(showedLayerNames => {
          // 依照 layerIndex 排序
          const showedLayerNamesSeq: string[] = Array.from(showedLayerNames)
            .map(name => [
              name,
              config.layers.find(l => l.name === name)?.layerIndex ?? -1
            ])
            .filter(([, index]) => index !== -1)
            .sort((a, b) => (a[1] as number) - (b[1] as number))
            .map(([name]) => name as string)

          return { context, showedLayerNames, showedLayerNamesSeq }
        })
      )
    })
  ).subscribe(({ context, showedLayerNames, showedLayerNamesSeq }) => {

    // 在context.root元素底下建立 svg 和 canvas 元素
    let svgElement = context.root.querySelector('.orbcharts__svg-root') as SVGSVGElement | null
    if (!svgElement) {
      svgElement = createSvg('orbcharts__svg-root')
      context.root.appendChild(svgElement)
    }
    mainSvgElement = svgElement
    
    let canvasElement = context.root.querySelector('.orbcharts__canvas-root') as HTMLCanvasElement | null
    if (!canvasElement) {
      canvasElement = createCanvasElement('orbcharts__canvas-root')
      context.root.appendChild(canvasElement)
    }
    mainCanvasElement = canvasElement

    // 處理 SVG 元素的 enter/update/exit
    handleElementLifecycle(
      svgElement!, 
      showedLayerNamesSeq, // 依照 showedLayerNamesSeq
      layerSVGElementsRef,
      (layerName) => createSVGGroup(`orbcharts__${layerName}`)
    )
    
    // 處理 Canvas 元素的 enter/update/exit
    handleElementLifecycle(
      canvasElement!, 
      showedLayerNamesSeq, // 依照 showedLayerNamesSeq
      layerCanvasElementsRef,
      (layerName) => createCanvas(`orbcharts__${layerName}`)
    )

    // init layers
    config.layers.forEach((layer) => {
      if (showedLayerNames.has(layer.name as keyof DefaultParams)) {
        layer.enable({ svg: mainSvgElement, canvas: mainCanvasElement }, context)
      } else {
        layer.destroy()
      }
    })
  })

  // const subscription = combineLatest({
  //   context: context$,
  //   showedLayerNames: showedLayerNames$
  // }).pipe(
  //   switchMap(async d => d),
  //   filter(({ context }) => context !== null)
  // ).subscribe(({ context, showedLayerNames }) => {
  //   // init layers
  //   config.layers.forEach((layer) => {
  //     if (showedLayerNames.has(layer.name as keyof DefaultParams)) {
  //       layer.enable({ svg: mainSvgElement, canvas: mainCanvasElement }, context)
  //     } else {
  //       layer.destroy()
  //     }
  //   })
  // })

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
      context$.next(context)
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