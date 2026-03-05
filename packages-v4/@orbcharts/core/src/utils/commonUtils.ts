import { DeepPartial } from "../types/Common";

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
export function deepOverwrite<DeepRecord extends Record<string, any>>(full: DeepRecord, options: DeepPartial<DeepRecord>): DeepRecord {
  if (isPlainObject(options) === false || isPlainObject(full) === false) {
    return Object.assign({}, full)
  }
  const mergeObject = (_full: DeepRecord, _options: DeepPartial<DeepRecord>) => {
    const obj: DeepRecord = (Object.assign({}, _full) as any)
    for (let key of Object.keys(_options)) {
      if ((key in _full) == false) {
        continue
      }
      let objValue: any = undefined
      // 下一層的plain object
      if (isPlainObject(_options[key]) && isPlainObject(_full[key])) {
        objValue = mergeObject(_full[key], _options[key])
        obj[key as keyof DeepRecord] = objValue
      }
      // 不是plain object直接賦值
      else {
        obj[key as keyof DeepRecord] = _options[key] as DeepRecord[typeof key]
      }
    }
    return obj
  }
  
  return mergeObject(full, options)
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
