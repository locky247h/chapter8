'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CategoryForm } from '../_components/CategoryForm'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。（自分で動作の制御したい）
    e.preventDefault()
    setIsSubmitting(true) // 🔵 送信開始

    try {
      // カテゴリーを作成します。
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ name }),
      })
      alert('カテゴリーを更新しました。')

    } catch (error) {
      console.error('カテゴリー更新エラー:', error)
      alert('更新に失敗しました。')

    } finally {
      setIsSubmitting(false) // 🔴 送信終了
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('カテゴリーを削除しますか？')) return
    setIsSubmitting(true) // 🔵 削除開始
    
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: token!,
        },
      })

      alert('カテゴリーを削除しました。')

      router.push('/admin/categories')
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました。')
      
    } finally {
      setIsSubmitting(false) // 🔴 削除終了
    }
  }

  useEffect(() => {
    if (!token) return

    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      const { category } = await res.json()
      setName(category.name)
    }

    fetcher()
  }, [id, token])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>

      <CategoryForm
        mode="edit"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}