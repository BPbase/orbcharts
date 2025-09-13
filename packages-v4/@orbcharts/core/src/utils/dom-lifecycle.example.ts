/**
 * DOM 生命週期管理工具使用示例
 */

import { handleElementLifecycle, createSVGGroup, createCanvas, createDiv } from './dom-lifecycle'

// 示例 1: 管理 SVG 圖層
function manageSVGLayers() {
  const svgRoot = document.querySelector('svg') as SVGSVGElement
  const layerElements: Record<string, SVGGElement> = {}
  
  // 顯示圖層 A, B, C
  handleElementLifecycle(
    svgRoot,
    ['layerA', 'layerB', 'layerC'],
    layerElements,
    createSVGGroup('chart-layer'),
    {
      onEnter: (element, id) => {
        console.log(`圖層 ${id} 已創建`)
        element.style.opacity = '0'
        // 淡入動畫
        element.animate([
          { opacity: '0' },
          { opacity: '1' }
        ], { duration: 300, fill: 'forwards' })
      },
      onExit: (element, id) => {
        console.log(`圖層 ${id} 即將移除`)
        // 淡出動畫
        element.animate([
          { opacity: '1' },
          { opacity: '0' }
        ], { duration: 300 })
      }
    }
  )
  
  // 後來只顯示 B, D (A,C 會被移除，D 會新增)
  setTimeout(() => {
    handleElementLifecycle(
      svgRoot,
      ['layerB', 'layerD'],
      layerElements,
      createSVGGroup('chart-layer')
    )
  }, 2000)
}

// 示例 2: 管理 Canvas 圖層
function manageCanvasLayers() {
  const container = document.querySelector('.canvas-container') as HTMLElement
  const canvasElements: Record<string, HTMLCanvasElement> = {}
  
  handleElementLifecycle(
    container,
    ['background', 'data', 'interaction'],
    canvasElements,
    createCanvas('canvas-layer'),
    {
      onEnter: (canvas, id) => {
        // 設置 canvas 屬性
        canvas.width = 800
        canvas.height = 600
        canvas.style.position = 'absolute'
        console.log(`Canvas ${id} 已創建並配置`)
      },
      onUpdate: (canvas, id) => {
        // 更新邏輯（如果需要）
        console.log(`Canvas ${id} 已更新`)
      }
    }
  )
}

// 示例 3: 動態圖表組件
class DynamicChart {
  private container: HTMLElement
  private layers: Record<string, HTMLDivElement> = {}
  
  constructor(container: HTMLElement) {
    this.container = container
  }
  
  updateLayers(layerNames: string[]) {
    handleElementLifecycle(
      this.container,
      layerNames,
      this.layers,
      createDiv('chart-component'),
      {
        onEnter: (div, id) => {
          div.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
          `
          div.setAttribute('data-layer', id)
        },
        onExit: (div, id) => {
          // 清理事件監聽器或其他資源
          console.log(`清理圖層 ${id} 的資源`)
        }
      }
    )
  }
  
  getLayer(name: string): HTMLDivElement | undefined {
    return this.layers[name]
  }
}

// 使用示例
const chart = new DynamicChart(document.querySelector('.chart-container')!)

// 初始化顯示基礎圖層
chart.updateLayers(['background', 'grid', 'data'])

// 添加交互圖層
setTimeout(() => {
  chart.updateLayers(['background', 'grid', 'data', 'tooltip', 'legend'])
}, 1000)

// 切換到簡化視圖
setTimeout(() => {
  chart.updateLayers(['background', 'data'])
}, 3000)

export { manageSVGLayers, manageCanvasLayers, DynamicChart }
