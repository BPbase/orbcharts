
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