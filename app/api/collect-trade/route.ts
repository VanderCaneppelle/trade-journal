import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schema
const tradeSchema = z.object({
  timestamp: z.string().datetime(),
  symbol: z.string().min(1),
  side: z.enum(['LONG', 'SHORT']),
  quantity: z.number().int().positive(),
  entry_price: z.number().positive(),
  exit_price: z.number().positive(),
  pnl: z.number(),
  setup: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  notes: z.string().optional().nullable(),
  user_id: z.string().uuid().optional(), // Optional, can be derived from auth
  api_key: z.string().optional(), // For authentication
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate API key if provided
    const apiKey = body.api_key || request.headers.get('x-api-key')
    const expectedApiKey = process.env.API_SECRET_KEY
    
    if (expectedApiKey && apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Validate request body
    const validatedData = tradeSchema.parse(body)
    
    // Get user - either from auth or from provided user_id
    const supabase = await createServerSupabaseClient()
    let userId: string

    if (validatedData.user_id) {
      // User ID provided directly (useful for NinjaTrader integration)
      userId = validatedData.user_id
    } else {
      // Try to get from auth session
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      userId = user.id
    }

    // Insert trade into database
    const { data, error } = await supabase
      .from('trades')
      .insert({
        user_id: userId,
        timestamp: validatedData.timestamp,
        symbol: validatedData.symbol,
        side: validatedData.side,
        quantity: validatedData.quantity,
        entry_price: validatedData.entry_price,
        exit_price: validatedData.exit_price,
        pnl: validatedData.pnl,
        setup: validatedData.setup || null,
        tags: validatedData.tags || null,
        notes: validatedData.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save trade', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Trade saved successfully',
        trade: data 
      },
      { status: 201 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to verify API is working
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/collect-trade',
    method: 'POST',
    description: 'Endpoint to collect trades from NinjaTrader or other trading platforms',
    example: {
      timestamp: '2025-01-01T14:33:00Z',
      symbol: 'MNQ',
      side: 'LONG',
      quantity: 1,
      entry_price: 18000.50,
      exit_price: 18004.00,
      pnl: 70.00,
      setup: 'Trend Continuation',
      tags: ['Followed Plan'],
      notes: 'Great entry on pullback',
      user_id: 'your-user-id-here',
      api_key: 'your-api-key-here',
    }
  })
}

