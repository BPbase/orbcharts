import type { RawData, RawDataColumn, DeepPartial, Encoding } from '@orbcharts/core'

/**
 * 首頁「快速展示」共用資料 ——
 * entities 是唯一的資料來源：Bar / Bubble / XY Bubble / Categorical Bubble / Ranked Bubble
 * 這 5 種圖表直接原封不動共用這份陣列（只是 Plugin 讀取的欄位不同）。
 * Network Bubble / TreeMap 需要「關聯」而非「數值」，資料模型本質不同，
 * 因此在 entities 之外，各自只附加極少量的結構資料（邊 / 分組節點）。
 *
 * entities 裡的 parent 欄位只有 TreeMap（tree 格式）會讀取，其餘 5 種圖表完全不理會它——
 * 但為了讓「資料」面板顯示的內容跟實際餵給圖表的資料一字不差，
 * 這裡直接把 parent 寫死在 entities 本身，不在執行期另外用 .map() 動態補上。
 */
export const entities: RawDataColumn[] = [
  { id: 'mobile', name: 'Mobile', series: 'Personal', category: 'Mobile', parent: 'Personal', value: 45, x: 3.2, y: 2.1, z: 45 },
  { id: 'wearable', name: 'Wearable', series: 'Personal', category: 'Wearable', parent: 'Personal', value: 6, x: 1.5, y: 0.8, z: 6 },
  { id: 'desktop', name: 'Desktop', series: 'Shared', category: 'Desktop', parent: 'Shared', value: 28, x: 6.5, y: 4.8, z: 28 },
  { id: 'tablet', name: 'Tablet', series: 'Shared', category: 'Tablet', parent: 'Shared', value: 17, x: 5.1, y: 3.4, z: 17 },
  { id: 'tv', name: 'TV', series: 'Shared', category: 'TV', parent: 'Shared', value: 10, x: 8.0, y: 1.2, z: 10 },
]

/** TreeMap 專用：一個根節點 + 2 個分組節點，讓 entities 掛在自己的 parent 底下 */
export const treeGroups: RawDataColumn[] = [
  { id: 'root', name: 'All Devices', value: null },
  { id: 'Personal', name: 'Personal', parent: 'root', value: null },
  { id: 'Shared', name: 'Shared', parent: 'root', value: null },
]

export const treeData: RawData = [...entities, ...treeGroups]

/** Network Bubble 專用：少量代表裝置之間關聯的邊 */
export const edges: RawDataColumn[] = [
  { id: 'edge-1', source: 'mobile', target: 'desktop', value: 2 },
  { id: 'edge-2', source: 'mobile', target: 'wearable', value: 2 },
  { id: 'edge-3', source: 'desktop', target: 'tablet', value: 2 },
  { id: 'edge-4', source: 'tablet', target: 'tv', value: 2 },
]

export const graphData: RawData = [...entities, ...edges]

/** 一般情況下的 Encoding：series 分組著色（Personal / Shared） */
export const defaultEncoding: DeepPartial<Encoding> = {
  series: { ignore: false },
  color: { by: 'series' },
}

/**
 * CategoricalPlot 的類別軸範圍是由「排序後第一個 series 的資料筆數」決定
 * （而非跨 series 的全域類別聯集）。Personal 只有 2 筆、Shared 有 3 筆，
 * 若沿用預設的 series 分組，Shared 的類別會被裁切掉。
 * 這裡改用 category 分組著色：5 筆資料視為單一 series、各自依 category 上色，
 * 剛好符合 CategoricalPlot「每個類別一顆泡泡」的設計，也不需要更動 entities 本身。
 */
export const categoricalEncoding: DeepPartial<Encoding> = {
  series: { ignore: true },
  color: { by: 'category' },
}

/** 輪播的視覺呈現：對應要切換的 Plugin + Layer 組合 */
export const demoViews = [
  {
    key: 'bar',
    dataset: 'flat',
    code: "new GridPlot({ Bar: {}, CategoryAxis: {}, ValueAxis: {} })",
  },
  {
    key: 'bubble',
    dataset: 'flat',
    code: 'new PartitionPlot({ Bubble: {} })',
  },
  {
    key: 'xyBubble',
    dataset: 'flat',
    code: 'new ScatterPlot({ Bubble: {}, XYAxes: {} })',
  },
  {
    key: 'categoricalBubble',
    dataset: 'flat',
    code: 'new CategoricalPlot({ RaisedBubble: {}, CategoryAxis: {}, ValueAxis: {} })',
    encoding: categoricalEncoding,
    encodingCode: "chart.updateEncoding({ series: { ignore: true }, color: { by: 'category' } })",
  },
  {
    key: 'rankedBubble',
    dataset: 'flat',
    code: 'new RankedPlot({ RankedBubble: {}, RankAxis: {}, CategoryAxis: {} })',
  },
  {
    key: 'networkBubble',
    dataset: 'graph',
    code: 'new NetworkPlot({ ForceDirectedBubble: {} })',
  },
  {
    key: 'treeMap',
    dataset: 'tree',
    code: 'new HierarchyPlot()',
  },
] as const

export type DemoView = (typeof demoViews)[number]
export type DemoViewKey = DemoView['key']
export type DemoDataset = DemoView['dataset']
