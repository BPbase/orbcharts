# orbcharts

an open source chart library based on d3.js and rx.js

從資料到視覺化 - 以資料格式分類的視覺化圖表套件

### 目前進展

一切都在如如火如荼的進行當中，我們盡可能的希望在2024年底能夠將將版本號進到正式版，也因此相關文件仍然有些缺漏，但很快的一切會盡快的完善起來：

[文件](https://orbcharts.blueplanet.com.tw/docs/guide/index.html)

[展示頁](https://orbcharts.blueplanet.com.tw/demo/list)

[npm](https://www.npmjs.com/package/orbcharts)

## Features

1. 6大資料類別

以「資料格式」為來作為最基礎的圖表分類（而非以視覺化或者圖表樣式分類），所有嵌入相同類別的 Plugins（圖表/圖型）可以共用相同的資料以及參數。

2. 模組化 Plugins

所有的圖型元素皆為 Plugins，在相同的資料類別載體當中，可以共用相同的資料及參數來擴展或更換嵌入的 Plugins，像是積木一樣一層一層往上疊加或者擴展功能。

3. D3.js 及 RxJS 為基礎的開發

為了打造最具有「資料趨動」精神的圖表設計框架，底層使用 D3.js 及 RxJS 來作為主要的開發技術。這兩者都是前端開發領域中非常熱門的函式庫，具有很高的應用及擴展潛力。

4. Typescript 型別檢查

OrbCharts同時支援 Javascript 開發環境以及 Typescript 開發環境，支援 Typescript 型別檢查。

## Get Started !

### 安裝

OrbCharts 適用於使用 npm 等套件管理的 node.js 開發環境中使用，不受限於特定的前端框架，同使支援 javascript 以及 typescript 的程式中使用（支援 typescript 的型別檢查）。

安裝指令很簡單，和所有你安裝過的套件一樣只有一行：

```sh
npm i orbcharts
```

### 執行

這是一個可執行的程式，可由此開始建立你的第一個圓餅圖：

```js
import { SeriesChart, Pie } from 'orbcharts'

const element = document.querySelector('#chart')

const chart = new SeriesChart(element)

chart.plugins$.next([new Pie()])

chart.data$.next([
  [80,120,45],
  [50,30,15,28],
  [55,13,38,10,5]
])

```

對於想快速開箱即用的使用情境， [展示頁](https://orbcharts.blueplanet.com.tw/demo/list) 可尋找更多的範例程式碼。

