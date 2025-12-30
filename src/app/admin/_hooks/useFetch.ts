'use client'

import useSWR from 'swr'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export function useFetch<T>(endpoint: string | null) {
  const { token } = useSupabaseSession()

  // 内部で fetcher を定義
  const fetcher = async (url: string) => {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token!,
      },
    })
    if (!res.ok) {
      throw new Error('Failed to fetch')
    }
    return res.json()
  }

  // SWR呼び出し
  const { data, error, isLoading, mutate } = useSWR<T>(
    token && endpoint ? endpoint : null,
    fetcher
  )

  return { data, error, isLoading, mutate }
}