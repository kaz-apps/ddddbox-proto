"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '@/lib/supabase'
import type { Ordinance } from '@/lib/supabase'

interface OrdinanceListProps {
  municipality: string;
}

export function OrdinanceList({ municipality }: OrdinanceListProps) {
  const [ordinances, setOrdinances] = useState<Ordinance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrdinances = async () => {
      try {
        const { data, error } = await supabase
          .from('ordinances')
          .select('*')
          .eq('municipality', municipality)
          .order('name')

        if (error) {
          throw error
        }

        setOrdinances(data)
      } catch (err) {
        console.error('Error fetching ordinances:', err)
        setError('条例の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrdinances()
  }, [municipality])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{municipality}の条例一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>条例名</TableHead>
              <TableHead>概要</TableHead>
              <TableHead>制定日</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordinances.map((ordinance) => (
              <TableRow key={ordinance.id}>
                <TableCell>{ordinance.name}</TableCell>
                <TableCell>{ordinance.description}</TableCell>
                <TableCell>{ordinance.enactment_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 