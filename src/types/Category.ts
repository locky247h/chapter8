export interface Category {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

// カテゴリーの更新時に送られてくるリクエストのbodyの型
 export interface UpdateCategoryRequestBody {
  name: string
}

// カテゴリーの作成時に送られてくるリクエストのbodyの型
export interface CreateCategoryRequestBody {
  name: string
}