declare module 'browser-image-compression' {
  interface Options {
    maxSizeMB?: number
    maxWidthOrHeight?: number
    useWebWorker?: boolean
    maxIteration?: number
    exifOrientation?: number
    fileType?: string
    initialQuality?: number
  }

  function imageCompression(
    file: File,
    options?: Options
  ): Promise<File>

  export default imageCompression
} 