'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { Category } from '@/types/Category'
import { Post } from '@/types/Post';

export default function Page() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false) // ✅ 送信中フラグ追加
  const { id } = useParams()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    // フォームのデフォルトの動作をキャンセルします。
    e.preventDefault()

    setIsSubmitting(true) // ✅ 送信開始
    try {
      // 記事を作成します。
      await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, thumbnailUrl, categories }),
      })

      alert('記事を更新しました。')
    } finally {
      setIsSubmitting(false) // ✅ 終わったら解除
    }
  }

  const handleDeletePost = async () => {
    if (!confirm('記事を削除しますか？')) return

    setIsSubmitting(true) // ✅ 削除中も操作不可にする
    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
      })

      alert('記事を削除しました。')

      router.push('/admin/posts')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`)
      const { post }: { post: Post } = await res.json()
      setTitle(post.title)
      setContent(post.content)
      setThumbnailUrl(post.thumbnailUrl)
      setCategories(post.postCategories.map((pc) => pc.category))
    }

    fetcher()
  }, [id])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDeletePost}
        isSubmitting={isSubmitting} // ✅ 子に渡す
      />
    </div>
  )
}