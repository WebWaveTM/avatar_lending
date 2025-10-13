'use client'

import * as React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material'

type Props = { videoUrl: string | null }

export default function DemoModal({ videoUrl }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button className="ruby-button demo-button" onClick={() => setOpen(true)}>
        Посмотреть демо-ролик
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        <DialogTitle>Демо-ролик</DialogTitle>
        <DialogContent dividers sx={{ p: 2 }}>
          {videoUrl ? (
            <Box sx={{ width: '100%', height: 'calc(100vh - 160px)' }}>
              <video
                src={videoUrl}
                controls
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
              />
            </Box>
          ) : (
            <Typography color="text.secondary">Видео пока не загружено</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


