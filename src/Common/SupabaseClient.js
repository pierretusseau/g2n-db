import dotenv from "dotenv"
dotenv.config()
import { createClient } from "@supabase/supabase-js"
// import { Database } from '../../Types/database.types'

console.log(process.env.SUPABASE_URL)

// export default createClient<Database>(
export default createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
  },
})
