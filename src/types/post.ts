import { Category } from './Category'

export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  postCategories: { category: Category }[]
  thumbnailImageKey: string
}

export interface MicroCmsPost {
  id: string
  title: string
  content: string
  createdAt: string
  categories: { id: string; name: string }[]
  thumbnail: { url: string; height: number; width: number }
}

export interface CreatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailImageKey: string
}

export interface UpdatePostRequestBody extends CreatePostRequestBody {
  id: number
}