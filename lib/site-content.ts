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
  logo: string
  category: string
  categoryOrder: number
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
  href?: string
  icon?: 'qq' | 'wechat'
  qrCode?: string
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
    seoKeywords: string
    seoRobots: string
    faviconUrl: string
    icp: string
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
  projectCategories: string[]
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
      nameRequired: boolean
      email: string
      emailPlaceholder: string
      emailRequired: boolean
      phone: string
      phonePlaceholder: string
      phoneRequired: boolean
      company: string
      companyPlaceholder: string
      companyRequired: boolean
      message: string
      messagePlaceholder: string
      messageRequired: boolean
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
  "site": {
    "brandName": "金科云创车载测试",
    "title": "金科云创 | 专业车载测试培训",
    "description": "更专业 · 更负责 · 好就业 · 好口碑 帮助每一个学员完成就业",
    "seoKeywords": "车载测试",
    "seoRobots": "index, follow",
    "faviconUrl": "/images/logo.png",
    "icp": "豫ICP备2026021945号",
    "footerText": "更专业 · 更负责 · 好就业 · 好口碑",
    "copyright": "保留所有权利。",
    "privacyLabel": "",
    "termsLabel": ""
  },
  "navigation": [
    {
      "name": "首页",
      "href": "/"
    },
    {
      "name": "课程介绍",
      "href": "/projects"
    },
    {
      "name": "学校环境",
      "href": "/partners"
    },
    {
      "name": "关于我们",
      "href": "/about"
    },
    {
      "name": "联系我们",
      "href": "/contact"
    }
  ],
  "home": {
    "hero": {
      "title": "以专业、口碑与技术打造可信赖的学习体验",
      "subtitle": "更专业，更负责，好就业，好口碑，金科云创致力于帮助0基础学员转行为车企工程师",
      "primaryButton": "查看实操案例",
      "secondaryButton": "联系我们",
      "image": "https://jkyc2017.com/uploads/1778037474657-mothlrvlme3boi.jpeg"
    },
    "servicesTitle": "团队服务介绍",
    "servicesSubtitle": "从学习到就业，专业团队全流程理论+实操陪跑",
    "services": [
      {
        "title": "教师团队",
        "description": "教师团队均来自吉利，奇瑞，路特斯，蔚来，极氪等主机厂，按工作方向授课，负责课程的讲授和更新。"
      },
      {
        "title": "实操团队",
        "description": "实操团队主要负责学员实操，包含座舱，车身，Adas，动力底盘，L4无人驾驶小车，HIL的实操，整车的实操。\n"
      },
      {
        "title": "就业团队",
        "description": "就业团队来自理想，小米，德赛西威等主机厂和供应商，负责学员就业，更新面试题库，就业答疑，模拟面试。"
      },
      {
        "title": "后勤团队",
        "description": "后勤团队包含行政 、财务和后勤团队，内部服务部门，做好学校的后勤保障工作。\n"
      }
    ],
    "featuredTitle": "精选实操",
    "featuredSubtitle": "覆盖座舱·  车身 · 智驾 · 动力底盘 · HIL等 ",
    "featuredButton": "查看全部实操",
    "testimonialsTitle": "学员怎么说",
    "testimonials": [
      {
        "name": "陈同学-本科-15k",
        "title": "就业方向HIL",
        "company": "上海XX电子",
        "quote": "老师讲的很透彻，课件也很丰富，目前我在华为做HIL测试",
        "avatar": "https://jkyc2017.com/uploads/1778037476767-mothlti7b8bt9z.jpeg"
      },
      {
        "name": "林同学-专科-9k",
        "title": "就业方向ADAS",
        "company": "合肥xx科技有限公司",
        "quote": "金科云创牛逼，目前我在做NOA测试，也喜欢开车，可以到处跑跑，我挺喜欢这份工作的。",
        "avatar": "https://jkyc2017.com/uploads/1778037478371-mothluqrznhbxp.jpeg"
      },
      {
        "name": "刘同学-专科-10k",
        "title": "就业方向车身域",
        "company": "广州XX汽车电子科技有限公司",
        "quote": "我是广东人，车身方向的东西还是比较多比较碎的，好在老师讲的也都讲到位了，自己也总结了挺多东西，我成功入职了自己的理想公司。",
        "avatar": "https://jkyc2017.com/uploads/1778037479808-mothlvuo9ilul5.jpeg"
      },
      {
        "name": "王同学-本科-12k",
        "title": "就业方向-动力底盘",
        "company": "北京XX汽车科技有限公司",
        "quote": "动力底盘比较吃年限，比较吃驾龄，而且东西比较多，好在自己啃下来了，成功入职了小米！",
        "avatar": "https://jkyc2017.com/uploads/1778037478371-mothluqrznhbxp.jpeg"
      }
    ],
    "ctaTitle": "如果你想要选择一个有潜力，有未来，有技术的行业",
    "ctaSubtitle": "告诉我们你的想法，我们会一起拆解目标、定制最适你的方向。",
    "ctaButton": "开始沟通"
  },
  "projectsPage": {
    "heroTitle": "实操案例",
    "heroSubtitle": "部分实操项目(整车全场景实操)",
    "allCategoryLabel": "全部",
    "featuredBadge": "就业薪资",
    "featuredTitle": "车载测试课程涵盖五大域和HIL",
    "featuredDescription": "我们为金融服务平台重构了信息架构、数据看板和核心转化流程，让专业能力更容易被用户理解。",
    "featuredBullets": [
      "最低薪资（约10%）7-8k",
      "平均薪资10k",
      "最高薪资（约20%）12-20k"
    ],
    "featuredImage": "https://jkyc2017.com/uploads/1780025920296-mpqdh2cozxuk8x.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "featuredButton": "联系我们",
    "processTitle": "报名流程",
    "processSubtitle": "每个项目都会围绕目标、体验、交付和迭代建立清晰节奏。",
    "processSteps": [
      {
        "number": "01",
        "title": "预约试听",
        "description": "预约报名需缴纳100元占座费，免费试听1周，试听满意，占座费转入学费，不满意全额退款"
      },
      {
        "number": "02",
        "title": "参加课程",
        "description": "课程包含理论+实操"
      },
      {
        "number": "03",
        "title": "就业",
        "description": "专业就业团队，辅助学员就业，直至拿到offer"
      },
      {
        "number": "04",
        "title": "售后",
        "description": "就业后，如果需要二次就业，金科云创提供终身二次就业服务"
      }
    ],
    "ctaTitle": "一起为中国新能源汽车的发展贡献一份力量！",
    "ctaSubtitle": "如果你正在迷茫，正在寻找一个有潜力的行业，想要学习一个能靠技术吃饭的本领，可以联系我们，我们会给你最专业的介绍。",
    "ctaButton": "联系我们"
  },
  "projectDetails": {
    "backLabel": "返回项目列表",
    "missingTitle": "未找到这个项目",
    "missingDescription": "该项目可能已下线，或者后台内容尚未同步。"
  },
  "projectCategories": [
    "命令实操",
    "总线相关实操",
    "座舱域实操",
    "智驾域实操",
    "车身域实操",
    "HIL机柜实操",
    "L4无人小车实操",
    "毕业合影",
    "校区环境",
    "OFFER展示"
  ],
  "about": {
    "heroTitle": "用清晰目标驱动每一次职业发展",
    "heroSubtitle": "金科云创是属云创职业技能培训学校旗下品牌\n公司于2017年成立于扶沟县，是河南首家专业的车载测试培训学校。",
    "primaryButton": "联系我们",
    "secondaryButton": "查看实操项目",
    "heroImage": "https://jkyc2017.com/uploads/1778818163302-mp6een3aqbumjb.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "storyTitle": "我们的理念",
    "storySubtitle": "“学生发展就是机构发展，学生未来就是机构未来”\n核心成员曾就职于蔚来汽车，奇瑞汽车，路特斯汽车等主机厂，负责过数十款车型的测试。",
    "milestones": [
      {
        "year": "2017",
        "title": "从一个4人教室开始",
        "description": "金科云创成立于2017年，立足扶沟，深耕1个校区",
        "image": "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        "year": "2018",
        "title": "搬迁扩大新场地",
        "description": "场地占地500平方",
        "image": "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        "year": "2025年",
        "title": "政府设立为“扶沟县云创职业培训学校”",
        "description": "政府背书，资质合规，持有民办教育办学许可证",
        "image": "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        "year": "2025",
        "title": "扩大新场地",
        "description": "新场地，电子教室和实操教室，共计2000平米，具有L4无人驾驶实训车，企业1:1定制HIL台架，和 NI平台HIL台架可实操VCU-HIL和BMS-HIL\n纯电实操车辆，正版CANoe盒子，台架100+人手一套，周立功人手一个，同星TSMaster可实操\n专业实操的新能源实训室2个，还有其他实操如示波器，万用表，LIN实操，UDS",
        "image": "https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      }
    ],
    "valuesTitle": "我们的原则",
    "valuesSubtitle": "这些原则决定了我们努力的方向。",
    "values": [
      {
        "title": "目标",
        "description": "立志成为最最专业的车载测试培训机构"
      },
      {
        "title": "责任",
        "description": "全力以赴，保障每一位学员100%就业"
      },
      {
        "title": "创新",
        "description": "持续更新课程，持续引入市场最新技术和理念"
      },
      {
        "title": "长期价值",
        "description": "终身协助学员免费再次就业"
      }
    ],
    "teamTitle": "",
    "teamSubtitle": "",
    "team": [],
    "ctaTitle": "点击咨询详情",
    "ctaSubtitle": "无论你是想转行、还是了解行业，我们都欢迎你来聊聊。",
    "ctaPrimaryButton": "联系我们",
    "ctaSecondaryButton": "点击聊聊"
  },
  "partnersPage": {
    "heroTitle": "校区环境&毕业合影",
    "heroSubtitle": "我们很荣幸与重视长期价值和清晰体验的团队一起工作。",
    "approachTitle": "我们的优势",
    "approachDescription": "",
    "approachItems": [
      {
        "title": "免费试听1周",
        "description": "免费试听1周，包含免费住宿"
      },
      {
        "title": "保障就业",
        "description": "签订就业合同，保证就业"
      },
      {
        "title": "终身售后",
        "description": "就业之后，提供终身免费售后，免费二次就业"
      }
    ],
    "approachImage": "https://jkyc2017.com/uploads/1778324097922-moy893sypv57ip.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "benefitsTitle": "就业方向",
    "benefitsSubtitle": "成为车载测试工程师，你可以选择这些方向就业。",
    "benefits": [
      {
        "title": "智能驾驶测试工程师",
        "description": "NOA高速领航，CNOA城市领航，LCC车道保持，ACC自适应巡航，AEB主动安全等"
      },
      {
        "title": "智能座舱测试工程师",
        "description": "导航，仪表，中控，语音助手，OTS升级，TBOX测试，远程车控等"
      },
      {
        "title": "车身域测试工程师",
        "description": "雨刮，车窗，防盗，门锁，座椅，空调等"
      },
      {
        "title": "动力底盘测试工程师",
        "description": "充放电，预约充电，智能补电，能量回收，驾驶模式，AutoHold，EPB，ABS，EPS，ESC等"
      },
      {
        "title": "HIL测试工程师",
        "description": "BMS-HIL，VCU-HIL，车身HIL等"
      },
      {
        "title": "诊断测试工程师",
        "description": "UDS诊断，UDS诊断自动化"
      }
    ],
    "ctaTitle": "点击报名咨询",
    "ctaSubtitle": "如果你正在寻找一家专业的车载测试培训机构，请联系我们",
    "ctaButton": "开启对话",
    "ctaImage": "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  "contact": {
    "heroTitle": "联系我们",
    "heroSubtitle": "告诉我们你的年龄和学历，我们会尽快回复。",
    "formTitle": "联系我们",
    "successTitle": "提交成功",
    "successMessage": "你的消息已经保存，我们会尽快与你联系。",
    "sendAnotherLabel": "继续发送",
    "submitLabel": "发送消息",
    "submittingLabel": "正在发送...",
    "fields": {
      "name": "姓名",
      "namePlaceholder": "请输入你的姓名",
      "nameRequired": true,
      "email": "年龄(必填)",
      "emailPlaceholder": "请输入你的年龄",
      "emailRequired": true,
      "phone": "电话（必填）",
      "phonePlaceholder": "请输入联系电话",
      "phoneRequired": true,
      "company": "地区（选填）",
      "companyPlaceholder": "请输入所在地区",
      "companyRequired": false,
      "message": "需求说明",
      "messagePlaceholder": "请简单描述项目背景、目标和时间安排",
      "messageRequired": false
    },
    "infoTitle": "联系信息",
    "labels": {
      "email": "邮箱",
      "phone": "电话",
      "address": "地址",
      "hours": "工作时间",
      "follow": "关注我们"
    },
    "info": {
      "email": "NUC666888@163.com",
      "phone": "13817174127 /  13641053194",
      "addressLines": [
        "河南省周口市扶沟县交通路1号云创职业培训学校"
      ],
      "hoursLines": [
        "周一至周六：08:30 - 20:30"
      ],
      "socialLinks": [
        {
          "name": "抖音",
          "href": "#",
          "icon": "qq",
          "qrCode": "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=jkyc-qq"
        },
        {
          "name": "微信",
          "href": "#",
          "icon": "wechat",
          "qrCode": "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=jkyc-wechat"
        }
      ]
    },
    "image": "https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "faqTitle": "常见问题",
    "faqSubtitle": "你可能关心的问题，我们先整理在这里。",
    "faqs": [
      {
        "question": "报名条件是什么",
        "answer": "招生要求年龄20-34岁，大专及其以上学历"
      },
      {
        "question": "学习周期是多久",
        "answer": "学习周期是2个月左右，包含理论和实操"
      },
      {
        "question": "是否提供免费住宿",
        "answer": "学习期间住宿免费提供"
      },
      {
        "question": "就业有没有保障",
        "answer": "提供保证就业服务，会签署就业保障协议(协议可联系老师查看)"
      },
      {
        "question": "都学习哪些课程",
        "answer": "学习内容涵盖五大域和HIL，详细课程大纲可联系老师获取"
      },
      {
        "question": "是否提供内推机会",
        "answer": "我们合作了50+企业，在投递简历之前，学校都会先内推"
      }
    ]
  },
  "partners": [
    {
      "name": "教室",
      "logo": "https://jkyc2017.com/uploads/1778136828288-mov4r9movvmp8c.png?auto=compress&cs=tinysrgb&w=160&h=100&dpr=2",
      "category": "校区环境",
      "categoryOrder": 1
    },
    {
      "name": "走廊",
      "logo": "https://jkyc2017.com/uploads/1778136868971-mov4s50rh2cp46.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "校区环境",
      "categoryOrder": 1
    },
    {
      "name": "环境走廊",
      "logo": "https://jkyc2017.com/uploads/1778136900425-mov4staijscj8o.png?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "校区环境",
      "categoryOrder": 2
    },
    {
      "name": "咨询室",
      "logo": "https://jkyc2017.com/uploads/1778136968213-mov4u9lh5fseyp.png?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "校区环境",
      "categoryOrder": 2
    },
    {
      "name": "形象墙",
      "logo": "https://jkyc2017.com/uploads/1778136991191-mov4urbrqrzv47.png?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "校区环境",
      "categoryOrder": 3
    },
    {
      "name": "前台",
      "logo": "https://jkyc2017.com/uploads/1778137007803-mov4v457h8zy3w.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "校区环境",
      "categoryOrder": 1
    },
    {
      "name": "毕业合影A",
      "logo": "https://jkyc2017.com/uploads/1778322494116-moy7aqasdwgkfj.png?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
      "category": "毕业合影",
      "categoryOrder": 2
    },
    {
      "name": "毕业合影B",
      "logo": "https://jkyc2017.com/uploads/1778816982473-mp6dpbyhwnymqc.jpg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
      "category": "毕业合影",
      "categoryOrder": 2
    },
    {
      "name": "毕业合影C",
      "logo": "https://jkyc2017.com/uploads/1778817032717-mp6dqeq5iovu13.jpg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
      "category": "毕业合影",
      "categoryOrder": 2
    },
    {
      "name": "毕业合影D",
      "logo": "https://jkyc2017.com/uploads/1778817120772-mp6dsao49klin4.jpg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
      "category": "毕业合影",
      "categoryOrder": 2
    },
    {
      "name": "毕业合影E",
      "logo": "https://jkyc2017.com/uploads/1778817146533-mp6dsujp94de8e.jpg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
      "category": "毕业合影",
      "categoryOrder": 2
    },
    {
      "name": "毕业合影F",
      "logo": "https://jkyc2017.com/uploads/1778817167182-mp6dtahagm1b2l.jpg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
      "category": "毕业合影",
      "categoryOrder": 2
    },
    {
      "name": "毕业合影G",
      "logo": "https://jkyc2017.com/uploads/1778817187304-mp6dtq086w204s.jpg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
      "category": "毕业合影",
      "categoryOrder": 2
    },
    {
      "name": "毕业合影H",
      "logo": "https://jkyc2017.com/uploads/1778817211838-mp6du8xqu336jn.jpg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
      "category": "毕业合影",
      "categoryOrder": 2
    },
    {
      "name": "毕业合影I",
      "logo": "https://jkyc2017.com/uploads/1778817237493-mp6dusqdtdo1h6.jpg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1",
      "category": "毕业合影",
      "categoryOrder": 2
    },
    {
      "name": "智驾10.5k",
      "logo": "https://jkyc2017.com/uploads/1779963807870-mppchs3iahghu1.jpg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "OFFER展示",
      "categoryOrder": 3
    },
    {
      "name": "吉利12k",
      "logo": "https://jkyc2017.com/uploads/1779963929338-mppckdtnwzfgaz.jpg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "OFFER展示",
      "categoryOrder": 3
    },
    {
      "name": "理想HIL-13k-13薪",
      "logo": "https://jkyc2017.com/uploads/1779964023393-mppcmee9b4tvpu.jpg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "OFFER展示",
      "categoryOrder": 3
    },
    {
      "name": "奇瑞车身13.5k",
      "logo": "https://jkyc2017.com/uploads/1779964107955-mppco7n7p7vxwh.jpg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "OFFER展示",
      "categoryOrder": 3
    },
    {
      "name": "杭州9.5k",
      "logo": "https://jkyc2017.com/uploads/1779964200192-mppcq6tcntblri.jpg?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "OFFER展示",
      "categoryOrder": 3
    },
    {
      "name": "前台",
      "logo": "https://jkyc2017.com/uploads/1780023369115-mpqbydujdtqrmj.png?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "校区环境",
      "categoryOrder": 1
    },
    {
      "name": "实验室2",
      "logo": "https://jkyc2017.com/uploads/1780023633957-mpqc4279xlsv2q.png?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "校区环境",
      "categoryOrder": 1
    },
    {
      "name": "走廊",
      "logo": "https://jkyc2017.com/uploads/1780023706379-mpqc5m2zxuojma.png?auto=compress&cs=tinysrgb&w=1600&h=1000&dpr=2",
      "category": "校区环境",
      "categoryOrder": 1
    }
  ],
  "projects": [
    {
      "id": "eco-habitat",
      "title": "CANoe仪表专项实操",
      "category": "总线相关实操",
      "description": "  ",
      "image": "https://jkyc2017.com/uploads/1778238208011-mowt46q3yoezas.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [
        "工程仪表",
        "正版CANoe"
      ],
      "detailIntro": " ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "artisan-cafe",
      "title": "台架实操",
      "category": "座舱域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778238264294-mowt5e5ikzr146.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "summit-events",
      "title": "车窗防夹",
      "category": "车身域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778238725034-mowtf9nucm3stk.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "L4-test",
      "title": "无人小车",
      "category": "L4无人小车实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778238793295-mowtgqbz5wmvn4.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "linux-test",
      "title": "Linux实操",
      "category": "命令实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778238925554-mowtjkdujupx1u.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "Lin-test",
      "title": "LIN实操",
      "category": "总线相关实操",
      "description": "    ",
      "image": "https://jkyctest.dasb.cn/uploads/1778239107103-mowtnggv0hqu6z.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "UDS-test",
      "title": "UDS实操",
      "category": "总线相关实操",
      "description": "  ",
      "image": "https://jkyc2017.com/uploads/1778239142423-mowto7pz2613go.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "shiboqi-test",
      "title": "示波器实操",
      "category": "总线相关实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778239166852-mowtoqkklav0ec.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "ZCAN-test",
      "title": "周立功实操",
      "category": "总线相关实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778239183866-mowtp3p6iy07kk.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "nova-finance",
      "title": "实车CANoe实操",
      "category": "座舱域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778239645469-mowtyzvhhkgdxq.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "zuocang-test",
      "title": "导航实操",
      "category": "座舱域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778321336529-moy6lx3lzk1ot8.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "yingyin-test",
      "title": "影音娱乐实操",
      "category": "座舱域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778321454770-moy6ogc2f506bu.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "leader-test",
      "title": "雷达摄像头实操",
      "category": "座舱域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778321556945-moy6qn69cbgsir.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "aeb-test",
      "title": "AEB假人假车实操",
      "category": "智驾域实操",
      "description": "  ",
      "image": "https://jkyc2017.com/uploads/1778321684132-moy6tdb8epo549.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "adb-test",
      "title": "ADB命令实操",
      "category": "命令实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778321743959-moy6unh3ag6ljf.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "apa-test",
      "title": "APA实操",
      "category": "智驾域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778321813745-moy6w5blj7vu0d.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "DOW-test",
      "title": "DOW实操",
      "category": "智驾域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778321868014-moy6xb72354h39.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "NOA-test",
      "title": "NOA实操",
      "category": "智驾域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778321907375-moy6y5kf3bajfz.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "weimen-test",
      "title": "尾门防夹",
      "category": "车身域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778321975475-moy6zm432o12ad.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "mensuo-test",
      "title": "门锁实操",
      "category": "车身域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778322016542-moy70hsuof0wln.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "zidong-test",
      "title": "自动大灯实操",
      "category": "车身域实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778322050326-moy717va5wslug.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    },
    {
      "id": "HIL-test",
      "title": "HIL机柜实操",
      "category": "HIL机柜实操",
      "description": "   ",
      "image": "https://jkyc2017.com/uploads/1778322306755-moy76pqbpkcxlq.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "tags": [],
      "detailIntro": "  ",
      "detailSections": [],
      "detailConclusion": "  "
    }
  ]
}

