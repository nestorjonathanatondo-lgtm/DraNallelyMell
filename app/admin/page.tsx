
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AdminPanel } from '@/components/admin/admin-panel'
import { isAdmin } from '@/lib/auth'
import { getContent } from '@/lib/content'
import { usingBlob } from '@/lib/storage'

export const metadata: Metadata = {
  title: 'Administración',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/')
  const content = await getContent()
  return <AdminPanel initialContent={content} persistent={usingBlob()} />
}
