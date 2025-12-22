'use client'

import { useParams, useRouter } from 'next/navigation'
import { CategoryForm } from '../_components/CategoryForm'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { useFetch } from '@/app/admin/_hooks/useFetch'
import { Category } from '@/types/Category'

export default function Page() {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()

  // useFetchを使ってカテゴリー情報を取得
  const { data, error, isLoading, mutate } = useFetch<{ category: Category }>(
    token ? `/api/admin/categories/${id}` : null
  )

  const category = data?.category

  // // フォームの状態管理()
  // const fetcher = (url: string) => 
  //   fetch(url, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: token!,
  //     },
  //   }).then(res => res.json())

  //   // SWRを使ってカテゴリー情報を取得
  //   const { data, error, isLoading, mutate } = useSWR<{ category:{ id: number; name:string } }>(
  //     token ? '/api/categories/${id}' : null,
  //     fetcher
  //   )

  //   const category = data?.category

  // ✅ 更新処理
  const handleSubmit = async (values: { name: string }) => {
    // e.preventDefault()  // CategoryForm内でpreventDefaultしているため不要
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify(values),
      })
      alert('カテゴリーを更新しました。')
      mutate() // 🔄 キャッシュ更新（再フェッチ）
    } catch (error) {
      console.error('カテゴリー更新エラー:', error)
      alert('更新に失敗しました。')
    }
  }

  // ✅ 削除処理
  const handleDeletePost = async () => {
    if (!confirm('カテゴリーを削除しますか？')) return
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
      })
      alert('カテゴリーを削除しました。')
      router.push('/admin/categories')
    } catch (error) {
      console.error('削除エラー:', error)
      alert('削除に失敗しました。')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
      </div>
      {category && (
        <CategoryForm
          mode="edit"
          defaultValues={{ name: category.name }} // ← 初期値を渡す
          onSubmit={handleSubmit}
          onDelete={handleDeletePost}
          //isSubmitting={false}
        />
      )}
    </div>
  )
}