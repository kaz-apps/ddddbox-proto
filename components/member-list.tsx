"use client"

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { supabase } from '@/lib/supabase'
import type { Member } from '@/lib/supabase'

export function MemberList() {
  const [members, setMembers] = useState<Member[]>([])
  const [currentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .order('name')

        if (error) {
          throw error
        }

        setMembers(data)
      } catch (err) {
        console.error('Error fetching members:', err)
        setError('メンバーの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const handleEdit = async (memberId: string) => {
    console.log('Edit member:', memberId)
  }

  const handleDelete = async (memberId: string) => {
    if (!window.confirm('このメンバーを削除してもよろしいですか？')) {
      return
    }

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberId)

      if (error) {
        throw error
      }

      setMembers(members.filter(member => member.id !== memberId))
    } catch (err) {
      console.error('Error deleting member:', err)
      alert('メンバーの削除に失敗しました')
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
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>権限</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(member.id)}
                      className="text-[#829F7F] hover:text-[#6B836D]"
                    >
                      <IconPencil className="w-4 h-4" />
                      <span className="ml-2">編集</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <IconTrash className="w-4 h-4" />
                      <span className="ml-2">削除</span>
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

