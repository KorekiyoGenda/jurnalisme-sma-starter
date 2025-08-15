// lib/date-safe.ts
const TZ = 'Asia/Jakarta'

// parsing 'YYYY-MM-DD' jadi Date di tengah hari UTC (biar gak “mundur/maju” 1 hari)
export function parseIDDate(d: string | Date) {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, day, 12, 0, 0))
  }
  return new Date(d)
}

// “today” untuk Asia/Jakarta (hanya tanggalnya saja)
export function todayID() {
  const now = new Date()
  const y = Number(new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric' }).format(now))
  const m = Number(new Intl.DateTimeFormat('en-CA', { timeZone: TZ, month: '2-digit' }).format(now))
  const d = Number(new Intl.DateTimeFormat('en-CA', { timeZone: TZ, day: '2-digit' }).format(now))
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
}

export function diffDaysID(dateStr: string) {
  const ev = parseIDDate(dateStr)
  const today = todayID()
  const ms = ev.getTime() - today.getTime()
  return Math.round(ms / 86400000) // 86400000 = ms per hari
}
