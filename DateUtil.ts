import Calendar from './Calendar'
import fecha from './date'

export default class DateUtil {
  /**
   * 将日期格式化为指定格式字符串
   * @param date
   * @param fmt
   * @returns {*|string}
   */
  static format(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
    date = date === undefined ? new Date() : date
    date = typeof date === 'number' ? new Date(date) : date
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss'
    let obj = {
      y: date.getFullYear(), // 年份，注意必须用getFullYear
      M: date.getMonth() + 1, // 月份，注意是从0-11
      d: date.getDate(), // 日期
      q: Math.floor((date.getMonth() + 3) / 3), // 季度
      w: date.getDay(), // 星期，注意是0-6
      H: date.getHours(), // 24小时制
      h: date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
      m: date.getMinutes(), // 分钟
      s: date.getSeconds(), // 秒
      S: date.getMilliseconds(), // 毫秒
    }
    let week = ['天', '一', '二', '三', '四', '五', '六']
    for (let i in obj) {
      fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
        let val = obj[i] + ''
        if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val]
        for (let j = 0, len = val.length; j < m.length - len; j++)
          val = '0' + val
        return m.length === 1 ? val : val.substring(val.length - m.length)
      })
    }
    return fmt
  }

  /**
   * string格式转Date
   * @param text
   * @param format
   * @returns {Date}
   */
  static parseDate(text, format = 'yyyy-MM-dd HH:mm:ss') {
    if (text instanceof Date) {
      return text
    }
    return fecha.parse(text, format, null)
  }

  /**
   * 取年月日
   * @param text
   * @param format
   * @returns {Date}
   */
  static parseDatePiker(text, format) {
    let newValue = text.replace(/-/g, '')
    if (+newValue && newValue.length > 7) {
      let year = +newValue.substr(0, 4)
      let month = +newValue.substr(4, 2)
      let day = +newValue.substr(6, 2)
      return new Date(Date.UTC(year, month - 1, day))
    } else {
      return new Date()
    }
  }

  /**
   * 当月第一天
   * @param date
   * @returns {number}
   */
  static getFirstDayOfMonth(date) {
    const temp = new Date(date.getTime())
    temp.setDate(1)
    return temp.getDay()
  }

  static isDateObject(val) {
    return val instanceof Date
  }

  /**
   * 指定的年月有多少天
   * @param year
   * @param month
   * @returns {number}
   */
  static getDayCountOfMonth(year, month) {
    if (month === 3 || month === 5 || month === 8 || month === 10) {
      return 30
    }

    if (month === 1) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        return 29
      } else {
        return 28
      }
    }

    return 31
  }

  /**
   * 某天是星期几
   * @param src
   * @returns {number}
   */
  static getWeekNumber(src) {
    const date = new Date(src.getTime())
    date.setHours(0, 0, 0, 0)
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4)
    // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
    // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    )
  }

  /**
   * 指定年月的第一天
   * @param year
   * @param month
   * @returns {Date}
   */
  static getStartDateOfMonth(year, month) {
    const result = new Date(year, month, 1)
    const day = result.getDay()

    if (day === 0) {
      return DateUtil.prevDate(result, 7)
    } else {
      return DateUtil.prevDate(result, day)
    }
  }

  /**
   * 某天的前几天
   * @param date
   * @param amount
   * @returns {Date}
   */
  static prevDate(date, amount = 1) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - amount
    )
  }

  /**
   * 某天的后几天
   * @param date
   * @param amount
   * @returns {Date}
   */
  static nextDate(date, amount = 1) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + amount
    )
  }

  /**
   * 某天加几天
   * @param date
   * @param amount
   * @returns {*}
   */
  static addDate(date, amount = 1) {
    date.setDate(date.getDate() + amount)
    return date
  }

  /**
   * 某天加几年
   * @param date
   * @param amount
   * @returns {Date}
   */
  static addYear(date, amount = 1) {
    const year = date.getFullYear()
    const month = date.getMonth()
    return DateUtil.changeYearMonthAndClampDate(date, year + amount, month)
  }

  /**
   * 某天加几月
   * @param date
   * @param amount
   * @returns {Date}
   */
  static addMonth(date, amount = 1) {
    const year = date.getFullYear()
    const month = date.getMonth()
    return DateUtil.changeYearMonthAndClampDate(
      date,
      year + parseInt(String((month + amount) / 11)),
      parseInt(String(month + (amount % 11)))
    )
  }

  static isDate(date) {
    if (date === null || date === undefined) return false
    if (isNaN(new Date(date).getTime())) return false
    return true
  }

  static modifyDate(date, y, m, d) {
    return new Date(
      y,
      m,
      d,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  }

  static modifyTime(date, h, m, s) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      h,
      m,
      s,
      date.getMilliseconds()
    )
  }

  /**
   * 去除时分秒
   * @param date
   * @returns {Date}
   */
  static clearTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  /**
   * 前几年
   * @param date
   * @param amount
   * @returns {Date}
   */
  static prevYear(date, amount = 1) {
    return DateUtil.addYear(date, amount * -1)
  }

  /**
   * 后几年
   * @param date
   * @param amount
   * @returns {Date}
   */
  static nextYear(date, amount = 1) {
    return DateUtil.addYear(date, amount)
  }

  static changeYearMonthAndClampDate(date, year, month) {
    // clamp date to the number of days in `year`, `month`
    // eg: (2010-1-31, 2010, 2) => 2010-2-28
    const monthDate = Math.min(
      date.getDate(),
      DateUtil.getDayCountOfMonth(year, month)
    )
    return DateUtil.modifyDate(date, year, month, monthDate)
  }

  /**
   * 上个月
   * @param date
   * @returns {Date}
   */
  static prevMonth(date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    return month === 0
      ? DateUtil.changeYearMonthAndClampDate(date, year - 1, 11)
      : DateUtil.changeYearMonthAndClampDate(date, year, month - 1)
  }

  /**
   * 下个月
   * @param date
   * @returns {Date}
   */
  static nextMonth(date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    return month === 11
      ? DateUtil.changeYearMonthAndClampDate(date, year + 1, 0)
      : DateUtil.changeYearMonthAndClampDate(date, year, month + 1)
  }

  /**
   * 当前天数
   * @param year
   * @returns {number}
   */
  static getDayCountOfYear(year) {
    const isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)
    return isLeapYear ? 366 : 365
  }

  /**
   * 阳历
   * @returns {string}
   */
  static solarDate() {
    let solar = Calendar.solar2lunar(null, null, null)
    return solar['gzYear'] + '年' + solar['IMonthCn'] + solar['IDayCn']
  }

  /**
   * 月转年
   * @param value
   * @returns {string}
   */
  static monthConvertYear(value) {
    let year = value / 12
    if (Math.round(year) === year) {
      return year + '年'
    }
    return value + '个月'
  }

  static formatUnit(value) {
    if (!value) {
      return ''
    } else if (value === '月') {
      return '个月'
    } else {
      return value
    }
  }
}
