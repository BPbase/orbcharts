import type { DataTree, DataTreeObj, DataTreeDatum } from '../types/DataTree'
import type { ComputedDataFn } from '../types/ComputedData'
import type { ComputedDataTree } from '../types/ComputedDataTree'
import { isPlainObject } from '../utils/commonUtils'
import { seriesColorPredicate } from '../utils/orbchartsUtils'

export const computeTreeData: ComputedDataFn<'tree'> = (context) => {
  const { data = [], dataFormatter, chartParams } = context

  // <categoryLabel, categoryIndex>
  const CategoryIndexMap = new Map<string, number>(
    dataFormatter.categoryLabels.map((label, index) => [label, index])
  )

  let computedBranchData: ComputedDataTree = {
    id: '',
    index: 0,
    label: '',
    description: '',
    categoryIndex: 0,
    categoryLabel: '',
    color: '',
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
      if (isPlainObject(data) === true) {
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
          categoryLabel: root.categoryLabel,
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
    
    const formatBranchData = (branch: DataTreeObj, level: number, seq: number): ComputedDataTree => {
      const childLayer = level + 1
      const categoryLabel: string | null = branch.categoryLabel ?? null
      let categoryIndex = 0
      if (categoryLabel != null) {
        if (!CategoryIndexMap.has(categoryLabel)) {
          CategoryIndexMap.set(categoryLabel, CategoryIndexMap.size)
        }
        categoryIndex = CategoryIndexMap.get(categoryLabel) ?? 0
      }

      const currentIndex = index
      index++
      const formattedBranchData: ComputedDataTree = {
        id: branch.id,
        index: currentIndex,
        level,
        seq,
        label: branch.label ?? '',
        description: branch.description ?? '',
        categoryIndex,
        categoryLabel,
        color: seriesColorPredicate(categoryIndex, chartParams),
        data: branch.data ?? {},
        // tooltipContent: branch.tooltipContent ? branch.tooltipContent : dataFormatter.tooltipContentFormat(branch, level, seq, context),
        value: branch.value,
        visible: true, // 先給預設值
        children: (branch.children ?? []).map((d, i) => {
          // 遞迴
          return formatBranchData(d, childLayer, i)
        })
      }

      formattedBranchData.visible = dataFormatter.visibleFilter(formattedBranchData, context)

      return formattedBranchData
    }
    computedBranchData = formatBranchData(dataTreeObj, 0, 0)
  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return computedBranchData

}
