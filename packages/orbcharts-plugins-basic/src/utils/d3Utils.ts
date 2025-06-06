import * as d3 from 'd3'

export function getSvgGElementSize (selection: d3.Selection<SVGGElement, any, any, any>): DOMRect {
  try {
    return selection.node()!.getBBox()
  } catch (e: any) {
    throw new Error(e)
  }
}

// 使用字串加入svg
export function appendSvg (selection: d3.Selection<any, any, any, any>, svgString: string): void {
  function parseSvg (svgString: string) {
    const div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
    div.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg">'+ svgString +'</svg>';
    const frag = document.createDocumentFragment()
    while (frag && div?.firstChild?.firstChild)
        frag.appendChild(div.firstChild.firstChild);
    return frag;
  }
  // 刪除現有子節點
  const node = selection.node()
  while(node.hasChildNodes())
  {
    node.removeChild(node.firstChild);
  }
  // 加入dom
  selection.node().appendChild(parseSvg(svgString))
}

export function getD3TransitionEase (easeName: string) {
  if (easeName.substring(0, 4) !== 'ease') {
    return d3.easeCubic
  }
  return (d3 as any)[easeName] ?? d3.easeCubic
}

export function makeD3Arc ({ axisWidth, innerRadius, outerRadius, padAngle, cornerRadius }: {
  axisWidth: number
  innerRadius: number
  outerRadius: number
  padAngle: number
  cornerRadius: number
}): d3.Arc<any, d3.DefaultArcObject> {
  const arcScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, axisWidth / 2])
  
  const _outerRadius = arcScale(outerRadius)!

  return d3.arc()
    .innerRadius(arcScale(innerRadius)!)
    .outerRadius(_outerRadius)
    .padAngle(padAngle)
    .padRadius(_outerRadius)
    .cornerRadius(cornerRadius)
}

export const parseTickFormatValue = (value: any, tickFormat: string | ((text: d3.NumberValue) =>  string | d3.NumberValue)) => {
  if (tickFormat! instanceof Function == true) {
    const v = (tickFormat as ((text: d3.NumberValue) => string))(value)
    return String(v ?? '')
  }
  return d3.format(tickFormat as string)!(value)
}

export const parseDateTickFormatValue = (value: any, tickFormat: string | ((text: d3.NumberValue) =>  string | d3.NumberValue)) => {
  if (tickFormat! instanceof Function == true) {
    return (tickFormat as ((text: d3.NumberValue) => string))(value)
  }
  return d3.timeFormat(tickFormat as string)!(value)
}

export function isLightColor (color: string) {
  // 1. 用 HSL 的亮度（較符合數學）
  // const hslColor = d3.hsl(color) // 轉換為 HSL 格式
  // const lightness = hslColor.l // 取得亮度值 (0 ~ 1)
  // 2. 用 LAB 的明度（較符合人眼感知）
  const labColor = d3.lab(color) // 轉換為 LAB 格式
  const lightness = labColor.l // 取得明度值 (0 ~ 100)

  // console.log(`顏色的亮度為: ${lightness}`);
  
  // 判斷顏色深淺
  if (lightness <= 60) {
    // console.log("這是一個深色系");
    return false
  } else {
    // console.log("這是一個淺色系");
    return true
  }
}
