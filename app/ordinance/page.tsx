import { OrdinanceList } from "@/components/ordinance/ordinance-list"

export default function OrdinancePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-2xl font-bold">条例一覧</h1>
      <OrdinanceList />
    </div>
  )
} 