"use client"

import { Edit, Plus, Trash2 } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { defaultSiteContent, normalizeCategoryLabel } from '@/lib/site-content'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }
type Path = Array<string | number>

interface ContentEditorProps {
  content: Record<string, JsonValue>
  onChange: (content: Record<string, JsonValue>) => void
}

const SECTIONS = [
  { key: 'site', label: '站点' },
  { key: 'navigation', label: '导航' },
  { key: 'home', label: '首页' },
  { key: 'projectsPage', label: '项目页' },
  { key: 'projectCategories', label: '项目分类' },
  { key: 'projectDetails', label: '详情页' },
  { key: 'projects', label: '项目' },
  { key: 'about', label: '关于' },
  { key: 'partnersPage', label: '合作页' },
  { key: 'partners', label: '伙伴' },
  { key: 'contact', label: '联系' }
]

const LABELS: Record<string, string> = {
  site: '站点信息',
  brandName: '品牌名称',
  title: '浏览器标题',
  description: 'SEO 描述',
  seoKeywords: 'SEO 关键词',
  seoRobots: '搜索引擎规则',
  faviconUrl: '浏览器图标地址',
  icp: '备案号',
  footerText: '页脚简介',
  copyright: '版权说明',
  privacyLabel: '隐私政策文字',
  termsLabel: '服务条款文字',
  navigation: '导航',
  name: '名称',
  href: '链接',
  home: '首页',
  hero: '首屏',
  subtitle: '副标题',
  primaryButton: '主按钮',
  secondaryButton: '次按钮',
  image: '图片地址',
  heroImage: '首屏图片',
  featuredImage: '重点图片',
  approachImage: '方式图片',
  ctaImage: '行动区图片',
  servicesTitle: '服务标题',
  servicesSubtitle: '服务说明',
  services: '服务',
  featuredTitle: '精选标题',
  featuredSubtitle: '精选说明',
  featuredButton: '精选按钮',
  testimonialsTitle: '评价标题',
  testimonials: '客户评价',
  quote: '评价内容',
  avatar: '头像地址',
  company: '公司',
  ctaTitle: '行动标题',
  ctaSubtitle: '行动说明',
  ctaButton: '行动按钮',
  projectsPage: '项目页',
  heroTitle: '首屏标题',
  heroSubtitle: '首屏说明',
  allCategoryLabel: '全部分类文字',
  featuredBadge: '重点标记',
  featuredDescription: '重点说明',
  featuredBullets: '重点列表',
  processTitle: '流程标题',
  processSubtitle: '流程说明',
  processSteps: '流程步骤',
  number: '编号',
  projectCategories: '项目分类',
  projectDetails: '详情页',
  backLabel: '返回文字',
  missingTitle: '缺失标题',
  missingDescription: '缺失说明',
  projects: '项目列表',
  id: '编号',
  category: '分类',
  tags: '标签',
  detailIntro: '详情开头',
  detailSections: '详情段落',
  detailConclusion: '详情结尾',
  items: '列表项',
  about: '关于页',
  storyTitle: '故事标题',
  storySubtitle: '故事说明',
  milestones: '发展节点',
  year: '年份',
  valuesTitle: '原则标题',
  valuesSubtitle: '原则说明',
  values: '原则',
  teamTitle: '团队标题',
  teamSubtitle: '团队说明',
  team: '团队成员',
  bio: '简介',
  ctaPrimaryButton: '行动主按钮',
  ctaSecondaryButton: '行动次按钮',
  partnersPage: '合作页',
  approachTitle: '合作方式标题',
  approachDescription: '合作方式说明',
  approachItems: '合作方式',
  benefitsTitle: '收益标题',
  benefitsSubtitle: '收益说明',
  benefits: '合作收益',
  partners: '合作伙伴',
  logo: '标志图片',
  categoryOrder: '分类排序',
  testimonial: '伙伴评价',
  contact: '联系页',
  formTitle: '表单标题',
  successTitle: '成功标题',
  successMessage: '成功提示',
  sendAnotherLabel: '再次发送文字',
  submitLabel: '提交按钮',
  submittingLabel: '提交中文字',
  fields: '表单字段',
  namePlaceholder: '姓名占位',
  nameRequired: '姓名必填',
  email: '邮箱',
  emailPlaceholder: '邮箱占位',
  emailRequired: '邮箱必填',
  phone: '电话',
  phonePlaceholder: '电话占位',
  phoneRequired: '电话必填',
  companyPlaceholder: '公司占位',
  companyRequired: '公司必填',
  message: '留言',
  messagePlaceholder: '留言占位',
  messageRequired: '留言必填',
  infoTitle: '联系信息标题',
  labels: '信息标签',
  address: '地址',
  hours: '工作时间',
  follow: '关注文字',
  info: '联系信息',
  addressLines: '地址行',
  hoursLines: '时间行',
  socialLinks: '社交链接',
  icon: '图标类型',
  qrCode: '二维码图片地址',
  faqTitle: '常见问题标题',
  faqSubtitle: '常见问题说明',
  faqs: '常见问题',
  question: '问题',
  answer: '答案'
}

