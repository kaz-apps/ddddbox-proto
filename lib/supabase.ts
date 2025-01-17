import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database tables
export type Member = {
  id: string
  name: string
  email: string
  role: '管理者' | 'システム管理者' | '一般ユーザー'
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  project_no: string
  name: string
  organization: string
  phase: '企画' | '設計' | '施工'
  prefecture?: string
  city?: string
  address?: string
  building_name?: string
  design_cost?: number
  construction_cost?: number
  status?: string
  various_applications?: string
  is_archived: boolean
  is_locked: boolean
  is_non_standard: boolean
  has_attachment: boolean
  code_name?: string
  created_at: string
  updated_at: string
}

export type Ordinance = {
  id: string
  prefecture: string
  category: string
  name: string
  description?: string
  reference_url?: string
  current_url?: string
  section: '調査' | '用途・規模・計画' | '条例手続き' | '緑化'
  municipality?: string
  enactment_date?: string
  created_at: string
  updated_at: string
}

export type ProjectMember = {
  project_id: string
  member_id: string
  created_at: string
}

export type ProjectOrdinance = {
  project_id: string
  ordinance_id: string
  status: '該当' | '非該当'
  note?: string
  created_at: string
  updated_at: string
} 