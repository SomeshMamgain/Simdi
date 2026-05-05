import { NextRequest, NextResponse } from 'next/server'

import { getReviewImageFile } from '@/lib/review-service'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await context.params
    const image = await getReviewImageFile(fileId)

    return new NextResponse(Buffer.from(image.data), {
      status: 200,
      headers: {
        'Content-Type': image.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Loading review image failed:', error)

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Unable to load review image',
      },
      { status: 404 }
    )
  }
}
