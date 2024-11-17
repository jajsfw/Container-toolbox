import imageCompression from 'browser-image-compression'

export interface CompressOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  quality: number
  useWebWorker?: boolean
}

export async function compressImage(
  file: File,
  options: Partial<CompressOptions> = {}
) {
  const defaultOptions: CompressOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    quality: 0.8,
    useWebWorker: true
  }

  try {
    const compressedFile = await imageCompression(
      file,
      { ...defaultOptions, ...options }
    )
    return compressedFile
  } catch (error) {
    console.error('图片压缩失败:', error)
    throw error
  }
} 