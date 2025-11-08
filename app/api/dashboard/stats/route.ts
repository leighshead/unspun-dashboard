import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/dashboard/stats - Get article statistics by status
export async function GET() {
  try {
    const supabase = await createClient()

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get counts by status
    const { count: queued } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'queued')

    const { count: in_progress } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'in_progress')

    const { count: completed } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    const { count: ready_to_publish } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ready_to_publish')

    return NextResponse.json({
      queued: queued || 0,
      in_progress: in_progress || 0,
      completed: completed || 0,
      ready_to_publish: ready_to_publish || 0,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
