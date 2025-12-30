'use client'

import { useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { useForm } from 'react-hook-form'
import { CreatePostRequestBody } from '@/types/post'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'


export default function Page() {
  const  { register, handleSubmit, setValue, watch, reset, formState: { isSubmitting}, 
  } = useForm<CreatePostRequestBody>({
    defaultValues: {
      title: '',
      content: '',
      thumbnailImageKey: '',
      categories: [],
    },
  })

  const router = useRouter()
  // Authorizationヘッダーに付与するためにtokenを取得
  const token = useSupabaseSession().token

// Authorizationヘッダーに付与するためにtokenを取得
const onSubmit = async (data: CreatePostRequestBody) => {
  try {
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify({
        ...data,
        categories: data.categories.map((cat) => ({ id: cat.id })),
      }),
    })

    const { id } = await res.json()
    router.push(`/admin/posts/${id}`)
    alert('記事を作成しました。')
    reset()
  } catch (error) {
    console.error('投稿作成エラー:', error)
    alert('記事の作成に失敗しました。')
  }
}
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事作成</h1>
      </div>

      <PostForm
        mode="new"
        register={register}
        setValue={setValue}
        watch={watch}
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}