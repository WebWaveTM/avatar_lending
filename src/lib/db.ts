import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'

const defaultDir = path.resolve(process.cwd(), 'var')
const defaultPath = path.join(defaultDir, 'auth.sqlite')

const dbPath = process.env.AUTH_DB_PATH || defaultPath

try {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
} catch {}

export const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

db.exec(
  `CREATE TABLE IF NOT EXISTS login_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ts INTEGER NOT NULL,
    success INTEGER NOT NULL
  )`
)

db.exec(
  `CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    institution TEXT NOT NULL,
    question TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`
)

db.exec(
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )`
)

export type Inquiry = {
  id: number
  name: string
  email: string
  institution: string
  question: string
  created_at: number
}

export type InquiryFormData = {
  name: string
  email: string
  institution: string
  question: string
}


function seedInquiriesIfEmpty(): void {
  const row = db.prepare('SELECT COUNT(*) as c FROM inquiries').get() as { c: number }
  if (row.c > 0) return

  const insert = db.prepare('INSERT INTO inquiries (name, email, institution, question, created_at) VALUES (?, ?, ?, ?, ?)')
  const tx = db.transaction(() => {
    for (let i = 1; i <= 100; i++) {
      const name = `Пользователь ${i}`
      const email = `user${i}@example.com`
      const institution = `Школа №${(i % 50) + 1}`
      const question = `Вопрос по аватару #${i}`
      // Разброс времени создания за последние ~30 дней
      const createdAt = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      insert.run(name, email, institution, question, createdAt)
    }
  })
  tx()
}

// seedInquiriesIfEmpty()

