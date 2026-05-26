import toast from 'react-hot-toast'

export function showFieldToast(label: string) {
  toast(`Falta ${label}, por favor complétal·o`, {
    id:       'field-error',
    duration: 3500,
    icon:     '⚠️',
    style: {
      background:   '#0A0A0A',
      color:        '#FFFFFF',
      fontSize:     '14px',
      fontWeight:   '500',
      borderRadius: '12px',
      padding:      '12px 16px',
      border:       '1px solid rgba(255,107,0,0.5)',
      boxShadow:    '0 4px 24px rgba(0,0,0,0.25)',
      maxWidth:     '340px',
      lineHeight:   '1.4',
    },
  })
}
