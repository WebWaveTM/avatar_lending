'use client'

import * as React from 'react'
import { Box, Paper, Typography, TextField, Button, Divider, Stack } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { type LandingSettings, getLandingSettings, saveLandingSettings } from '@/lib/actions'
import toast from 'react-hot-toast'

const schema = z.object({
  header: z.object({
    title: z.string().max(50, 'Макс 50 символов').optional().default(''),
    subtitle: z.string().max(110, 'Макс 110 символов').optional().default(''),
  }),
  features: z.object({
    items: z.array(z.string().max(150, 'Макс 150 символов').optional().default('')).length(4),
  }),
  video: z.object({
    file: z.string().nullable().optional().default(null), // video url
  }),
  howItWorks: z
    .array(z.object({ title: z.string().max(50).optional().default(''), subtitle: z.string().max(200).optional().default('') }))
    .length(3),
  whyUseful: z
    .array(z.object({ title: z.string().max(40).optional().default(''), subtitle: z.string().max(100).optional().default('') }))
    .length(3),
  socials: z.object({
    telegram: z.string().trim().url('Некорректная ссылка').or(z.literal('')).default(''),
    vk: z.string().trim().url('Некорректная ссылка').or(z.literal('')).default(''),
  }),
  faq: z.object({
    items: z
      .array(z.object({ question: z.string().optional().default(''), answer: z.string().optional().default('') }))
      .max(6, 'Макс 6 вопросов')
      .default([]),
  }),
})

type FormValues = z.input<typeof schema>

const defaults: FormValues = {
  header: { title: '', subtitle: '' },
  features: { items: ['', '', '', ''] },
  video: { file: null },
  howItWorks: [
    { title: '', subtitle: '' },
    { title: '', subtitle: '' },
    { title: '', subtitle: '' },
  ],
  whyUseful: [
    { title: '', subtitle: '' },
    { title: '', subtitle: '' },
    { title: '', subtitle: '' },
  ],
  socials: { telegram: '', vk: '' },
  faq: { items: [] },
}

export default function LandingSettingsTab() {
  const [loading, setLoading] = React.useState(true)
  const [pendingVideoFile, setPendingVideoFile] = React.useState<File | null>(null)
  const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  })

  const faqArray = useFieldArray({ control, name: 'faq.items' })

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const saved = await getLandingSettings()
        if (mounted && saved) {
          reset(saved as FormValues)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [reset])

  const onSubmit = handleSubmit(async (values) => {
    try {
      let videoUrl = values.video?.file ?? null
      if (pendingVideoFile) {
        const form = new FormData()
        form.append('file', pendingVideoFile)
        const res = await fetch('/api/landing/video/upload', { method: 'POST', body: form })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || 'Upload failed')
        videoUrl = json.url
      }
      const parsed = schema.parse({ ...values, video: { file: videoUrl } })
      await saveLandingSettings(parsed as LandingSettings)
      toast.success('Настройки сохранены')
      setPendingVideoFile(null)
    } catch {
      toast.error('Ошибка при сохранении')
    }
  })

  if (loading) {
    return <Typography color="text.secondary">Загрузка…</Typography>
  }

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Шапка</Typography>
          <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 6}}>
              <TextField label="Заголовок" fullWidth {...register('header.title')} error={!!errors.header?.title} helperText={errors.header?.title?.message} />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField label="Подпись" fullWidth {...register('header.subtitle')} error={!!errors.header?.subtitle} helperText={errors.header?.subtitle?.message} />
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="h6">Особенности</Typography>
          <Grid container spacing={2}>
            {[0,1,2,3].map((i) => (
              <Grid size={{xs: 12, md: 6}} key={i}>
                <TextField label={`Пункт ${i+1}`} fullWidth {...register(`features.items.${i}` as const)} error={!!errors.features?.items?.[i]} helperText={errors.features?.items?.[i]?.message} />
              </Grid>
            ))}
          </Grid>

          <Divider />

          <Typography variant="h6">Видео</Typography>
          <input type="file" accept="video/*" onChange={(e) => {
            const file = e.currentTarget.files?.[0]
            setPendingVideoFile(file ?? null)
          }} />
          <Typography variant="caption" color="text.secondary">{pendingVideoFile ? `Выбран файл: ${pendingVideoFile.name}. Он будет загружен при сохранении.` : 'До 500 МБ. Файл будет загружен при сохранении.'}</Typography>

          <Divider />

          <Typography variant="h6">Как это работает</Typography>
          {[0,1,2].map((i) => (
            <Grid container spacing={2} key={i}>
              <Grid size={{xs: 12, md: 6}}>
                <TextField label="Заголовок" fullWidth {...register(`howItWorks.${i}.title` as const)} error={!!errors.howItWorks?.[i]?.title} helperText={errors.howItWorks?.[i]?.title?.message} />
              </Grid>
              <Grid size={{xs: 12, md: 6}}>
                <TextField label="Подпись" fullWidth {...register(`howItWorks.${i}.subtitle` as const)} error={!!errors.howItWorks?.[i]?.subtitle} helperText={errors.howItWorks?.[i]?.subtitle?.message} />
              </Grid>
            </Grid>
          ))}

          <Divider />

          <Typography variant="h6">Почему это полезно</Typography>
          {[0,1,2].map((i) => (
            <Grid container spacing={2} key={i}>
              <Grid size={{xs: 12, md: 6}}>
                <TextField label="Заголовок" fullWidth {...register(`whyUseful.${i}.title` as const)} error={!!errors.whyUseful?.[i]?.title} helperText={errors.whyUseful?.[i]?.title?.message} />
              </Grid>
              <Grid size={{xs: 12, md: 6}}>
                <TextField label="Подпись" fullWidth {...register(`whyUseful.${i}.subtitle` as const)} error={!!errors.whyUseful?.[i]?.subtitle} helperText={errors.whyUseful?.[i]?.subtitle?.message} />
              </Grid>
            </Grid>
          ))}

          <Divider />

          <Typography variant="h6">Соцсети</Typography>
          <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 6}}>
              <TextField label="Telegram" fullWidth {...register('socials.telegram')} error={!!errors.socials?.telegram} helperText={errors.socials?.telegram?.message} />
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <TextField label="VK" fullWidth {...register('socials.vk')} error={!!errors.socials?.vk} helperText={errors.socials?.vk?.message} />
            </Grid>
          </Grid>

          <Divider />

          <Typography variant="h6">Частые вопросы</Typography>
          <Stack spacing={2}>
            {faqArray.fields.map((f, idx) => (
              <Paper key={f.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{xs: 12}}>
                    <TextField label="Вопрос" fullWidth {...register(`faq.items.${idx}.question` as const)} />
                  </Grid>
                  <Grid size={{xs: 12}}>
                    <TextField label="Ответ" fullWidth multiline minRows={2} {...register(`faq.items.${idx}.answer` as const)} />
                  </Grid>
                  <Grid size={{xs: 12}}>
                    <Button color="error" onClick={() => faqArray.remove(idx)}>Удалить</Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            {faqArray.fields.length < 6 && (
              <Button variant="outlined" onClick={() => faqArray.append({ question: '', answer: '' })}>Добавить вопрос</Button>
            )}
          </Stack>

          <Box>
            <Button variant="contained" onClick={onSubmit} disabled={isSubmitting}>Сохранить</Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}


