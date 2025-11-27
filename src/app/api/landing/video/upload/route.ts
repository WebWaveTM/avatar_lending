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
    if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 })
    if (file.size > 500 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 500MB)' }, { status: 400 })
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = path.extname(file.name || '.mp4') || '.mp4'
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
    const dir = path.resolve(process.cwd(), 'var', 'uploads')
    fs.mkdirSync(dir, { recursive: true })

    // remove previous files
    try {
      const existing = fs.readdirSync(dir)
      for (const f of existing) {
        try { fs.unlinkSync(path.join(dir, f)) } catch {}
      }
    } catch {}

    // save new file
    const filePath = path.join(dir, filename)
    fs.writeFileSync(filePath, buffer)

    // update settings
    const current = (await getLandingSettings()) || ({} as LandingSettings)
    const updated: LandingSettings = {
      header: current.header || { title: '', subtitle: '' },
      features: current.features || { items: ['', '', '', ''] },
      video: { file: `/api/landing/video/${filename}` },
      howItWorks: current.howItWorks || [
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
      ],
      howItWorksImage: current.howItWorksImage ?? null,
      socialsImage: current.socialsImage ?? null,
      whyUseful: current.whyUseful || {
        item1: { title: '', subtitle: '', image: null },
        item2: { title: '', subtitle: '', image: null },
        item3: { title: '', subtitle: '', image: null },
      },
      socials: current.socials || { telegram: '', vk: '' },
      faq: current.faq || { items: [] },
    }
    await saveLandingSettings(updated)

    return NextResponse.json({ ok: true, url: updated.video.file })
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}


