'use client'

import Link from 'next/link'
import { Post } from '@/types/post'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession' // ← カスタムフックをimport
//import  useSWR from 'swr' // ← SWRをimport
import { useFetch } from '../_hooks/useFetch'

// // fetcher関数を定義
// const fetcher = async (url: string, token: string) => { 
//   const res = await fetch(url, { 
//     headers: { 
//       'Content-type': 'applicartion/json', 
//       Authorization: token, 
//     },
//   })
//   return res.json()
// }

export default function Page() {
  const { token } = useSupabaseSession() // ← token取得

  // useFetchカスタムフックを使ってデータ取得
  const { data, error, isLoading } = useFetch<{ posts: Post[]}>(
    token ? '/api/admin/posts' : null
  )


  // // SWRを使ってデータ取得
  // const {data, error, isLoading} = useSWR(
  //   token ? ['/api/admin/posts', token] : null, // tokenがある場合のみfetch
  //   ([url, token]) => fetcher(url, token) // fetcherにurlとtokenを渡す
  // )

  if (isLoading) return <div>読み込み中...</div>
  if (error) return <div>エラーが発生しました</div>


  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <Link href="/admin/posts/new">新規作成</Link>
        </button>
      </div>

      <div className="">
        {data?.posts.map((post: Post) => {
          return (
            <Link href={`/admin/posts/${post.id}`} key={post.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{post.title}</div>
                <div className="text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}