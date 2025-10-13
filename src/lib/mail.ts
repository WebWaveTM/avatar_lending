'use server'

import nodemailer from 'nodemailer'
import type { Inquiry } from './db'
import { getNotificationEmail } from './actions'

function getTransport() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const secure = process.env.SMTP_SECURE === 'true'

  if (!host || !user || !pass) {
    throw new Error('SMTP env vars are not fully set')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })
}

function renderInquiryHtml(inquiry: Inquiry) {
  const createdAt = new Date(inquiry.created_at).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `
  <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color:#f5f7fb; padding:24px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:640px; margin:0 auto;">
      <tr>
        <td>
          <div style="background:white; border-radius:16px; box-shadow:0 6px 20px rgba(0,0,0,0.06); padding:28px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
              <div style="font-size:18px; font-weight:600; color:#111827;">Новое обращение</div>
              <div style="font-size:12px; color:#6b7280;">${createdAt}</div>
            </div>
            <div style="height:1px; background:#eef0f4; margin:12px 0 20px;"></div>

            <div style="margin-bottom:16px;">
              <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">ФИО</div>
              <div style="font-size:16px; color:#111827;">${escapeHtml(inquiry.name)}</div>
            </div>
            <div style="margin-bottom:16px;">
              <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">Email</div>
              <div style="font-size:16px; color:#111827;">${escapeHtml(inquiry.email)}</div>
            </div>
            <div style="margin-bottom:16px;">
              <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">Образовательное учреждение</div>
              <div style="font-size:16px; color:#111827;">${escapeHtml(inquiry.institution)}</div>
            </div>
            <div style="margin-bottom:8px;">
              <div style="font-size:12px; color:#6b7280; margin-bottom:4px;">Вопрос</div>
              <div style="font-size:16px; color:#111827; line-height:1.6;">${escapeHtml(inquiry.question).replace(/\n/g,'<br/>')}</div>
            </div>
          </div>
          <div style="text-align:center; color:#9ca3af; font-size:12px; margin-top:16px;">
            Вы получили это письмо, так как указали эту почту для уведомлений.
          </div>
        </td>
      </tr>
    </table>
  </div>
  `
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendNewInquiryEmail(inquiry: Inquiry): Promise<void> {
  const to = await getNotificationEmail()
  if (!to) return

  const transporter = getTransport()
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com'
  const subject = 'Новое обращение — Аватары'
  const html = renderInquiryHtml(inquiry)

  await transporter.sendMail({ from, to, subject, html })
}
