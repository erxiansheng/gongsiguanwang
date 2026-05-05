export interface ProjectDetailSection {
  title: string
  items: string[]
}

export interface Project {
  id: string
  title: string
  category: string
  description: string
  image: string
  tags: string[]
  detailIntro: string
  detailSections: ProjectDetailSection[]
  detailConclusion: string
}

export interface Testimonial {
  name: string
  title: string
  company: string
  quote: string
  avatar: string
}

export interface Person {
  name: string
  title: string
  bio: string
  image: string
}

export interface Partner {
  name: string
  description: string
  logo: string
  testimonial: string
}

export interface Service {
  title: string
  description: string
  features?: string[]
}

export interface IconTextItem {
  title: string
  description: string
}

export interface Milestone extends IconTextItem {
  year: string
  image: string
}

export interface NavigationItem {
  name: string
  href: string
}

export interface SocialLink {
  name: string
  href: string
}

export interface ContactInfo {
  email: string
  phone: string
  addressLines: string[]
  hoursLines: string[]
  socialLinks: SocialLink[]
}

export interface SiteContent {
  site: {
    brandName: string
    title: string
    description: string
    footerText: string
    copyright: string
    privacyLabel: string
    termsLabel: string
  }
  navigation: NavigationItem[]
  home: {
    hero: {
      title: string
      subtitle: string
      primaryButton: string
      secondaryButton: string
      image: string
    }
    servicesTitle: string
    servicesSubtitle: string
    services: Service[]
    featuredTitle: string
    featuredSubtitle: string
    featuredButton: string
    testimonialsTitle: string
    testimonials: Testimonial[]
    ctaTitle: string
    ctaSubtitle: string
    ctaButton: string
  }
  projectsPage: {
    heroTitle: string
    heroSubtitle: string
    allCategoryLabel: string
    featuredBadge: string
    featuredTitle: string
    featuredDescription: string
    featuredBullets: string[]
    featuredImage: string
    featuredButton: string
    processTitle: string
    processSubtitle: string
    processSteps: Array<IconTextItem & { number: string }>
    ctaTitle: string
    ctaSubtitle: string
    ctaButton: string
  }
  projectDetails: {
    backLabel: string
    missingTitle: string
    missingDescription: string
  }
  about: {
    heroTitle: string
    heroSubtitle: string
    primaryButton: string
    secondaryButton: string
    heroImage: string
    storyTitle: string
    storySubtitle: string
    milestones: Milestone[]
    valuesTitle: string
    valuesSubtitle: string
    values: IconTextItem[]
    teamTitle: string
    teamSubtitle: string
    team: Person[]
    ctaTitle: string
    ctaSubtitle: string
    ctaPrimaryButton: string
    ctaSecondaryButton: string
  }
  partnersPage: {
    heroTitle: string
    heroSubtitle: string
    approachTitle: string
    approachDescription: string
    approachItems: IconTextItem[]
    approachImage: string
    benefitsTitle: string
    benefitsSubtitle: string
    benefits: IconTextItem[]
    ctaTitle: string
    ctaSubtitle: string
    ctaButton: string
    ctaImage: string
  }
  contact: {
    heroTitle: string
    heroSubtitle: string
    formTitle: string
    successTitle: string
    successMessage: string
    sendAnotherLabel: string
    submitLabel: string
    submittingLabel: string
    fields: {
      name: string
      namePlaceholder: string
      email: string
      emailPlaceholder: string
      phone: string
      phonePlaceholder: string
      company: string
      companyPlaceholder: string
      message: string
      messagePlaceholder: string
    }
    infoTitle: string
    labels: {
      email: string
      phone: string
      address: string
      hours: string
      follow: string
    }
    info: ContactInfo
    image: string
    faqTitle: string
    faqSubtitle: string
    faqs: Array<{ question: string; answer: string }>
  }
  partners: Partner[]
  projects: Project[]
}

