import { prisma } from '@/lib/db/prisma'
import { MediaUploader } from '@/components/admin/media-uploader'
import { MediaGrid } from '@/components/admin/media-grid'

export default async function MediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div>
      <h1 className="text-2xl font-semibold">Media Library</h1>
      <div className="mt-6">
        <MediaUploader />
      </div>
      <div className="mt-8">
        <MediaGrid
          media={media.map((m:any) => ({
            id: m.id,
            url: m.url,
            altText: m.altText,
            createdAt: m.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  )
}