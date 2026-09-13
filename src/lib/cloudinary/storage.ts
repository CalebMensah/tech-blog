import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadFile(file: File, folder: string) {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const result = await new Promise<{ secure_url: string; public_id: string; width?: number; height?: number }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `publication/${folder}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload failed'))
          resolve(result)
        }
      )
      stream.end(buffer)
    }
  )

  return {
    url: result.secure_url,
    path: result.public_id, // stored in Media.storagePath, used for deletion
    width: result.width,
    height: result.height,
  }
}

export async function deleteFile(publicId: string) {
  const result = await cloudinary.uploader.destroy(publicId)
  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error(`Delete failed: ${result.result}`)
  }
}