'use client'

import { signIn } from 'next-auth/react'
import { Button, Container, TextField, Typography, Box, Paper, Alert } from '@mui/material'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  password: z.string().min(1, 'Введите пароль'),
})

type FormValues = z.infer<typeof formSchema>

export default function SignInPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const callbackUrl = searchParams.get('callbackUrl') || '/admin'
  const urlError = searchParams.get('error')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '' },
  })

  const onSubmit = handleSubmit(async ({ password }) => {
    const result = await signIn('credentials', {
      redirect: false,
      password,
      callbackUrl,
    })

    if (!result) {
      setError('root', { message: 'Неизвестная ошибка' })
      return
    }
    if (result.error) {
      setError('root', { message: 'Неверный пароль' })
      return
    }
    router.push(result.url || callbackUrl)
  })

  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        <Paper elevation={2} sx={{ width: '100%', p: 4, borderRadius: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Вход в панель администратора
          </Typography>
          {(errors.root?.message || urlError) && (
            <Box mb={2}>
              <Alert severity="error">{errors.root?.message || 'Неверный пароль'}</Alert>
            </Box>
          )}
          <Box component="form" onSubmit={onSubmit}>
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              {...register('password')}
              margin="normal"
              required
              autoFocus
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} fullWidth>
              {isSubmitting ? 'Входим…' : 'Войти'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}


