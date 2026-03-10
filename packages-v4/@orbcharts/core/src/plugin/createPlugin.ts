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
  first,
  Observable,
} from 'rxjs'
import type { PluginSetupProps, LayerEnableProps } from '../types'
import { handleElementLifecycle } from '../utils/dom-lifecycle'
import { createSvg, createCanvasElement, createSVGGroup, createCanvas } from '../utils/dom'
import { createPluginClassName, createLayerClassName } from '../utils/orbchartsUtils'
import { deepOverwrite } from '../utils/commonUtils'
import { createOrbChartsErrorMessage, createValidatorErrorMessage, createValidatorWarningMessage } from '../utils/errorMessage'

export const createPlugin = <
  ExtendContext extends ExtendableContext,
  PluginParams,
  AllLayerParams
>(elementType: 'canvas' | 'svg', config: DefinePluginConfig<'svg' | 'canvas', ExtendContext, PluginParams, AllLayerParams>, initPluginParams?: DeepPartial<PluginParams | AllLayerParams>): PluginEntity<PluginParams, AllLayerParams> => {
  
  // const pluginParams$ = new BehaviorSubject<PluginParams>(Object.assign({}, config.defaultParams))

  const svgClassName = `${createPluginClassName(config.name)}__svg`
  const canvasClassName = `${createPluginClassName(config.name)}__canvas`

  let destroySetup = () => {}

  // 全部的layers
  const allLayerInstances = {
    // 將陣列轉成字典
    ...config.layers.reduce((acc, layer) => {
      acc[layer.name as keyof AllLayerParams] = layer
      return acc
    }, {} as Record<keyof AllLayerParams, typeof config.layers[number]>)
  }
  const getAllLayerNamesSet = () => new Set(config.layers.map(l => l.name as keyof AllLayerParams))
  const getParamsKeySet = (params: DeepPartial<PluginParams | AllLayerParams>): Set<keyof AllLayerParams> => {
    // 取得有設定 params 的 layer name
    if (params) {
      const AllLayerNamesSet = getAllLayerNamesSet()
      const keysOfParams = Object.keys(params) as (keyof AllLayerParams)[]
      return new Set(keysOfParams.filter(key => AllLayerNamesSet.has(key)))
    }
    return new Set()
  }
  // 有設定 params 對應的 layers 名稱
  const SettedParamsKeySet$ = new BehaviorSubject<Set<keyof AllLayerParams>>(getParamsKeySet(initPluginParams))
  // 前一次顯示的 layers
  // const previousShowedLayerNames$ = new BehaviorSubject<Set<keyof PluginParams>>(new Set())
  // 有設定 show/showOnly 等的 layers 名稱
  const SettedIsShowKeySet$ = new BehaviorSubject<Set<keyof AllLayerParams> | null>(null)

  const context$ = new BehaviorSubject<ChartContext<ExtendContext> | null>(null)
  const injectedContext$ = context$.pipe(
    filter((context): context is ChartContext<ExtendContext> => context !== null)
  )

  // const showAllLayers = () => {
  //   const AllLayerNamesSet = new Set(config.layers.map(l => l.name as keyof AllLayerParams))
  //   SettedIsShowKeySet$.next(AllLayerNamesSet)
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

  // 當 context 或 SettedIsShowKeySet 改變時，重新初始化 layers
  const shownLayerNames$ = combineLatest({
    // context: context$,
    SettedParamsKeySet: SettedParamsKeySet$,
    SettedIsShowKeySet: SettedIsShowKeySet$
  }).pipe(
    debounceTime(0),
    // filter(({ context }) => context !== null),
    map(({ SettedParamsKeySet, SettedIsShowKeySet }) => {
      const ShownLayerNamesSet = SettedIsShowKeySet == null ? SettedParamsKeySet : SettedIsShowKeySet // SettedIsShowKeySet 預設為 null
      // 依照 layerIndex 排序
      const shownLayerNamesSeq: string[] = Array.from(ShownLayerNamesSet)
        .map(name => [
          name,
          config.layers.find(l => l.name === name)?.layerIndex ?? -1
        ])
        .filter(([, index]) => index !== -1)
        .sort((a, b) => (a[1] as number) - (b[1] as number))
        .map(([name]) => name as string)

      return { ShownLayerNamesSet, shownLayerNamesSeq }
    })
  )

  // const pluginElements$ = injectedContext$.pipe(
  //   map(context => {
  //     // -- 在context.root元素底下建立 svg 和 canvas 元素 --
  //     let svgElement: SVGSVGElement | null = context.root.querySelector(`.${svgClassName}`)
  //     if (!svgElement) {
  //       svgElement = createSvg(svgClassName)
  //       context.root.appendChild(svgElement)
  //     }
      
  //     let canvasElement: HTMLCanvasElement | null = context.root.querySelector(`.${canvasClassName}`)
  //     if (!canvasElement) {
  //       canvasElement = createCanvasElement(canvasClassName)
  //       context.root.appendChild(canvasElement)
  //     }

  //     return { svgElement, canvasElement }
  //   })
  // )

  const pluginElement$: Observable<SVGSVGElement | HTMLCanvasElement> = injectedContext$.pipe(
    map(context => {
      // -- 在context.root元素底下建立 svg 或 canvas 元素 --
      if (elementType === 'svg') {
        let svgElement: SVGSVGElement | null = context.root.querySelector(`.${svgClassName}`)
        if (!svgElement) {
          svgElement = createSvg(svgClassName)
          context.root.appendChild(svgElement)
        }
        return svgElement
      } else if (elementType === 'canvas') {
        let canvasElement: HTMLCanvasElement | null = context.root.querySelector(`.${canvasClassName}`)
        if (!canvasElement) {
          canvasElement = createCanvasElement(canvasClassName)
          context.root.appendChild(canvasElement)
        }
        return canvasElement
      }
    })
  )

  const pluginPatchParams$ = new BehaviorSubject<DeepPartial<AllLayerParams | PluginParams> | undefined>(
    initPluginParams
  )

  const pluginForceReplaceParams$ = new BehaviorSubject<DeepPartial<AllLayerParams | PluginParams> | undefined>(
    initPluginParams
  )

  // const pluginParams$ = new BehaviorSubject<PluginParams>(
  //   deepOverwrite(config.defaultParams, initPluginParams as DeepPartial<PluginParams>)
  // )
  const pluginParams$ = new Observable<PluginParams>(subscriber => {
    // update
    pluginPatchParams$.subscribe(patch => {
      try {
        // 檢查 data$ 資料格式是否正確
        const { status, columnName, expectToBe } = config.validator(patch)
        if (status === 'error') {
          throw new Error(createValidatorErrorMessage({
            columnName,
            expectToBe,
            from: `${config.name}.params$`
          }))
        } else if (status === 'warning') {
          console.warn(createValidatorWarningMessage({
            columnName,
            expectToBe,
            from: `${config.name}.params$`
          }))
        }
      } catch (e) {
        // throw new Error(e.message)
        // 驗證失敗仍繼續執行，才不會把 Observable 資料流給中斷掉
        console.error(createOrbChartsErrorMessage(e))
      }

      const newParams = deepOverwrite(config.defaultParams, patch as DeepPartial<PluginParams> ?? {})

      subscriber.next(newParams)
    })

    // force replace
    pluginForceReplaceParams$.subscribe(full => {
      subscriber.next(full as PluginParams)
    })
  })
  
  pluginPatchParams$.pipe(
    map(patch => {
      try {
        // 檢查 data$ 資料格式是否正確
        const { status, columnName, expectToBe } = config.validator(patch)
        if (status === 'error') {
          throw new Error(createValidatorErrorMessage({
            columnName,
            expectToBe,
            from: `${config.name}.params$`
          }))
        } else if (status === 'warning') {
          console.warn(createValidatorWarningMessage({
            columnName,
            expectToBe,
            from: `${config.name}.params$`
          }))
        }
      } catch (e) {
        // throw new Error(e.message)
        // 驗證失敗仍繼續執行，才不會把 Observable 資料流給中斷掉
        console.error(createOrbChartsErrorMessage(e))
      }

      return deepOverwrite(config.defaultParams, patch as DeepPartial<PluginParams> ?? {})
    }),
    shareReplay(1)
  )

  const pluginSetupProps$ = combineLatest({
    context: injectedContext$,
    pluginElement: pluginElement$
  }).pipe(
    debounceTime(0),
    map(({ context, pluginElement }) => {
      const pluginSetupProps: PluginSetupProps<'svg' | 'canvas', ExtendContext, PluginParams> = 
      elementType === 'svg' ?{
        context: context as ChartContext<ExtendContext>, // 初始化時 context 有可能被 in place 擴展
        svg: pluginElement as SVGSVGElement,
        pluginParams$
      } : {
        context: context as ChartContext<ExtendContext>,
        canvas: pluginElement as HTMLCanvasElement,
        pluginParams$
      }
      return pluginSetupProps
    }),
    first() // 只做初始化
  )
  
  // .subscribe(pluginSetupProps => {
  //   // 初始化 plugin
  //   if (config.setup) {
  //     destroySetup = config.setup(pluginSetupProps)
  //   }
  // })

  combineLatest({
    pluginSetupProps: pluginSetupProps$,
    shownLayerNames: shownLayerNames$
  }).pipe(
    debounceTime(0)
  ).subscribe(({ pluginSetupProps, shownLayerNames }) => {
    // const { context, svg, canvas } = pluginSetupProps
    const { ShownLayerNamesSet, shownLayerNamesSeq } = shownLayerNames

    // init plugin
    if (config.setup) {
      destroySetup = config.setup(pluginSetupProps)
    }

    // layer element - 處理 SVG 元素的 enter/update/exit
    if (elementType === 'svg') {
      handleElementLifecycle(
        (pluginSetupProps as PluginSetupProps<'svg', ExtendContext, PluginParams>).svg, 
        shownLayerNamesSeq, // 依照 shownLayerNamesSeq
        layerSVGElementsRef,
        (layerName) => createSVGGroup(createLayerClassName(config.name, layerName))
      )
    }
    
    // layer element - 處理 Canvas 元素的 enter/update/exit
    if (elementType === 'canvas') {
      handleElementLifecycle(
        (pluginSetupProps as PluginSetupProps<'canvas', ExtendContext, PluginParams>).canvas, 
        shownLayerNamesSeq, // 依照 shownLayerNamesSeq
        layerCanvasElementsRef,
        (layerName) => createCanvas(createLayerClassName(config.name, layerName))
      )
    }

    // init layers
    config.layers.forEach((layer) => {
      if (ShownLayerNamesSet.has(layer.name as keyof AllLayerParams)) {
        const layerEnableProps: LayerEnableProps<'svg' | 'canvas', ExtendContext, PluginParams, unknown> = 
          elementType === 'svg' ? 
            {
              svgG: (pluginSetupProps as PluginSetupProps<'svg', ExtendContext, PluginParams>).svg.querySelector(`.${createLayerClassName(config.name, layer.name)}`),
              // canvas: context.root.querySelector(`.${createLayerClassName(config.name, layer.name)}`),
              // context: Object.assign({}, context) as ChartContext<ExtendContext>,
              context: pluginSetupProps.context,
              pluginParams$,
              initLayerParams: pluginPatchParams$.getValue()?.[layer.name as keyof AllLayerParams] as unknown || {}
            }
          : {
              // svgG: context.root.querySelector(`.${createLayerClassName(config.name, layer.name)}`),
              canvas: (pluginSetupProps as PluginSetupProps<'canvas', ExtendContext, PluginParams>).canvas.querySelector(`.${createLayerClassName(config.name, layer.name)}`),
              // context: Object.assign({}, context) as ChartContext<ExtendContext>,
              context: pluginSetupProps.context,
              pluginParams$,
              initLayerParams: pluginPatchParams$.getValue()?.[layer.name as keyof AllLayerParams] as unknown || {}
            }
            
        layer.enable(layerEnableProps)
      } else {
        layer.destroy()
      }
    })
  })
  
  // const subscription = combineLatest({
  //   shownLayerNames: shownLayerNames$,
  //   context: context$
  // }).pipe(
  //   debounceTime(0),
  //   filter(({ context }) => context !== null)
  // ).subscribe(({ context, shownLayerNames }) => {

  //   const { ShownLayerNamesSet, shownLayerNamesSeq } = shownLayerNames

  //   // -- 在context.root元素底下建立 svg 和 canvas 元素 --
  //   let svgElement: SVGSVGElement | null = context.root.querySelector(`.${svgClassName}`)
  //   if (!svgElement) {
  //     svgElement = createSvg(svgClassName)
  //     context.root.appendChild(svgElement)
  //   }
  //   // mainSvgElement = svgElement
    
  //   let canvasElement: HTMLCanvasElement | null = context.root.querySelector(`.${canvasClassName}`)
  //   if (!canvasElement) {
  //     canvasElement = createCanvasElement(canvasClassName)
  //     context.root.appendChild(canvasElement)
  //   }
  //   // mainCanvasElement = canvasElement

  //   // const extension: ExtendContext = config.setup(context)
  //   // Object.assign(context, extension)
  //   const pluginSetupProps: PluginSetupProps<ExtendContext, PluginParams> = {
  //     context: context as ChartContext<ExtendContext>, // 初始化時 context 有可能被 in place 擴展
  //     svg: svgElement!,
  //     canvas: canvasElement!,
  //     pluginParams$: of(config.defaultParams).pipe(shareReplay(1))
  //   }

  //   // 初始化 plugin
  //   if (config.setup) {
  //     destroySetup = config.setup(pluginSetupProps)
  //   }

  //   // 處理 SVG 元素的 enter/update/exit
  //   handleElementLifecycle(
  //     svgElement!, 
  //     shownLayerNamesSeq, // 依照 shownLayerNamesSeq
  //     layerSVGElementsRef,
  //     (layerName) => createSVGGroup(createLayerClassName(config.name, layerName))
  //   )
    
  //   // 處理 Canvas 元素的 enter/update/exit
  //   handleElementLifecycle(
  //     canvasElement!, 
  //     shownLayerNamesSeq, // 依照 shownLayerNamesSeq
  //     layerCanvasElementsRef,
  //     (layerName) => createCanvas(createLayerClassName(config.name, layerName))
  //   )

  //   // init layers
  //   config.layers.forEach((layer) => {
  //     if (ShownLayerNamesSet.has(layer.name as keyof AllLayerParams)) {
  //       const layerEnableProps: LayerEnableProps<ExtendContext, PluginParams> = {
  //         svgG: context.root.querySelector(`.${createLayerClassName(config.name, layer.name)}`),
  //         canvas: context.root.querySelector(`.${createLayerClassName(config.name, layer.name)}`),
  //         // context: Object.assign({}, context) as ChartContext<ExtendContext>,
  //         context: pluginSetupProps.context,
  //         pluginParams$
  //       }
  //       layer.enable(layerEnableProps)
  //     } else {
  //       layer.destroy()
  //     }
  //   })
    
  // })

  // const subscription = combineLatest({
  //   context: context$,
  //   shownLayerNames: shownLayerNames$
  // }).pipe(
  //   switchMap(async d => d),
  //   filter(({ context }) => context !== null)
  // ).subscribe(({ context, shownLayerNames }) => {
  //   // init layers
  //   config.layers.forEach((layer) => {
  //     if (shownLayerNames.has(layer.name as keyof PluginParams)) {
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
      SettedIsShowKeySet$.next(new Set([...Array.from(SettedIsShowKeySet$.getValue()), ...names]))
    },
    showOnly: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      SettedIsShowKeySet$.next(new Set([...names]))
    },
    showAll: () => {
      SettedIsShowKeySet$.next(getAllLayerNamesSet())
    },
    hide: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      SettedIsShowKeySet$.next(new Set([...Array.from(SettedIsShowKeySet$.getValue()).filter(name => !names.includes(name))]))
    },
    hideAll: () => {
      SettedIsShowKeySet$.next(new Set())
    },
    toggle: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      Array.from(SettedIsShowKeySet$.getValue()).forEach(shown => {
        if (names.includes(shown)) {
          names.splice(names.indexOf(shown), 1)
        } else {
          names.push(shown)
        }
      })
      SettedIsShowKeySet$.next(new Set(names))
    },
    getShownLayerNames: () => {
      return Array.from(SettedIsShowKeySet$.getValue())
    },
    // layer params
    // setLayers: (partial: DeepPartial<PluginParams>) => {
    //   params = { ...params, ...partial }
    // },
    updateParams: (patch: DeepPartial<PluginParams | AllLayerParams>) => {
      // plugin params
      pluginPatchParams$.next(patch)
      // layer params
      Object.keys(patch).forEach((key) => {
        const layer = allLayerInstances[key as keyof AllLayerParams]
        if (layer) {
          layer.updateParams((patch as Record<string, any>)[key])
        }
      })
      
      SettedParamsKeySet$.next(getParamsKeySet(patch))
    },
    forceReplaceParams: (full: PluginParams | AllLayerParams) => {
      // plugin params
      pluginForceReplaceParams$.next(full)
      // layer params
      Object.keys(full).forEach((key) => {
        const layer = allLayerInstances[key as keyof AllLayerParams]
        if (layer) {
          layer.forceReplaceParams((full as Record<string, any>)[key])
        }
      })
      SettedParamsKeySet$.next(getParamsKeySet(full))
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

      context.size$.subscribe(size => {
        const svgElement: SVGSVGElement | null = context.root.querySelector(`.${svgClassName}`)
        const canvasElement: HTMLCanvasElement | null = context.root.querySelector(`.${canvasClassName}`)
        if (svgElement) {
          svgElement.setAttribute('width', size.width.toString())
          svgElement.setAttribute('height', size.height.toString())
        }
        if (canvasElement) {
          canvasElement.width = size.width
          canvasElement.height = size.height
        }
      })
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
      // SettedIsShowKeySet$.next(getAllLayerNamesSet())
    },
    destroy: () => {
      destroySetup()
      // subscription.unsubscribe()
      context$.complete()
      SettedIsShowKeySet$.complete()
      
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