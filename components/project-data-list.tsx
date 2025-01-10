"use client"

import "@/app/globals.css"
import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IconChevronUp, IconChevronDown, IconDownload, IconEye, IconEyeOff } from '@tabler/icons-react'
import Link from 'next/link'
import { Checkbox } from "@/components/ui/checkbox"

type ProjectData = {
  id: string;
  projectNo: string;
  projectName: string;
  designCost: string;
  constructionCost: string;
  status: string;
  variousApplications: string;
  members: string[];
  lastUpdatedBy: string;
  isArchived: boolean;
  isLocked: boolean;
  isNonStandard: boolean;
  hasAttachment: boolean;
  codeName?: string;
}

type SortConfig = {
  key: keyof ProjectData | null;
  direction: 'asc' | 'desc' | null;
}

type SearchFilters = {
  projectNameSearch: string;
  codeNameSearch: string;
  teamMemberSearch: string;
  projectMembers: string[];
  documentType: string[];
  isArchived: boolean;
  hasAttachment: boolean;
}

const mockProjectData: ProjectData[] = [
  { id: '1', projectNo: 'AMDlab-01', projectName: 'A社東京支社新築工事', designCost: '100,000千円', constructionCost: '500,000千円', status: '要／設置', variousApplications: '申請済み', members: ['itashita', 'arasaki'], lastUpdatedBy: 'itashita', isArchived: false, isLocked: false, isNonStandard: false, hasAttachment: true, codeName: 'codename1' },
  { id: '2', projectNo: 'YSKui-02', projectName: 'B社大阪支店改修工事', designCost: '80,000千円', constructionCost: '300,000千円', status: '不要／設置しない', variousApplications: '未申請', members: ['matsubara', 'sakata'], lastUpdatedBy: 'matsubara', isArchived: false, isLocked: true, isNonStandard: false, hasAttachment: false, codeName: 'codename2' },
  { id: '3', projectNo: 'Atelier-03', projectName: 'C社名古屋オフィス増築工事', designCost: '120,000千円', constructionCost: '600,000千円', status: '要／設置', variousApplications: '申請中', members: ['itashita', 'matsubara'], lastUpdatedBy: 'sakata', isArchived: false, isLocked: false, isNonStandard: true, hasAttachment: true, codeName: 'codename3' },
  { id: '4', projectNo: 'KKStudio-04', projectName: 'D社福岡ビル建替工事', designCost: '200,000千円', constructionCost: '1,000,000千円', status: '要／設置', variousApplications: '申請済み', members: ['arasaki', 'sakata'], lastUpdatedBy: 'arasaki', isArchived: true, isLocked: false, isNonStandard: false, hasAttachment: true, codeName: 'codename4' },
  { id: '5', projectNo: 'NKArch-05', projectName: 'E社札幌支社改装工事', designCost: '50,000千円', constructionCost: '150,000千円', status: '不要／設置しない', variousApplications: '未申請', members: ['itashita', 'arasaki', 'matsubara'], lastUpdatedBy: 'itashita', isArchived: false, isLocked: false, isNonStandard: false, hasAttachment: false, codeName: 'codename5' },
]

