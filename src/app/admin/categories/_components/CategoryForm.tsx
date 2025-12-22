import React from 'react'
import { useForm } from 'react-hook-form'

interface FormValues {
  name: string
}

interface Props {
  mode: 'new' | 'edit'
  defaultValues?: FormValues
  onSubmit: (values: FormValues) => void
  onDelete?: () => void
  // isSubmitting: boolean
}

// interface Props {
//   mode: 'new' | 'edit'
//   name: string
//   setName: (title: string) => void
//   // onSubmit: (e: React.FormEvent) => void
//   onSubmit: (values: {name: string }) => void // ✅ 修正
//   onDelete?: () => void
//   isSubmitting: boolean // ✅ 追加
// }

export const CategoryForm: React.FC<Props> = ({
  mode,
  defaultValues,
  onSubmit,
  onDelete,
}) => {
  const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm<FormValues>({
    defaultValues,
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          カテゴリー名
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          disabled={isSubmitting} // ✅ 入力不可
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting} // ✅ 送信ボタンも不可
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {mode === 'new' ? '作成' : '更新'}
      </button>
      {mode === 'edit' && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isSubmitting} // ✅ 削除ボタンも不可
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
        >
          削除
        </button>
      )}
    </form>
  )
}