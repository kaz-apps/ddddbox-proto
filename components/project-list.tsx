"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconUsers, IconPencil, IconArchive } from '@tabler/icons-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/lib/supabase'

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('project_no')

        if (error) {
          throw error
        }

        setProjects(data)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('プロジェクトの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleArchive = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_archived: true })
        .eq('id', projectId)

      if (error) {
        throw error
      }

      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, is_archived: true }
          : project
      ))
    } catch (err) {
      console.error('Error archiving project:', err)
      alert('プロジェクトのアーカイブに失敗しました')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">マイプロジェクト</h2>
        <span className="text-sm text-gray-500">{projects.length}件</span>
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
                    {project.project_no}
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[#829F7F]"
                      onClick={() => handleArchive(project.id)}
                    >
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

