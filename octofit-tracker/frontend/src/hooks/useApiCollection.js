import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

export function useApiCollection(endpoint, fetcher = fetchCollection) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    fetcher(endpoint, controller.signal)
      .then(setItems)
      .catch((requestError) => {
        if (requestError?.name !== 'AbortError') {
          setError(
            requestError instanceof Error
              ? requestError.message
              : String(requestError),
          )
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [endpoint, fetcher])

  return { items, loading, error }
}
