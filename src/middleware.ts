import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/admin/sign-in',
  },
})

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}


