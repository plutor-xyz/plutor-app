import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoiceId, email } = body

    // TODO: Implement email sending logic
    console.log('Sending invoice', invoiceId, 'to', email)

    return NextResponse.json({ success: true, message: 'Invoice sent successfully' })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send invoice' },
      { status: 500 }
    )
  }
}