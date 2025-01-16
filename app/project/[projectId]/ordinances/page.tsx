import { OrdinanceList } from "@/components/ordinance-list";

interface PageProps {
  params: {
    projectId: string;
  };
}

// TODO: この部分は実際のデータ取得ロジックに置き換える必要があります
const mockOrdinances = [
  {
    id: "1",
    name: "○○市環境基本条例",
    description: "環境の保全及び創造について、基本理念を定め、市、事業者及び市民の責務を明らかにするとともに、環境の保全及び創造に関する施策の基本的な事項を定めることにより、環境の保全及び創造に関する施策を総合的かつ計画的に推進し、もって現在及び将来の市民の健康で文化的な生活の確保に寄与することを目的とする。",
    enactmentDate: "2024-01-01",
    municipality: "○○市"
  },
  // 他のモックデータ...
];

export default function OrdinancesPage({ params }: PageProps) {
  const { projectId } = params;
  
  // TODO: projectIdを使用して、該当プロジェクトの市区町村の条例データを取得する

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">条例一覧</h1>
      <OrdinanceList ordinances={mockOrdinances} municipality="○○市" />
    </div>
  );
} 