type PlainObject = Record<string, unknown>

export function normalizeCategoryLabel(category: unknown): string {
  return String(category ?? '').trim().replace(/\s+/g, ' ')
}

function isPlainObject(value: unknown): value is PlainObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function mergeContentValue<T>(defaults: T, value: unknown): T {
  if (Array.isArray(defaults)) return (Array.isArray(value) ? value : defaults) as T
  if (isPlainObject(defaults)) {
    const source = isPlainObject(value) ? value : {}
    return Object.fromEntries(
      Object.entries(defaults).map(([key, defaultValue]) => [key, mergeContentValue(defaultValue, source[key])])
    ) as T
  }
  return (value === undefined || value === null ? defaults : value) as T
}

function normalizePartners(partners: Partner[]): Partner[] {
  return partners.map((partner, index) => {
    const fallback = defaultSiteContent.partners[index] || defaultSiteContent.partners[0]
    return {
      name: partner.name || fallback.name,
      logo: partner.logo || fallback.logo,
      category: partner.category || fallback.category || '未分类',
      categoryOrder: typeof partner.categoryOrder === 'number' ? partner.categoryOrder : (fallback.categoryOrder ?? 0)
    }
  })
}

function normalizeProjects(projects: Project[]): Project[] {
  return projects.map((project, index) => {
    const fallback = defaultSiteContent.projects[index] || defaultSiteContent.projects[0]
    return {
      ...project,
      id: project.id || fallback.id,
      title: project.title || fallback.title,
      category: normalizeCategoryLabel(project.category) || fallback.category,
      description: project.description || fallback.description,
      image: project.image || fallback.image,
      tags: Array.isArray(project.tags) ? project.tags : fallback.tags,
      detailIntro: project.detailIntro || fallback.detailIntro,
      detailSections: Array.isArray(project.detailSections) ? project.detailSections : fallback.detailSections,
      detailConclusion: project.detailConclusion || fallback.detailConclusion
    }
  })
}

