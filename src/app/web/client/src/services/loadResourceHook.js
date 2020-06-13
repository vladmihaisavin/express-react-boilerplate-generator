import { useState, useEffect } from "react";
import httpClient from './httpClient'

export function useLoadResource(url, shouldLoad = true) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

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