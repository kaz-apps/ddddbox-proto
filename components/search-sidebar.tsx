"use client"

import React, { useState, useEffect } from 'react'
import { TextField, Button, Checkbox, FormControlLabel, Card, CardContent, Autocomplete, Chip, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { IconRefresh, IconTrash, IconDeviceFloppy } from '@tabler/icons-react'
import toast from 'react-hot-toast'

type ProjectMember = {
  value: string;
  label: string;
}

// プロジェクトメンバーリスト
const projectMembers: ProjectMember[] = [
  { value: 'itashita', label: '板下和彦' },
  { value: 'arasaki', label: '新崎健吾' },
  { value: 'matsubara', label: '松原昌玲' },
  { value: 'sakata', label: '酒田優斗' },
]

// 初期フィルター設定
const initialFilters = {
  projectNameSearch: '',
  codeNameSearch: '',
  teamMemberSearch: '',
  projectMembers: [] as string[],
  documentType: [] as string[],
  isArchived: false,
  hasAttachment: false
}

type SearchSidebarProps = {
  onSearchFiltersChange: (filters: typeof initialFilters) => void;
}

type SavedSearch = {
  id: string;
  name: string;
  filters: typeof initialFilters;
}

type DocumentTypeOption = {
  group: string;
  value: string;
  label: string;
}

type DocumentTypeGroup = {
  group: string;
  collapsed: boolean;
  items: DocumentTypeOption[];
}

type DocumentTypeOptionWithHeader = DocumentTypeOption | {
  group: string;
  isGroupHeader: true;
  collapsed: boolean;
}

export function SearchSidebar({ onSearchFiltersChange }: SearchSidebarProps) {
  const [filters, setFilters] = useState(initialFilters)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSearchName, setNewSearchName] = useState('')

  const [documentTypes, setDocumentTypes] = useState<DocumentTypeGroup[]>([
    {
      group: '予算',
      collapsed: false,
      items: [
        { group: '予算', value: 'designCost', label: '設計費用' },
        { group: '予算', value: 'constructionCost', label: '工事費' },
      ]
    },
    {
      group: '申請',
      collapsed: false,
      items: [
        { group: '申請', value: 'applicationStatus', label: '申請状況' },
        { group: '申請', value: 'variousApplications', label: '各種申請' },
      ]
    },
  ]);

  const flatDocumentTypes = documentTypes.flatMap(group =>
    group.items.map(item => ({
      ...item,
      group: group.group
    }))
  );

  // フィルター更新関数
  const updateFilters = (newFilters: Partial<typeof initialFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onSearchFiltersChange(updatedFilters);
  };

  // 検索条件保存
  const handleSaveSearchConditions = () => {
    setIsDialogOpen(true);
  }

  const handleSaveConfirm = () => {
    if (newSearchName.trim() === '') {
      toast.error('検索条件の名前を入力してください');
      return;
    }

    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: newSearchName,
      filters: { ...filters },
    };

    setSavedSearches([...savedSearches, newSavedSearch]);
    setIsDialogOpen(false);
    setNewSearchName('');
    toast.success('検索条件を保存しました', { duration: 3000 });
  }

  // 保存された検索条件を適用
  const applySearchCondition = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
    onSearchFiltersChange(savedSearch.filters);
    toast.success(`検索条件「${savedSearch.name}」を適用しました`, { duration: 3000 });
  }

  // 保存された検索条件を削除
  const deleteSearchCondition = (id: string) => {
    setSavedSearches(savedSearches.filter(search => search.id !== id));
    toast.success('検索条件を削除しました', { duration: 3000 });
  }

  // フィルターリセット
  const resetFilters = () => {
    updateFilters(initialFilters);
  }

  const toggleGroupCollapse = (groupIndex: number) => {
    setDocumentTypes(prevTypes =>
      prevTypes.map((group, index) =>
        index === groupIndex ? { ...group, collapsed: !group.collapsed } : group
      )
    );
  };

  return (
    <div className="w-80 border-l bg-white p-4 overflow-y-auto">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">カルテ項目検索</h2>

        <Card>
          <CardContent className="space-y-4">

            {/* プロジェクト名 */}
            <TextField
              fullWidth
              label="プロジェクト名"
              value={filters.projectNameSearch}
              onChange={(e) => updateFilters({ projectNameSearch: e.target.value })}
            />

            {/* プロジェクトメンバー選択 */}
            <Autocomplete
              multiple
              options={projectMembers}
              getOptionLabel={(option) => option.label}
              value={projectMembers.filter(member => filters.projectMembers.includes(member.value))}
              onChange={(_, newValue) => {
                updateFilters({ projectMembers: newValue.map(item => item.value) })
              }}
              renderInput={(params) => <TextField {...params} label="プロジェクトメンバー" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={option.value}
                      label={option.label}
                      {...tagProps}
                      onDelete={() => {
                        const newMembers = filters.projectMembers.filter(m => m !== option.value);
                        updateFilters({ projectMembers: newMembers });
                      }}
                    />
                  );
                })
              }
            />
            
            {/* チームメンバー検索 */}
            <TextField
              fullWidth
              label="チームメンバー検索"
              value={filters.teamMemberSearch}
              onChange={(e) => updateFilters({ teamMemberSearch: e.target.value })}
            />

            {/* カルテ項目選択 */}
            <Autocomplete
              multiple
              options={documentTypes.flatMap(group => [
                { group: group.group, isGroupHeader: true, collapsed: group.collapsed },
                ...(!group.collapsed ? group.items.map(item => ({
                  ...item,
                  group: group.group
                })) : [])
              ])}
              getOptionLabel={(option) => {
                if ('isGroupHeader' in option) {
                  return option.group;
                }
                return `${option.group} > ${option.label}`;
              }}
              groupBy={(option) => option.group}
              renderGroup={(params) => (
                <div key={params.group}>
                  <div
                    style={{ cursor: 'pointer', fontWeight: 'bold', padding: '8px' }}
                    onClick={() => toggleGroupCollapse(documentTypes.findIndex(g => g.group === params.group))}
                  >
                    {params.group} {documentTypes.find(g => g.group === params.group)?.collapsed ? '▶' : '▼'}
                  </div>
                  {!documentTypes.find(g => g.group === params.group)?.collapsed && params.children}
                </div>
              )}
              value={flatDocumentTypes.filter(item => filters.documentType.includes(item.value)) as DocumentTypeOption[]}
              onChange={(_, newValue) => {
                const validOptions = newValue.filter((item): item is DocumentTypeOption => !('isGroupHeader' in item));
                updateFilters({ documentType: validOptions.map(item => item.value) });
              }}
              renderInput={(params) => <TextField {...params} label="カルテ項目" />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  if ('isGroupHeader' in option) return null;
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={option.value}
                      label={option.label}
                      {...tagProps}
                      onDelete={() => {
                        const newTypes = filters.documentType.filter(t => t !== option.value);
                        updateFilters({ documentType: newTypes });
                      }}
                    />
                  )
                }).filter(Boolean)
              }
              renderOption={(props, option) => {
                if ('isGroupHeader' in option) {
                  return null;
                }
                return (
                  <li {...props}>
                    {option.label}
                  </li>
                );
              }}
              isOptionEqualToValue={(option, value) => {
                if ('isGroupHeader' in option || 'isGroupHeader' in value) {
                  return false;
                }
                return option.value === value.value;
              }}
            />

            {/* チェックボックス */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.hasAttachment}
                  onChange={(e) => updateFilters({ hasAttachment: e.target.checked })}
                />
              }
              label="ファイル添付あり"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!filters.isArchived}
                  onChange={(e) => updateFilters({ isArchived: !e.target.checked })}
                />
              }
              label="アーカイブプロジェクトを含める"
            />

            {/* ボタン */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<IconRefresh />}
              onClick={resetFilters}
            >
              検索条件をリセット
            </Button>

            <Button
              variant="contained"
              fullWidth
              onClick={handleSaveSearchConditions}
              style={{ backgroundColor: '#8BA989', color: 'white' }}
            >
              検索条件を保存
            </Button>

            {/* 保存された検索条件のリスト */}
            {savedSearches.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mt-4 mb-2">保存された検索条件</h3>
                <List>
                  {savedSearches.map((savedSearch) => (
                    <ListItem key={savedSearch.id} onClick={() => applySearchCondition(savedSearch)}>
                      <ListItemText primary={savedSearch.name} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => deleteSearchCondition(savedSearch.id)}>
                          <IconTrash />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 検索条件保存ダイアログ */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>検索条件を保存</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="検索条件の名前"
            type="text"
            fullWidth
            value={newSearchName}
            onChange={(e) => setNewSearchName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleSaveConfirm} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

