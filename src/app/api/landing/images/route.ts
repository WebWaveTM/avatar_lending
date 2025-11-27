import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { getLandingSettings, saveLandingSettings, type LandingSettings } from '@/lib/actions'

export const runtime = 'nodejs'

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const typeParam = url.searchParams.get('type')
    const type = typeParam === 'how-it-works' || typeParam === 'socials' ? typeParam : null
    
    if (!type) {
      return NextResponse.json({ error: 'type must be "how-it-works" or "socials"' }, { status: 400 })
    }

    const current = (await getLandingSettings()) || ({} as LandingSettings)
    const imgUrl = type === 'how-it-works' ? current.howItWorksImage : current.socialsImage
    
    if (imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('/api/landing/images/')) {
      const filename = imgUrl.split('/').pop()
      if (filename) {
        const filePath = path.resolve(process.cwd(), 'var', 'images', filename)
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath) } catch {}
      }
    }

    const updated: LandingSettings = {
      header: current.header || { title: '', subtitle: '' },
      features: current.features || { items: ['', '', '', ''] },
      video: current.video || { file: null },
      howItWorks: current.howItWorks || [
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
      ],
      howItWorksImage: type === 'how-it-works' ? null : (current.howItWorksImage ?? null),
      socialsImage: type === 'socials' ? null : (current.socialsImage ?? null),
      whyUseful: current.whyUseful || {
        item1: { title: '', subtitle: '', image: null },
        item2: { title: '', subtitle: '', image: null },
        item3: { title: '', subtitle: '', image: null },
      },
      socials: current.socials || { telegram: '', vk: '' },
      faq: current.faq || { items: [] },
    }

    await saveLandingSettings(updated)

    return NextResponse.json({ ok: true, type })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

