"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ProjectDetailsFormProps {
  projectId: string;
}

export function ProjectDetailsForm({ projectId }: ProjectDetailsFormProps) {
  const [formData, setFormData] = useState({
    designStartDate: new Date('2024-01-01'),
    designEndDate: new Date('2024-01-01'),
    constructionStartDate: new Date('2024-01-01'),
    constructionEndDate: new Date('2024-01-01'),
    specificProcessEndDate: new Date('2024-01-01'),
    specificProcessName: '2階の床及びこれを支持するはりに鉄筋を配置する工事の工程',
    designCosts: '100000',
    constructionCosts: '99999',
    prefecture: '東京都',
    city: '千代田区',
    address: '丸の内1-1-1',
    buildingName: '丸の内ビル'
  })

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, [field]: date }))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>工程</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>設計工期</Label>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !formData.designStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.designStartDate ? format(formData.designStartDate, "yyyy/MM/dd") : "日付を選択"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.designStartDate}
                    onSelect={(date) => handleDateChange('designStartDate', date)}
                  />
                </PopoverContent>
              </Popover>
              <span>~</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !formData.designEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.designEndDate ? format(formData.designEndDate, "yyyy/MM/dd") : "日付を選択"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.designEndDate}
                    onSelect={(date) => handleDateChange('designEndDate', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>建設工期</Label>
            <div className="flex items-center space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !formData.constructionStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.constructionStartDate ? format(formData.constructionStartDate, "yyyy/MM/dd") : "日付を選択"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.constructionStartDate}
                    onSelect={(date) => handleDateChange('constructionStartDate', date)}
                  />
                </PopoverContent>
              </Popover>
              <span>~</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !formData.constructionEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.constructionEndDate ? format(formData.constructionEndDate, "yyyy/MM/dd") : "日付を選択"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.constructionEndDate}
                    onSelect={(date) => handleDateChange('constructionEndDate', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>特定工程終了年月日</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !formData.specificProcessEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.specificProcessEndDate ? format(formData.specificProcessEndDate, "yyyy/MM/dd") : "日付を選択"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.specificProcessEndDate}
                  onSelect={(date) => handleDateChange('specificProcessEndDate', date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>特定工程名称</Label>
            <Input
              name="specificProcessName"
              value={formData.specificProcessName}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>予算</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>設計費用</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                name="designCosts"
                value={formData.designCosts}
                onChange={handleInputChange}
                className="w-[200px]"
              />
              <span className="text-sm text-gray-500">千円</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>工事費</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                name="constructionCosts"
                value={formData.constructionCosts}
                onChange={handleInputChange}
                className="w-[200px]"
              />
              <span className="text-sm text-gray-500">千円</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>計画地</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>都道府県</Label>
              <Input
                name="prefecture"
                value={formData.prefecture}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label>市区町村</Label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>住所</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="番地まで入力してください"
            />
          </div>
          <div className="space-y-2">
            <Label>建物名</Label>
            <Input
              name="buildingName"
              value={formData.buildingName}
              onChange={handleInputChange}
              placeholder="建物名がある場合は入力してください"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

