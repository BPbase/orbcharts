import {
  combineLatest,
  distinctUntilChanged,
  debounceTime,
  filter,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable } from 'rxjs'
import type { ModelData, ModelDatumSeries, ModelDatumTree } from '@orbcharts/core'
import type {
  ComputedData,
  ComputedDatumTree,
} from '../../types'
import { HierarchyPlotPluginParams } from './types'

export const treeComputedDataObservable = ({ selectedTreeData$, pluginParams$ }: {
  selectedTreeData$: Observable<ModelData<'tree'>>
  pluginParams$: Observable<HierarchyPlotPluginParams>
}): Observable<ComputedData<'tree'>> => {
  return combineLatest({
    selectedTreeData: selectedTreeData$,
    pluginParams: pluginParams$
  }).pipe(
    debounceTime(0),
    map(({ selectedTreeData, pluginParams }) => {
      function buildComputedTree (node: ModelDatumTree, parentVisible: boolean = true): ComputedDatumTree {
        // 父節點必須可見，子節點才有機會可見
        const selfVisible = parentVisible && (
          !pluginParams.visibleFilter || pluginParams.visibleFilter(node)
        )

        return {
          ...node,
          visible: selfVisible,
          children: (node.children || []).map(child => buildComputedTree(child, selfVisible))
        }
      }
      return buildComputedTree(selectedTreeData)
    })
  )
}

// 所有節點list結構
export const nodeListObservable = ({ computedData$ }: { computedData$: Observable<ComputedData<'tree'>> }) => {
  return computedData$.pipe(
    map(data => {
      function setNodeList (accNodeList: ComputedDatumTree[], branch: ComputedDatumTree) {
        accNodeList.push(branch)
        if (branch.children) {
          branch.children.forEach(childBranch => {
            accNodeList = setNodeList(accNodeList, childBranch) // 遞迴子節點
          })
        }
        return accNodeList
      }
      return setNodeList([], data)
    })
  )
}

// export const categoryLabelsObservable = ({ nodeList$, fullDataFormatter$ }: {
//   nodeList$: Observable<ComputedDataTree[]>
//   fullDataFormatter$: Observable<DataFormatterTree>
// }) => {

//   const categoryLabels$ = fullDataFormatter$.pipe(
//     map(d => d.categoryLabels),
//     distinctUntilChanged((a, b) => {
//       return JSON.stringify(a) === JSON.stringify(b)
//     }),
//   )

//   return combineLatest({
//     nodeList: nodeList$,
//     categoryLabels: categoryLabels$
//   }).pipe(
//     switchMap(async d => d),
//     map(data => {
//       const CurrentLabelSet = new Set(data.categoryLabels)
//       const ExistLabelSet = new Set(
//         data.nodeList.filter(node => node.visible).map(node => node.categoryLabel)
//       )
//       // 加入已存在的label（data.nodeList有，但是dataFormatter.categoryLabels沒有）
//       Array.from(ExistLabelSet).forEach(label => {
//         if (!CurrentLabelSet.has(label)) {
//           CurrentLabelSet.add(label)
//         }
//       })
//       // 移除不存在的label（dataFormatter.categoryLabels有，但是data.nodeList沒有）
//       Array.from(CurrentLabelSet).forEach(label => {
//         if (!ExistLabelSet.has(label)) {
//           ExistLabelSet.delete(label)
//         }
//       })

//       return Array.from(CurrentLabelSet)
//     }),
//     distinctUntilChanged((a, b) => {
//       return JSON.stringify(a) === JSON.stringify(b)
//     }),
//   )
// }

export const categoryLabelsObservable = (CategoryDataMap$: Observable<Map<string, ComputedDatumTree[]>>) => {
  return CategoryDataMap$.pipe(
    map(data => {
      return Array.from(data.keys())
    }),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a) === JSON.stringify(b)
    }),
  )
}

// 所有可見的節點
export const treeVisibleComputedDataObservable = ({ computedData$ }: { computedData$: Observable<ComputedData<'tree'>> }) => {
  return computedData$.pipe(
    map(data => {
      function filterChildren (accTree: ComputedDatumTree): ComputedDatumTree {
        const nextChildren = (accTree.children || [])
          .filter(child => child.visible !== false) // 預設視為可見
          .map(child => filterChildren(child)) // 遞迴子節點

        return {
          ...accTree,
          children: nextChildren
        }
      }
      return filterChildren(data)
    })
  )
}