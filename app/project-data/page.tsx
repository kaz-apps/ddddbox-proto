"use client"

import { useState } from 'react'
import Layout from '@/components/layout'
import { ProjectDataList } from '@/components/project-data-list'
import { SearchSidebar } from '@/components/search-sidebar'

const initialFilters = {
  projectNameSearch: '',
  codeNameSearch: '',
  teamMemberSearch: '',
  projectMembers: [] as string[],
  documentType: [] as string[],
  isArchived: false,
  hasAttachment: false
}

export default function ProjectDataPage() {
  const [searchFilters, setSearchFilters] = useState(initialFilters)

  return (
    <Layout>
      <div className="container mx-auto py-6 flex">
        <div className="flex-grow pr-4">
          <h1 className="text-2xl font-bold mb-6">カルテ項目検索</h1>
          <ProjectDataList searchFilters={searchFilters} />
        </div>
        <SearchSidebar onSearchFiltersChange={setSearchFilters} />
      </div>
    </Layout>
  )
}

