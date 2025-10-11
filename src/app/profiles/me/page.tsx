import { Navbar } from '@/components/navbar'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function MyProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Redirect to actual profile
  if (session.user.handle) {
    redirect(`/profiles/${session.user.handle}`)
  }

  redirect('/dashboard')
}

