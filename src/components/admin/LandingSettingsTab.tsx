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
  howItWorks: z.object({
    subtitle: z.string().max(100, 'Макс 100 символов').optional().default(''),
    items: z
      .array(z.object({ title: z.string().max(50).optional().default(''), subtitle: z.string().max(200).optional().default('') }))
      .length(3),
  }),
  whyUseful: z.object({
    item1: z.object({ title: z.string().max(40).optional().default(''), subtitle: z.string().max(100).optional().default(''), image: z.string().nullable().optional().default(null) }),
    item2: z.object({ title: z.string().max(40).optional().default(''), subtitle: z.string().max(100).optional().default(''), image: z.string().nullable().optional().default(null) }),
    item3: z.object({ title: z.string().max(40).optional().default(''), subtitle: z.string().max(100).optional().default(''), image: z.string().nullable().optional().default(null) }),
  }),
  socials: z.object({
    telegram: z.string().trim().url('Некорректная ссылка').or(z.literal('')).default(''),
    vk: z.string().trim().url('Некорректная ссылка').or(z.literal('')).default(''),
  }),
  faq: z.object({
    items: z
      .array(z.object({ 
        question: z.string().max(200, 'Макс 200 символов').optional().default(''), 
        answer: z.string().max(500, 'Макс 500 символов').optional().default('') 
      }))
      .max(6, 'Макс 6 вопросов')
      .default([]),
  }),
})

type FormValues = z.input<typeof schema>

const defaults: FormValues = {
  header: { title: '', subtitle: '' },
  features: { items: ['', '', '', ''] },
  video: { file: null },
  howItWorks: {
    subtitle: '',
    items: [
      { title: '', subtitle: '' },
      { title: '', subtitle: '' },
      { title: '', subtitle: '' },
    ],
  },
  whyUseful: {
    item1: { title: '', subtitle: '', image: null },
    item2: { title: '', subtitle: '', image: null },
    item3: { title: '', subtitle: '', image: null },
  },
  socials: { telegram: '', vk: '' },
  faq: { items: [] },
}

