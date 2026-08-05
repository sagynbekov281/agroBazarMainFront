// src/data/content.ts
export interface Category {
  key: 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'meat' | 'honey'
  emoji: string
  tint: string
}

export const categories: Category[] = [
  { key: 'vegetables', emoji: '🥦', tint: '#DCEEDD' },
  { key: 'fruits', emoji: '🍎', tint: '#FBDBD3' },
  { key: 'grains', emoji: '🌾', tint: '#EFE6CD' },
  { key: 'dairy', emoji: '🥛', tint: '#D9E3F7' },
  { key: 'meat', emoji: '🥩', tint: '#F4CFCF' },
  { key: 'honey', emoji: '🍯', tint: '#F6E4B8' },
]

export interface Product {
  id: string
  key: string
  price: number
  image: string
  seller: string
  region: string
  minOrder: number
  badge?: 'vip' | 'organic'
  tags: Array<'popular' | 'new' | 'cheap'>
}

export const products: Product[] = [
  { id: 'potato', key: 'potato', price: 35, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80', seller: 'Арслан Б.', region: 'Нарынская обл.', minOrder: 500, badge: 'vip', tags: ['popular', 'cheap'] },
  { id: 'apple', key: 'apple', price: 60, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80', seller: 'Тома Н.', region: 'Чуйская обл.', minOrder: 100, tags: ['popular'] },
  { id: 'tomato', key: 'tomato', price: 70, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80', seller: 'Арсен Х.', region: 'Иссык-Куль', minOrder: 80, badge: 'organic', tags: ['popular', 'new'] },
  { id: 'onion', key: 'onion', price: 35, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80', seller: 'Арслан Б.', region: 'Нарынская обл.', minOrder: 700, tags: ['popular', 'cheap'] },
  { id: 'honey', key: 'honey', price: 490, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80', seller: 'ОсОО «Нектар»', region: 'Иссык-Куль', minOrder: 5, badge: 'organic', tags: ['popular', 'new'] },
  { id: 'carrot', key: 'carrot', price: 30, image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=400&q=80', seller: 'Бекболот У.', region: 'Таласская обл.', minOrder: 300, tags: ['popular', 'cheap'] },
  { id: 'strawberry', key: 'strawberry', price: 210, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80', seller: 'Гульнара А.', region: 'Ошская обл.', minOrder: 20, badge: 'vip', tags: ['popular', 'new'] },
  { id: 'banana', key: 'banana', price: 200, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80', seller: 'Импорт КГ', region: 'Бишкек', minOrder: 50, tags: ['popular'] },
]

export interface Farmer {
  id: string
  key: string
  avatar: string
  verified: boolean
  rating: number
  productsCount: number
}

export const farmers: Farmer[] = [
  { id: 'azamat', key: 'azamat', avatar: '', verified: true, rating: 4.1, productsCount: 37 },
  { id: 'gulmira', key: 'gulmira', avatar: '', verified: true, rating: 3.9, productsCount: 128 },
  { id: 'akterek', key: 'akterek', avatar: '', verified: true, rating: 4.7, productsCount: 8 },
  { id: 'bakyt', key: 'bakyt', avatar: '', verified: true, rating: 5.0, productsCount: 24 },
]

export interface TransportOption {
  id: string
  key: string
  price: number
  priceIsFrom: boolean
  icon: 'truck' | 'van' | 'flatbed'
}

export const transportOptions: TransportOption[] = [
  { id: 'reefer', key: 'reefer', price: 18000, priceIsFrom: false, icon: 'truck' },
  { id: 'gazelle', key: 'gazelle', price: 32000, priceIsFrom: false, icon: 'van' },
  { id: 'kamaz', key: 'kamaz', price: 4000, priceIsFrom: true, icon: 'flatbed' },
]

export interface PriceStat {
  id: string
  key: string
  price: number
  change: number
}

export const priceStats: PriceStat[] = [
  { id: 'potato', key: 'potato', price: 40, change: 3.2 },
  { id: 'tomato', key: 'tomato', price: 75, change: -1.8 },
  { id: 'onion', key: 'onion', price: 26, change: 0.5 },
  { id: 'apple', key: 'apple', price: 25, change: -5.2 },
  { id: 'strawberry', key: 'strawberry', price: 120, change: 6.7 },
]