import { AuthorForm } from '@/components/admin/author-form'

export default function NewAuthorPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New Author</h1>
      <div className="mt-6">
        <AuthorForm />
      </div>
    </div>
  )
}