export default function LandingSettingsTab() {
  const [loading, setLoading] = React.useState(true)
  const [pendingVideoFile, setPendingVideoFile] = React.useState<File | null>(null)
  const [pendingImages, setPendingImages] = React.useState<Array<File | null>>([null, null, null])
  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
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
          // Transform saved data to form structure
          const formData = {
            ...saved,
            howItWorks: {
              subtitle: (saved as any).howItWorksSubtitle || '',
              items: saved.howItWorks || [
                { title: '', subtitle: '' },
                { title: '', subtitle: '' },
                { title: '', subtitle: '' },
              ],
            },
          }
          reset(formData as FormValues)
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
      // Upload images for advantages if selected
      const imageKeys: Array<'item1' | 'item2' | 'item3'> = ['item1', 'item2', 'item3']
      const imageUrls: Record<'item1' | 'item2' | 'item3', string | null> = { item1: null, item2: null, item3: null }
      for (let i = 0; i < 3; i++) {
        const img = pendingImages[i]
        const key = imageKeys[i]
        if (img) {
          const form = new FormData()
          form.append('file', img)
          form.append('index', String(i))
          const res = await fetch('/api/landing/advantages/upload', { method: 'POST', body: form })
          const json = await res.json()
          if (!res.ok) throw new Error(json?.error || 'Upload failed')
          imageUrls[key] = json.url as string
        }
      }

      const nextValues = { ...values, video: { file: videoUrl } }
      // merge returned image urls into whyUseful
      const mergedWhy = {
        item1: {
          title: nextValues.whyUseful.item1?.title ?? '',
          subtitle: nextValues.whyUseful.item1?.subtitle ?? '',
          image: imageUrls.item1 ?? nextValues.whyUseful.item1?.image ?? null,
        },
        item2: {
          title: nextValues.whyUseful.item2?.title ?? '',
          subtitle: nextValues.whyUseful.item2?.subtitle ?? '',
          image: imageUrls.item2 ?? nextValues.whyUseful.item2?.image ?? null,
        },
        item3: {
          title: nextValues.whyUseful.item3?.title ?? '',
          subtitle: nextValues.whyUseful.item3?.subtitle ?? '',
          image: imageUrls.item3 ?? nextValues.whyUseful.item3?.image ?? null,
        },
      }

      const parsed = schema.parse({ ...nextValues, whyUseful: mergedWhy })
      // Transform howItWorks structure for saving
      const transformed = {
        ...parsed,
        howItWorks: parsed.howItWorks.items || [],
        howItWorksSubtitle: parsed.howItWorks.subtitle || '',
      }
      await saveLandingSettings(transformed as LandingSettings)
      toast.success('Настройки сохранены')
      setPendingVideoFile(null)
      setPendingImages([null, null, null])
    } catch {
      toast.error('Ошибка при сохранении')
    }
  })

  const handleDeleteVideo = async () => {
    try {
      const res = await fetch('/api/landing/video', { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Delete failed')
      setValue('video.file', null)
      setPendingVideoFile(null)
      toast.success('Видео удалено')
    } catch {
      toast.error('Ошибка при удалении видео')
    }
  }

  const handleDeleteImage = async (i: number) => {
    try {
      const res = await fetch(`/api/landing/advantages?index=${i}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Delete failed')
      const key = ['item1', 'item2', 'item3'][i] as 'item1' | 'item2' | 'item3'
      setValue(`whyUseful.${key}.image` as const, null)
      setPendingImages((prev) => {
        const next = [...prev]
        next[i] = null
        return next
      })
      toast.success('Картинка удалена')
    } catch {
      toast.error('Ошибка при удалении картинки')
    }
  }

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
          {watch('video.file') ? (
            <Box>
              <Button color="error" variant="outlined" onClick={handleDeleteVideo}>Удалить видео</Button>
            </Box>
          ) : null}

          <Divider />

          <Typography variant="h6">Как это работает</Typography>
          <Grid container spacing={2}>
            <Grid size={{xs: 12}}>
              <TextField 
                label="Подзаголовок секции" 
                fullWidth 
                {...register('howItWorks.subtitle')} 
                error={!!errors.howItWorks?.subtitle} 
                helperText={errors.howItWorks?.subtitle?.message || 'Макс 100 символов'}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
          </Grid>
          {[0,1,2].map((i) => (
            <Grid container spacing={2} key={i}>
              <Grid size={{xs: 12, md: 6}}>
                <TextField label="Заголовок" fullWidth {...register(`howItWorks.items.${i}.title` as const)} error={!!errors.howItWorks?.items?.[i]?.title} helperText={errors.howItWorks?.items?.[i]?.title?.message} />
              </Grid>
              <Grid size={{xs: 12, md: 6}}>
                <TextField label="Подпись" fullWidth {...register(`howItWorks.items.${i}.subtitle` as const)} error={!!errors.howItWorks?.items?.[i]?.subtitle} helperText={errors.howItWorks?.items?.[i]?.subtitle?.message} />
              </Grid>
            </Grid>
          ))}

          <Divider />

          <Typography variant="h6">Почему это полезно</Typography>
          {[
            { key: 'item1' as const, index: 0, label: 'круг 1' },
            { key: 'item2' as const, index: 1, label: 'круг 2' },
            { key: 'item3' as const, index: 2, label: 'круг 3' },
          ].map(({ key, index, label }) => (
            <Grid container spacing={2} key={key}>
              <Grid size={{xs: 12, md: 6}}>
                <TextField label="Заголовок" fullWidth {...register(`whyUseful.${key}.title` as const)} error={!!errors.whyUseful?.[key]?.title} helperText={errors.whyUseful?.[key]?.title?.message} />
              </Grid>
              <Grid size={{xs: 12, md: 6}}>
                <TextField label="Подпись" fullWidth {...register(`whyUseful.${key}.subtitle` as const)} error={!!errors.whyUseful?.[key]?.subtitle} helperText={errors.whyUseful?.[key]?.subtitle?.message} />
              </Grid>
              <Grid size={{xs: 12}}>
                <Typography variant="subtitle2">Картинка ({label})</Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0] ?? null
                    setPendingImages((prev) => {
                      const next = [...prev]
                      next[index] = file
                      return next
                    })
                  }}
                />
                <Typography variant="caption" color="text.secondary">{pendingImages[index] ? `Выбран файл: ${pendingImages[index]!.name}. Он будет загружен при сохранении.` : 'До 15 МБ. Файл будет загружен при сохранении.'}</Typography>
                {watch(`whyUseful.${key}.image` as const) ? (
                  <Box sx={{ mt: 1 }}>
                    <Button color="error" variant="outlined" onClick={() => handleDeleteImage(index)}>Удалить картинку</Button>
                  </Box>
                ) : null}
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
                    <TextField 
                      label="Вопрос" 
                      fullWidth 
                      {...register(`faq.items.${idx}.question` as const)} 
                      error={!!errors.faq?.items?.[idx]?.question}
                      helperText={errors.faq?.items?.[idx]?.question?.message || 'Макс 200 символов'}
                      inputProps={{ maxLength: 200 }}
                    />
                  </Grid>
                  <Grid size={{xs: 12}}>
                    <TextField 
                      label="Ответ" 
                      fullWidth 
                      multiline 
                      minRows={2} 
                      {...register(`faq.items.${idx}.answer` as const)} 
                      error={!!errors.faq?.items?.[idx]?.answer}
                      helperText={errors.faq?.items?.[idx]?.answer?.message || 'Макс 500 символов'}
                      inputProps={{ maxLength: 500 }}
                    />
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


