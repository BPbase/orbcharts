# orbcharts

an open source chart library based on d3.js and rx.js

從資料到視覺化 - 為資料格式設計的圖表框架

demo: https://bpbase.github.io/orbcharts/

npm: https://www.npmjs.com/package/orbcharts

## Features

1. 6大資料類別

以「資料格式」為來作為最基礎的圖表分類（而非以視覺化或者圖表樣式分類），所有嵌入相同類別的 Plugins（圖表/圖型）可以共用相同的資料以及參數。

2. 模組化 Plugins

所有的圖型元素皆為 Plugins，在相同的資料類別載體當中，可以共用相同的資料及參數來擴展或更換嵌入的 Plugins，像是積木一樣一層一層往上疊加或者擴展功能。

3. 客製化開發框架

OrbCharts除了是一個開箱即用的套件，也是一個可以開發圖表的開發框架。只要依照 6 大資料類別的「資料」及「參數」規範以及 API 就可以建立自己的客製化 Plugins。

4. D3.js 及 RxJS 為基礎的開發

為了打造最具有「資料趨動」精神的圖表設計框架，底層使用 D3.js 及 RxJS 來作為主要的開發技術。這兩者都是前端開發領域中非常熱門的函式庫，具有很高的應用及擴展潛力。

5. Typescript 型別檢查

OrbCharts同時支援 Javascript 開發環境以及 Typescript 開發環境，支援 Typescript 型別檢查。

## Get Started !

### 支援環境

OrbCharts 適用於一般的前端專案當中（不受限於特定的前端框架），使用 es-module import 至 Javascript 程式當中，並同時支援 Typescript 的型別檢查。 


### 建議安裝方式

OrbCharts 支援 npm 安裝，使用以下指令即可將所有 OrbCharts 程式模組安裝至您的專案當中：

```sh
npm i orbcharts
```

### 範例

```js
import { useSeriesChart, pie, tooltip } from 'orbcharts'

const element = document.querySelector('#pie-chart')

const chart = useSeriesChart(element)

chart.plugins$.next([pie, tooltip])

chart.data$.next([
  55026,
  65057,
  45044,
  20038,
  30013,
  30020,
  32006,
  43073,
  38023,
  50018,
  75097,
  62085
])

```

## 基礎使用 - 圖表

> 本章節主要是在說明建立圖表、以及建立圖表之前所能設定的相關參數。

### 圖表類別

依照所需要的資料類別需使用不同的圖表類別來建立，依照 6 種資料類別分別對應了 6 個圖表類別：

* `SeriesChart`
* `GridChart`
* `MultiGridChart`
* `MultiValueChart`
* `RelationshipChart`
* `TreeChart`


引入方式：

```js
import { SeriesChart } from 'orbcharts'
```


### 語法

6 種圖表類別的語法和參數都是一樣的，在這邊使用 `SeriesChart` 來作示範。

```js
const chart = new SeriesChart(element, options)
```

> Note: 需注意在這邊需使用 `new` 關鍵字使用類別建構式來產生 `chart` 物件，使用一般 Function 方式呼叫是不合法的。



圖表類別裡有兩個參數 `element` 以及 `options`，其中 `element` 是必要的，它是用來繪製圖表的 Dom 根元素，而後者 `options` 是可選的。

最簡單的範例：

```js
import { SeriesChart } from 'orbcharts'

const element = document.querySelector('#pie-chart')
const chart = new SeriesChart(element)
```



在 BPChart 的設計當中，Chart 類別只是一個載體，我們還需要資料以及 Plugins 才能夠把圖型繪製出來。在下個章節我們將詳細說明這個 `chart` 的使用方式。



### 圖表類別參數

`element`

* 型別：`HTMLElement | Element`

* 說明：選取用來繪製圖表的 Dom 元素，所以的圖表 SVG 元素將會以此元素作為根節點來填加上去。




`options`

* 型別：`ChartOptionsPartial<T extends ChartType>`

* 說明：可選的參數設定，如無設定則全為預設值

* 物件欄位：

  | 名稱   | 說明                                                         | 型別                                 |
  | ------ | ------------------------------------------------------------ | ------------------------------------ |
  | preset | 圖表的「預設集」，用來取代原有的預設參數。這邊有兩種使用方式，一種是直接使用 OrbCharts 原生提供的 Preset 物件，另一種方式是自行製作 Preset。<br />詳細的使用方式請參照下個章節。 | `PresetPartial<T extends ChartType>` |

* 預設值：`{}`



## 基礎使用 - 預設集(`preset`)

> 在前一個章節當中我們介紹過在圖表類別的參數：
>
> ```js
> import { SeriesChart } from 'orbcharts'
> 
> const element = document.querySelector('#pie-chart')
> // 建立圖表物件，第一個參數為`element`，第二個參數為`options`
> const chart = new SeriesChart(element, {})
> ```
>
> 其中 `options` 可以設置「預設集」(`preset`)，這是用來預先設置圖表參數的方式，在本章節中將詳細介紹「預設集」的設定方式。



> Note:
> 
> 為方便說明，本章節中的範例將省略掉建立圖表物件的程式碼，會直接使用 `chart` 來代表一個圖表物件。


### 使用 Preset 快速建立圖表

Preset 是 OrbCharts 提供的圖表的「預設集」，提供開發者選擇使用，主要用途有二：

1. 降低使用門檻，提供開發者快速建立一個預先設定好的基礎樣式。
2. 將系統原有的預設值給覆蓋掉，操作圖表時避免一直重覆設定相同的參數。


引入方式：

```js
import { PRESET_PIE_DONUT } from 'orbcharts'
```



使用範例：

```js
const chart = new SeriesChart(element, {
  preset: PRESET_PIE_DONUT
})

chart.plugins.next([pie])
```

如果沒有使用 Preset，自行輸入 `plugin.params$`、`chartParams$`、`dataFormatter$` 的參數也可以得到相同的結果，這個部份後面會做說明。


## 基礎使用 - 圖表參數(`chartParams`)

(coming soon)

## 基礎使用 - 輸入資料(`data`及`dataFormatter`)

(coming soon)

## Plugins

(coming soon)