const LONG_TEXT_KEYS = new Set([
  'description', 'subtitle', 'footerText', 'quote', 'bio', 'detailIntro', 'detailConclusion',
  'heroSubtitle', 'featuredDescription', 'processSubtitle', 'ctaSubtitle', 'storySubtitle',
  'valuesSubtitle', 'teamSubtitle', 'approachDescription', 'benefitsSubtitle', 'successMessage',
  'messagePlaceholder', 'answer'
])

const OBJECT_ARRAY_KEYS = new Set([
  'navigation', 'services', 'testimonials', 'processSteps', 'projects', 'detailSections', 'milestones',
  'values', 'team', 'approachItems', 'benefits', 'partners', 'faqs', 'socialLinks'
])

export default function ContentEditor({ content, onChange }: ContentEditorProps) {
  const availableSections = SECTIONS.filter((section) => section.key in content)
  const [activeKey, setActiveKey] = useState(availableSections[0]?.key || 'site')
  const currentKey = activeKey in content ? activeKey : availableSections[0]?.key
  const projectCategories = getProjectCategories(content)

  function update(path: Path, value: JsonValue) {
    const nextContent = setAtPath(content, path, value) as Record<string, JsonValue>
    onChange(syncProjectCategories(applyProjectCategoryRename(content, nextContent, path, value)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {availableSections.map((section) => (
          <Button
            key={section.key}
            type="button"
            size="sm"
            variant={currentKey === section.key ? 'default' : 'outline'}
            onClick={() => setActiveKey(section.key)}
          >
            {section.label}
          </Button>
        ))}
      </div>

      {currentKey && (
        <div className="rounded-lg border border-border bg-background/60 p-4">
          <EditorField
            fieldKey={currentKey}
            value={content[currentKey]}
            path={[currentKey]}
            onChange={update}
            projectCategories={projectCategories}
          />
        </div>
      )}
    </div>
  )
}

function EditorField({ fieldKey, value, path, onChange, projectCategories }: { fieldKey: string; value: JsonValue; path: Path; onChange: (path: Path, value: JsonValue) => void; projectCategories: string[] }) {
  if (Array.isArray(value)) {
    return <ArrayEditor fieldKey={fieldKey} value={value} path={path} onChange={onChange} projectCategories={projectCategories} />
  }

  if (value && typeof value === 'object') {
    return <ObjectEditor fieldKey={fieldKey} value={value as Record<string, JsonValue>} path={path} onChange={onChange} projectCategories={projectCategories} />
  }

  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-3 rounded-md border border-border p-3 text-sm">
        <input type="checkbox" checked={value} onChange={(event) => onChange(path, event.target.checked)} />
        {labelFor(fieldKey)}
      </label>
    )
  }

  if (typeof value === 'number') {
    return (
      <FieldShell fieldKey={fieldKey}>
        <Input type="number" value={value} onChange={(event) => onChange(path, Number(event.target.value))} />
      </FieldShell>
    )
  }

  const textValue = value === null ? '' : String(value)
  const useTextarea = LONG_TEXT_KEYS.has(fieldKey) || textValue.length > 80

  if (fieldKey === 'category' && projectCategories.length > 0) {
    return (
      <CategorySelect
        value={textValue}
        categories={projectCategories}
        onChange={(category) => onChange(path, category)}
      />
    )
  }

  return (
    <FieldShell fieldKey={fieldKey}>
      {useTextarea ? (
        <Textarea value={textValue} onChange={(event) => onChange(path, event.target.value)} className="min-h-[110px]" />
      ) : (
        <Input value={textValue} onChange={(event) => onChange(path, event.target.value)} />
      )}
    </FieldShell>
  )
}

function ObjectEditor({ fieldKey, value, path, onChange, projectCategories }: { fieldKey: string; value: Record<string, JsonValue>; path: Path; onChange: (path: Path, value: JsonValue) => void; projectCategories: string[] }) {
  const entries = Object.entries(value).filter(([key]) => key !== 'updatedAt')

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{labelFor(fieldKey)}</h3>
      <div className="grid grid-cols-1 gap-4">
        {entries.map(([key, item]) => (
          <EditorField key={key} fieldKey={key} value={item} path={[...path, key]} onChange={onChange} projectCategories={projectCategories} />
        ))}
      </div>
    </div>
  )
}

