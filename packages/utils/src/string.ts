export function getNestedValue(obj, path) {
  // 支持path传入的字符串数组，例如 'a[0],'a[0].b','a[0][1]', 'a[0].b[1]', 'a[0][1].b'

  if (path?.includes('[')) {
    const pathArray = path.split(/[[\].]/).filter(Boolean)
    let value = obj

    for (const pathSegment of pathArray) {
      if (value && typeof value === 'object' && pathSegment in value) {
        value = value[pathSegment]
      }
      else {
        value = undefined
        break
      }
    }

    return value
  }

  const pathArray = path.split('.')
  let value = obj

  for (const pathSegment of pathArray) {
    if (value && typeof value === 'object' && pathSegment in value) {
      value = value[pathSegment]
    }
    else {
      value = undefined
      break
    }
  }

  return value
}

export function setNestedValue(obj, path, newValue) {
  // 支持path传入的字符串数组，例如 'a[0],'a[0].b','a[0][1]', 'a[0].b[1]', 'a[0][1].b'
  if (!obj)
    return

  if (path?.includes('[')) {
    const pathArray = path.split(/[[\].]/).filter(Boolean)
    let currentObj = obj

    for (let i = 0; i < pathArray.length - 1; i++) {
      const pathSegment = pathArray[i]
      const nextPathSegment = pathArray[i + 1]

      if (nextPathSegment === '0' || Number.parseInt(nextPathSegment)) {
        // 如果路径不存在，创建空数组
        if (!(pathSegment in currentObj) || !currentObj[pathSegment])
          currentObj[pathSegment] = []

        // 如果路径不存在，创建空对象
        if (typeof currentObj[pathSegment] !== 'object')
          currentObj[pathSegment] = {}

        currentObj = currentObj[pathSegment]
      }
      else {
        // 如果路径不存在，创建空对象
        if (!(pathSegment in currentObj) || !currentObj[pathSegment])
          currentObj[pathSegment] = {}

        currentObj = currentObj[pathSegment]
      }
    }

    // 设置最终路径的新值
    currentObj[pathArray[pathArray.length - 1]] = newValue
    return
  }

  const pathArray = path.split('.')
  let currentObj = obj

  for (let i = 0; i < pathArray.length - 1; i++) {
    const pathSegment = pathArray[i]

    if (!(pathSegment in currentObj) || !currentObj[pathSegment]) {
      // 如果路径不存在，创建空对象
      currentObj[pathSegment] = {}
    }

    currentObj = currentObj[pathSegment]
  }

  // 设置最终路径的新值
  currentObj[pathArray[pathArray.length - 1]] = newValue
}
