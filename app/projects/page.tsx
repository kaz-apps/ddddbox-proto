import Layout from '@/components/layout'
import { ProjectList } from '@/components/project-list'

export default function ProjectsPage() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">プロジェクト一覧</h1>
        <ProjectList />
      </div>
    </Layout>
  )
}

