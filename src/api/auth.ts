import { api } from './client'

export interface RegisterPayload {
  phone: string
  email?: string
  password: string
  role: 'farmer' | 'buyer'
}

export interface VerifyOtpPayload {
  phone: string
  code: string
}

export interface LoginPayload {
  identifier: string
  password: string
}

export interface RegisterPayload {
  phone: string
  email?: string
  password: string
  role: 'farmer' | 'buyer'
  first_name: string
  last_name: string
  region?: string
  farm_name?: string
}

export const registerUser = (payload: RegisterPayload) =>
  api.post('/auth/register', payload)

export const verifyOtp = (payload: VerifyOtpPayload) =>
  api.post('/auth/verify-otp', payload)

export const loginUser = (payload: LoginPayload) =>
  api.post<{ access: string; refresh: string }>('/auth/login', payload)

export const logoutUser = (refresh: string) =>
  api.post('/auth/logout', { refresh })