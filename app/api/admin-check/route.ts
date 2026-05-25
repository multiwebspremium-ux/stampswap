import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return NextResponse.json({
    logged_in: !!user,
    user_email: user?.email ?? null,
    admin_email_set: !!process.env.ADMIN_EMAIL,
    match: user?.email === process.env.ADMIN_EMAIL,
  })
}
