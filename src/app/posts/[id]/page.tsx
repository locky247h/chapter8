'use client'

import  { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import Image from 'next/image';
import { MicroCmsPost } from '@/types/post';
import { Post } from '@/types/post'
import { supabase } from '@/utils/supabase';

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true)
      const res = await fetch(`/api/posts/${id}`)
      const data = await res.json()
      console.log('APIからのデータ:', data)
      setPost(data.post)
      setIsLoading(false)
    }

    fetcher();
  }, [id])

   // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
   useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(post.thumbnailImageKey);
        console.log('🧩 publicUrl:', publicUrl);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [post?.thumbnailImageKey]);

  if (isLoading) {
    return <div className="text-center py-8">読み込み中です...</div>;
  }

  if (!post) {
    return <div className="text-center py-8">記事が見つかりません</div>;
  }

  return (
    <div className="py-8">
      <div className="max-w-[800px] mx-auto">
      {thumbnailImageUrl && (
          <Image
            src={thumbnailImageUrl}
            alt={post.title}
            width={800}
            height={800}
            className="rounded-lg"
          />
        )}

          <ul>
            <li key={post.id}>
              <div className="flex justify-between pb-3 mt-4">
                <div className="text-xs">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex  space-x-2">
                  {post.postCategories.map((pc) => {
                    return (
                      <div key={pc.category.id} className="border-2 border-blue-300 rounded px-2 py-0.5 text-sm text-blue-300">
                      {pc.category.name}
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