export function ProjectDataList({ searchFilters }: { searchFilters: SearchFilters }) {
  const [projectData, setProjectData] = useState<ProjectData[]>(mockProjectData)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null
  })
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([])
  const [hiddenRows, setHiddenRows] = useState<string[]>([])

  useEffect(() => {
    const filteredData = mockProjectData.filter(project => {
      const matchesProjectName = project.projectName.toLowerCase().includes(searchFilters.projectNameSearch.toLowerCase());
      const matchesCodeName = project.codeName?.toLowerCase().includes(searchFilters.codeNameSearch.toLowerCase()) || false;
      const matchesTeamMember = project.members.some(member => 
        member.toLowerCase().includes(searchFilters.teamMemberSearch.toLowerCase())
      );
      const matchesProjectMembers = searchFilters.projectMembers.length === 0 || 
                                    searchFilters.projectMembers.some(member => project.members.includes(member));
      const matchesDocumentType = searchFilters.documentType.length === 0 || 
                                  searchFilters.documentType.some(type => {
                                    if (type === 'designCost') return project.designCost !== '0';
                                    if (type === 'constructionCost') return project.constructionCost !== '0';
                                    if (type === 'applicationStatus') return project.status !== '';
                                    if (type === 'variousApplications') return project.variousApplications !== '';
                                    return false;
                                  });
      const matchesArchived = !searchFilters.isArchived || !project.isArchived;
      const matchesAttachment = !searchFilters.hasAttachment || project.hasAttachment;

      return matchesProjectName && matchesCodeName && matchesTeamMember && 
             matchesProjectMembers && matchesDocumentType && matchesArchived && matchesAttachment;
    });

    setProjectData(filteredData);
  }, [searchFilters]);

  const resetSort = () => {
    setSortConfig({ key: null, direction: null })
    setProjectData([...projectData])
  }

  const handleSort = (key: keyof ProjectData) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const getSortedData = () => {
    if (!sortConfig.key || !sortConfig.direction) {
      return projectData
    }

    return [...projectData].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const SortIcon = ({ columnKey }: { columnKey: keyof ProjectData }) => {
    if (sortConfig.key !== columnKey) {
      return <IconChevronUp className="w-4 h-4 text-gray-400 ml-1" />;
    }
    return sortConfig.direction === 'asc' ? (
      <IconChevronUp className="w-4 h-4 text-gray-900 ml-1" />
    ) : (
      <IconChevronDown className="w-4 h-4 text-gray-900 ml-1" />
    );
  };

  const exportToCSV = () => {
    const visibleColumns = searchFilters.documentType.filter(type => !hiddenColumns.includes(type));
    const headers = ['プロジェクトNo.', ...visibleColumns.map(type => {
      switch (type) {
        case 'projectName':
          return 'プロジェクト名称';
        case 'designCost':
          return '設計費用';
        case 'constructionCost':
          return '工事費';
        case 'applicationStatus':
          return '申請状況';
        case 'variousApplications':
          return '各種申請';
        default:
          return '';
      }
    })];
    const csvData = getSortedData()
      .filter(data => !hiddenRows.includes(data.id))
      .map(data => [
        data.projectNo,
        ...visibleColumns.map(type => {
          switch (type) {
            case 'projectName':
              return data.projectName;
            case 'designCost':
              return data.designCost;
            case 'constructionCost':
              return data.constructionCost;
            case 'applicationStatus':
              return data.status;
            case 'variousApplications':
              return data.variousApplications;
            default:
              return '';
          }
        })
      ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'project_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  const toggleColumnVisibility = (columnType: string) => {
    setHiddenColumns(prev => 
      prev.includes(columnType) ? prev.filter(type => type !== columnType) : [...prev, columnType]
    );
  }

  const toggleRowVisibility = (rowId: string) => {
    setHiddenRows(prev => 
      prev.includes(rowId) ? prev.filter(id => id !== rowId) : [...prev, rowId]
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">非表示の列</h3>
          <div className="flex flex-wrap gap-2">
            {hiddenColumns.map(type => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => toggleColumnVisibility(type)}
              >
                {type === 'designCost' ? '設計費用' :
                 type === 'constructionCost' ? '工事費' :
                 type === 'applicationStatus' ? '申請状況' :
                 type === 'variousApplications' ? '各種申請' : type}
                <IconEye className="w-4 h-4 ml-2" />
              </Button>
            ))}
          </div>
        </div>
        <div className="flex justify-end mb-4">
          <Button onClick={resetSort} variant="outline">並び替えをリセット</Button>
          <Button onClick={exportToCSV} variant="outline" className="ml-2">
            <IconDownload className="w-4 h-4 mr-2" />
            CSVエクスポート
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>表示</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('projectName')}
              >
                <div className="flex items-center">
                  プロジェクト名称
                  <SortIcon columnKey="projectName" />
                </div>
              </TableHead>
              {searchFilters.documentType.map(type => {
                if (type === 'projectName' || hiddenColumns.includes(type)) return null;
                let columnName = '';
                let sortKey: keyof ProjectData = 'projectName';
                switch (type) {
                  case 'designCost':
                    columnName = '設計費用';
                    sortKey = 'designCost';
                    break;
                  case 'constructionCost':
                    columnName = '工事費';
                    sortKey = 'constructionCost';
                    break;
                  case 'applicationStatus':
                    columnName = '申請状況';
                    sortKey = 'status';
                    break;
                  case 'variousApplications':
                    columnName = '各種申請';
                    sortKey = 'variousApplications';
                    break;
                }
                return (
                  <TableHead 
                    key={type}
                    className="cursor-pointer"
                    onClick={() => handleSort(sortKey)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {columnName}
                        <SortIcon columnKey={sortKey} />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleColumnVisibility(type);
                        }}
                      >
                        {hiddenColumns.includes(type) ? (
                          <IconEye className="w-4 h-4" />
                        ) : (
                          <IconEyeOff className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedData().map((data) => {
              if (hiddenRows.includes(data.id)) return null;
              return (
                <TableRow key={data.id}>
                  <TableCell>
                    <Checkbox
                      checked={!hiddenRows.includes(data.id)}
                      onCheckedChange={() => toggleRowVisibility(data.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link href={`/project-details/${data.id}`} className="text-blue-600 hover:underline">
                      {data.projectName}
                    </Link>
                  </TableCell>
                  {searchFilters.documentType.map(type => {
                    if (type === 'projectName' || hiddenColumns.includes(type)) return null;
                    switch (type) {
                      case 'designCost':
                        return <TableCell key={`${data.id}-${type}`}>{data.designCost}</TableCell>;
                      case 'constructionCost':
                        return <TableCell key={`${data.id}-${type}`}>{data.constructionCost}</TableCell>;
                      case 'applicationStatus':
                        return <TableCell key={`${data.id}-${type}`}>{data.status}</TableCell>;
                      case 'variousApplications':
                        return <TableCell key={`${data.id}-${type}`}>{data.variousApplications}</TableCell>;
                      default:
                        return null;
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {hiddenRows.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">非表示の行</h3>
          <div className="flex flex-wrap gap-2">
            {hiddenRows.map(rowId => {
              const row = projectData.find(data => data.id === rowId);
              return row ? (
                <Button
                  key={rowId}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRowVisibility(rowId)}
                >
                  {row.projectName}
                  <IconEye className="w-4 h-4 ml-2" />
                </Button>
              ) : null;
            })}
          </div>
        </div>
      )}
    </>
  )
}

