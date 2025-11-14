'use server'

import { RunResult } from "better-sqlite3"
import { db, Inquiry, InquiryFormData } from "./db"
import { sendNewInquiryEmail } from './mail'

export async function logLoginAttempt(success: boolean): Promise<void> {
  const now = Date.now()
  const insert = db.prepare('INSERT INTO login_audit (ts, success) VALUES (?, ?)')
  const prune = db.prepare(
    'DELETE FROM login_audit WHERE id NOT IN (SELECT id FROM login_audit ORDER BY ts DESC LIMIT 10)'
  )
  const tx = db.transaction(() => {
    insert.run(now, success ? 1 : 0)
    prune.run()
  })
  tx()
}

export async function getAllInquiries(page: number, pageSize: number): Promise<Inquiry[]> {
  const limit = Math.max(1, Math.min(pageSize, 100))
  const offset = Math.max(0, (Math.max(1, page) - 1) * limit)
  const stmt = db.prepare<[number, number]>(
    'SELECT id, name, email, institution, question, created_at FROM inquiries ORDER BY created_at DESC LIMIT ? OFFSET ?'
  )
  return stmt.all(limit, offset) as Inquiry[]
}

export async function getInquiriesCount(): Promise<number> {
  const row = db.prepare('SELECT COUNT(*) as c FROM inquiries').get() as { c: number }
  return row.c
}

export async function getNewInquiriesCountSince(sinceTs: number): Promise<number> {
  const row = db
    .prepare('SELECT COUNT(*) as c FROM inquiries WHERE created_at > ?')
    .get(sinceTs) as { c: number }
  return row.c
}
  
export async function createInquiry(inquiry: InquiryFormData): Promise<RunResult> {
    const insert = db.prepare('INSERT INTO inquiries (name, email, institution, question, created_at) VALUES (?, ?, ?, ?, ?)')
    const createdAt = Date.now()
    const result = insert.run(inquiry.name, inquiry.email, inquiry.institution, inquiry.question, createdAt)
    // Send email in background; failures won't break the request
    try {
      const row = db.prepare('SELECT id, name, email, institution, question, created_at FROM inquiries WHERE id = ?').get(result.lastInsertRowid) as Inquiry
      await sendNewInquiryEmail(row)
    } catch {}
    return result
  }

export async function deleteInquiry(id: number): Promise<RunResult> {
  const deleteStmt = db.prepare('DELETE FROM inquiries WHERE id = ?')
  return deleteStmt.run(id)
}

const SETTINGS_EMAIL_KEY = 'notification_email'

export async function getNotificationEmail(): Promise<string | null> {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(SETTINGS_EMAIL_KEY) as { value?: string } | undefined
  return row?.value ?? null
}

export async function saveNotificationEmail(email: string): Promise<void> {
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
  upsert.run(SETTINGS_EMAIL_KEY, email)
}

export async function deleteNotificationEmail(): Promise<void> {
  const del = db.prepare('DELETE FROM settings WHERE key = ?')
  del.run(SETTINGS_EMAIL_KEY)
}

const SETTINGS_LANDING_KEY = 'landing_settings'

export type LandingSettings = {
  header: { title: string; subtitle: string }
  features: { items: string[] } // 4 items
  video: { file: string | null }
  howItWorks: { title: string; subtitle: string }[] // 3
  howItWorksSubtitle?: string // subtitle for "How it works" section
  whyUseful: {
    item1: { title: string; subtitle: string; image?: string | null }
    item2: { title: string; subtitle: string; image?: string | null }
    item3: { title: string; subtitle: string; image?: string | null }
  }
  socials: { telegram: string; vk: string }
  faq: { items: { question: string; answer: string }[] } // up to 6
}

export async function getLandingSettings(): Promise<LandingSettings | null> {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(SETTINGS_LANDING_KEY) as { value?: string } | undefined
  if (!row?.value) return null
  try {
    const parsed = JSON.parse(row.value) as any
    // Migrate whyUseful from array to object format if needed
    if (parsed.whyUseful && Array.isArray(parsed.whyUseful)) {
      parsed.whyUseful = {
        item1: parsed.whyUseful[0] || { title: '', subtitle: '', image: null },
        item2: parsed.whyUseful[1] || { title: '', subtitle: '', image: null },
        item3: parsed.whyUseful[2] || { title: '', subtitle: '', image: null },
      }
      // Save migrated data back to database
      await saveLandingSettings(parsed as LandingSettings)
    }
    return parsed as LandingSettings
  } catch {
    return null
  }
}

export async function saveLandingSettings(settings: LandingSettings): Promise<void> {
  const upsert = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
  upsert.run(SETTINGS_LANDING_KEY, JSON.stringify(settings))
}