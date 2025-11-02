import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de base de datos
export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'tecnico'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Request {
  id: string
  requester_name: string
  requester_email: string
  is_affiliated: boolean
  company_name: string
  position_name: string
  collective_agreement: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Evaluation {
  id: string
  request_id: string
  tecnico_id: string
  eval_company_name: string
  eval_position_name: string
  eval_affected_people: string
  eval_collective_agreement: string
  eval_num_groups: 6 | 7 | 8
  eval_direct_indirect: 'directo' | 'indirecto'
  factor_scores: Record<string, number>
  total_score: number
  final_group: string
  report_url: string | null
  created_at: string
  updated_at: string
}

export interface EvaluationFactor {
  factor_id: string
  factor_name: string
  subfactor_name: string
  levels_data: Record<string, {points: number, description: string}>
  is_direct_indirect_specific: boolean
  is_active: boolean
}

export interface GroupLimit {
  id: string
  num_groups: number
  group_number: number
  min_points: number
  max_points: number | null
}