export const defaultSiteContent: SiteContent = {
  site: {
    brandName: '澄造数字',
    title: '澄造数字 | 品牌与数字体验工作室',
    description: '以策略、设计与技术帮助品牌建立清晰、有温度、可持续增长的数字体验。',
    footerText: '我们为品牌打造清晰可信的数字体验，让创意、技术与业务目标落在同一个方向上。',
    copyright: '保留所有权利。',
    privacyLabel: '隐私政策',
    termsLabel: '服务条款'
  },
  navigation: [
    { name: '首页', href: '/' },
    { name: '项目案例', href: '/projects' },
    { name: '合作伙伴', href: '/partners' },
    { name: '关于我们', href: '/about' },
    { name: '联系我们', href: '/contact' }
  ],
  home: {
    hero: {
      title: '以策略、设计与技术打造可信赖的数字体验',
      subtitle: '我们帮助成长型团队梳理品牌表达、搭建高质量网站，并把复杂业务转化为清晰易用的线上产品。',
      primaryButton: '查看项目案例',
      secondaryButton: '联系我们',
      image: 'https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    servicesTitle: '核心服务',
    servicesSubtitle: '从品牌策略到产品落地，我们用连贯的方法解决数字化增长中的关键问题。',
    services: [
      { title: '品牌系统', description: '建立可识别、可延展的视觉语言，让品牌价值在每一次触达中保持一致。' },
      { title: '网站与应用开发', description: '使用稳定现代的技术栈构建高性能网站、业务系统与可持续维护的数字产品。' },
      { title: '用户体验设计', description: '围绕真实用户任务设计信息架构、流程与界面，让体验更直觉、更高效。' },
      { title: '数字增长', description: '通过内容、数据与转化路径优化，帮助品牌获得更稳定的关注与业务线索。' }
    ],
    featuredTitle: '精选项目',
    featuredSubtitle: '覆盖金融、可持续生活、健康、旅居与活动营销等多种业务场景。',
    featuredButton: '查看全部项目',
    testimonialsTitle: '客户怎么说',
    testimonials: [
      {
        name: '陈若琳',
        title: '首席执行官',
        company: '辰星科技',
        quote: '澄造数字帮我们重新梳理了品牌表达和官网体验，设计很克制，但业务重点变得非常清楚。',
        avatar: 'https://images.pexels.com/photos/762080/pexels-photo-762080.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        name: '林嘉明',
        title: '市场负责人',
        company: '绿境计划',
        quote: '他们能快速理解我们的公益目标，并把复杂信息转化成适合传播和转化的页面结构。',
        avatar: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      {
        name: '苏婉婷',
        title: '创始人',
        company: '匠作集合',
        quote: '这是一支真正会倾听的团队，他们把我们的品牌气质做得既高级又容易被用户记住。',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }
    ],
    ctaTitle: '准备启动你的下一个项目了吗？',
    ctaSubtitle: '告诉我们你的想法，我们会一起拆解目标、路径和最适合当前阶段的落地方案。',
    ctaButton: '开始沟通'
  },
  projectsPage: {
    heroTitle: '项目案例',
    heroSubtitle: '这些项目展示了我们如何把业务目标、品牌表达和用户体验整合成可执行的数字成果。',
    allCategoryLabel: '全部',
    featuredBadge: '重点案例',
    featuredTitle: '星河金融平台体验升级',
    featuredDescription: '我们为金融服务平台重构了信息架构、数据看板和核心转化流程，让专业能力更容易被用户理解。',
    featuredBullets: ['用户关键路径完成率提升 42%', '客服咨询量下降 35%', '无障碍评分从 76 提升至 98'],
    featuredImage: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    featuredButton: '联系我们',
    processTitle: '协作流程',
    processSubtitle: '每个项目都会围绕目标、体验、交付和迭代建立清晰节奏。',
    processSteps: [
      { number: '01', title: '发现', description: '通过访谈、资料梳理与竞品研究，确认业务目标、受众任务和限制条件。' },
      { number: '02', title: '策略', description: '把调研结论转化为信息架构、品牌表达和产品功能优先级。' },
      { number: '03', title: '创作', description: '设计师与工程师协同推进界面、内容和技术实现，确保体验完整落地。' },
      { number: '04', title: '优化', description: '上线后持续观察数据和反馈，迭代关键页面、性能与转化路径。' }
    ],
    ctaTitle: '一起创造更有价值的数字体验',
    ctaSubtitle: '如果你正在规划品牌升级、官网改版或业务系统建设，我们很愿意听听你的想法。',
    ctaButton: '联系我们'
  },
  projectDetails: {
    backLabel: '返回项目列表',
    missingTitle: '未找到这个项目',
    missingDescription: '该项目可能已下线，或者后台内容尚未同步。'
  },
  about: {
    heroTitle: '用清晰目标驱动每一次数字创作',
    heroSubtitle: '我们是一支由策略、设计、开发和内容伙伴组成的小团队，专注把复杂想法变成可被用户理解和使用的数字体验。',
    primaryButton: '与我们合作',
    secondaryButton: '查看项目',
    heroImage: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    storyTitle: '我们的故事',
    storySubtitle: '从小型创意工作室到稳定服务多行业客户的数字体验团队。',
    milestones: [
      { year: '2015', title: '从一个明确的问题开始', description: '团队最初只做品牌页面和活动站，但始终坚持先理解业务，再做设计。', image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { year: '2018', title: '扩展策略与开发能力', description: '随着客户需求变复杂，我们补齐了品牌策略、内容规划和前端工程能力。', image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { year: '2021', title: '服务更多行业客户', description: '我们开始为金融、健康、公益和生活方式品牌提供端到端数字体验方案。', image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { year: '2023', title: '形成稳定的协作方法', description: '今天的澄造数字更强调可维护的内容系统、可衡量的体验目标和长期伙伴关系。', image: 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }
    ],
    valuesTitle: '我们的原则',
    valuesSubtitle: '这些原则决定了我们如何取舍、沟通和交付。',
    values: [
      { title: '质量', description: '我们关注细节，但不迷恋复杂；每个选择都应该服务于用户和业务目标。' },
      { title: '协作', description: '好的结果来自透明沟通、及时反馈和对彼此专业判断的尊重。' },
      { title: '创新', description: '我们持续尝试新方法和工具，但只在能带来真实价值时才引入它们。' },
      { title: '长期价值', description: '我们优先构建可持续维护、可迭代增长的内容和技术基础。' }
    ],
    teamTitle: '团队成员',
    teamSubtitle: '认识这些把策略、审美和工程细节串起来的人。',
    team: [
      { name: '林澄', title: '创始人与创意总监', bio: '长期服务品牌升级与数字产品项目，擅长把商业目标转化为清晰的创意方向。', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { name: '周亦舟', title: '技术负责人', bio: '负责前端架构、性能优化与内容管理方案，重视可维护性和交付稳定性。', image: 'https://images.pexels.com/photos/2380794/pexels-photo-2380794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { name: '唐一宁', title: '设计负责人', bio: '关注信息层级、视觉秩序与细腻交互，让复杂业务也能被轻松理解。', image: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { name: '顾南溪', title: '策略负责人', bio: '擅长品牌定位、内容结构和增长路径规划，帮助团队在创意前先问对问题。', image: 'https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }
    ],
    ctaTitle: '加入我们的创作旅程',
    ctaSubtitle: '无论你想合作、咨询项目，还是希望加入团队，我们都欢迎你来聊聊。',
    ctaPrimaryButton: '联系我们',
    ctaSecondaryButton: '查看机会'
  },
  partnersPage: {
    heroTitle: '合作伙伴',
    heroSubtitle: '我们很荣幸与重视长期价值和清晰体验的团队一起工作。',
    approachTitle: '我们的合作方式',
    approachDescription: '真正有效的合作建立在共同目标、开放沟通和持续迭代之上。',
    approachItems: [
      { title: '共同推进', description: '从发现问题到上线复盘，我们都会让关键决策透明可追踪。' },
      { title: '长期关系', description: '我们更愿意深入理解客户的阶段性目标，而不只是完成一次交付。' },
      { title: '共享成果', description: '我们用业务指标、体验反馈和团队效率共同衡量项目价值。' }
    ],
    approachImage: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    benefitsTitle: '合作收益',
    benefitsSubtitle: '与澄造数字合作，你可以期待这些确定性的支持。',
    benefits: [
      { title: '策略经验', description: '获得策略、设计和开发团队的联合判断，让项目从一开始就方向清晰。' },
      { title: '创新方案', description: '结合行业趋势与业务实际，选择真正适合当前阶段的技术和体验方案。' },
      { title: '专属支持', description: '项目过程有明确负责人跟进，减少沟通成本和交付不确定性。' },
      { title: '结果导向', description: '围绕转化、留存、咨询量、品牌认知等指标持续优化体验。' },
      { title: '透明沟通', description: '保持清楚的文档、节奏和反馈机制，让每一步都有依据。' },
      { title: '资源连接', description: '在内容、影像、技术与传播方面连接合适伙伴，提升项目完成度。' }
    ],
    ctaTitle: '成为合作伙伴',
    ctaSubtitle: '如果你正在寻找长期可靠的数字体验伙伴，我们可以从一次简短沟通开始。',
    ctaButton: '开启对话',
    ctaImage: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  contact: {
    heroTitle: '联系我们',
    heroSubtitle: '告诉我们你的项目背景、目标或正在遇到的问题，我们会尽快回复。',
    formTitle: '发送项目需求',
    successTitle: '提交成功',
    successMessage: '你的消息已经保存，我们会尽快与你联系。',
    sendAnotherLabel: '继续发送',
    submitLabel: '发送消息',
    submittingLabel: '正在发送...',
    fields: {
      name: '姓名',
      namePlaceholder: '请输入你的姓名',
      email: '邮箱',
      emailPlaceholder: '请输入邮箱地址',
      phone: '电话（选填）',
      phonePlaceholder: '请输入联系电话',
      company: '公司（选填）',
      companyPlaceholder: '请输入公司名称',
      message: '需求说明',
      messagePlaceholder: '请简单描述项目背景、目标和时间安排'
    },
    infoTitle: '联系信息',
    labels: {
      email: '邮箱',
      phone: '电话',
      address: '地址',
      hours: '工作时间',
      follow: '关注我们'
    },
    info: {
      email: 'hello@chengzao.cn',
      phone: '+86 400 800 2026',
      addressLines: ['上海市徐汇区创意园 18 号', '澄造数字工作室'],
      hoursLines: ['周一至周五：09:30 - 18:30', '周六：10:00 - 14:00'],
      socialLinks: [
        { name: '小红书', href: '#' },
        { name: '微博', href: '#' },
        { name: '领英', href: '#' }
      ]
    },
    image: 'https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    faqTitle: '常见问题',
    faqSubtitle: '你可能关心的合作问题，我们先整理在这里。',
    faqs: [
      { question: '你们提供哪些服务？', answer: '我们提供品牌系统、网站与应用开发、用户体验设计、内容结构和数字增长相关服务，也可以按项目阶段组合。' },
      { question: '项目费用如何计算？', answer: '费用会根据目标、范围、交付物和时间安排定制。初步沟通后，我们会给出清晰的报价与阶段计划。' },
      { question: '一个项目通常需要多久？', answer: '轻量官网通常需要 4 到 6 周，复杂品牌与平台项目可能需要 2 到 4 个月，具体取决于范围和反馈节奏。' },
      { question: '可以远程合作吗？', answer: '可以。我们有稳定的远程协作流程，会通过文档、会议和阶段演示保持沟通清晰。' },
      { question: '你们的项目流程是什么？', answer: '通常包括发现、策略、设计开发、上线和优化几个阶段，每个阶段都会有明确产出和确认节点。' },
      { question: '项目完成后是否提供维护？', answer: '可以。我们提供内容更新、性能优化、功能迭代和技术维护等持续支持方案。' }
    ]
  },
  partners: [
    { name: '辰星科技', description: '专注可持续创新的企业级技术公司。', logo: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2', testimonial: '澄造数字帮助我们让数字形象更准确地表达了创新能力。' },
    { name: '绿境计划', description: '关注生态保护与公众教育的公益组织。', logo: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2', testimonial: '新网站让捐赠和志愿者报名流程更顺畅，转化有明显提升。' },
    { name: '城居造物', description: '为紧凑城市空间设计现代家具的生活方式品牌。', logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2', testimonial: '他们建立的品牌识别系统准确捕捉了我们的审美和价值观。' },
    { name: '脉冲传媒', description: '关注新文化趋势与数字内容传播的媒体公司。', logo: 'https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2', testimonial: '内容结构和视觉更新让我们的受众互动更稳定。' },
    { name: '峰汇金融', description: '面向数字经济的新型金融服务平台。', logo: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2', testimonial: '官网改版后，潜在客户咨询量有了清晰增长。' },
    { name: '远景健康', description: '提供便捷远程医疗服务的健康科技品牌。', logo: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2', testimonial: '他们把复杂的医疗服务流程设计得更容易理解和操作。' }
  ],
  projects: [
    {
      id: 'nova-finance',
      title: '星河金融平台',
      category: '网站与应用',
      description: '面向个人理财用户的金融服务平台，包含数据看板、智能洞察和账户管理体验。',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['金融科技', '界面设计', '数据看板'],
      detailIntro: '星河金融平台是一套现代化金融服务界面，目标是让用户更轻松地理解资产状态、消费趋势和下一步行动。我们通过重新组织信息架构与视觉层级，把复杂数据转化为可读、可信、可操作的体验。',
      detailSections: [
        { title: '直觉清晰的界面系统', items: ['简洁首页：集中呈现关键资产指标和近期动态', '智能导航：根据用户任务组织核心功能入口', '可视化分析：用图表呈现收支趋势、预算和投资结构', '健康评分：帮助用户快速判断财务状态并获得改进建议'] },
        { title: '进阶财务分析能力', items: ['实时分类：自动归类交易并生成消费图谱', '趋势预测：基于历史行为推算未来支出与储蓄变化', '情境对比：支持与自定义目标或群组进行对比分析', '行动建议：把复杂指标转化成下一步可执行建议'] }
      ],
      detailConclusion: '这个项目让金融产品从单纯交易工具，转向更具陪伴感和决策支持能力的数字顾问。'
    },
    {
      id: 'eco-habitat',
      title: '绿栖居品牌系统',
      category: '品牌系统',
      description: '为可持续居住倡议打造完整品牌识别，强调环保材料、社区连接和长期生活方式。',
      image: 'https://images.pexels.com/photos/2469122/pexels-photo-2469122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['品牌识别', '可持续', '视觉系统'],
      detailIntro: '绿栖居关注可持续住房与社区生活，我们为它建立了一套兼具亲和力和专业度的品牌语言，让环保理念不再停留在口号，而是能被用户真实感知。',
      detailSections: [
        { title: '品牌设计系统', items: ['视觉识别：建立自然、可靠的色彩与字体系统', '标志设计：形成适合多场景应用的品牌符号', '规范手册：整理品牌应用、版式和图片风格规则', '传播物料：保证线上线下触点保持一致'] },
        { title: '材料与应用指引', items: ['环保材料：推荐更低浪费的印刷与制作方式', '包装方案：减少多余装饰，强调循环使用', '数字资产：适配官网、社媒和活动页面', '社区表达：让品牌语气更接近真实居住者'] }
      ],
      detailConclusion: '新的品牌系统帮助绿栖居以更清晰、更可信的方式传递可持续生活价值。'
    },
    {
      id: 'pulse-fitness',
      title: '脉动健身应用',
      category: '移动体验',
      description: '结合训练计划、营养记录和社群激励的移动健身产品。',
      image: 'https://images.pexels.com/photos/1103242/pexels-photo-1103242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['健康科技', '移动应用', '体验设计'],
      detailIntro: '脉动健身应用希望把训练记录、营养建议和社群激励整合到一个轻量工具中。我们重点优化了每日任务、进度反馈和个性化目标，让坚持训练变得更容易。',
      detailSections: [
        { title: '训练管理', items: ['定制计划：按目标生成个性化训练安排', '动作库：提供清晰的动作说明和替代方案', '进度追踪：记录表现并展示阶段变化', '智能提醒：帮助用户形成稳定训练节奏'] },
        { title: '营养与习惯', items: ['饮食计划：结合训练目标给出营养建议', '食物记录：快速记录热量和营养比例', '健康食谱：推荐可执行的日常搭配', '饮水监测：用轻量提醒帮助习惯养成'] }
      ],
      detailConclusion: '通过减少记录成本并强化正向反馈，产品更像一个持续陪伴用户的训练伙伴。'
    },
    {
      id: 'artisan-cafe',
      title: '匠作咖啡品牌空间',
      category: '品牌系统',
      description: '为精品咖啡连锁设计品牌识别与空间视觉，突出手作感和城市生活气质。',
      image: 'https://images.pexels.com/photos/302902/pexels-photo-302902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['品牌识别', '空间视觉', '生活方式'],
      detailIntro: '匠作咖啡需要一套能同时适配门店、包装和数字渠道的品牌系统。我们从视觉符号、色彩、字体和语气入手，建立温暖但不过度装饰的表达。',
      detailSections: [
        { title: '识别系统', items: ['标志组合：设计主标与辅助符号，适配不同尺寸', '色彩方案：用克制色彩表达手作和品质感', '字体层级：建立菜单、包装和页面的排版规则', '图片语言：统一产品、空间与人物影像风格'] },
        { title: '应用规范', items: ['品牌语气：明确沟通原则和文本风格', '门店物料：统一杯套、菜单、导视和海报', '数字体验：适配官网、社媒和会员页面', '扩展框架：为未来新店和新品保留延展空间'] }
      ],
      detailConclusion: '这套系统让品牌在线下和线上触点都保持稳定识别，同时保留了手作品牌应有的温度。'
    },
    {
      id: 'nomad-travel',
      title: '远行者旅居平台',
      category: '网站与应用',
      description: '面向远程工作者的旅居平台，整合目的地信息、共享办公和灵活住宿。',
      image: 'https://images.pexels.com/photos/7625308/pexels-photo-7625308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['旅居科技', '产品设计', '前端开发'],
      detailIntro: '远行者旅居平台服务数字游牧人群，核心挑战是把目的地、住宿、办公和社区资源整合成清晰决策路径。',
      detailSections: [
        { title: '目的地决策', items: ['城市情报：整合气候、成本和签证信息', '办公空间：按网络、环境和社区活跃度筛选', '住宿匹配：推荐适合远程工作的灵活房源', '行程规划：串联交通、入住和工作安排'] },
        { title: '社区支持', items: ['同城连接：帮助用户找到当地活动与伙伴', '目的地指南：沉淀真实经验和生活建议', '远程工具：支持时区管理和工作效率规划', '身心支持：提供健康资源和生活平衡提示'] }
      ],
      detailConclusion: '平台把旅行愿望和实际生活需求连接起来，让长期旅居变得更有秩序。'
    },
    {
      id: 'summit-events',
      title: '峰会活动数字营销',
      category: '数字增长',
      description: '为科技峰会设计数字活动页面、内容传播节奏和社媒转化路径。',
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      tags: ['活动营销', '内容策略', '转化优化'],
      detailIntro: '峰会活动需要在短周期内完成认知、报名和现场互动。我们用内容分层、渠道组合和转化页面设计，把传播节奏拆成可执行动作。',
      detailSections: [
        { title: '策略框架', items: ['受众洞察：分析报名动机和信息需求', '渠道优化：规划搜索、社媒和邮件节奏', '内容体系：构建议题、嘉宾和案例传播路径', '数据评估：跟踪报名、来源和转化质量'] },
        { title: '执行要素', items: ['搜索营销：完善关键词和活动页基础结构', '社媒互动：按平台特性设计内容模板', '转化优化：简化报名流程并突出价值信息', '自动化触达：设置提醒、确认和会后跟进内容'] }
      ],
      detailConclusion: '最终方案帮助活动在有限时间内获得更高质量的关注和报名转化。'
    }
  ]
}