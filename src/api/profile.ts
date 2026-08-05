import { api } from './client'

export interface ProfileData {
  phone: string
  email: string | null
  first_name: string
  last_name: string
  role: string | null
  region: string
  farm_name: string
  bio: string
  avatar_url: string
}

export const getMyProfile = () => api.get<ProfileData>('/profiles/me')
export const updateMyProfile = (data: Partial<ProfileData>) =>
  api.patch<ProfileData>('/profiles/me', data)