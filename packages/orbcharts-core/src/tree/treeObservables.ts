import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  merge,
  takeUntil,
  shareReplay,
  switchMap,
  Subject,
  Observable } from 'rxjs'
import type {
  ChartParams,
  ComputedDataTree,
  ComputedDataTypeMap,
  DataFormatterTree } from '../types'


// 所有節點list結構
export const nodeListObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTree> }) => {
  return computedData$.pipe(
    map(data => {
      function setNodeList (accNodeList: ComputedDataTree[], branch: ComputedDataTree) {
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

export const existCategoryLabelsObservable = ({ nodeList$, fullDataFormatter$ }: {
  nodeList$: Observable<ComputedDataTree[]>
  fullDataFormatter$: Observable<DataFormatterTree>
}) => {

  const categoryLabels$ = fullDataFormatter$.pipe(
    map(d => d.categoryLabels),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a).length === JSON.stringify(b).length
    }),
  )

  return combineLatest({
    nodeList: nodeList$,
    categoryLabels: categoryLabels$
  }).pipe(
    switchMap(async d => d),
    map(data => {
      const CurrentLabelSet = new Set(data.categoryLabels)
      const ExistLabelSet = new Set(
        data.nodeList.filter(node => node.visible).map(node => node.categoryLabel)
      )
      // 加入已存在的label（data.nodeList有，但是dataFormatter.categoryLabels沒有）
      Array.from(ExistLabelSet).forEach(label => {
        if (!CurrentLabelSet.has(label)) {
          CurrentLabelSet.add(label)
        }
      })
      // 移除不存在的label（dataFormatter.categoryLabels有，但是data.nodeList沒有）
      Array.from(CurrentLabelSet).forEach(label => {
        if (!ExistLabelSet.has(label)) {
          ExistLabelSet.delete(label)
        }
      })

      return Array.from(CurrentLabelSet)
    }),
    distinctUntilChanged((a, b) => {
      return JSON.stringify(a).length === JSON.stringify(b).length
    }),
  )
}

// 所有可見的節點
export const treeVisibleComputedDataObservable = ({ computedData$ }: { computedData$: Observable<ComputedDataTree> }) => {
  return computedData$.pipe(
    map(data => {
      function filterChildren (accTree: ComputedDataTree) {
        if (accTree.children) {
          accTree.children = accTree.children
            .filter(child => child.visible) // 篩選visible
            .map(child => filterChildren(child)) // 遞迴子節點
        }
        return accTree
      }
      return filterChildren(data)
    })
  )
}