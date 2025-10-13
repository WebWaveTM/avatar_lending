'use client'

import * as React from 'react'
import { Box, Tabs, Tab, Container, Typography, Paper, Button, Stack } from '@mui/material'
import InquiriesTab from './InquiriesTab'
import LandingSettingsTab from './LandingSettingsTab'
import type { Inquiry } from '@/lib/db'
import { signOut } from 'next-auth/react'
import SettingsDialog from '@/components/admin/SettingsDialog'
import { getNotificationEmail } from '@/lib/actions'

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  }
}

type Props = { inquiries: Inquiry[]; total: number; page: number; pageSize: number }

export default function AdminDashboard({ inquiries, total, page, pageSize }: Props) {
  const [value, setValue] = React.useState(0)
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [email, setEmail] = React.useState<string | null>(null)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      const e = await getNotificationEmail()
      if (mounted) setEmail(e)
    })()
    return () => { mounted = false }
  }, [])

  return (
    <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Админ-панель
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => setSettingsOpen(true)}>Настройки</Button>
              <Button
                variant="outlined"
                onClick={() => signOut({ callbackUrl: '/admin/sign-in', redirect: true })}
              >
                Выйти
              </Button>
            </Stack>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="admin dashboard tabs">
              <Tab label="Обращения" {...a11yProps(0)} />
              <Tab label="Настройки лэндинга" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <Box role="tabpanel" hidden={value !== 0} id="admin-tabpanel-0" aria-labelledby="admin-tab-0" sx={{ pt: 3 }}>
            {value === 0 && <InquiriesTab inquiries={inquiries} total={total} page={page} pageSize={pageSize} />}
          </Box>
          <Box role="tabpanel" hidden={value !== 1} id="admin-tabpanel-1" aria-labelledby="admin-tab-1" sx={{ pt: 3 }}>
            {value === 1 && <LandingSettingsTab />}
          </Box>
        </Paper>
        <SettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          initialEmail={email}
          onSaved={(e) => setEmail(e)}
          onDeleted={() => setEmail(null)}
        />
      </Container>
    </Box>
  )
}


