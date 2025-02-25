# OrbCharts

![logo - light mode](https://orbcharts.blueplanet.com.tw/images/logo_light_temp2.png)

「資料驅動的 Javascript 圖表函式庫」

* [官方網站](https://orbcharts.blueplanet.com.tw)

* [NPM](https://www.npmjs.com/package/orbcharts)


## Features

1. 6 大資料格式

OrbCharts 以 6 種「資料格式」為核心，每個資料格式各別對應到獨特的視覺化型式，可以透過參數對資料進行操作 - 過瀘、軸轉、比例尺等，動態的映射到圖表的視覺呈現。

2. 模組化 Plugins

所有的圖型元素皆為嵌入式的 Plugins，在相同的資料類別當中可以動態的擴展或更換，像是積木一樣一層一層往上疊加或者擴展功能。

3. D3.js 及 RxJS 為基礎

為了打造最具有「資料驅動」精神的圖表設計框架，底層使用 D3.js 及 RxJS 來作為主要的開發技術。這兩者都是前端開發領域中非常熱門的函式庫，具有很高的應用及擴展潛力。


## Get Started !

### 安裝

OrbCharts 提供 npm 安裝方式，適用於一般使用 webpack, vite 等打包工具的前端開發專案中，不受限於特定的前端框架，同時支援 Javascript 以及 Typescript 開發環境。

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

## License

OrbCharts 基於 [Apache License 2.0](https://github.com/BPbase/orbcharts/blob/main/LICENSE) 發布。