function ArrayEditor({ fieldKey, value, path, onChange, projectCategories }: { fieldKey: string; value: JsonValue[]; path: Path; onChange: (path: Path, value: JsonValue) => void; projectCategories: string[] }) {
  const isObjectArray = OBJECT_ARRAY_KEYS.has(fieldKey) || value.some((item) => item && typeof item === 'object' && !Array.isArray(item))
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const editingItem = editingIndex === null ? null : value[editingIndex]

  function addItem() {
    const template = value[0] ?? getArrayTemplate(fieldKey)
    const nextItem = fieldKey === 'projectCategories'
      ? createNewCategoryName(projectCategories)
      : createEmptyLike(template)
    onChange(path, [...value, nextItem])
    setEditingIndex(value.length)
  }

  function removeItem(index: number) {
    onChange(path, value.filter((_, itemIndex) => itemIndex !== index))
    if (editingIndex === null) return
    if (editingIndex === index) setEditingIndex(null)
    if (editingIndex > index) setEditingIndex(editingIndex - 1)
  }

  if (!isObjectArray) {
    return (
      <div className="space-y-3 rounded-md border border-border p-4">
        <ArrayHeader fieldKey={fieldKey} onAdd={addItem} />
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input value={String(item ?? '')} onChange={(event) => onChange([...path, index], event.target.value)} />
              <Button type="button" variant="outline" size="icon" onClick={() => removeItem(index)} aria-label="删除">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 rounded-md border border-border p-4">
      <ArrayHeader fieldKey={fieldKey} onAdd={addItem} />
      {value.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          暂无内容，点击新增开始添加。
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[1fr_auto] gap-3 bg-muted/50 px-4 py-2 text-sm font-medium text-muted-foreground md:grid-cols-[minmax(180px,1fr)_180px_auto]">
            <span>名称</span>
            <span className="hidden md:block">摘要</span>
            <span className="text-right">操作</span>
          </div>
          {value.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-border px-4 py-3 md:grid-cols-[minmax(180px,1fr)_180px_auto]">
              <div className="min-w-0">
                <div className="truncate font-medium">{getItemTitle(item, index)}</div>
                <div className="mt-1 flex flex-wrap gap-2 md:hidden">
                  {getItemBadges(item).map((badge) => (
                    <Badge key={badge} variant="secondary" className="max-w-full truncate">{badge}</Badge>
                  ))}
                </div>
              </div>
              <div className="hidden min-w-0 flex-wrap gap-2 md:flex">
                {getItemBadges(item).map((badge) => (
                  <Badge key={badge} variant="secondary" className="max-w-full truncate">{badge}</Badge>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setEditingIndex(index)}>
                  <Edit className="mr-2 h-4 w-4" />编辑
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => removeItem(index)}>
                  <Trash2 className="mr-2 h-4 w-4" />删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && setEditingIndex(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingIndex === null ? labelFor(fieldKey) : getItemTitle(editingItem, editingIndex)}</DialogTitle>
            <DialogDescription>编辑完成后关闭弹窗，页面上的保存内容按钮会写入最新数据。</DialogDescription>
          </DialogHeader>
          {editingIndex !== null && editingItem !== undefined && (
            <EditorField
              fieldKey={`${labelFor(fieldKey)} ${editingIndex + 1}`}
              value={editingItem}
              path={[...path, editingIndex]}
              onChange={onChange}
              projectCategories={projectCategories}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ArrayHeader({ fieldKey, onAdd }: { fieldKey: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="text-lg font-bold">{labelFor(fieldKey)}</h3>
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />新增
      </Button>
    </div>
  )
}

function FieldShell({ fieldKey, children }: { fieldKey: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{labelFor(fieldKey)}</label>
      {children}
    </div>
  )
}

function CategorySelect({ value, categories, onChange }: { value: string; categories: string[]; onChange: (value: string) => void }) {
  const normalizedValue = normalizeCategoryLabel(value)
  const options = categories.some((category) => normalizeCategoryLabel(category) === normalizedValue)
    ? categories
    : [normalizedValue, ...categories].filter(Boolean)

  return (
    <FieldShell fieldKey="category">
      <Select value={normalizedValue} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="选择分类" />
        </SelectTrigger>
        <SelectContent>
          {options.map((category) => (
            <SelectItem key={category} value={category}>{category}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  )
}

function labelFor(key: string) {
  return LABELS[key] || key
}

function getProjectCategories(content: Record<string, JsonValue>): string[] {
  const categoryValues = Array.isArray(content.projectCategories) ? content.projectCategories : []
  const projectValues = Array.isArray(content.projects)
    ? content.projects.map((project) => {
      if (!project || typeof project !== 'object' || Array.isArray(project)) return ''
      return normalizeCategoryLabel((project as Record<string, JsonValue>).category)
    })
    : []

  return uniqueCategories([...categoryValues, ...projectValues])
}

function syncProjectCategories(content: Record<string, JsonValue>): Record<string, JsonValue> {
  return {
    ...content,
    projectCategories: getProjectCategories(content)
  }
}

function applyProjectCategoryRename(previousContent: Record<string, JsonValue>, nextContent: Record<string, JsonValue>, path: Path, value: JsonValue): Record<string, JsonValue> {
  if (path[0] !== 'projectCategories' || path.length !== 2 || typeof path[1] !== 'number') return nextContent

  const previousCategories = Array.isArray(previousContent.projectCategories) ? previousContent.projectCategories : []
  const previousName = normalizeCategoryLabel(previousCategories[path[1]])
  const nextName = normalizeCategoryLabel(value)
  if (!previousName || !nextName || previousName === nextName || !Array.isArray(nextContent.projects)) return nextContent

  return {
    ...nextContent,
    projects: nextContent.projects.map((project) => {
      if (!project || typeof project !== 'object' || Array.isArray(project)) return project
      const record = project as Record<string, JsonValue>
      return normalizeCategoryLabel(record.category) === previousName
        ? { ...record, category: nextName }
        : project
    })
  }
}

function uniqueCategories(categories: JsonValue[]): string[] {
  const normalized = categories.map(normalizeCategoryLabel).filter(Boolean)
  return Array.from(new Map(normalized.map((category) => [category, category])).values())
}

function getItemTitle(item: JsonValue, index: number) {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const record = item as Record<string, JsonValue>
    const title = record.title || record.name || record.question || record.id
    if (title) return String(title)
  }
  return `第 ${index + 1} 项`
}

function getItemBadges(item: JsonValue): string[] {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return []
  const record = item as Record<string, JsonValue>
  const badges = [record.category, record.title, record.company, record.href, record.year]
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)

  return Array.from(new Set(badges)).slice(0, 2)
}

function createNewCategoryName(categories: string[]): string {
  const base = '新分类'
  if (!categories.includes(base)) return base

  let index = 2
  while (categories.includes(`${base}${index}`)) index += 1
  return `${base}${index}`
}

function getArrayTemplate(fieldKey: string): JsonValue | undefined {
  const templates: Record<string, JsonValue | undefined> = {
    navigation: defaultSiteContent.navigation[0] as unknown as JsonValue,
    services: defaultSiteContent.home.services[0] as unknown as JsonValue,
    testimonials: defaultSiteContent.home.testimonials[0] as unknown as JsonValue,
    processSteps: defaultSiteContent.projectsPage.processSteps[0] as unknown as JsonValue,
    projects: defaultSiteContent.projects[0] as unknown as JsonValue,
    detailSections: defaultSiteContent.projects[0].detailSections[0] as unknown as JsonValue,
    milestones: defaultSiteContent.about.milestones[0] as unknown as JsonValue,
    values: defaultSiteContent.about.values[0] as unknown as JsonValue,
    team: defaultSiteContent.about.team[0] as unknown as JsonValue,
    approachItems: defaultSiteContent.partnersPage.approachItems[0] as unknown as JsonValue,
    benefits: defaultSiteContent.partnersPage.benefits[0] as unknown as JsonValue,
    partners: defaultSiteContent.partners[0] as unknown as JsonValue,
    faqs: defaultSiteContent.contact.faqs[0] as unknown as JsonValue,
    socialLinks: defaultSiteContent.contact.info.socialLinks[0] as unknown as JsonValue
  }

  return templates[fieldKey]
}

function createEmptyLike(value: JsonValue | undefined): JsonValue {
  if (Array.isArray(value)) return []
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, createEmptyLike(item)])) as Record<string, JsonValue>
  }
  if (typeof value === 'number') return 0
  if (typeof value === 'boolean') return false
  return ''
}

function setAtPath(root: JsonValue, path: Path, value: JsonValue): JsonValue {
  if (path.length === 0) return value
  const [head, ...rest] = path
  if (Array.isArray(root)) {
    const next = [...root]
    next[Number(head)] = setAtPath(next[Number(head)], rest, value)
    return next
  }
  const record = { ...(root as Record<string, JsonValue>) }
  record[String(head)] = setAtPath(record[String(head)], rest, value)
  return record
}

