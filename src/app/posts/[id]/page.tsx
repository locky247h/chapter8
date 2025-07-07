'use client'

import  { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import Image from 'next/image';
import type { Post } from '../../_types/types';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // APIでpostsを取得する処理をuseEffectで実行します。
  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      const res = await fetch(`https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`);
      const data = await res.json();
      setPost(data.post);
      setIsLoading(false);
    }

    fetcher();
  }, [id])

  if (isLoading) {
    return <div className="text-center py-8">読み込み中です...</div>;
  }

  if (!post) {
    return <div className="text-center py-8">記事が見つかりません</div>;
  }

  return (
    <div className="py-8">
      <div className="max-w-[800px] mx-auto">
        <Image src={post.thumbnailUrl}
          alt="" 
          width={800} 
          height={400}
        />
          <ul>
            <li key={post.id}>
              <div className="flex justify-between pb-3 mt-4">
                <div className="text-xs">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex  space-x-2">
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
                className="py-4" 
                dangerouslySetInnerHTML={{ __html: post.content }}
                >
              </div>
            </li>
        </ul>
      </div>
    </div>
  );
};
