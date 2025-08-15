export const nfID = new Intl.NumberFormat('id-ID'); // konsisten
export const fmt = (n: number | null | undefined) => nfID.format(n ?? 0);
