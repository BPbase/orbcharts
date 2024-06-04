import type { ComputedDataFn } from '../types/ComputedData'
import type { DataFormatterGrid } from '../types/DataFormatterGrid'
import type { ComputedDataGrid } from '../types/ComputedDataGrid'
import { computeGridData } from '../grid/computeGridData'

export const computeMultiGridData: ComputedDataFn<'multiGrid'> = ({ data = [], dataFormatter, chartParams, layout }) => {
  if (!data.length) {
    return []
  }

  let multiGridData: ComputedDataGrid[] = []

  try {
    multiGridData = data.map((d, i) => {
      const dataFormatterGrid: DataFormatterGrid = {
        ...dataFormatter.multiGrid[i],
        type: `multiGrid_${i}` as any, // 非規範的名稱，用作 datum id 前綴
        // colors: dataFormatter.colors,
        colorsPredicate: dataFormatter.multiGrid[i].colorsPredicate,
        visibleFilter: dataFormatter.visibleFilter as any, // 用any避開function參數型別不同
        // padding: dataFormatter.padding,
        tooltipContentFormat: dataFormatter.tooltipContentFormat as any, // 用any避開function參數型別不同
      }
      // const layoutGrid: ComputedLayoutBase = {
      //   width: layout.width,
      //   height: layout.height,
      //   top: layout.top,
      //   right: layout.right,
      //   bottom: layout.bottom,
      //   left: layout.left,
      //   rootWidth: layout.rootWidth,
      //   rootHeight: layout.rootHeight,
      //   // content: layout.content[i]
      // }
      return computeGridData({
        data: d,
        dataFormatter: dataFormatterGrid,
        chartParams,
        layout
      })
    })
  } catch (e) {
    // console.error(e)
    throw Error(e)
  }

  return multiGridData
}
