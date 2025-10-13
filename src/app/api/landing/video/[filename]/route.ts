import { NextRequest } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  const filePath = path.resolve(process.cwd(), 'var', 'uploads', params.filename)
  if (!fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 })
  }
  const stat = fs.statSync(filePath)
  const range = req.headers.get('range')
  const contentType = 'video/mp4'

  if (!range) {
    const file = fs.readFileSync(filePath)
    return new Response(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stat.size),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store',
      },
    })
  }

  const parts = range.replace(/bytes=/, '').split('-')
  const start = parseInt(parts[0], 10)
  const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1
  const chunkSize = end - start + 1
  const stream = fs.createReadStream(filePath, { start, end })
  return new Response(stream as any, {
    status: 206,
    headers: {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': String(chunkSize),
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
    },
  })
}


