'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { Post } from '@/types/post'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { useForm } from 'react-hook-form'
import { CreatePostRequestBody } from '@/types/post'
import { useFetch } from '../../_hooks/useFetch'

export default function Page() {

  const { id } = useParams()
  const router = useRouter()
  const { token } = useSupabaseSession()

  const { register, handleSubmit, watch, setValue, reset, formState: { isSubmitting },
  } = useForm<CreatePostRequestBody>({
    defaultValues: { title: '', content: '', thumbnailImageKey: '', categories: [],
    },
  })

  //記事データ取得
const { data, error, isLoading } = useFetch<{ post: Post }>(
    token ? `/api/admin/posts/${id}` : null
  )

  //更新処理
  const onSubmit = async (data: CreatePostRequestBody) => {
    try {
      // 記事を作成します。
      await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...data,
          categories: data.categories.map((cat) => ({ id: cat.id })),
      }),
    })

      alert('記事を更新しました。') 
    } catch (error){
      console.error('記事更新エラー:', error)
      alert('記事の更新に失敗しました。')
    }
  }
  
  //削除処理
  const handleDeletePost = async () => {
    if (!confirm('記事を削除しますか？')) return

    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token!,
        },
      })

      alert('記事を削除しました。')
      router.push('/admin/posts')
    } catch (error) {
      console.error('記事削除エラー:', error)
      alert('記事の削除に失敗しました。')
    }
  }

  //記事データをフォームにセット
  useEffect(() => {
    if (data?.post) {
      const post = data.post
      reset({
        title: post.title,
        content: post.content,
        thumbnailImageKey: post.thumbnailImageKey,
        categories: post.postCategories?.map((pc) => pc.category) ?? [],
      })
    }
  }, [data, reset])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  // //APIから記事データを取得してフォームにセット
  // useEffect(() => {
  //   if (!token) return

  //   const fetcher = async () => {
  //     console.log('取得中の記事ID:', id) // ← まずここ確認
  //     const res = await fetch(`/api/admin/posts/${id}`, {
  //       headers: {
  //         Authorization: token,
  //         "Content-Type": "application/json",
  //       },
  //     }) 
  //     const { post }: { post: Post } = await res.json()

  //     reset({
  //       title: post.title,
  //       content: post.content,
  //       thumbnailImageKey: post.thumbnailImageKey,
  //       categories: post.postCategories?.map((pc) => pc.category) ?? [],
  //     })
  //   }

  //   fetcher()
  // }, [id, token, reset])
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事編集</h1>
      </div>

      <PostForm
        mode="edit"
        register={register}
        setValue={setValue}
        watch={watch}
        onSubmit={handleSubmit(onSubmit)}
        onDelete={handleDeletePost}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}