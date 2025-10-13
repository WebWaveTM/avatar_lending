import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { logLoginAttempt } from '@/lib/actions'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Пароль',
      credentials: {
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        const providedPassword = credentials?.password
        const envPassword = process.env.ADMIN_PASSWORD

        if (!envPassword) {
          console.error('ADMIN_PASSWORD is not set in environment')
          await logLoginAttempt(false)
          return null
        }

        if (!providedPassword) {
          await logLoginAttempt(false)
          return null
        }

        if (providedPassword !== envPassword) {
          await logLoginAttempt(false)
          return null
        }

        await logLoginAttempt(true)
        return { id: 'admin', name: 'Admin' }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
}


