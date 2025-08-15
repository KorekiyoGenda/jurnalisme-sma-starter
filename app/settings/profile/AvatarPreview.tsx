'use client'

import { useEffect, useState } from 'react'
import NextImage from 'next/image'

type Props = {
  initialUrl?: string
}

/**
 * Preview avatar berbentuk lingkaran.
 * - Menangkap perubahan <input type="file" id="avatar" />
 * - Tampilkan preview lokal (URL.createObjectURL) tanpa stretching (object-cover)
 */
export default function AvatarPreview({ initialUrl }: Props) {
  const [url, setUrl] = useState<string | undefined>(initialUrl)

  useEffect(() => {
    const input = document.getElementById('avatar') as HTMLInputElement | null
    if (!input) return

    const onChange = () => {
      const file = input.files?.[0]
      if (!file) {
        setUrl(initialUrl)
        return
      }
      const objectUrl = URL.createObjectURL(file)
      setUrl(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }

    input.addEventListener('change', onChange)
    return () => input.removeEventListener('change', onChange)
  }, [initialUrl])

  return (
    <div className="h-16 w-16 overflow-hidden rounded-full bg-muted relative">
      {url ? (
        <NextImage
          src={url}
          alt="Avatar"
          fill
          sizes="64px"
          className="object-cover"
          priority
        />
      ) : null}
    </div>
  )
}
