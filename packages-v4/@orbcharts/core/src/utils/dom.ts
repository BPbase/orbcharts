
export function createSvg (className?: string): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  svg.setAttribute('xmls', 'http://www.w3.org/2000/svg')
  svg.setAttribute('version', '1.1')
  svg.style.position = 'absolute'
  if (className) {
    svg.classList.add(className)
  }
  return svg
}

export function createCanvasElement (className?: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.style.position = 'absolute'
  if (className) {
    canvas.classList.add(className)
  }
  return canvas
}

export function createSVGGroup(className?: string): SVGGElement {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  if (className) {
    g.classList.add(className)
  }
  return g
}

export function createCanvas(className?: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  if (className) {
    canvas.classList.add(className)
  }
  return canvas
}

export function createDiv(className?: string): HTMLDivElement {
  const div = document.createElement('div')
  if (className) {
    div.classList.add(className)
  }
  return div
}