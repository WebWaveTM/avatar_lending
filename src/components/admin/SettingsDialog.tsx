'use client'

import * as React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { deleteNotificationEmail, saveNotificationEmail } from '@/lib/actions'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.email('Введите корректный email').or(z.literal('')).transform((v) => v.trim()),
})

type FormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  onClose: () => void
  initialEmail: string | null
  onSaved: (email: string) => void
  onDeleted: () => void
}

export default function SettingsDialog({ open, onClose, initialEmail, onSaved, onDeleted }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, getValues } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: initialEmail ?? '' },
  })

  React.useEffect(() => {
    reset({ email: initialEmail ?? '' })
  }, [initialEmail, reset])

  const onSubmit = handleSubmit(async ({ email }) => {
    try {
      await saveNotificationEmail(email)
      toast.success('Email сохранён')
      onSaved(email)
      reset({ email })
      onClose()
    } catch (e) {
      toast.error('Ошибка при сохранении')
    }
  })

  const onDelete = async () => {
    try {
      await deleteNotificationEmail()
      toast.success('Email удалён')
      reset({ email: '' })
      onDeleted()
      onClose()
    } catch {
      toast.error('Ошибка при удалении')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle>Настройки уведомлений</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Эта почта будет использоваться для получения уведомлений о новых обращениях.
        </Typography>
        <Box component="form" onSubmit={onSubmit}>
          <TextField
            label="Email для уведомлений"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            placeholder="name@example.com"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onDelete} disabled={isSubmitting}>Удалить</Button>
        <Button onClick={onClose} disabled={isSubmitting}>Отмена</Button>
        <Button variant="contained" onClick={onSubmit} disabled={isSubmitting}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  )
}


