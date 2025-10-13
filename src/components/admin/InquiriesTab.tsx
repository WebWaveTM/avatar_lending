'use client'

import * as React from 'react'
import type { Inquiry } from '@/lib/db'
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Paper,
} from '@mui/material'
import Stack from '@mui/material/Stack'
import Pagination from '@mui/material/Pagination'
import { deleteInquiry, getInquiriesCount, getAllInquiries } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

type Props = { inquiries: Inquiry[]; total: number; page: number; pageSize: number }

export default function InquiriesTab({ inquiries, total, page, pageSize }: Props) {
  const [selected, setSelected] = React.useState<Inquiry | null>(null)
  const [items, setItems] = React.useState<Inquiry[]>(inquiries)
  const [knownTotal, setKnownTotal] = React.useState<number>(total)
  const [newAvailable, setNewAvailable] = React.useState<boolean>(false)
  const [newCount, setNewCount] = React.useState<number>(0)
  const router = useRouter()

  const pageCount = Math.max(1, Math.ceil(knownTotal / pageSize))

  async function handleDelete(id: number) {
    await deleteInquiry(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    setSelected((prev) => (prev && prev.id === id ? null : prev))
    setKnownTotal((t) => Math.max(0, t - 1))
  }

  React.useEffect(() => {
    setItems(inquiries)
    setKnownTotal(total)
    setNewAvailable(false)
    setNewCount(0)
  }, [inquiries, total, page])

  React.useEffect(() => {
    let mounted = true
    const interval = setInterval(async () => {
      try {
        const count = await getInquiriesCount()
        if (!mounted) return
        if (count > knownTotal) {
          const diff = count - knownTotal
          setNewCount(diff)
          if (!newAvailable) {
            setNewAvailable(true)
            toast.success('Появились новые обращения')
          }
        }
      } catch {
        // ignore
      }
    }, 10000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [knownTotal, newAvailable])

  return (
    <Box>
      {newAvailable && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Button variant="contained" onClick={async () => {
            try {
              const [fresh, count] = await Promise.all([
                getAllInquiries(1, pageSize),
                getInquiriesCount(),
              ])
              setItems(fresh)
              setKnownTotal(count)
              setSelected(null)
              setNewAvailable(false)
              setNewCount(0)
              if (page !== 1) {
                router.push('/admin?page=1')
              }
            } catch {
              // ignore
            }
          }}>
            Загрузить новые обращения{newCount > 0 ? ` (${newCount})` : ''}
          </Button>
        </Box>
      )}
      {items.length === 0 ? (
        <Typography color="text.secondary">Пока нет обращений</Typography>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <List>
            {items.map((inq) => (
              <React.Fragment key={inq.id}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <ListItemButton onClick={() => setSelected(inq)} sx={{ px: 0, borderRadius: 2 }}>
                      <ListItemText
                        primary={inq.name}
                        secondary={`${new Date(inq.created_at).toLocaleString()} — ${inq.email}`}
                      />
                    </ListItemButton>
                  </Box>
                  <Button color="error" onClick={() => handleDelete(inq.id)}>Удалить</Button>
                </Stack>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          color="primary"
          count={pageCount}
          page={Math.min(page, pageCount)}
          onChange={(_e, p) => router.push(`/admin?page=${p}`)}
          shape="rounded"
        />
      </Box>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Обращение</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">ФИО</Typography>
              <Typography gutterBottom>{selected.name}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Email</Typography>
              <Typography gutterBottom>{selected.email}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Образовательное учреждение</Typography>
              <Typography gutterBottom>{selected.institution}</Typography>
              <Typography variant="subtitle2" color="text.secondary">Вопрос</Typography>
              <Typography>{selected.question}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {selected && (
            <Button color="error" onClick={() => handleDelete(selected.id)}>Удалить</Button>
          )}
          <Button onClick={() => setSelected(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}


