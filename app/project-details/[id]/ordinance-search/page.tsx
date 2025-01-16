"use client"

import React from 'react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Layout from "@/components/layout"

interface OrdinanceSearchPageProps {
  params: {
    id: string;
  };
}

interface Ordinance {
  prefecture: string;
  category: string;
  name: string;
  referenceUrl: string;
  currentUrl: string;
  section: "調査" | "用途・規模・計画" | "条例手続き" | "緑化";
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

  // 都道府県が変更されたときの処理
  const handlePrefectureChange = (prefecture: string) => {
    setSelectedPrefecture(prefecture);
    // 都道府県が変更されたら、その都道府県の最初の市区町村を選択
    if (cities[prefecture] && cities[prefecture].length > 0) {
      setSelectedCity(cities[prefecture][0]);
    }
  };

  // モックデータ
  const ordinances: Ordinance[] = [
    {
      prefecture: "東京都",
      category: "都市計画情報",
      name: "都市計画情報等インターネット提供サービストップ",
      referenceUrl: "都市計画情報等インターネット提供サービストップ",
      currentUrl: "都市計画情報等インターネット提供サービストップ",
      section: "調査"
    },
    {
      prefecture: "東京都",
      category: "ハザードマップ",
      name: "洪水ハザードマップ",
      referenceUrl: "洪水ハザードマップ",
      currentUrl: "洪水ハザードマップ",
      section: "調査"
    },
    {
      prefecture: "その他",
      category: "ハザードマップ",
      name: "国交省ハザードマップ",
      referenceUrl: "国交省ハザードマップ",
      currentUrl: "国交省ハザードマップ",
      section: "調査"
    },
    {
      prefecture: "東京都",
      category: "道路台帳",
      name: "道路について｜東京都都市整備局",
      referenceUrl: "道路について｜東京都都市整備局",
      currentUrl: "道路について｜東京都都市整備局",
      section: "調査"
    },
    {
      prefecture: "東京都",
      category: "水道台帳",
      name: "下水道台帳案内｜東京都下水道局",
      referenceUrl: "下水道台帳案内｜東京都下水道局",
      currentUrl: "下水道台帳案内｜東京都下水道局",
      section: "調査"
    }
  ]

  // セクションごとにデータをグループ化
  const groupedOrdinances = ordinances.reduce((acc, ordinance) => {
    if (!acc[ordinance.section]) {
      acc[ordinance.section] = [];
    }
    acc[ordinance.section].push(ordinance);
    return acc;
  }, {} as Record<string, Ordinance[]>);

  // 条例のステータスを更新
  const updateOrdinanceStatus = (ordinance: Ordinance, status: "該当" | "非該当") => {
    setOrdinanceStatuses(prev => ({
      ...prev,
      [ordinance.name]: {
        ...ordinance,
        status: status
      }
    }));
  };

  // メモを保存
  const saveNote = () => {
    if (currentOrdinance) {
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
    }
  };

  // メモモーダルを開く
  const openNoteModal = (ordinance: Ordinance) => {
    setCurrentOrdinance(ordinance);
    setNote(ordinanceStatuses[ordinance.name]?.note || "");
    setNoteModalOpen(true);
  };

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
          <select
            value={selectedPrefecture}
            onChange={(e) => handlePrefectureChange(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {prefectures.map((prefecture) => (
              <option key={prefecture} value={prefecture}>
                {prefecture}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/3">
          <label className="block text-sm font-medium mb-2">市区町村</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {cities[selectedPrefecture]?.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
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
                        <a href={ordinance.referenceUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {ordinance.referenceUrl}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a href={ordinance.currentUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {ordinance.currentUrl}
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