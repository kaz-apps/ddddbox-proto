import Layout from '@/components/layout'
import { ProjectDetailsForm } from '@/components/project-details-form'

export default function ProjectDetailsPage() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">プロジェクト詳細</h1>
        <ProjectDetailsForm projectId="temp-id" />
      </div>
    </Layout>
  )
}

