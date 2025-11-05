'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { Category } from '@/types/Category'
import { CreatePostRequestBody } from '@/types/post'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailImageKey, setThumbnailImageKey] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false) // ✅ ←これを追加！
  const router = useRouter()
  // Authorizationヘッダーに付与するためにtokenを取得
  const token = useSupabaseSession().token

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault()

    setIsSubmitting(true) // 🔵 送信開始

    const requestBody: CreatePostRequestBody = {
      title,
      content,
      thumbnailImageKey,
      categories: categories.map((cat) => ({ id: cat.id })), // ✅ Category[] → { id: number }[] に変換
    }

    // 記事を作成します。
    try {
      const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(requestBody),
    })

    // レスポンスから作成した記事のIDを取得します。
    const { id } = await res.json()

    // 作成した記事の詳細ページに遷移します。
    router.push(`/admin/posts/${id}`)

    alert('記事を作成しました。')
  } catch (error) {
    console.error('投稿作成エラー:', error)
    alert('記事の作成に失敗しました。')
  } finally {
    setIsSubmitting(false) // 🔴 送信終了
  }
}

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事作成</h1>
      </div>

      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting} // ✅ 追加
      />
    </div>
  )
}