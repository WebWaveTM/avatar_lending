import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { getLandingSettings, saveLandingSettings, type LandingSettings } from '@/lib/actions'

export const runtime = 'nodejs'

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const indexParam = url.searchParams.get('index')
    const index = indexParam ? parseInt(indexParam, 10) : NaN
    if (!Number.isInteger(index) || index < 0 || index > 2) {
      return NextResponse.json({ error: 'index must be 0, 1, or 2' }, { status: 400 })
    }

    const current = (await getLandingSettings()) || ({} as LandingSettings)
    const why = Array.isArray(current.whyUseful) ? current.whyUseful : []
    const imgUrl = why[index]?.image || null
    if (imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('/api/landing/advantages/')) {
      const filename = imgUrl.split('/').pop()
      if (filename) {
        const filePath = path.resolve(process.cwd(), 'var', 'advantages', filename)
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath) } catch {}
      }
    }

    const updatedWhy = [0,1,2].map((i) => {
      const src = why[i] || { title: '', subtitle: '', image: null as string | null }
      if (i === index) {
        return { title: src.title || '', subtitle: src.subtitle || '', image: null }
      }
      return { title: src.title || '', subtitle: src.subtitle || '', image: src.image ?? null }
    })

    const updated: LandingSettings = {
      header: current.header || { title: '', subtitle: '' },
      features: current.features || { items: ['', '', '', ''] },
      video: current.video || { file: null },
      howItWorks: current.howItWorks || [
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
        { title: '', subtitle: '' },
      ],
      whyUseful: updatedWhy,
      socials: current.socials || { telegram: '', vk: '' },
      faq: current.faq || { items: [] },
    }

    await saveLandingSettings(updated)

    return NextResponse.json({ ok: true, index })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}


