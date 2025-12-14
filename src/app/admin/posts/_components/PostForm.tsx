import React, { ChangeEvent, useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import { CategoriesSelect } from './CategoriesSelect'
import { UseFormRegister, UseFormSetValue, UseFormWatch,} from 'react-hook-form'
import { CreatePostRequestBody } from '@/types/post'

export interface Props {
  mode: 'new' | 'edit'
  register: UseFormRegister<CreatePostRequestBody>
  setValue: UseFormSetValue<CreatePostRequestBody>
  watch: UseFormWatch<CreatePostRequestBody>
  onSubmit: (e: React.FormEvent) => void
  onDelete?: () => void
  isSubmitting: boolean
}

export const PostForm: React.FC<Props> = ({
  mode,
  register, // inputをフォームに紐づける
  setValue, // 値を手動で更新する
  watch,   // 値を監視する
  onSubmit, // onSubmitをラップする
  onDelete, // 削除ボタンのハンドラ
  isSubmitting, //エラーや送信中状態
}) => { 
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  console.log("watchの中身:", watch)

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }

    // eventから画像を取得
    const file = event.target.files[0] // 選択された画像を取得

    // private/は必ずつけること
    const filePath = `private/${uuidv4()}` // ファイルパスを指定

    // Supabase Storageに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail') //　バケット名を指定
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示
    if (error) {
      alert(error.message)
      return
    }

    // data.pathに画像のパスが格納されているので、thumbnailImageKeyに格納
    setValue("thumbnailImageKey", data.path)
  }

  const thumbnailImageKey = watch("thumbnailImageKey") // 画像のキーをwatchで監視

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!thumbnailImageKey) return
    
    const fetcher = async () => {
      const {
        data: { publicUrl } } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

        setThumbnailImageUrl(publicUrl)
      }

      fetcher()
  }, [thumbnailImageKey])

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
         {...register('title')}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          disabled={isSubmitting} // ✅ 入力不可
        />
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          {...register('content')}
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          disabled={isSubmitting} // ✅ 入力不可
        />
      </div>
      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700"
        >
          サムネイルURL
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
          disabled={isSubmitting} // ✅ 入力不可
        />
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          カテゴリー
        </label>
        <CategoriesSelect
          selectedCategories={watch("categories")}
          setSelectedCategories={(cats) => {
            console.log("setSelectedCategoriesに渡されたcats:", cats)
            setValue("categories", cats)
          }}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting} // ✅ 入力不可
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {mode === 'new' ? '作成' : '更新'}
      </button>
      {mode === 'edit' && (
        <button
          type="button"
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
          onClick={onDelete}
          disabled={isSubmitting} // ✅ 入力不可
        >
          削除
        </button>
      )}
    </form>
  )
}