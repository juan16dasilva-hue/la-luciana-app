import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://unzvpgshqxpaeqlkosmu.supabase.co'

const supabaseKey = 'sb_publishable_4my2y9w1IKPHbC6QElX4rA_LUiLVecl'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)