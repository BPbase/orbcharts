import type { ChartContext, DeepPartial, DefinePluginConfig, ExtendableContext, PluginEntity } from '../types'
import {
  BehaviorSubject,
  combineLatest,
  switchMap,
  map,
  filter,
  of,
  shareReplay,
  debounceTime,
  Observable,
} from 'rxjs'
import { handleElementLifecycle } from '../utils/dom-lifecycle'
import { createSvg, createCanvasElement, createSVGGroup, createCanvas } from '../utils/dom'


export const createPlugin = <
  ExtendContext extends ExtendableContext,
  PluginParams,
  AllLayerParams
>(config: DefinePluginConfig<ExtendContext, PluginParams, AllLayerParams>, initPluginParams?: DeepPartial<PluginParams | AllLayerParams>): PluginEntity<PluginParams, AllLayerParams> => {

  // const pluginParams$ = new BehaviorSubject<PluginParams>(Object.assign({}, config.defaultParams))

  let destroySetup = () => {}

  // 全部的layers
  const allLayerInstances = {
    ...config.layers.reduce((acc, layer) => {
      acc[layer.name as keyof AllLayerParams] = layer
      return acc
    }, {} as Record<keyof AllLayerParams, typeof config.layers[number]>)
  }

  
  const getAllLayerNamesSet = () => new Set(config.layers.map(l => l.name as keyof AllLayerParams))
  const getDefaultLayerNamesSet = (params: DeepPartial<PluginParams | AllLayerParams>): Set<keyof AllLayerParams> => {
    if (params) {
      const AllLayerNamesSet = getAllLayerNamesSet()
      const keysOfParams = Object.keys(params) as (keyof AllLayerParams)[]
      return new Set(keysOfParams.filter(key => AllLayerNamesSet.has(key)))
    }
    return new Set()
  }

  // 預設顯示的 layers
  const defaultShowedLayerNames$ = new BehaviorSubject<Set<keyof AllLayerParams>>(getDefaultLayerNamesSet(initPluginParams))
  // 前一次顯示的 layers
  // const previousShowedLayerNames$ = new BehaviorSubject<Set<keyof PluginParams>>(new Set())
  // 設定要顯示的 layers
  const settingShowedLayerNames$ = new BehaviorSubject<Set<keyof AllLayerParams> | null>(null)

  const context$ = new BehaviorSubject<ChartContext<ExtendContext> | null>(null)

  // const showAllLayers = () => {
  //   const AllLayerNamesSet = new Set(config.layers.map(l => l.name as keyof AllLayerParams))
  //   settingShowedLayerNames$.next(AllLayerNamesSet)
  // }

  // const defulatAllLayerParams = config.layers.reduce((acc, layer) => {
  //   acc[layer.name as keyof PluginParams as string] = layer.defaultParams
  //   return acc
  // }, {} as Record<string, any>) as PluginParams
  // const allLayerParams$ = new BehaviorSubject<PluginParams>(Object.assign({}, defulatAllLayerParams))

  // const showedLayerParams$ = 

  // element 全部保存起來避免重複創建
  const layerSVGElementsRef: Record<string, SVGElement> = {}
  const layerCanvasElementsRef: Record<string, HTMLCanvasElement> = {}
  
  // 儲存主要的 svg 和 canvas 元素引用
  // let mainSvgElement: SVGSVGElement | null = null
  // let mainCanvasElement: HTMLCanvasElement | null = null

  // 當 context 或 settingShowedLayerNames 改變時，重新初始化 layers
  const subscription = combineLatest({
    context: context$,
    defaultShowedLayerNames: defaultShowedLayerNames$,
    settingShowedLayerNames: settingShowedLayerNames$
  }).pipe(
    debounceTime(0),
    filter(({ context }) => context !== null),
    map(({ context, defaultShowedLayerNames, settingShowedLayerNames }) => {
      const showedLayerNames = settingShowedLayerNames ?? defaultShowedLayerNames
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
  ).subscribe(({ context, showedLayerNames, showedLayerNamesSeq }) => {

    // 在context.root元素底下建立 svg 和 canvas 元素
    let svgElement = context.root.querySelector('.orbcharts__svg-root') as SVGSVGElement | null
    if (!svgElement) {
      svgElement = createSvg('orbcharts__svg-root')
      context.root.appendChild(svgElement)
    }
    // mainSvgElement = svgElement
    
    let canvasElement = context.root.querySelector('.orbcharts__canvas-root') as HTMLCanvasElement | null
    if (!canvasElement) {
      canvasElement = createCanvasElement('orbcharts__canvas-root')
      context.root.appendChild(canvasElement)
    }
    // mainCanvasElement = canvasElement

    // 初始化 plugin
    if (config.setup) {
      // const extension: ExtendContext = config.setup(context)
      // Object.assign(context, extension)
      destroySetup = config.setup({
        context: context as ChartContext<ExtendContext>, // 初始化時 context 有可能被 in place 擴展
        svg: svgElement!,
        canvas: canvasElement!,
        pluginParams$: of(config.defaultParams).pipe(shareReplay(1))
      })
    }

    // 處理 SVG 元素的 enter/update/exit
    handleElementLifecycle(
      svgElement!, 
      showedLayerNamesSeq, // 依照 showedLayerNamesSeq
      layerSVGElementsRef,
      (layerName) => createSVGGroup(`orbcharts__${config.name}-${layerName}`)
    )
    
    // 處理 Canvas 元素的 enter/update/exit
    handleElementLifecycle(
      canvasElement!, 
      showedLayerNamesSeq, // 依照 showedLayerNamesSeq
      layerCanvasElementsRef,
      (layerName) => createCanvas(`orbcharts__${config.name}-${layerName}`)
    )

    // init layers
    config.layers.forEach((layer) => {
      if (showedLayerNames.has(layer.name as keyof AllLayerParams)) {
        layer.enable({
          svg: context.root.querySelector(`.orbcharts__${config.name}-${layer.name}`),
          canvas: context.root.querySelector(`.orbcharts__${config.name}-${layer.name}`),
          context,
          pluginParams$: of(config.defaultParams).pipe(shareReplay(1))
        })
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
  //     if (showedLayerNames.has(layer.name as keyof PluginParams)) {
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
  // if (config.setup) {
  //   contextExtension = config.setup
  // }

  // let params = {
  //   [config.name]: params
  // } as PluginParams

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
    show: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      settingShowedLayerNames$.next(new Set([...Array.from(settingShowedLayerNames$.getValue()), ...names]))
    },
    showOnly: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      settingShowedLayerNames$.next(new Set([...names]))
    },
    showAll: () => {
      settingShowedLayerNames$.next(getAllLayerNamesSet())
    },
    hide: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      settingShowedLayerNames$.next(new Set([...Array.from(settingShowedLayerNames$.getValue()).filter(name => !names.includes(name))]))
    },
    hideAll: () => {
      settingShowedLayerNames$.next(new Set())
    },
    toggle: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      Array.from(settingShowedLayerNames$.getValue()).forEach(shown => {
        if (names.includes(shown)) {
          names.splice(names.indexOf(shown), 1)
        } else {
          names.push(shown)
        }
      })
      settingShowedLayerNames$.next(new Set(names))
    },
    // layer params
    // setLayers: (partial: DeepPartial<PluginParams>) => {
    //   params = { ...params, ...partial }
    // },
    updateParams: (patch: DeepPartial<PluginParams | AllLayerParams>) => {
      Object.keys(patch).forEach((key) => {
        const layer = allLayerInstances[key as keyof AllLayerParams]
        if (layer) {
          layer.updateParams((patch as Record<string, any>)[key])
        }
      })
      defaultShowedLayerNames$.next(getDefaultLayerNamesSet(patch))
    },
    forceReplaceParams: (full: PluginParams | AllLayerParams) => {
      Object.keys(full).forEach((key) => {
        const layer = allLayerInstances[key as keyof AllLayerParams]
        if (layer) {
          layer.forceReplaceParams((full as Record<string, any>)[key])
        }
      })
      defaultShowedLayerNames$.next(getDefaultLayerNamesSet(full))
    },
    getParams: () => {
      return config.layers.reduce((acc, layer) => {
        acc[layer.name] = layer.getParams()
        return acc
      }, {} as Record<string, any>) as PluginParams | AllLayerParams
    },
    // layer: <LayerName extends keyof PluginParams>(name: LayerName) => ({
    //   // set: (partial: DeepPartial<PluginParams[LayerName]>) => {
    //   //   if (params[name]) {
    //   //     params[name] = { ...params[name], ...partial }
    //   //   }
    //   // },
    //   update: (patch: DeepPartial<PluginParams[LayerName]>) => {
    //     if (params[name]) {
    //       params[name] = { ...params[name], ...patch }
    //     }
    //   },
    //   replace: (full: PluginParams[LayerName]) => {
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
    // 由 chart 注入 context
    injectContext: (context) => {
      context$.next(Object.assign({}, context) as ChartContext<ExtendContext>)

      // if (config.setup) {
      //   // const extension: ExtendContext = config.setup(context)
      //   // Object.assign(context, extension)
      //   config.setup({
      //     context: context as ChartContext<ExtendContext>,
      //     svg: mainSvgElement!,
      //     canvas: mainCanvasElement!,
      //     pluginParams$
      //   })
      // }
      
      // 顯示全部 layers
      // settingShowedLayerNames$.next(getAllLayerNamesSet())
    },
    destroy: () => {
      destroySetup()
      subscription.unsubscribe()
      context$.complete()
      settingShowedLayerNames$.complete()
      
      config.layers.forEach((layer) => {
        layer.destroy()
      })
    },
    // // outputs
    // layers$: new Observable<Record<string, PluginParams>>(subscriber => {
    //   subscriber.next(params)
    // })
  }
}