function collectProjectCategories(projects: Project[], categories: unknown[]): string[] {
  const names = [
    ...categories,
    ...projects.map((project) => project.category)
  ].map(normalizeCategoryLabel).filter(Boolean)

  return Array.from(new Map(names.map((name) => [name, name])).values())
}

function normalizeSocialLinks(links: SocialLink[]): SocialLink[] {
  const defaults = defaultSiteContent.contact.info.socialLinks
  const source = Array.isArray(links) && links.length > 0 ? links : defaults
  const hasQrConfig = source.some((link) => link.icon || link.qrCode)
  const selected = hasQrConfig ? source : defaults

  return selected.slice(0, 2).map((link, index) => {
    const fallback = defaults[index] || defaults[0]
    const icon = link.icon === 'wechat' || link.icon === 'qq' ? link.icon : fallback.icon
    return {
      name: link.name || fallback.name,
      href: link.href || fallback.href || '#',
      icon,
      qrCode: link.qrCode || fallback.qrCode || ''
    }
  })
}

export function normalizeSiteContent(content: unknown): SiteContent {
  const merged = mergeContentValue(defaultSiteContent, content)
  const fields = merged.contact.fields
  const source = isPlainObject(content) ? content : {}
  const sourceProjectCategories = Array.isArray(source.projectCategories) ? source.projectCategories : []
  const projects = normalizeProjects(merged.projects)

  return {
    ...merged,
    site: {
      ...merged.site,
      faviconUrl: merged.site.faviconUrl || defaultSiteContent.site.faviconUrl
    },
    projectCategories: collectProjectCategories(projects, sourceProjectCategories),
    projects,
    partners: normalizePartners(merged.partners),
    contact: {
      ...merged.contact,
      fields: {
        ...fields,
        nameRequired: fields.nameRequired !== false,
        emailRequired: fields.emailRequired !== false,
        phoneRequired: fields.phoneRequired === true,
        companyRequired: fields.companyRequired === true,
        messageRequired: fields.messageRequired !== false
      },
      info: {
        ...merged.contact.info,
        socialLinks: normalizeSocialLinks(merged.contact.info.socialLinks)
      }
    }
  }
}
