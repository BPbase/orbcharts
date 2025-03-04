# OrbCharts

![logo - light mode](https://orbcharts.blueplanet.com.tw/images/logo_light_temp2.png)

OrbCharts is a "data-driven JavaScript chart library" that currently supports 6 data types, 23 chart types, 50 plugins, and 100 preset style combinations.

[Official Website](https://orbcharts.blueplanet.com.tw)

## Features

1. 6 Major Data Formats

OrbCharts is centered around 6 "data formats", each corresponding to unique visualizations. You can manipulate the data through parameters - filtering, axis transformation, scaling, etc., dynamically mapping to the chart's visual presentation.

2. Modular Plugins

All chart elements are embedded plugins that can be dynamically extended or replaced within the same data category, stacking or expanding functionality like building blocks.

1. Based on D3.js and RxJS

To create the most "data-driven" chart design framework, D3.js and RxJS are used as the main development technologies. Both are very popular libraries in the front-end development field, with high application and expansion potential.

## Get Started!

### Installation

OrbCharts supports CDN downloads and npm installation, is not limited to specific front-end frameworks, and supports both JavaScript and TypeScript development environments.

Here are several installation methods:

1. npm installation

```sh
npm i orbcharts
```

2. ESM format CDN download

```html
<script type="module">
import * as orbcharts from 'https://cdn.jsdelivr.net/npm/orbcharts@3.0.1/+esm'
</script>
```

3. UMD format CDN download

```html
<script src="https://cdn.jsdelivr.net/npm/orbcharts@3.0.1/dist/orbcharts.umd.min.js"></script>
```

### Execution

This is an executable program to start creating your first pie chart:

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

OrbCharts is released under the [Apache License 2.0](https://github.com/BPbase/orbcharts/blob/main/LICENSE).
