
// 是否為原始物件
export function isPlainObject(variable: any) {
  return Object.prototype.toString.call(variable) === "[object Object]";
}

// 是否為function
export function isFunction(fn: any) {
  // return !!fn && !fn.nodename && fn.constructor != String && fn.constructor != RegExp && fn.constructor != Array && /function/i.test(fn + "");
  return Object.prototype.toString.call(fn) === '[object Function]'
}

// 是否為dom
export function isDom(obj: any) {
  return !!(obj && obj.nodeType);
}

// 將可選的參數和預設值合併
export function mergeOptionsWithDefault<Options extends { [key: string]: any; }> (options: {[key: string]: any}, defaultOptions: Options): Options {
  if (isPlainObject(options) === false || isPlainObject(defaultOptions) === false) {
    return Object.assign({}, defaultOptions)
  }
  const mergeObjColumns = (_options: {[key: string]: any}, _defaultOptions: {[key: string]: any}) => {
    const obj: Options = (Object.assign({}, _defaultOptions) as any)
    for (let key of Object.keys(_options)) {
      if ((key in _defaultOptions) == false) {
        continue
      }
      let objValue: any = undefined
      // 下一層的plain object
      if (isPlainObject(_options[key]) && isPlainObject(_defaultOptions[key])) {
        objValue = mergeObjColumns(_options[key], _defaultOptions[key])
        obj[key as keyof Options] = objValue
      }
      // 不是plain object直接賦值
      else {
        obj[key as keyof Options] = _options[key]
      }
    }
    return obj
  }
  
  return mergeObjColumns(options, defaultOptions)
}

// 加上千分位 ,
export function formatCommaNumber (num = 0): string {
  try {
    let parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  } catch (e: any) {
    console.error(e)
  }
}
