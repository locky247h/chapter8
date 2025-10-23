'use client'

import React, { useEffect, useState } from 'react'
import { Category } from '@/types/Category'

interface Props {
  selectedCategories: Category[]
  setSelectedCategories: (categories: Category[]) => void
}

export const CategoriesSelect: React.FC<Props> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const [categories, setCategories] = useState<Category[]>([])

  // カテゴリ一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/admin/categories')
      const { categories } = await res.json()
      setCategories(categories)
    }
    fetchCategories()
  }, [])

  // 複数選択処理
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, (opt) =>
      Number(opt.value)
    )
    const newSelected = categories.filter((cat) =>
      selectedIds.includes(cat.id)
    )
    setSelectedCategories(newSelected)
  }

  return (
    <div className="space-y-2">
      <select
        id="categories"
        multiple
        value={(selectedCategories ?? []).map((cat) => cat.id.toString())} //追加　
        onChange={handleChange}
        className="block w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
        size={Math.min(categories.length, 5)} // 一度に見せる数
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* 選択中のカテゴリーをタグ風に表示 */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedCategories.map((cat) => (
          <span
            key={cat.id}
            className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm"
          >
            {cat.name}
          </span>
        ))}
      </div>
    </div>
  )
}
