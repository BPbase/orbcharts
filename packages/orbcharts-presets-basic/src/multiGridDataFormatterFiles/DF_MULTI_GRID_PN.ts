import type { DataFormatterFile } from '../types'

export const DF_MULTI_GRID_DIVERGING: DataFormatterFile<'multiGrid'> = {
  id: 'DF_MULTI_GRID_DIVERGING',
  chartType: 'multiGrid',
  description: '分向Gird',
  data: {
    gridList: [
      // 第一個grid
      {
        groupAxis: {
          position: 'bottom'
        },
        valueAxis: {
          position: 'left'
        },
      },
      // 第二個grid
      {
        groupAxis: {
          position: 'top'
        },
        valueAxis: {
          position: 'left'
        },
      }
    ],
    // 設定排版方式
    container: {
      gap: 0,
      rowAmount: 2,
      columnAmount: 1
    },
    separateGrid: true // 將兩個grid拆分
  }
}