import { useCallback, useState } from 'react'

export function useAsync(asyncFunction: (...args: any[]) => Promise<any>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<any>(null)

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFunction(...args)
      setData(result)
      return result
    }
    catch (err) {
      setError(err as Error)
      throw err
    }
    finally {
      setLoading(false)
    }
  }, [asyncFunction])

  return { execute, loading, error, data }
}
