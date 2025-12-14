'use client'

import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// APIレスポンスの型
type ContactResponse = {
  message: string
}

// Zod スキーマ定義
export const contactSchema = z.object({
  name: z.string()
    .min(1, "名前は必須です")
    .max(30, "名前は30文字以内で入力してください"),
  email: z.email("有効なメールアドレスを入力してください")
    .min(1, "メールアドレスは必須です"),
  message: z.string()
    .min(1, "本文は必須です")
    .max(500, "本文は500文字以内で入力してください"),
})

// フォームの型を Zod から自動生成
export type ContactForm = z.infer<typeof contactSchema>

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" }
  })

  // 送信処理
  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
      })

      const result: ContactResponse = await res.json()
      console.log(result.message)

      alert("送信しました！")
      reset() // フォームをクリア
    } catch (error) {
      console.error("送信に失敗しました", error)
      alert("送信に失敗しました。もう一度お試しください。")
    }
  }

  return(
    <div className="max-w-[800px] mx-auto py-8 px-4">
    <h1 className="text-xl font-bold mb-15">問い合わせフォーム</h1>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* お名前 */}
      <div className="flex items-start">
        <label className="w-28 pt-2">お名前</label>
        <div className="flex-1 ml-10 pb-5">
          <input
            type="text"
            className="w-full border p-2 rounded-md"
            {...register("name")}
            disabled={isSubmitting}
          /> 
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div> 
      </div>

      {/* メールアドレス */}
      <div className="flex item-start">
        <label className="w-28 pt-2">メールアドレス</label>
        <div className="flex-1 ml-10 pb-5">
          <input
          type="email"
          className="w-full border p-2 rounded-md"
          {...register("email")}
          disabled={isSubmitting}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
      </div>

      {/* 本文 */}
      <div className="flex items-start">
        <label className="w-28 pt-2">本文</label>
        <div className="flex-1 ml-10 pb-5">
          <textarea
            className="w-full border p-2 rounded-md"
            rows={5}
            {...register("message")}
            disabled={isSubmitting}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>
      </div>

      {/* ボタン */}
      <div className="flex space-x-4 justify-center pt-4">
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "送信中..." : "送信"}
        </button>
        <button
        type="button"
        className="bg-gray-300 text-black px-4 py-2 rounded-md"
        onClick={()=> reset()}
        disabled={isSubmitting}
        >
          クリア
        </button>
      </div>
      </form>
  </div>
  );
}
