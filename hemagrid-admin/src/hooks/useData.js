import { useState, useEffect, useCallback } from 'react'

export function useData(fetchFn, interval = 30000) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    try {
      const result = await fetchFn()
      if (result.success) {
        setData(result.data)
        setLastUpdated(new Date())
        setError(null)
      }
    } catch (err) {
      setError('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    load()
    const timer = setInterval(load, interval)
    return () => clearInterval(timer)
  }, [load, interval])

  return { data, loading, error, lastUpdated, refresh: load }
}
