/**
 * DOM 元素生命週期管理工具
 * 提供類似 D3.js 的 enter/update/exit 模式
 */

/**
 * 比較兩個數組是否相等
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((val, i) => val === b[i])
}

/**
 * 高效的元素重新排序函數，使用最少的 DOM 操作
 */
export function reorderElements<T extends Element>(
  parent: Element, 
  targetOrder: string[], 
  elementsRef: Record<string, T>
): void {
  // 獲取當前所有相關的子元素
  const currentElements = targetOrder
    .map(name => elementsRef[name])
    .filter(el => el && el.parentNode === parent)

  if (currentElements.length === 0) return

  // 檢查當前順序是否已經正確
  let isCorrectOrder = true
  let previousElement: Element | null = null
  
  for (const element of currentElements) {
    if (previousElement && previousElement.nextElementSibling !== element) {
      isCorrectOrder = false
      break
    }
    previousElement = element
  }

  // 如果順序已經正確，直接返回
  if (isCorrectOrder) return

  // 使用 DocumentFragment 來批量操作，減少 reflow
  const fragment = document.createDocumentFragment()
  
  // 按照目標順序將元素添加到 fragment
  targetOrder.forEach(name => {
    const element = elementsRef[name]
    if (element && element.parentNode === parent) {
      fragment.appendChild(element)
    }
  })
  
  // 一次性將所有元素插入回父元素
  parent.appendChild(fragment)
}

/**
 * 元素工廠函數類型
 */
export type ElementFactory<T extends Element> = (id: string) => T

/**
 * 生命週期鉤子函數類型
 */
export interface LifecycleHooks<T extends Element> {
  /** 元素進入時的回調 */
  onEnter?: (element: T, id: string) => void
  /** 元素更新時的回調 */
  onUpdate?: (element: T, id: string) => void
  /** 元素退出前的回調 */
  onExit?: (element: T, id: string) => void
}

/**
 * D3.js 風格的元素生命週期管理：處理 enter/update/exit
 * 
 * @param parent 父容器元素
 * @param targetIds 目標元素 ID 列表（按順序）
 * @param elementsRef 元素引用字典
 * @param createElement 元素創建工廠函數
 * @param hooks 生命週期鉤子函數（可選）
 */
export function handleElementLifecycle<T extends Element>(
  parent: Element,
  targetIds: string[],
  elementsRef: Record<string, T>,
  createElement: ElementFactory<T>,
  hooks?: LifecycleHooks<T>
): void {
  // Exit: 移除不再需要的元素
  const currentIds = Object.keys(elementsRef)
  const toRemove = currentIds.filter(id => !targetIds.includes(id))
  
  toRemove.forEach(id => {
    const element = elementsRef[id]
    if (element && element.parentNode === parent) {
      // 執行退出回調
      hooks?.onExit?.(element, id)
      
      // 從 DOM 移除
      parent.removeChild(element)
    }
    delete elementsRef[id]
  })

  // Enter: 創建新元素
  const toAdd = targetIds.filter(id => !elementsRef[id])
  
  toAdd.forEach(id => {
    const element = createElement(id)
    elementsRef[id] = element
    parent.appendChild(element)
    
    // 執行進入回調
    hooks?.onEnter?.(element, id)
  })

  // Update: 處理已存在的元素
  const existing = targetIds.filter(id => elementsRef[id] && !toAdd.includes(id))
  existing.forEach(id => {
    const element = elementsRef[id]
    hooks?.onUpdate?.(element, id)
  })

  // 重新排序所有存在的元素
  if (targetIds.length > 0) {
    reorderElements(parent, targetIds, elementsRef)
  }
}

// /**
//  * 創建 SVG group 元素的工廠函數
//  */
// export function createSVGGroup(className?: string): ElementFactory<SVGGElement> {
//   return (id: string) => {
//     const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
//     g.classList.add(className ? `${className}--${id}` : `layer--${id}`)
//     return g
//   }
// }

// /**
//  * 創建 Canvas 元素的工廠函數
//  */
// export function createCanvas(className?: string): ElementFactory<HTMLCanvasElement> {
//   return (id: string) => {
//     const canvas = document.createElement('canvas')
//     canvas.classList.add(className ? `${className}--${id}` : `layer--${id}`)
//     return canvas
//   }
// }

// /**
//  * 創建通用 DIV 元素的工廠函數
//  */
// export function createDiv(className?: string): ElementFactory<HTMLDivElement> {
//   return (id: string) => {
//     const div = document.createElement('div')
//     div.classList.add(className ? `${className}--${id}` : `layer--${id}`)
//     return div
//   }
// }
