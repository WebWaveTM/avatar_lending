import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { saveLandingSettings, getLandingSettings, type LandingSettings } from '@/lib/actions'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 })
    }
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const indexRaw = formData.get('index')
    const index = typeof indexRaw === 'string' ? parseInt(indexRaw, 10) : Number(indexRaw)
    if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 })
    if (!Number.isInteger(index) || index < 0 || index > 2) {
      return NextResponse.json({ error: 'index must be 0, 1, or 2' }, { status: 400 })
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 15MB)' }, { status: 400 })
    }

    const allowedExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'])
    const originalExt = path.extname(file.name || '').toLowerCase()
    const ext = allowedExts.has(originalExt) ? originalExt : '.png'

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
    const dir = path.resolve(process.cwd(), 'var', 'advantages')
    fs.mkdirSync(dir, { recursive: true })

    // Remove previous file for this index if present in settings
    const current = (await getLandingSettings()) || ({} as LandingSettings)
    const currentWhy = current.whyUseful || {
      item1: { title: '', subtitle: '', image: null },
      item2: { title: '', subtitle: '', image: null },
      item3: { title: '', subtitle: '', image: null },
    }
    
    const keys: Array<'item1' | 'item2' | 'item3'> = ['item1', 'item2', 'item3']
    const key = keys[index]
    const prevUrl = currentWhy[key]?.image || null
    if (prevUrl && prevUrl.startsWith('/api/landing/advantages/')) {
      const prevName = prevUrl.split('/').pop()
      if (prevName) {
        const prevPath = path.join(dir, prevName)
        try { if (fs.existsSync(prevPath)) fs.unlinkSync(prevPath) } catch {}
      }
    }

    // Save new file
    const filePath = path.join(dir, filename)
    fs.writeFileSync(filePath, buffer)

    // Update settings (merge, keep others intact)
    const updatedWhy: LandingSettings['whyUseful'] = {
      item1: {
        title: currentWhy.item1?.title || '',
        subtitle: currentWhy.item1?.subtitle || '',
        image: key === 'item1' ? `/api/landing/advantages/${filename}` : (currentWhy.item1?.image ?? null),
      },
      item2: {
        title: currentWhy.item2?.title || '',
        subtitle: currentWhy.item2?.subtitle || '',
        image: key === 'item2' ? `/api/landing/advantages/${filename}` : (currentWhy.item2?.image ?? null),
      },
      item3: {
        title: currentWhy.item3?.title || '',
        subtitle: currentWhy.item3?.subtitle || '',
        image: key === 'item3' ? `/api/landing/advantages/${filename}` : (currentWhy.item3?.image ?? null),
      },
    }

    const updated: LandingSettings = {
      header: current.header || { title: '', subtitle: '' },
      features: current.features || { items: ['', '', '', ''] },
      video: current.video || { file: null },
      howItWorks: Array.isArray(current.howItWorks) ? current.howItWorks : [
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
      ],
      whyUseful: updatedWhy,
      socials: current.socials || { telegram: '', vk: '' },
      faq: current.faq || { items: [] },
    }

    await saveLandingSettings(updated)

    return NextResponse.json({ ok: true, url: `/api/landing/advantages/${filename}`, index })
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}


