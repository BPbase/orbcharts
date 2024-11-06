
type RenderCircleTextParams = {
  text: string,
  radius: number,
  lineHeight: number,
  isBreakAll: boolean,
  limit?:number
}

type Line = { width: number; text: string }

export function renderCircleText (selection: d3.Selection<any, any, any, any>, {
  text,
  radius,
  lineHeight,
  isBreakAll = false,
  limit = 0
}: RenderCircleTextParams): d3.Selection<SVGTSpanElement, Line, SVGTextElement, any> | undefined {
  if (selection == null || text == null) {
    console.error("selection or text is not defined")
    return
  }
  if (radius == null) {
    const getBox = selection.node().getBBox()
    radius = getBox.width / 2
  }

  function getWords (text: string) {
    let words
    if (isBreakAll) {
      words = text.split('')
    } else {
      words = text.split(/\s+/g) // To hyphenate: /\s+|(?<=-)/
    }
    if (!words[words.length - 1]) words.pop()
    if (!words[0]) words.shift()
    return words
  }

  // 省略文章字數
  function ellipisText (text:string, limit:number) {
    if (text && limit) {
      if (text.length > limit) {
        text = text.substring(0, limit) + "..."; // 超過字數以"..."取代
      }
    }
    return text;
  }

  function measureWidth (text: string) {
    const context = document.createElement("canvas").getContext("2d")
    // return text => context.measureText(text).width
    return context?.measureText(text)?.width ?? 0
  }

  function getTargetWidth (text: string) {
    const m = measureWidth(text.trim())
    const result = Math.sqrt(m * lineHeight)
    return result
    // return(
      // Math.sqrt(measureWidth(text.trim()) * lineHeight)
    // )
  }

  function getLines (words: string[], targetWidth: number) {
    let line: Line = { width: 0, text: '' }
    let lineWidth0 = Infinity
    const lines: Array<Line> = []
    let space = " "
    if (isBreakAll) {
      space = ""
    }
    for (let i = 0, n = words.length; i < n; ++i) {
      const lineText1 = (line.text ? line.text + space : '') + words[i]
      const lineWidth1 = measureWidth(lineText1)
      if ((lineWidth0 + lineWidth1) / 2 < targetWidth) {
        line.width = lineWidth0 = lineWidth1
        line.text = lineText1
      } else {
        lineWidth0 = measureWidth(words[i])
        line = {width: lineWidth0, text: words[i]}
        lines.push(line)
      }
    }
    return lines
  }

  function getTextRadius (lines: Array<Line>) {
    let radius = 0
    for (let i = 0, n = lines.length; i < n; ++i) {
      const dy: number = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight
      const dx: number = lines[i].width / 2
      radius = Math.max(radius, Math.sqrt(dx ** 2 + dy ** 2))
    }
    return radius
  }

  function draw (selection: d3.Selection<any, any, any, any>, text: string) {
    if(limit > 0) text = ellipisText(text,limit)
    const words = getWords(text)
    const targetWidth = getTargetWidth(text)
    const lines = getLines(words, targetWidth)
    const textRadius = getTextRadius(lines)

    let t = selection.select<SVGTextElement>("text")
    if (!t.size()) {
      t = selection.append("text")
    }
    t.attr("transform", `translate(${0},${0}) scale(${radius / textRadius})`)
    const tspanUpdate = t.selectAll<SVGTSpanElement, Line>("tspan")
      .data(lines)
    const tspanEnter = tspanUpdate.enter()
      .append<SVGTSpanElement>("tspan")
      .attr("x", 0)
      .merge(tspanUpdate as d3.Selection<SVGTSpanElement, Line, SVGTextElement, undefined>)
      .attr("y", (d: Line, i: number) => (i - lines.length / 2 + 0.8) * lineHeight)
      .text((d: Line) => d.text)
    tspanUpdate.exit().remove()

    // return selection.node()
    return tspanUpdate.merge(tspanEnter)
  }

  return draw(selection, text)
}

// 圖軸上的多行tspan
export function renderTspansOnAxis (textSelection: d3.Selection<d3.BaseType, unknown, null, undefined>, {
  textArr,
  textSizePx,
  groupAxisPosition
}: {
  textArr: string[]
  textSizePx: number
  groupAxisPosition: 'top' | 'right' | 'bottom' | 'left'
}) {
  // -- 將原本單行文字改為多行文字 --
  textSelection.text(null) // 先清空原本的 text

  const textX = Number(textSelection.attr('x'))
  let textY = Number(textSelection.attr('y'))
  if (groupAxisPosition === 'top') {
    // 當文字在上方時，要往上偏移第一行的高度
    textY -= (textArr.length - 1) * textSizePx
  }
  
  textSelection
    .selectAll('tspan')
    .data(textArr)
    .join('tspan')
    .attr('x', textX)
    .attr('y', (_d, _i) => textY + _i * textSizePx)
    .text(d => d)
}

// 四象限上的多行tspan
export function renderTspansOnQuadrant (textSelection: d3.Selection<d3.BaseType, unknown, null, undefined>, {
  textArr,
  textSizePx,
  quadrant
}: {
  textArr: string[]
  textSizePx: number
  quadrant: number
}) {
  textSelection
    .selectAll('tspan')
    .data(textArr)
    .join('tspan')
    .attr('x', 0)
    .attr('y', (_d, _i) => quadrant == 1 || quadrant == 2
      ? - (textArr.length - 1 - _i) * textSizePx
      : _i * textSizePx)
    .text(d => d)
}