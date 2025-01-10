import Layout from '@/components/layout'
import { ProjectDetailsForm } from '@/components/project-details-form'

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">建物カルテ</h1>
        <ProjectDetailsForm projectId={params.id} />
      </div>
    </Layout>
  )
}

