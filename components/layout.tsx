"use client"

import { IconBell, IconChevronLeft, IconChevronRight, IconSettings, IconUsers, IconFolder, IconDatabase, IconChevronDown } from '@tabler/icons-react'
import Link from "next/link"
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ProjectDetailsForm } from './project-details-form'
import { Settings } from './settings'
import { mockProjects } from './project-list'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCodeNameDisplayed, setIsCodeNameDisplayed] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [expandedProjects, setExpandedProjects] = useState<string[]>([])
  const pathname = usePathname()

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-[#8BA989] text-white p-4 flex flex-col transition-all duration-300 relative rounded-r-[40px]`}>
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="absolute -right-3 top-4 bg-white text-[#8BA989] rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Expand sidebar"
          >
            <IconChevronRight className="w-4 h-4" />
          </button>
        )}
        {/* Organization Header */}
        <div className="flex items-center gap-2 mb-8">
          <img
            src="https://news.biglobe.ne.jp/animal/1209/2354273656/grp_20241209232411_1.jpg"
            alt="Organization Logo"
            className="w-8 h-8 bg-white rounded-md object-cover"
          />
          {!isSidebarCollapsed && <div className="flex-1">○○さんの組織</div>}
          <IconChevronLeft
            className={`w-5 h-5 cursor-pointer transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          />
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2">
          <Link
            href="/members"
            className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md"
          >
            <IconUsers className="w-5 h-5" />
            {!isSidebarCollapsed && <span>組織メンバー管理</span>}
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md"
          >
            <IconFolder className="w-5 h-5" />
            {!isSidebarCollapsed && <span>プロジェクト一覧</span>}
          </Link>
          <Link
            href="/project-data"
            className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md"
          >
            <IconDatabase className="w-5 h-5" />
            {!isSidebarCollapsed && <span>カルテ項目検索</span>}
          </Link>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md w-full text-left"
          >
            <IconSettings className="w-5 h-5" />
            {!isSidebarCollapsed && <span>設定</span>}
          </button>
        </nav>

        {/* Project List */}
        {!isSidebarCollapsed && (
          <div className="mt-8">
            <div className="mb-2 text-sm">プロジェクト一覧</div>
            <nav className="space-y-1">
              {mockProjects.map((project) => (
                <div key={project.id} className="space-y-1">
                  <div
                    className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md text-sm cursor-pointer"
                    onClick={() => toggleProject(project.id)}
                  >
                    <IconChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedProjects.includes(project.id) ? 'rotate-0' : '-rotate-90'
                      }`}
                    />
                    <IconFolder className="w-4 h-4" />
                    <span>{project.name}</span>
                  </div>
                  {expandedProjects.includes(project.id) && (
                    <div className="ml-4 space-y-1 border-l-2 border-white/20 pl-2">
                      <Link
                        href={`/project-details/${project.id}`}
                        className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md text-sm"
                      >
                        <IconFolder className="w-4 h-4" />
                        <span>プロジェクト詳細</span>
                      </Link>
                      <Link
                        href={`/project-details/${project.id}/ordinance-search`}
                        className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md text-sm"
                      >
                        <IconDatabase className="w-4 h-4" />
                        <span>条例自動検索</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-background overflow-y-auto">
        <header className="border-b p-4 flex items-center justify-between">
          <h1 className="text-lg font-medium">
            {pathname.includes('ordinance-search') ? '条例自動検索' :
             pathname.includes('project-details') ? 'プロジェクト詳細' :
             'プロジェクト一覧'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCodeNameDisplayed(!isCodeNameDisplayed)}
                className={`w-12 h-6 ${isCodeNameDisplayed ? 'bg-blue-500' : 'bg-gray-200'} rounded-full relative transition-colors duration-200 ease-in-out`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                    isCodeNameDisplayed ? 'translate-x-6' : ''
                  }`}
                />
              </button>
              <span>コードネーム表示</span>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
          </div>
        </header>
        <main className="p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <Settings onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  )
}

