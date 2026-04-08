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
  Subject,
} from 'rxjs'
import type { PluginSetupProps, LayerEnableProps } from '../types'
// import { handleElementLifecycle } from '../utils/dom-lifecycle'
// import { createSVG, createCanvasElement, createSVGGroup, createCanvas } from '../utils/dom'
// import { createPluginClassName, createLayerClassName } from '../utils/orbchartsUtils'
import { deepOverwrite } from '../utils/commonUtils'
import { createOrbChartsErrorMessage, createValidatorErrorMessage, createValidatorWarningMessage } from '../utils/errorMessage'

export const createPlugin = <
  ElementType extends 'svg' | 'canvas',
  ExtendContext extends ExtendableContext,
  PluginParams,
  AllLayerParams
>(elementType: ElementType, config: DefinePluginConfig<ExtendContext, PluginParams, AllLayerParams>, initPluginParams?: DeepPartial<PluginParams | AllLayerParams>): PluginEntity<ElementType, PluginParams, AllLayerParams> => {
  // const svgClassName = `${createPluginClassName(config.name)}__svg`
  // const svgGClassName = `${createPluginClassName(config.name)}__g`
  // const canvasClassName = `${createPluginClassName(config.name)}__canvas`

  // 內部保存起來的 id
  let _id = config.name
  
  let destroySetup = () => {}

  const context$ = new BehaviorSubject<ChartContext<ExtendContext> | null>(null)
  const injectedContext$ = context$.pipe(
    filter((context): context is ChartContext<ExtendContext> => context !== null)
  )

  // element 全部保存起來避免重複創建
  // const layerSVGElementsRef: Record<string, SVGElement> = {}
  // const layerCanvasElementsRef: Record<string, HTMLCanvasElement> = {}

  // 全部的layers
  const allLayerInstances = {
    // 將陣列轉成字典
    ...config.layers.reduce((acc, layer) => {
      acc[layer._name as keyof AllLayerParams] = layer
      return acc
    }, {} as Record<keyof AllLayerParams, typeof config.layers[number]>)
  }
  const getAllLayerNamesSet = () => new Set(config.layers.map(l => l._name as keyof AllLayerParams))
  // const getParamsKeySet = (params: DeepPartial<PluginParams | AllLayerParams>): Set<keyof AllLayerParams> => {
  //   // 取得有設定 params 的 layer name
  //   if (params) {
  //     const AllLayerNamesSet = getAllLayerNamesSet()
  //     const keysOfParams = Object.keys(params) as (keyof AllLayerParams)[]
  //     return new Set(keysOfParams.filter(key => AllLayerNamesSet.has(key)))
  //   }
  //   return new Set()
  // }
  const getParamsKeys = (params: DeepPartial<PluginParams | AllLayerParams>): (keyof AllLayerParams)[] => {
    // 取得有設定 params 的 layer name
    if (params) {
      const AllLayerNamesSet = getAllLayerNamesSet()
      const keysOfParams = Object.keys(params) as (keyof AllLayerParams)[]
      return keysOfParams.filter(key => AllLayerNamesSet.has(key))
    }
    return []
  }

  // config 設定顯示的 layers
  const systemInitLayerNames = config.layers.reduce((prev, current) => {
    if (current._initShow) {
      prev.push(current._name as keyof AllLayerParams)
    }
    return prev
  }, [] as (keyof AllLayerParams)[])
  // 有設定 params 對應的 layers 名稱
  const initLayerNames = getParamsKeys(initPluginParams)
  // const InitLayerNameSet$ = new BehaviorSubject<Set<keyof AllLayerParams>>(getParamsKeySet(initPluginParams))
  // 有設定 show/showOnly 等的 layers 名稱
  const ShownLayerNameSet$ = new BehaviorSubject<Set<keyof AllLayerParams>>(
    new Set(initLayerNames.length > 0 ? initLayerNames : systemInitLayerNames)
  )
  // 顯示的 layers 名稱
  // const getShownLayerNames = ({ InitLayerNameSet, IsShowLayerNameSet }: { InitLayerNameSet: Set<keyof AllLayerParams>, IsShowLayerNameSet: Set<keyof AllLayerParams> | null }) => {
  //   const ShownLayerNameSet = IsShowLayerNameSet == null ? InitLayerNameSet : IsShowLayerNameSet // IsShowLayerNameSet 預設為 null
  //   return ShownLayerNameSet
  // }
  // const ShownLayerNameSet$ = combineLatest({
  //   InitLayerNameSet: InitLayerNameSet$,
  //   IsShowLayerNameSet: IsShowLayerNameSet$
  // }).pipe(
  //   debounceTime(0),
  //   // filter(({ context }) => context !== null),
  //   map(({ InitLayerNameSet, IsShowLayerNameSet }) => {
  //     return getShownLayerNames({ InitLayerNameSet, IsShowLayerNameSet })
  //   })
  // )
  // 顯示的 layers 名稱依照 layerIndex 排序
  const shownLayerNamesSeq$ = ShownLayerNameSet$.pipe(
    map(ShownLayerNameSet => {
      // 依照 layerIndex 排序
      const shownLayerNamesSeq: string[] = Array.from(ShownLayerNameSet)
        .map(name => [
          name,
          config.layers.find(l => l._name === name)?._layerIndex ?? -1
        ])
        .filter(([, index]) => index !== -1)
        .sort((a, b) => (a[1] as number) - (b[1] as number))
        .map(([name]) => name as string)
      return shownLayerNamesSeq
    })
  )

  // plugin 的根元素
  // const pluginElement$: Observable<SVGGElement | HTMLCanvasElement> = injectedContext$.pipe(
  //   map(context => {
  //     // -- 在 svg 或 canvas 元素底下建立 plugin 的元素 --
  //     if (elementType === 'svg') {
  //       let svgGElement: SVGGElement | null = context.svg.querySelector(`.${svgGClassName}`)
  //       if (!svgGElement) {
  //         svgGElement = createSVGGroup(svgGClassName)
  //         context.svg.appendChild(svgGElement)
  //       }
  //       return svgGElement
  //     } else if (elementType === 'canvas') {
  //       let canvasElement: HTMLCanvasElement | null = context.canvas.querySelector(`.${canvasClassName}`)
  //       if (!canvasElement) {
  //         canvasElement = createCanvasElement(canvasClassName)
  //         context.canvas.appendChild(canvasElement)
  //       }
  //       return canvasElement
  //     }
  //   })
  // )

  // update plugin params
  const patchPluginParams$ = new BehaviorSubject<DeepPartial<AllLayerParams | PluginParams> | undefined>(
    initPluginParams ?? {}
  )

  // force replace plugin params
  const forceReplacePluginParams$ = new Subject<DeepPartial<AllLayerParams | PluginParams> | undefined>()

  const pluginParams$ = new Observable<PluginParams>(subscriber => {
    // -- update --
    patchPluginParams$.subscribe(patch => {
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
      // console.log('newParams', newParams)
      subscriber.next(newParams)
    })

    // -- force replace --
    forceReplacePluginParams$.subscribe(full => {
      subscriber.next(full as PluginParams)
    })
  })
  
  // patchPluginParams$.pipe(
  //   map(patch => {
  //     try {
  //       // 檢查 data$ 資料格式是否正確
  //       const { status, columnName, expectToBe } = config.validator(patch)
  //       if (status === 'error') {
  //         throw new Error(createValidatorErrorMessage({
  //           columnName,
  //           expectToBe,
  //           from: `${config.name}.params$`
  //         }))
  //       } else if (status === 'warning') {
  //         console.warn(createValidatorWarningMessage({
  //           columnName,
  //           expectToBe,
  //           from: `${config.name}.params$`
  //         }))
  //       }
  //     } catch (e) {
  //       // throw new Error(e.message)
  //       // 驗證失敗仍繼續執行，才不會把 Observable 資料流給中斷掉
  //       console.error(createOrbChartsErrorMessage(e))
  //     }

  //     return deepOverwrite(config.defaultParams, patch as DeepPartial<PluginParams> ?? {})
  //   }),
  //   shareReplay(1)
  // )

  const pluginSetupProps$: Observable<PluginSetupProps<ExtendContext, PluginParams>> = injectedContext$.pipe(
    map((context) => {
      // const pluginSetupProps: PluginSetupProps<ExtendContext, PluginParams> = 
      //   elementType === 'svg' ? {
      //     context: context as ChartContext<ExtendContext>, // 初始化時 context 有可能被 in place 擴展
      //     svgG: pluginElement as SVGSVGElement,
      //     pluginParams$
      //   } : {
      //     context: context as ChartContext<ExtendContext>,
      //     canvas: pluginElement as HTMLCanvasElement,
      //     pluginParams$
      //   }
      return {
        context, // 初始化時 context 有可能被 in place 擴展
        pluginParams$
      }
    }),
    first() // 只做初始化
  )

  combineLatest({
    pluginSetupProps: pluginSetupProps$,
    ShownLayerNameSet: ShownLayerNameSet$,
    shownLayerNamesSeq: shownLayerNamesSeq$
  }).pipe(
    debounceTime(0)
  ).subscribe(({ pluginSetupProps, ShownLayerNameSet, shownLayerNamesSeq }) => {
    
    // 更新 layer elements
    const layerElements = pluginSetupProps.context._updateLayerElements(
      elementType,
      _id,
      shownLayerNamesSeq.map(layer => ({
        pluginId: _id,
        pluginName: config.name,
        layerName: layer,
        layerIndex: allLayerInstances[layer as keyof AllLayerParams]._layerIndex
      }))
    )

    // init plugin
    if (config.setup) {
      destroySetup = config.setup(pluginSetupProps)
    }

    // // layer element - 處理 SVG 元素的 enter/update/exit
    // if (elementType === 'svg') {
    //   handleElementLifecycle(
    //     // (pluginSetupProps as PluginSetupProps<ExtendContext, PluginParams>).svgG,
    //     pluginSetupProps.context.svg, 
    //     shownLayerNamesSeq, // 依照 shownLayerNamesSeq
    //     layerSVGElementsRef,
    //     (layerName) => createSVGGroup(createLayerClassName(config.name, layerName))
    //   )
    // }
    
    // // layer element - 處理 Canvas 元素的 enter/update/exit
    // if (elementType === 'canvas') {
    //   handleElementLifecycle(
    //     // (pluginSetupProps as PluginSetupProps<ExtendContext, PluginParams>).canvas, 
    //     pluginSetupProps.context.canvas,
    //     shownLayerNamesSeq, // 依照 shownLayerNamesSeq
    //     layerCanvasElementsRef,
    //     (layerName) => createCanvas(createLayerClassName(config.name, layerName))
    //   )
    // }

    // init layers
    config.layers.forEach((layer) => {
      if (ShownLayerNameSet.has(layer._name as keyof AllLayerParams)) {
        const layerEnableProps: LayerEnableProps<'svg' | 'canvas', ExtendContext, PluginParams, unknown> = 
          elementType === 'svg' ? 
            {
              // svgG: (pluginSetupProps as PluginSetupProps<'svg', ExtendContext, PluginParams>).svgG.querySelector(`.${createLayerClassName(config.name, layer.name)}`),
              svgG: layerElements[layer._name as keyof AllLayerParams] as SVGGElement,
              // canvas: context.root.querySelector(`.${createLayerClassName(config.name, layer.name)}`),
              // context: Object.assign({}, context) as ChartContext<ExtendContext>,
              context: pluginSetupProps.context,
              pluginParams$,
              initLayerParams: patchPluginParams$.getValue()?.[layer._name as keyof AllLayerParams] as unknown || {}
            }
          : {
              // svgG: context.root.querySelector(`.${createLayerClassName(config.name, layer.name)}`),
              // canvas: (pluginSetupProps as PluginSetupProps<'canvas', ExtendContext, PluginParams>).canvas.querySelector(`.${createLayerClassName(config.name, layer.name)}`),
              canvas: layerElements[layer._name as keyof AllLayerParams] as HTMLCanvasElement,
              // context: Object.assign({}, context) as ChartContext<ExtendContext>,
              context: pluginSetupProps.context,
              pluginParams$,
              initLayerParams: patchPluginParams$.getValue()?.[layer._name as keyof AllLayerParams] as unknown || {}
            }
            
        layer._enable(layerEnableProps)
      } else {
        layer._disable()
      }
    })
  })

  return {
    // name: `${config.name}-${Math.random().toString(36).substr(2, 9)}`,
    _name: config.name,
    _elementType: elementType,
    // info: {
    //   name: config.name,
    //   layers: [config.name]
    // } as PluginInfo,
    // layerIndex: config.layerIndex,
    // contextExtension,
    // layer visibility controls
    _getId: () => _id,
    _setId: (id: string) => {
      _id = id
    },
    // 由 chart 注入 context
    _injectContext: (context) => {

      context$.next(Object.assign({}, context) as ChartContext<ExtendContext>)

      // context.size$.subscribe(size => {
      //   const svgGElement: SVGGElement | null = context.root.querySelector(`.${svgGClassName}`)
      //   const canvasElement: HTMLCanvasElement | null = context.root.querySelector(`.${canvasClassName}`)
      //   if (svgGElement) {
      //     svgGElement.setAttribute('width', size.width.toString())
      //     svgGElement.setAttribute('height', size.height.toString())
      //   }
      //   if (canvasElement) {
      //     canvasElement.width = size.width
      //     canvasElement.height = size.height
      //   }
      // })

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
      // IsShowLayerNameSet$.next(getAllLayerNamesSet())
    },
    show: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      ShownLayerNameSet$.next(new Set([...Array.from(ShownLayerNameSet$.getValue()), ...names]))
    },
    showOnly: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      ShownLayerNameSet$.next(new Set([...names]))
    },
    showAll: () => {
      ShownLayerNameSet$.next(getAllLayerNamesSet())
    },
    hide: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      ShownLayerNameSet$.next(new Set([...Array.from(ShownLayerNameSet$.getValue()).filter(name => !names.includes(name))]))
    },
    hideAll: () => {
      ShownLayerNameSet$.next(new Set())
    },
    toggle: (names: (keyof AllLayerParams) | (keyof AllLayerParams)[]) => {
      names = Array.isArray(names) ? names : [names]
      Array.from(ShownLayerNameSet$.getValue()).forEach(shown => {
        if (names.includes(shown)) {
          names.splice(names.indexOf(shown), 1)
        } else {
          names.push(shown)
        }
      })
      ShownLayerNameSet$.next(new Set(names))
    },
    getShownLayerNames: () => {
      // const ShownLayerNameSet = getShownLayerNames({
      //   InitLayerNameSet: InitLayerNameSet$.getValue(),
      //   IsShowLayerNameSet: IsShowLayerNameSet$.getValue()
      // })
      return Array.from(ShownLayerNameSet$.getValue())
    },
    // layer params
    // setLayers: (partial: DeepPartial<PluginParams>) => {
    //   params = { ...params, ...partial }
    // },
    updateParams: (patch: DeepPartial<PluginParams | AllLayerParams>) => {
      // plugin params
      patchPluginParams$.next(patch)
      // layer params
      Object.keys(patch).forEach((key) => {
        const layer = allLayerInstances[key as keyof AllLayerParams]
        if (layer) {
          layer._updateParams((patch as Record<string, any>)[key])
        }
      })
      
      // InitLayerNameSet$.next(getParamsKeySet(patch))
    },
    forceReplaceParams: (full: PluginParams | AllLayerParams) => {
      // plugin params
      forceReplacePluginParams$.next(full)
      // layer params
      Object.keys(full).forEach((key) => {
        const layer = allLayerInstances[key as keyof AllLayerParams]
        if (layer) {
          layer._forceReplaceParams((full as Record<string, any>)[key])
        }
      })
      // InitLayerNameSet$.next(getParamsKeySet(full))
    },
    getParams: () => {
      return config.layers.reduce((acc, layer) => {
        acc[layer._name] = layer._getParams()
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
    destroy: () => {
      destroySetup()
      // subscription.unsubscribe()
      context$.complete()
      // IsShowLayerNameSet$.complete()
      ShownLayerNameSet$.complete()
      
      config.layers.forEach((layer) => {
        layer._destroy()
      })
    },
    // // outputs
    // layers$: new Observable<Record<string, PluginParams>>(subscriber => {
    //   subscriber.next(params)
    // })
  }
}