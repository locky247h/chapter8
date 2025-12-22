"use client"

import Link from "next/link"
import { Category } from '@/types/Category'
import { useFetch } from "@/app/admin/_hooks/useFetch"
export default function Page() {

  const { data, error, isLoading } = useFetch<{ categories: Category[] }>(
    `/api/admin/categories`
  )
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>
  
 const categories = data?.categories ?? []
  
  return (
    <div className="">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-xl font-bold">カテゴリー一覧</h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link href="/admin/categories/new">新規作成</Link>
      </button>
    </div>

    <div className="">
      {categories.map((category) => {
        return (
          <Link href={`/admin/categories/${category.id}`} key={category.id}>
            <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
              <div className="text-xl font-bold">{category.name}</div>
            </div>
          </Link>
        )
      })}
    </div>
  </div>
  )
}