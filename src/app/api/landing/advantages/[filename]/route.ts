import { NextRequest } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'

function guessContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  switch (ext) {
    case '.png': return 'image/png'
    case '.jpg':
    case '.jpeg': return 'image/jpeg'
    case '.webp': return 'image/webp'
    case '.gif': return 'image/gif'
    case '.svg': return 'image/svg+xml'
    default: return 'application/octet-stream'
  }
}

export async function GET(_req: NextRequest, { params }: { params: { filename: string } }) {
  const filePath = path.resolve(process.cwd(), 'var', 'advantages', params.filename)
  if (!fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 })
  }
  try {
    const file = fs.readFileSync(filePath)
    return new Response(file, {
      status: 200,
      headers: {
        'Content-Type': guessContentType(params.filename),
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return new Response('Error', { status: 500 })
  }
}


