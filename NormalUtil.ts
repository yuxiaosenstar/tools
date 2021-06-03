export default class NormalUtil {
  /**
   * uuid 4
   * @returns
   */
  static uuid() {
    const s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
  }

  /**
   * 判断是否是基本数据类型
   * @param value
   */
  static isPrimitive(value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * 判断是否是一个js对象
   * @param value
   */
  static isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]'
  }

  /**
   * 深拷贝
   * @param value
   */
  static cloneDeep(value) {
    // 记录被拷贝的值，避免循环引用的出现
    let memo = {}

    function baseClone(value) {
      let res
      // 如果是基本数据类型，则直接返回
      if (NormalUtil.isPrimitive(value)) {
        return value
        // 如果是引用数据类型，我们浅拷贝一个新值来代替原来的值
      } else if (Array.isArray(value)) {
        res = [...value]
      } else if (NormalUtil.isObject(value)) {
        res = { ...value }
      }

      // 检测我们浅拷贝的这个对象的属性值有没有是引用数据类型。如果是，则递归拷贝
      Reflect.ownKeys(res).forEach((key) => {
        if (typeof res[key] === 'object' && res[key] !== null) {
          //此处我们用memo来记录已经被拷贝过的引用地址。以此来解决循环引用的问题
          if (memo[res[key]]) {
            res[key] = memo[res[key]]
          } else {
            memo[res[key]] = res[key]
            res[key] = baseClone(res[key])
          }
        }
      })
      return res
    }

    return baseClone(value)
  }

  /**F
   * 浅拷贝
   * @param value
   */
  static clone(value) {
    return JSON.parse(JSON.stringify(value))
  }

  /**
   * 是否相等
   * @param a
   * @param b
   * @returns
   */
  static isEqual(a, b) {
    if (a === b) return true
    if (!(a instanceof Array)) return false
    if (!(b instanceof Array)) return false
    if (a.length !== b.length) return false
    for (let i = 0; i !== a.length; ++i) {
      if (a[i] !== b[i]) return false
    }
    return true
  }

  /**
   * 是否为数字
   * @param val
   * @returns
   */
  static isNumber(val) {
    if (
      val === '' ||
      val === null ||
      (val && val.indexOf && val.indexOf(' ') >= 0)
    ) {
      return false
    }
    if (!isNaN(val)) {
      return true
    } else {
      return false
    }
  }
}
