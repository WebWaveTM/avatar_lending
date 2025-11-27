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
    const typeRaw = formData.get('type')
    const type = typeof typeRaw === 'string' ? typeRaw : String(typeRaw)
    
    if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 })
    if (type !== 'how-it-works' && type !== 'socials') {
      return NextResponse.json({ error: 'type must be "how-it-works" or "socials"' }, { status: 400 })
    }

    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 15MB)' }, { status: 400 })
    }

    const allowedExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'])
    const originalExt = path.extname(file.name || '').toLowerCase()
    const ext = allowedExts.has(originalExt) ? originalExt : '.png'

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
    const dir = path.resolve(process.cwd(), 'var', 'images')
    fs.mkdirSync(dir, { recursive: true })

    // Remove previous file if present in settings
    const current = (await getLandingSettings()) || ({} as LandingSettings)
    const prevUrl = type === 'how-it-works' ? current.howItWorksImage : current.socialsImage
    if (prevUrl && typeof prevUrl === 'string' && prevUrl.startsWith('/api/landing/images/')) {
      const prevName = prevUrl.split('/').pop()
      if (prevName) {
        const prevPath = path.join(dir, prevName)
        try { if (fs.existsSync(prevPath)) fs.unlinkSync(prevPath) } catch {}
      }
    }

    // Save new file
    const filePath = path.join(dir, filename)
    fs.writeFileSync(filePath, buffer)

    // Update settings
    const updated: LandingSettings = {
      header: current.header || { title: '', subtitle: '' },
      features: current.features || { items: ['', '', '', ''] },
      video: current.video || { file: null },
      howItWorks: current.howItWorks || [
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
      ],
      howItWorksImage: type === 'how-it-works' ? `/api/landing/images/${filename}` : (current.howItWorksImage ?? null),
      socialsImage: type === 'socials' ? `/api/landing/images/${filename}` : (current.socialsImage ?? null),
      whyUseful: current.whyUseful || {
        item1: { title: '', subtitle: '', image: null },
        item2: { title: '', subtitle: '', image: null },
        item3: { title: '', subtitle: '', image: null },
      },
      socials: current.socials || { telegram: '', vk: '' },
      faq: current.faq || { items: [] },
    }

    await saveLandingSettings(updated)

    return NextResponse.json({ ok: true, url: `/api/landing/images/${filename}`, type })
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

