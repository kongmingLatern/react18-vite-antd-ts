import { getNestedValue, setNestedValue } from '../string'

describe('getNestedValue', () => {
  it('happy path', () => {
    // 准备测试数据
    const testData = {
      a: 1,
      b: 2,
    }

    // 调用函数并获取结果
    const getA = getNestedValue(testData, 'a')
    const getB = getNestedValue(testData, 'b')
    const getC = getNestedValue(testData, 'c')

    // 断言结果
    expect(getA).toBe(1)
    expect(getB).toBe(2)
    expect(getC).toBe(undefined)
  })

  it('nestedValue', () => {
    // 准备测试数据
    const testData = {
      a: {
        b: {
          c: 'test value',
        },
      },
    }

    // 调用函数并获取结果
    const result = getNestedValue(testData, 'a.b.c')

    // 断言结果
    expect(result).toBe('test value')
  })

  it('support array key', () => {
    const testData = {
      a: ['new value', 'new value'],
    } as any

    expect(getNestedValue(testData, 'a[0]')).toBe('new value')
    expect(getNestedValue(testData, 'a[1]')).toBe('new value')
  })

  it('support array nested key', () => {
    const testData = {
      a: [
        {
          startTime: 123123123,
        },
      ],
    } as any

    expect(getNestedValue(testData, 'a[0].startTime')).toBe(123123123)
  })

  it('support array unquired key', () => {
    const testData = {
      a: [
        {
          b: 'new value',
        },
        {
          b: 'new value',
        },
      ],
    } as any

    expect(getNestedValue(testData, 'a[0].b')).toBe('new value')
    expect(getNestedValue(testData, 'a[1].b')).toBe('new value')
  })

  it('support array nested deep key', () => {
    const testData = {
      a: [
        {
          b: [
            {
              c: 'new value',
            },
          ],
        },
        {
          b: [
            {
              c: 'new value',
            },
          ],
        },
      ],
    } as any

    getNestedValue(testData, 'a[0].b[0].c')
    getNestedValue(testData, 'a[1].b[0].c')

    expect(testData.a[0].b[0].c).toBe('new value')
    expect(testData.a[1].b[0].c).toBe('new value')
  })
})

describe('setNestedValue', () => {
  it('setNestedValue', () => {
    // 准备测试数据
    const testData = {} as any

    // 调用函数并设置新值
    setNestedValue(testData, 'a', 1)

    // 断言结果
    expect(testData.a).toBe(1)
    expect(testData.b).toBe(undefined)

    setNestedValue(testData, 'b', 1)
    expect(testData.a).toBe(1)
    expect(testData.b).toBe(1)
  })
  it('setNestedValue nested', () => {
    // 准备测试数据
    const testData = {} as any

    // 调用函数并设置新值
    setNestedValue(testData, 'a.b.c', 'new value')

    // 断言结果
    expect(testData.a.b.c).toBe('new value')
  })

  it('should return new value', () => {
    // 准备测试数据
    const testData = {
      a: {
        b: {
          c: 'old value',
        },
      },
    }

    // 调用函数并设置新值
    setNestedValue(testData, 'a.b.c', 'new value')

    // 断言结果
    expect(testData.a.b.c).toBe('new value')
  })

  it('support read new value', () => {
    const testData = {} as any

    setNestedValue(testData, 'a[0]', 'new value')
    setNestedValue(testData, 'a[1]', 'new value')

    expect(testData.a[0]).toBe('new value')
    expect(testData.a[1]).toBe('new value')
  })

  it('should set value when arrObject is undefined', () => {
    const testData = {
      a: [
        {
          beginTime: 'old value',
        },
      ],
    } as any

    setNestedValue(testData, 'a[1].beginTime', 'new value')

    expect(testData.a[1].beginTime).toBe('new value')
  })

  it('support array key', () => {
    const testData = {} as any

    setNestedValue(testData, 'a[0].b', 'new value')
    setNestedValue(testData, 'a[1].b', 'new value')

    expect(testData.a[0].b).toBe('new value')
    expect(testData.a[1].b).toBe('new value')
  })

  it('support array key deep 2 level', () => {
    const testData = {} as any

    setNestedValue(testData, 'a[0].b[0].c', 'new value')
    setNestedValue(testData, 'a[1].b[0].c', 'new value')

    expect(testData.a[0].b[0].c).toBe('new value')
    expect(testData.a[1].b[0].c).toBe('new value')
  })
})
