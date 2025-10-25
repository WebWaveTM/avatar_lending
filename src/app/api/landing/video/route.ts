import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { getLandingSettings, saveLandingSettings, type LandingSettings } from '@/lib/actions'

export const runtime = 'nodejs'

export async function DELETE(_req: NextRequest) {
  try {
    const current = (await getLandingSettings()) || ({} as LandingSettings)
    const url = current.video?.file || null
    if (url && url.startsWith('/api/landing/video/')) {
      const filename = url.split('/').pop()
      if (filename) {
        const filePath = path.resolve(process.cwd(), 'var', 'uploads', filename)
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath) } catch {}
      }
    }

    const updated: LandingSettings = {
      header: current.header || { title: '', subtitle: '' },
      features: current.features || { items: ['', '', '', ''] },
      video: { file: null },
      howItWorks: current.howItWorks || [
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
      ],
      whyUseful: (Array.isArray(current.whyUseful) ? current.whyUseful : [
        { title: '', subtitle: '', image: null },
        { title: '', subtitle: '', image: null },
        { title: '', subtitle: '', image: null },
      ]),
      socials: current.socials || { telegram: '', vk: '' },
      faq: current.faq || { items: [] },
    }

    await saveLandingSettings(updated)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}


