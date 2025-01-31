"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

type OrdinanceItem = {
  title: string
  link: string
  category: string
  region: string
  description: string
  applicationArea: string
  contact: {
    department: string
    phone: string
  }
  references: {
    application?: string
    ordinance?: string
    rules?: string
  }
}

type OrdinanceCategory = {
  category: string
  items: {
    [region: string]: OrdinanceItem[]
  }
}

const ordinanceData: OrdinanceCategory[] = [
  {
    category: "緑化",
    items: {
      "東京都": [
        {
          title: "東京都中高層建築物の建築に係る紛争の予防と調整に関する条例",
          link: "#",
          category: "緑化",
          region: "東京都",
          description: "東京都における緑化に関する基本的な条例です。",
          applicationArea: "東京都",
          contact: {
            department: "東京都 市街地建築部調整課 建築紛争調整担当",
            phone: "03-5388-3377"
          },
          references: {
            application: "中高層建築物に関する紛争の予防と調整｜東京都都市整備局",
            ordinance: "このリンクの検索欄に「東京都中高層建築物の建築に係る紛...",
            rules: "このリンクの検索欄に「東京都中高層建築物の建築に係る紛..."
          }
        }
      ],
      "千代田区": [
        {
          title: "千代田区緑化推進要綱",
          link: "#",
          category: "緑化",
          region: "千代田区",
          description: "千代田区における緑化推進に関する要綱です。",
          applicationArea: "千代田区",
          contact: {
            department: "千代田区 環境まちづくり部 環境政策課",
            phone: "03-5211-4253"
          },
          references: {
            application: "千代田区緑化推進要綱の解説",
            ordinance: "千代田区緑化推進要綱",
            rules: "千代田区緑化に関する規則"
          }
        }
      ],
      "品川区": [
        {
          title: "品川区みどりの条例",
          link: "#",
          category: "緑化",
          region: "品川区",
          description: "品川区における緑化の推進と保全に関する条例です。",
          applicationArea: "品川区",
          contact: {
            department: "品川区 都市環境部 みどり推進課",
            phone: "03-5742-6799"
          },
          references: {
            application: "品川区みどりの条例の手引き",
            ordinance: "品川区みどりの条例",
            rules: "品川区みどりの保全に関する規則"
          }
        }
      ]
    }
  },
  {
    category: "景観",
    items: {
      "東京都": [
        {
          title: "街並み景観｜東京都都市整備局",
          link: "#",
          category: "景観",
          region: "東京都",
          description: "東京都の景観計画に関する基本方針です。",
          applicationArea: "東京都",
          contact: {
            department: "東京都 都市整備局 景観担当",
            phone: "03-5388-3377"
          },
          references: {
            application: "街並み景観｜東京都都市整備局",
            ordinance: "東京都景観条例",
            rules: "東京都景観規則"
          }
        }
      ],
      "千代田区": [
        {
          title: "千代田区景観まちづくり計画",
          link: "#",
          category: "景観",
          region: "千代田区",
          description: "千代田区の景観形成の方針を定めた計画です。",
          applicationArea: "千代田区",
          contact: {
            department: "千代田区 環境まちづくり部 景観・都市計画課",
            phone: "03-5211-4254"
          },
          references: {
            application: "千代田区景観まちづくり計画の解説",
            ordinance: "千代田区景観まちづくり条例",
            rules: "千代田区景観規則"
          }
        }
      ],
      "品川区": [
        {
          title: "品川区景観条例",
          link: "#",
          category: "景観",
          region: "品川区",
          description: "品川区の良好な景観形成のための基準を定めた条例です。",
          applicationArea: "品川区",
          contact: {
            department: "品川区 都市環境部 都市計画課",
            phone: "03-5742-6798"
          },
          references: {
            application: "品川区景観計画",
            ordinance: "品川区景観条例",
            rules: "品川区景観規則"
          }
        }
      ]
    }
  }
]

export function OrdinanceList() {
  return (
    <div className="w-full">
      <table className="w-full border-collapse bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-1/4 border-b p-4 text-left font-medium text-gray-600">カテゴリ</th>
            <th className="w-1/4 border-b p-4 text-left font-medium text-gray-600">その他法令</th>
            <th className="w-1/4 border-b p-4 text-left font-medium text-gray-600">東京都</th>
            <th className="w-1/4 border-b p-4 text-left font-medium text-gray-600">千代田区</th>
            <th className="w-1/4 border-b p-4 text-left font-medium text-gray-600">品川区</th>
          </tr>
        </thead>
        <tbody>
          {ordinanceData.map((category) => (
            <tr key={category.category} className="border-b">
              <td className="p-4 text-gray-900">{category.category}</td>
              <td className="p-4"></td>
              {["東京都", "千代田区", "品川区"].map((region) => (
                <td key={region} className="p-4">
                  {category.items[region]?.map((item, index) => (
                    <HoverCard key={index} openDelay={0} closeDelay={0}>
                      <HoverCardTrigger asChild>
                        <a
                          href={item.link}
                          className="text-green-600 hover:text-green-700 hover:underline"
                        >
                          {item.title}
                        </a>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-[480px]">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-bold">協議先区分</h4>
                            <p>{item.region}</p>
                          </div>
                          <div>
                            <h4 className="font-bold">協議先区分</h4>
                            <p>{item.category}</p>
                          </div>
                          <div>
                            <h4 className="font-bold">法規制/条例名称</h4>
                            <p>{item.title}</p>
                          </div>
                          <div>
                            <h4 className="font-bold">参照元（適用条件）URL</h4>
                            <a href="#" className="text-green-600 hover:underline flex items-center gap-1">
                              <span className="text-green-600">⇗</span>
                              {item.references.application}
                            </a>
                          </div>
                          <div>
                            <h4 className="font-bold">参照元（条例）URL</h4>
                            <a href="#" className="text-green-600 hover:underline flex items-center gap-1">
                              <span className="text-green-600">⇗</span>
                              {item.references.ordinance}
                            </a>
                          </div>
                          <div>
                            <h4 className="font-bold">参照元（規則）URL</h4>
                            <a href="#" className="text-green-600 hover:underline flex items-center gap-1">
                              <span className="text-green-600">⇗</span>
                              {item.references.rules}
                            </a>
                          </div>
                          <div>
                            <h4 className="font-bold">適用条件</h4>
                            <p>{item.applicationArea}</p>
                          </div>
                          <div>
                            <h4 className="font-bold">担当窓口</h4>
                            <p>{item.contact.department}</p>
                            <p>電話 {item.contact.phone}</p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 