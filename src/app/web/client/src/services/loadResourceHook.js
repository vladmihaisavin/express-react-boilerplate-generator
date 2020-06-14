import { useState, useEffect } from "react";
import httpClient from './httpClient'

export function useLoadResource(url, shouldLoad = true) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(shouldLoad)

  useEffect(() => {
    async function getResource() {
      setLoading(true)
      const response = await httpClient.get(url)
      
      setData(response.data)
      setLoading(false)
    }
    if (shouldLoad) {
      getResource()
    }
  }, [url, shouldLoad])

  return [data, loading]
}