import { prisma } from '@/lib/db/prisma'
import { ProductForm } from '@/components/admin/product-form'
import { ProductListItem } from '@/components/admin/product-list-item'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { reviews: true, comparisonItems: true } },
    },
  })

  return (
    <div className="grid max-w-5xl grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Products are the things being reviewed or compared (apps, tools, phones, etc.)
        </p>
        <div className="mt-6 space-y-3">
          {products.map((p:any) => (
            <ProductListItem
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                slug: p.slug,
                description: p.description,
                brand: p.brand,
                websiteUrl: p.websiteUrl,
                logoUrl: p.logoUrl,
              }}
              usageCount={p._count.reviews + p._count.comparisonItems}
            />
          ))}
          {products.length === 0 && (
            <p className="text-sm text-neutral-500">No products yet.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">New Product</h2>
        <div className="mt-4">
          <ProductForm />
        </div>
      </div>
    </div>
  )
}