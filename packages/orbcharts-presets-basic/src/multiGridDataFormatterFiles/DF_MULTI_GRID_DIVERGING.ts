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
          position: 'right'
        },
        valueAxis: {
          position: 'bottom'
        },
      },
      // 第二個grid
      {
        groupAxis: {
          position: 'left'
        },
        valueAxis: {
          position: 'bottom'
        },
      }
    ],
    // 設定排版方式
    container: {
      gap: 200,
      rowAmount: 1,
      columnAmount: 2
    },
    separateGrid: true // 將兩個grid拆分
  }
}