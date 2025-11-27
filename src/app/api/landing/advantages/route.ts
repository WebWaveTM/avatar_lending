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
    const currentWhy = current.whyUseful || {
      item1: { title: '', subtitle: '', image: null },
      item2: { title: '', subtitle: '', image: null },
      item3: { title: '', subtitle: '', image: null },
    }
    
    const keys: Array<'item1' | 'item2' | 'item3'> = ['item1', 'item2', 'item3']
    const key = keys[index]
    const imgUrl = currentWhy[key]?.image || null
    if (imgUrl && typeof imgUrl === 'string' && imgUrl.startsWith('/api/landing/advantages/')) {
      const filename = imgUrl.split('/').pop()
      if (filename) {
        const filePath = path.resolve(process.cwd(), 'var', 'advantages', filename)
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath) } catch {}
      }
    }

    const updatedWhy: LandingSettings['whyUseful'] = {
      item1: {
        title: currentWhy.item1?.title || '',
        subtitle: currentWhy.item1?.subtitle || '',
        image: key === 'item1' ? null : (currentWhy.item1?.image ?? null),
      },
      item2: {
        title: currentWhy.item2?.title || '',
        subtitle: currentWhy.item2?.subtitle || '',
        image: key === 'item2' ? null : (currentWhy.item2?.image ?? null),
      },
      item3: {
        title: currentWhy.item3?.title || '',
        subtitle: currentWhy.item3?.subtitle || '',
        image: key === 'item3' ? null : (currentWhy.item3?.image ?? null),
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
      howItWorksImage: current.howItWorksImage ?? null,
      socialsImage: current.socialsImage ?? null,
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


