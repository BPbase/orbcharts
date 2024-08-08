import type { DataTree, DataTreeObj, DataTreeDatum } from '../types/DataTree'
import type { ComputedDataFn } from '../types/ComputedData'
import type { ComputedDataTree } from '../types/ComputedDataTree'
import { isObject } from '../utils/commonUtils'

export const computeTreeData: ComputedDataFn<'tree'> = (context) => {
  const { data = [], dataFormatter, chartParams } = context

  let computedBranchData: ComputedDataTree = {
    id: '',
    index: 0,
    label: '',
    description: '',
    visible: true,
    // tooltipContent: '',
    data: {},
    value: 0,
    level: 0,
    seq: 0,
    children: []
  }

  try {
    // 建立樹狀結構資料
    const dataTreeObj: DataTreeObj = (function () {
      if (isObject(data) === true) {
        // 原本就是樹狀結構則直接複製
        return structuredClone(data) as DataTreeObj
      } else if (Array.isArray(data) === false) {
        return {
          id: ''
        }
      }
      // -- 陣列格式轉物件 --
      // let rootId = ''
      let root: DataTreeDatum | undefined = undefined
      // const DataMap: Map<string, DataTreeDatum> = new Map()
      const ChildrenMap: Map<string, DataTreeDatum[]> = new Map()
      ;(data as DataTreeDatum[]).forEach(d => {
        // DataMap.set(d.id, d)

        if (!d.parent) {
          // rootId = d.id
          root = d
        } else {
          const children: DataTreeDatum[] = ChildrenMap.get(d.parent) ?? []
          children.push(d)
          ChildrenMap.set(d.parent!, children)
        }
      })

      const createBranchData = (root: DataTreeDatum): DataTreeObj => {
        return {
          id: root.id,
          label: root.label,
          data: root.data,
          // tooltipContent: root.tooltipContent,
          value: root.value,
          children: (ChildrenMap.get(root.id) ?? []).map(d => {
            // 遞迴
            return createBranchData(d)
          })
        }
      }
      if (root) {
        return createBranchData(root)
      } else {
        return {
          id: ''
        }
      }    
    })()

    let index = 0
    
    const formatBranchData = (branchRoot: DataTreeObj, level: number, seq: number): ComputedDataTree => {
      const childLayer = level + 1
      const visible = dataFormatter.visibleFilter(branchRoot, level, seq, context)
      const currentIndex = index
      index++
      return {
        id: branchRoot.id,
        index: currentIndex,
        level,
        seq,
        label: branchRoot.label ?? '',
        description: branchRoot.description ?? '',
        data: branchRoot.data ?? {},
        // tooltipContent: branchRoot.tooltipContent ? branchRoot.tooltipContent : dataFormatter.tooltipContentFormat(branchRoot, level, seq, context),
        value: branchRoot.value,
        visible,
        children: (branchRoot.children ?? []).map((d, i) => {
          // 遞迴
          return formatBranchData(d, childLayer, i)
        })
      }
    }
    computedBranchData = formatBranchData(dataTreeObj, 0, 0)
  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return computedBranchData

}
