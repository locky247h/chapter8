'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Post } from './_types/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // APIでpostsを取得する処理をuseEffectで実行します。
  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts`);
      const data = await res.json();
      setPosts(data.posts);
      setIsLoading(false);
    }

    fetcher()
  }, [])

  if (isLoading) {
    return <div className="text-center py-8">読み込み中です...</div>;
  }

    return (
    <div className="py-8">
      <div className="max-w-[800px] mx-auto">
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`} className="block mb-8 border-4 border-gray-300 p-4">
                <div className="flex justify-between pb-3">
                  <div className="text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    {post.categories.map((category) => {
                      return (
                        <div key={category} className="border-2 border-blue-300 rounded px-2 py-0.5 text-sm text-blue-300">
                        {category}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="text-2xl ">
                    {post.title}
                </div>
                <div 
                  className="line-clamp-2 w-120 py-3" 
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  >
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

