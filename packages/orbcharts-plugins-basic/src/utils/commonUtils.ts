// 取得文字寬度
export function measureTextWidth (text: string, size: number = 10) {
  const context = document.createElement("canvas").getContext("2d")
  let width = context?.measureText(text)?.width ?? 0
  return width * size / 10 // 以10為基準
}

// 取得最小及最大值 - 數字陣列
export function getMinAndMax (data: number[]): [number, number] {
  const defaultMinAndMax: [number, number] = [0, 0] // default
  if (!data.length) {
    return defaultMinAndMax
  }
  const minAndMax: [number, number] = data.reduce((prev, current) => {
    // [min, max]
    return [
      current < prev[0] ? current : prev[0],
      current > prev[1] ? current : prev[1]
    ]
  }, [data[0], data[0]])
  return minAndMax
}