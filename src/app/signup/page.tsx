'use client'

import { supabase } from '@/utils/supabase' // 前の工程で作成したファイル
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.email('正しいメールアドレスを入力してください').min(1, 'メールアドレスは必須です'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
})

//ZodスキーマからTypeScriptの型を自動で生成(これがないとTypeScriptに変換できない)
type FormData = z.infer<typeof schema> 

export default function Page() {
  const { register, handleSubmit, reset, formState: {errors, isSubmitting}, 
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const { email, password } = data

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3002/login`,
      },
    })
    if (error) {
      alert('登録に失敗しました')
    } else {
      reset() // フォームの内容を初期状態にリセット
      alert('確認メールを送信しました。')
    }
  }

  return (
    <div className="flex justify-center pt-[240px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-[400px]">
        <div>

          {/* メール */}
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            {...register('email')} // ← ここだけで value/onChange 管理してくれる
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* パスワード */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            {...register('password')} // ← ここだけで value/onChange 管理してくれる
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {isSubmitting ? '登録中...' : '登録'}
          </button>
        </div>
      </form>
    </div>
  )
}