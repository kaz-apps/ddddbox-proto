"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconUsers, IconPencil, IconArchive } from '@tabler/icons-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

type Project = {
  id: string;
  projectNo: string;
  name: string;
  organization: string;
  phase: '企画' | '設計' | '施工';
}

export const mockProjects: Project[] = [
  { id: '1', projectNo: 'AMDlab-01', name: '商業施設改修工事', organization: '株式会社AMDlab', phase: '企画' },
  { id: '2', projectNo: 'yskui-01', name: '商業施設改修工事', organization: '安井建築設計', phase: '企画' },
  { id: '3', projectNo: 'Atelier', name: '商業施設改修工事', organization: 'アトリエ', phase: '企画' },
  { id: '4', projectNo: 'AMDlab-04', name: '商業施設改修工事', organization: '株式会社AMDlab', phase: '企画' },
  { id: '5', projectNo: 'yskui-01', name: '商業施設改修工事', organization: '安井建築設計', phase: '企画' },
  { id: '6', projectNo: 'Atelier', name: '商業施設改修工事', organization: 'アトリエ', phase: '企画' },
]

export function ProjectList() {
  const [projects] = useState<Project[]>(mockProjects)
  const [currentPage] = useState(1)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">マイプロジェクト</h2>
        <span className="text-sm text-gray-500">20件</span>
      </div>
      
      <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">4Dプロジェクト No./プロジェクトNo.</TableHead>
                <TableHead>プロジェクト名称</TableHead>
                <TableHead>編集</TableHead>
                <TableHead>フェーズ</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-md text-sm">
                      {project.projectNo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/project-details/${project.id}`} className="text-blue-600 hover:underline">
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>{project.organization}</TableCell>
                  <TableCell>{project.phase}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-[#829F7F]">
                        <IconUsers className="w-4 h-4" />
                        <span className="ml-2">メンバー追加</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[#829F7F]">
                        <IconPencil className="w-4 h-4" />
                        <span className="ml-2">編集</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[#829F7F]">
                        <IconArchive className="w-4 h-4" />
                        <span className="ml-2">アーカイブ</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </div>

      <div className="flex justify-center gap-1 mt-4">
        <Button variant="outline" size="sm" disabled>
          {'<<'}
        </Button>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            className="min-w-[32px]"
          >
            {page}
          </Button>
        ))}
        <Button variant="outline" size="sm">
          {'>>'}
        </Button>
      </div>
    </div>
  )
}

