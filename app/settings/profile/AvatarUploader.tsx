'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import NextImage from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

type Props = {
  name?: string               // nama field form (default: 'avatar')
  initialUrl?: string         // url avatar sekarang (opsional)
}

export default function AvatarUploader({ name = 'avatar', initialUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialUrl || undefined)

  // dialog + crop state
  const [open, setOpen] = useState(false)
  const [src, setSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  // Buka file picker
  const onPickFile = () => inputRef.current?.click()

  // Saat pilih file: tampilkan dialog crop
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataURL(file)
    setSrc(dataUrl)
    setOpen(true)
  }

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  // Konversi hasil crop ke Blob -> File -> taruh ke input tersembunyi
  const onConfirm = useCallback(async () => {
    if (!src || !croppedAreaPixels) return

    const blob = await getCroppedBlob(src, croppedAreaPixels, 512) // output 512x512
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })

    // taruh file hasil crop ke input[name=avatar]
    if (inputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      inputRef.current.files = dt.files
    }

    // update preview
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)

    // tutup dialog
    setOpen(false)
    // reset sumber awal crop
    setSrc(null)
  }, [src, croppedAreaPixels])

  const roundMask = useMemo(
    () => 'relative h-16 w-16 overflow-hidden rounded-full bg-muted',
    []
  )

  return (
    <div className="flex items-center gap-4">
      {/* Preview lingkaran */}
      <div className={roundMask}>
        {previewUrl ? (
          <NextImage
            src={previewUrl}
            alt="Avatar"
            fill
            sizes="64px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No Avatar
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Foto Profil</Label>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onPickFile}>
            Pilih/Ganti Foto
          </Button>
          {previewUrl && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                // hapus file di input & preview
                if (inputRef.current) inputRef.current.value = ''
                setPreviewUrl(undefined)
              }}
            >
              Hapus
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Rasio wajib 1:1. Kamu bisa crop sebelum menyimpan. Disarankan &lt; 5MB.
        </p>
      </div>

      {/* Input file "asli" (tersembunyi). Hasil crop akan ditaruh di sini */}
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* Dialog Crop 1:1 */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Crop Foto Profil (1:1)</DialogTitle>
          </DialogHeader>

          <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-md bg-black">
            {src && (
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"           // terlihat bulat saat crop
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Zoom</Label>
            <Slider
              value={[zoom]}
              onValueChange={(v) => setZoom(v[0] ?? 1)}
              min={1}
              max={3}
              step={0.01}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="button" onClick={onConfirm}>
              Gunakan Foto Ini
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* Helpers */
function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // gunakan DOM API, bukan komponen Next
    const img = document.createElement('img') // atau: const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.crossOrigin = 'anonymous' // aman untuk canvas
    img.src = url
  })
}

/**
 * Crop ke Blob JPEG (size px = sisi terpanjang output)
 */
async function getCroppedBlob(
  imageSrc: string,
  crop: Area,
  size = 512,
  quality = 0.9
): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // output square
  canvas.width = size
  canvas.height = size

  // scale agar crop area diisi ke canvas square
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  const sx = crop.x * scaleX
  const sy = crop.y * scaleY
  const sw = crop.width * scaleX
  const sh = crop.height * scaleY

  // drawImage: src crop → dest 0,0,size,size
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, size, size)

  return await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality)
  })
}
