import Layout from '@/components/layout'
import { MemberList } from '@/components/member-list'

export default function MembersPage() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">組織メンバー管理</h1>
            <span className="text-sm text-gray-500">20件</span>
          </div>
          <button className="bg-[#8BA989] text-white px-4 py-2 rounded-md hover:bg-[#7A987B] transition-colors">
            メンバー招待
          </button>
        </div>
        <MemberList />
      </div>
    </Layout>
  )
}

