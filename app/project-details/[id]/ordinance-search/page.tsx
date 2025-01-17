"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Layout from "@/components/layout"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from '@/lib/supabase'
import type { Ordinance as OrdinanceType } from '@/lib/supabase'

interface OrdinanceSearchPageProps {
  params: {
    id: string;
  };
}

interface Ordinance extends OrdinanceType {
  status?: "該当" | "非該当" | null;
  note?: string;
}

export default function OrdinanceSearchPage({ params }: OrdinanceSearchPageProps) {
  const [selectedPrefecture, setSelectedPrefecture] = useState("東京都")
  const [selectedCity, setSelectedCity] = useState("千代田区")
  const [ordinanceStatuses, setOrdinanceStatuses] = useState<{[key: string]: Ordinance}>({})
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [currentOrdinance, setCurrentOrdinance] = useState<Ordinance | null>(null)
  const [note, setNote] = useState("")
  const [ordinances, setOrdinances] = useState<Ordinance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 都道府県のモックデータ
  const prefectures = [
    "東京都",
    "神奈川県",
    "埼玉県",
    "千葉県",
  ]

  // 市区町村のモックデータ
  const cities: { [key: string]: string[] } = {
    "東京都": [
      "千代田区",
      "中央区",
      "港区",
      "新宿区",
      "文京区",
      "台東区",
      "墨田区",
      "江東区",
    ],
    "神奈川県": [
      "横浜市",
      "川崎市",
      "相模原市",
      "横須賀市",
    ],
    "埼玉県": [
      "さいたま市",
      "川越市",
      "川口市",
      "所沢市",
    ],
    "千葉県": [
      "千葉市",
      "市川市",
      "船橋市",
      "松戸市",
    ],
  }

  useEffect(() => {
    const fetchOrdinances = async () => {
      try {
        const { data, error } = await supabase
          .from('ordinances')
          .select('*')
          .eq('prefecture', selectedPrefecture)
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
  }, [selectedPrefecture])

  // 都道府県が変更されたときの処理
  const handlePrefectureChange = (prefecture: string) => {
    setSelectedPrefecture(prefecture);
    // 都道府県が変更されたら、その都道府県の最初の市区町村を選択
    if (cities[prefecture] && cities[prefecture].length > 0) {
      setSelectedCity(cities[prefecture][0]);
    }
  };

  // セクションごとにデータをグループ化
  const groupedOrdinances = ordinances.reduce((acc, ordinance) => {
    if (!acc[ordinance.section]) {
      acc[ordinance.section] = [];
    }
    acc[ordinance.section].push(ordinance);
    return acc;
  }, {} as Record<string, Ordinance[]>);

  // 条例のステータスを更新
  const updateOrdinanceStatus = async (ordinance: Ordinance, status: "該当" | "非該当") => {
    try {
      const { error } = await supabase
        .from('project_ordinances')
        .upsert({
          project_id: params.id,
          ordinance_id: ordinance.id,
          status: status
        })

      if (error) {
        throw error
      }

      setOrdinanceStatuses(prev => ({
        ...prev,
        [ordinance.name]: {
          ...ordinance,
          status: status
        }
      }));
    } catch (err) {
      console.error('Error updating ordinance status:', err)
      alert('条例のステータス更新に失敗しました')
    }
  };

  // メモを保存
  const saveNote = async () => {
    if (currentOrdinance) {
      try {
        const { error } = await supabase
          .from('project_ordinances')
          .upsert({
            project_id: params.id,
            ordinance_id: currentOrdinance.id,
            note: note
          })

        if (error) {
          throw error
        }

        setOrdinanceStatuses(prev => ({
          ...prev,
          [currentOrdinance.name]: {
            ...currentOrdinance,
            note: note
          }
        }));
        setNoteModalOpen(false);
        setNote("");
        setCurrentOrdinance(null);
      } catch (err) {
        console.error('Error saving note:', err)
        alert('メモの保存に失敗しました')
      }
    }
  };

  // メモモーダルを開く
  const openNoteModal = (ordinance: Ordinance) => {
    setCurrentOrdinance(ordinance);
    setNote(ordinanceStatuses[ordinance.name]?.note || "");
    setNoteModalOpen(true);
  };

  if (isLoading) {
    return <Layout><div>Loading...</div></Layout>
  }

  if (error) {
    return <Layout><div className="text-red-500">{error}</div></Layout>
  }

  const content = (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">条例自動検索</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">改善提案・不備を伝える</Button>
          <Button variant="outline">ガイドライン</Button>
          <Button variant="default" className="bg-[#8BA989]">エクスポート</Button>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="w-1/3">
          <label className="block text-sm font-medium mb-2">都道府県</label>
          <Select value={selectedPrefecture} onValueChange={handlePrefectureChange}>
            <SelectTrigger>
              <SelectValue placeholder="都道府県を選択" />
            </SelectTrigger>
            <SelectContent>
              {prefectures.map((prefecture) => (
                <SelectItem key={prefecture} value={prefecture}>
                  {prefecture}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/3">
          <label className="block text-sm font-medium mb-2">市区町村</label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="市区町村を選択" />
            </SelectTrigger>
            <SelectContent>
              {cities[selectedPrefecture]?.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="text-gray-600 mb-8">
        <p>敷地01の住所：東京都千代田区丸の内1-1-1</p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedOrdinances).map(([section, ordinances]) => (
          <div key={section}>
            <div className="bg-gray-700 text-white px-4 py-2 font-medium">
              {section}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">根拠先区分</TableHead>
                  <TableHead className="w-32">カテゴリ</TableHead>
                  <TableHead>法規制/条例名称</TableHead>
                  <TableHead>参照元（適用条件）URL</TableHead>
                  <TableHead>参照元（条例）URL</TableHead>
                  <TableHead className="w-32">該当チェック</TableHead>
                  <TableHead className="w-32">メモ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordinances.map((ordinance, index) => {
                  const status = ordinanceStatuses[ordinance.name]?.status;
                  const note = ordinanceStatuses[ordinance.name]?.note;
                  return (
                    <TableRow 
                      key={index} 
                      className={`
                        transition-colors duration-200
                        ${status === "該当" ? "bg-green-50 hover:bg-green-100" : 
                          status === "非該当" ? "bg-gray-100 hover:bg-gray-200" : 
                          index % 2 === 0 ? "bg-gray-50" : ""}
                      `}
                    >
                      <TableCell>{ordinance.prefecture}</TableCell>
                      <TableCell>{ordinance.category}</TableCell>
                      <TableCell className={status === "該当" ? "font-medium" : ""}>{ordinance.name}</TableCell>
                      <TableCell>
                        <a href={ordinance.reference_url || '#'} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {ordinance.reference_url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a href={ordinance.current_url || '#'} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {ordinance.current_url}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={status === "該当" ? "default" : "outline"}
                            className={`
                              ${status === "該当" ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50"}
                              transition-colors duration-200
                            `}
                            onClick={() => updateOrdinanceStatus(ordinance, "該当")}
                          >
                            該当
                          </Button>
                          <Button
                            size="sm"
                            variant={status === "非該当" ? "default" : "outline"}
                            className={`
                              ${status === "非該当" ? "bg-gray-600 hover:bg-gray-700" : "hover:bg-gray-50"}
                              transition-colors duration-200
                            `}
                            onClick={() => updateOrdinanceStatus(ordinance, "非該当")}
                          >
                            非該当
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openNoteModal(ordinance)}
                          className={status === "非該当" ? "opacity-50" : ""}
                        >
                          {note ? "メモ編集" : "メモ追加"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>

      {/* メモ入力モーダル */}
      {noteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h3 className="text-lg font-bold mb-4">メモ</h3>
            <textarea
              className="w-full h-32 p-2 border rounded-md mb-4"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="条例に関するメモを入力してください"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNoteModalOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={saveNote}>
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return <Layout>{content}</Layout>;
} 