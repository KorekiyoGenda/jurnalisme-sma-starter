// Timezone IANA yang valid
const TZ = 'Asia/Jakarta';
const LOCALE = 'id-ID';

function fmtDate(
  input: string | number | Date,
  options: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, ...options })
    .format(new Date(input));
}

// Preset yang sering dipakai
export const dateID = {
  day2:       (d: any) => fmtDate(d, { day: '2-digit' }),
  monthShort: (d: any) => fmtDate(d, { month: 'short' }),
  weekdayLong:(d: any) => fmtDate(d, { weekday: 'long' }),
  fullLong:   (d: any) => fmtDate(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
};
