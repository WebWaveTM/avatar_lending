export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { type Inquiry } from '@/lib/db'
import { getAllInquiries, getInquiriesCount } from '@/lib/actions'

export default async function AdminPage({ searchParams }: { searchParams?: { page?: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/sign-in')
  const page = Number(searchParams?.page || '1')
  const pageSize = 20
  const inquiries: Inquiry[] = await getAllInquiries(page, pageSize)
  const total: number = await getInquiriesCount()
  return <AdminDashboard inquiries={inquiries} total={total} page={page} pageSize={pageSize} />
}


