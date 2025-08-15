export default function StatusChip({ status }:{ status:'draft'|'in_review'|'published'|'rejected' }) {
  const map = {
    draft:      'bg-amber-100 text-amber-700',
    in_review:  'bg-sky-100 text-sky-700',
    published:  'bg-emerald-100 text-emerald-700',
    rejected:   'bg-rose-100 text-rose-700',
  } as const
  const label = { draft:'Draft', in_review:'Review', published:'Published', rejected:'Rejected' }[status]
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>{label}</span>
}
