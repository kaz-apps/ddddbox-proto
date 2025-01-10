"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IconPencil, IconTrash } from '@tabler/icons-react'

type Member = {
  id: string;
  name: string;
  role: '管理者' | 'システム管理者' | '一般ユーザー';
  email: string;
}

const mockMembers: Member[] = [
  { id: '1', name: '松原昌幸', role: 'システム管理者', email: 'matsubara@example.com' },
  { id: '2', name: '板下和彦', role: 'システム管理者', email: 'itashita@example.com' },
  { id: '3', name: '新崎健吾', role: 'システム管理者', email: 'arasaki@example.com' },
  { id: '4', name: '酒田優斗', role: 'システム管理者', email: 'sakata@example.com' },
  { id: '5', name: '松原昌玲', role: 'システム管理者', email: 'matsura@example.com' },
  { id: '6', name: '山田太郎', role: 'システム管理者', email: 'yamada@example.com' },
  { id: '7', name: '佐藤次郎', role: 'システム管理者', email: 'sato@example.com' },
  { id: '8', name: '田中三郎', role: 'システム管理者', email: 'tanaka@example.com' },
  { id: '9', name: '鈴木四郎', role: 'システム管理者', email: 'suzuki@example.com' },
  { id: '10', name: '高橋五郎', role: 'システム管理者', email: 'takahashi@example.com' },
]

export function MemberList() {
  const [members] = useState<Member[]>(mockMembers)
  const [currentPage] = useState(1)

  const handleEdit = (memberId: string) => {
    console.log('Edit member:', memberId)
  }

  const handleDelete = (memberId: string) => {
    console.log('Delete member:', memberId)
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

