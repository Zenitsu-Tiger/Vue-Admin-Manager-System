/**
 * Mock 数据统一出口
 * 用于面试展示，无需后端接口
 */

// 用户数据
export const mockUsers = [
  {
    id: 1,
    name: 'admin',
    realname: '系统管理员',
    cellphone: '13800138000',
    enable: 1,
    departmentId: 1,
    role_id: 1,
    createAt: '2023-10-01T10:00:00.000Z',
    updateAt: '2023-12-01T15:30:00.000Z'
  },
  {
    id: 2,
    name: 'manager',
    realname: '项目经理',
    cellphone: '13900139000',
    enable: 1,
    departmentId: 2,
    role_id: 2,
    createAt: '2023-10-15T09:00:00.000Z',
    updateAt: '2023-11-20T14:00:00.000Z'
  },
  {
    id: 3,
    name: 'developer',
    realname: '前端开发',
    cellphone: '13700137000',
    enable: 1,
    departmentId: 3,
    role_id: 3,
    createAt: '2023-11-01T11:30:00.000Z',
    updateAt: '2023-11-25T16:45:00.000Z'
  },
  {
    id: 4,
    name: 'tester',
    realname: '测试工程师',
    cellphone: '13600136000',
    enable: 0,
    departmentId: 3,
    role_id: 4,
    createAt: '2023-11-10T08:00:00.000Z',
    updateAt: '2023-11-30T10:00:00.000Z'
  },
  {
    id: 5,
    name: 'designer',
    realname: 'UI设计师',
    cellphone: '13500135000',
    enable: 1,
    departmentId: 4,
    role_id: 5,
    createAt: '2023-11-15T14:00:00.000Z',
    updateAt: '2023-12-02T09:30:00.000Z'
  }
]

// 项目数据
export const mockProjects = [
  {
    id: 1,
    name: 'Vue Admin Manager System',
    description: '基于Vue3的后台管理系统',
    status: 'active',
    progress: 85,
    priority: 'high',
    leader: '系统管理员',
    teamSize: 5,
    startDate: '2023-08-01',
    endDate: '2024-02-01',
    budget: 500000,
    spent: 425000,
    tags: ['Vue3', 'TypeScript', 'Pinia'],
    createAt: '2023-08-01T10:00:00.000Z',
    updateAt: '2023-12-01T15:30:00.000Z'
  },
  {
    id: 2,
    name: '电商平台升级项目',
    description: '老系统重构，使用微前端架构',
    status: 'active',
    progress: 60,
    priority: 'high',
    leader: '项目经理',
    teamSize: 8,
    startDate: '2023-09-15',
    endDate: '2024-03-15',
    budget: 800000,
    spent: 480000,
    tags: ['微前端', 'Qiankun', 'React'],
    createAt: '2023-09-15T10:00:00.000Z',
    updateAt: '2023-11-28T16:00:00.000Z'
  },
  {
    id: 3,
    name: '移动端App开发',
    description: 'React Native跨平台应用',
    status: 'pending',
    progress: 25,
    priority: 'medium',
    leader: '前端开发',
    teamSize: 4,
    startDate: '2023-11-01',
    endDate: '2024-05-01',
    budget: 350000,
    spent: 87500,
    tags: ['React Native', 'TypeScript', 'Redux'],
    createAt: '2023-11-01T08:00:00.000Z',
    updateAt: '2023-11-30T12:00:00.000Z'
  },
  {
    id: 4,
    name: '数据可视化平台',
    description: 'BI看板与数据分析平台',
    status: 'completed',
    progress: 100,
    priority: 'low',
    leader: 'UI设计师',
    teamSize: 3,
    startDate: '2023-06-01',
    endDate: '2023-10-30',
    budget: 200000,
    spent: 185000,
    tags: ['ECharts', 'D3.js', 'Vue3'],
    createAt: '2023-06-01T10:00:00.000Z',
    updateAt: '2023-10-30T18:00:00.000Z'
  },
  {
    id: 5,
    name: '客户关系管理系统',
    description: 'CRM系统全新打造',
    status: 'active',
    progress: 45,
    priority: 'medium',
    leader: '项目经理',
    teamSize: 6,
    startDate: '2023-10-01',
    endDate: '2024-04-01',
    budget: 600000,
    spent: 270000,
    tags: ['Vue3', 'Element Plus', 'Node.js'],
    createAt: '2023-10-01T09:00:00.000Z',
    updateAt: '2023-12-01T14:30:00.000Z'
  }
]

// 销售数据 - 用于图表展示
export const mockSalesData = {
  // 月度销售趋势
  monthlyTrend: {
    categories: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月'
    ],
    series: [
      {
        name: '销售额',
        data: [120, 132, 101, 134, 190, 230, 210, 182, 191, 234, 290, 330]
      },
      {
        name: '订单量',
        data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149]
      }
    ]
  },
  // 产品分类占比
  categoryDistribution: [
    { value: 1048, name: '电子产品', color: '#5470c6' },
    { value: 735, name: '服装配饰', color: '#91cc75' },
    { value: 580, name: '食品饮料', color: '#fac858' },
    { value: 484, name: '家居用品', color: '#ee6666' },
    { value: 300, name: '运动户外', color: '#73c0de' }
  ],
  // 区域销售排名
  regionRanking: [
    { name: '华东区', value: 38245, percentage: 32 },
    { name: '华南区', value: 29834, percentage: 25 },
    { name: '华北区', value: 22156, percentage: 18 },
    { name: '西南区', value: 15678, percentage: 13 },
    { name: '其他', value: 14087, percentage: 12 }
  ],
  // 实时数据统计
  realtimeStats: {
    totalSales: 1289456,
    totalOrders: 8934,
    avgOrderValue: 144.3,
    conversionRate: 3.2,
    newCustomers: 1256,
    returnRate: 2.1
  }
}

// 任务数据
export const mockTasks = [
  {
    id: 1,
    title: '完成首页UI设计',
    description: '设计系统首页的整体布局和交互',
    status: 'completed',
    priority: 'high',
    assignee: 'UI设计师',
    dueDate: '2023-11-30',
    tags: ['设计', 'UI'],
    progress: 100
  },
  {
    id: 2,
    title: '开发用户管理模块',
    description: '实现用户的增删改查功能',
    status: 'in_progress',
    priority: 'high',
    assignee: '前端开发',
    dueDate: '2023-12-15',
    tags: ['开发', '功能'],
    progress: 70
  },
  {
    id: 3,
    title: '编写单元测试',
    description: '为核心模块编写Jest单元测试',
    status: 'in_progress',
    priority: 'medium',
    assignee: '测试工程师',
    dueDate: '2023-12-20',
    tags: ['测试', 'Jest'],
    progress: 45
  },
  {
    id: 4,
    title: '性能优化',
    description: '优化页面加载速度和渲染性能',
    status: 'pending',
    priority: 'medium',
    assignee: '前端开发',
    dueDate: '2023-12-25',
    tags: ['优化', '性能'],
    progress: 0
  },
  {
    id: 5,
    title: '文档编写',
    description: '编写项目技术文档和API文档',
    status: 'pending',
    priority: 'low',
    assignee: '系统管理员',
    dueDate: '2024-01-05',
    tags: ['文档'],
    progress: 0
  }
]

// 日志数据
export const mockLogs = [
  {
    id: 1,
    type: 'info',
    message: '用户 admin 登录系统',
    time: '2023-12-03 09:30:15',
    module: '认证模块'
  },
  {
    id: 2,
    type: 'success',
    message: '数据备份完成',
    time: '2023-12-03 08:00:00',
    module: '系统模块'
  },
  {
    id: 3,
    type: 'warning',
    message: '服务器负载较高 (85%)',
    time: '2023-12-03 07:45:22',
    module: '监控模块'
  },
  {
    id: 4,
    type: 'error',
    message: 'API请求超时: /api/users/list',
    time: '2023-12-02 23:12:45',
    module: '网络模块'
  },
  {
    id: 5,
    type: 'info',
    message: '新用户注册: developer02',
    time: '2023-12-02 18:30:00',
    module: '用户模块'
  },
  {
    id: 6,
    type: 'success',
    message: '定时任务执行成功',
    time: '2023-12-02 12:00:00',
    module: '定时任务'
  },
  {
    id: 7,
    type: 'warning',
    message: '数据库连接池使用率 75%',
    time: '2023-12-02 11:30:15',
    module: '数据库模块'
  },
  {
    id: 8,
    type: 'info',
    message: '系统配置更新',
    time: '2023-12-02 10:00:00',
    module: '系统模块'
  }
]

// 通知数据
export const mockNotifications = [
  {
    id: 1,
    title: '系统更新通知',
    content: '系统将于今晚22:00进行版本升级',
    type: 'system',
    read: false,
    time: '10分钟前'
  },
  {
    id: 2,
    title: '任务提醒',
    content: '您有3个待处理的任务即将到期',
    type: 'task',
    read: false,
    time: '30分钟前'
  },
  {
    id: 3,
    title: '审批通知',
    content: '您的请假申请已通过审批',
    type: 'approval',
    read: true,
    time: '2小时前'
  },
  {
    id: 4,
    title: '新消息',
    content: '项目经理给您发送了一条消息',
    type: 'message',
    read: true,
    time: '昨天'
  },
  {
    id: 5,
    title: '安全提醒',
    content: '检测到异地登录，请确认是否为本人操作',
    type: 'security',
    read: false,
    time: '2天前'
  }
]

// 雷达图数据 - 技能评估
export const mockSkillsData = {
  indicators: [
    { name: 'Vue.js', max: 100 },
    { name: 'TypeScript', max: 100 },
    { name: 'Node.js', max: 100 },
    { name: 'React', max: 100 },
    { name: '工程化', max: 100 },
    { name: '性能优化', max: 100 }
  ],
  series: [
    { name: '当前水平', value: [92, 88, 75, 70, 85, 80] },
    { name: '目标水平', value: [95, 95, 90, 85, 95, 90] }
  ]
}

// 地图数据
export const mockMapData = [
  { name: '北京', value: 2890 },
  { name: '上海', value: 3450 },
  { name: '广东', value: 4200 },
  { name: '浙江', value: 2100 },
  { name: '江苏', value: 1950 },
  { name: '四川', value: 1670 },
  { name: '湖北', value: 1320 },
  { name: '山东', value: 1850 },
  { name: '河南', value: 1100 },
  { name: '福建', value: 980 }
]

// 热力图数据
export const mockHeatmapData = (() => {
  const data: number[][] = []
  const hours = [
    '12a',
    '1a',
    '2a',
    '3a',
    '4a',
    '5a',
    '6a',
    '7a',
    '8a',
    '9a',
    '10a',
    '11a',
    '12p',
    '1p',
    '2p',
    '3p',
    '4p',
    '5p',
    '6p',
    '7p',
    '8p',
    '9p',
    '10p',
    '11p'
  ]
  const days = ['周六', '周五', '周四', '周三', '周二', '周一', '周日']

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 24; j++) {
      data.push([j, i, Math.floor(Math.random() * 10)])
    }
  }
  return { hours, days, data }
})()

// 仪表盘数据
export const mockGaugeData = {
  cpu: 68,
  memory: 72,
  disk: 45,
  network: 35
}

// 时间线数据
export const mockTimelineData = [
  {
    time: '2023-12-01',
    title: '项目启动',
    content: '项目正式立项，组建开发团队',
    type: 'primary'
  },
  {
    time: '2023-12-05',
    title: '需求评审',
    content: '完成产品需求文档评审，确定功能范围',
    type: 'success'
  },
  {
    time: '2023-12-10',
    title: '技术选型',
    content: '确定使用Vue3 + TypeScript + Pinia技术栈',
    type: 'info'
  },
  {
    time: '2023-12-15',
    title: '原型设计',
    content: 'UI原型设计完成，开始前端开发',
    type: 'warning'
  },
  {
    time: '2023-12-20',
    title: '开发阶段',
    content: '核心功能模块开发中...',
    type: 'primary'
  }
]

// ==================== 充电桩管理系统 Mock 数据 ====================

// 充电站类型/分类数据
export const mockChargingStationTypes = [
  {
    id: 1,
    name: '公共充电站',
    code: 'PUBLIC',
    icon: 'Location',
    description: '面向社会公众开放的充电站，支持多种支付方式',
    stationCount: 156,
    pileCount: 892,
    color: '#409eff',
    sort: 1,
    enable: 1,
    createAt: '2023-01-15T10:00:00.000Z',
    updateAt: '2023-12-01T15:30:00.000Z'
  },
  {
    id: 2,
    name: '专用充电站',
    code: 'PRIVATE',
    icon: 'OfficeBuilding',
    description: '企业、单位专用充电站，需授权使用',
    stationCount: 89,
    pileCount: 423,
    color: '#67c23a',
    sort: 2,
    enable: 1,
    createAt: '2023-02-20T09:00:00.000Z',
    updateAt: '2023-11-20T14:00:00.000Z'
  },
  {
    id: 3,
    name: '住宅充电站',
    code: 'RESIDENTIAL',
    icon: 'House',
    description: '小区、住宅区配套充电设施',
    stationCount: 234,
    pileCount: 1156,
    color: '#e6a23c',
    sort: 3,
    enable: 1,
    createAt: '2023-03-10T11:30:00.000Z',
    updateAt: '2023-11-25T16:45:00.000Z'
  },
  {
    id: 4,
    name: '商业充电站',
    code: 'COMMERCIAL',
    icon: 'Shop',
    description: '商场、写字楼等商业区域充电站',
    stationCount: 67,
    pileCount: 334,
    color: '#f56c6c',
    sort: 4,
    enable: 1,
    createAt: '2023-04-05T08:00:00.000Z',
    updateAt: '2023-11-30T10:00:00.000Z'
  },
  {
    id: 5,
    name: '高速服务区',
    code: 'HIGHWAY',
    icon: 'Van',
    description: '高速公路服务区快充站',
    stationCount: 45,
    pileCount: 268,
    color: '#909399',
    sort: 5,
    enable: 1,
    createAt: '2023-05-18T14:00:00.000Z',
    updateAt: '2023-12-02T09:30:00.000Z'
  }
]

// 充电站数据
export const mockChargingStations = [
  {
    id: 1,
    name: '科技园A区充电站',
    code: 'ST-2023-001',
    typeId: 1,
    typeName: '公共充电站',
    address: '深圳市南山区科技园南区A座',
    longitude: 113.9446,
    latitude: 22.5329,
    pileCount: 12,
    availableCount: 8,
    chargingCount: 3,
    faultCount: 1,
    status: 'online',
    operatorName: '特来电',
    servicePhone: '400-001-0001',
    openTime: '00:00-24:00',
    parkingFee: 5,
    electricityPrice: 1.2,
    serviceFee: 0.8,
    images: ['https://picsum.photos/400/300?random=1'],
    rating: 4.8,
    monthlyOrders: 2456,
    monthlyRevenue: 89650,
    createAt: '2023-01-15T10:00:00.000Z',
    updateAt: '2023-12-03T08:30:00.000Z'
  },
  {
    id: 2,
    name: '华强北商圈充电站',
    code: 'ST-2023-002',
    typeId: 4,
    typeName: '商业充电站',
    address: '深圳市福田区华强北路赛格广场',
    longitude: 114.0879,
    latitude: 22.5469,
    pileCount: 20,
    availableCount: 12,
    chargingCount: 6,
    faultCount: 2,
    status: 'online',
    operatorName: '星星充电',
    servicePhone: '400-002-0002',
    openTime: '06:00-24:00',
    parkingFee: 10,
    electricityPrice: 1.5,
    serviceFee: 0.6,
    images: ['https://picsum.photos/400/300?random=2'],
    rating: 4.5,
    monthlyOrders: 3890,
    monthlyRevenue: 156780,
    createAt: '2023-02-20T09:00:00.000Z',
    updateAt: '2023-12-02T16:00:00.000Z'
  },
  {
    id: 3,
    name: '万科城花园充电站',
    code: 'ST-2023-003',
    typeId: 3,
    typeName: '住宅充电站',
    address: '深圳市龙华区万科城花园B区地下停车场',
    longitude: 114.0239,
    latitude: 22.6556,
    pileCount: 8,
    availableCount: 5,
    chargingCount: 2,
    faultCount: 1,
    status: 'online',
    operatorName: '云快充',
    servicePhone: '400-003-0003',
    openTime: '00:00-24:00',
    parkingFee: 0,
    electricityPrice: 0.9,
    serviceFee: 0.5,
    images: ['https://picsum.photos/400/300?random=3'],
    rating: 4.6,
    monthlyOrders: 1234,
    monthlyRevenue: 34560,
    createAt: '2023-03-10T11:30:00.000Z',
    updateAt: '2023-12-01T12:00:00.000Z'
  },
  {
    id: 4,
    name: '腾讯大厦专用站',
    code: 'ST-2023-004',
    typeId: 2,
    typeName: '专用充电站',
    address: '深圳市南山区高新科技园腾讯大厦',
    longitude: 113.9356,
    latitude: 22.5403,
    pileCount: 30,
    availableCount: 18,
    chargingCount: 10,
    faultCount: 2,
    status: 'online',
    operatorName: '内部运营',
    servicePhone: '0755-12345678',
    openTime: '07:00-22:00',
    parkingFee: 0,
    electricityPrice: 0.8,
    serviceFee: 0,
    images: ['https://picsum.photos/400/300?random=4'],
    rating: 4.9,
    monthlyOrders: 4567,
    monthlyRevenue: 112340,
    createAt: '2023-04-05T08:00:00.000Z',
    updateAt: '2023-12-03T09:30:00.000Z'
  },
  {
    id: 5,
    name: '深汕高速服务区站',
    code: 'ST-2023-005',
    typeId: 5,
    typeName: '高速服务区',
    address: '深汕高速惠东服务区',
    longitude: 114.8927,
    latitude: 22.9876,
    pileCount: 16,
    availableCount: 10,
    chargingCount: 4,
    faultCount: 2,
    status: 'online',
    operatorName: '国家电网',
    servicePhone: '95598',
    openTime: '00:00-24:00',
    parkingFee: 0,
    electricityPrice: 1.8,
    serviceFee: 0.8,
    images: ['https://picsum.photos/400/300?random=5'],
    rating: 4.3,
    monthlyOrders: 2890,
    monthlyRevenue: 145600,
    createAt: '2023-05-18T14:00:00.000Z',
    updateAt: '2023-12-02T14:30:00.000Z'
  },
  {
    id: 6,
    name: '宝安机场T3充电站',
    code: 'ST-2023-006',
    typeId: 1,
    typeName: '公共充电站',
    address: '深圳市宝安区宝安国际机场T3航站楼P3停车场',
    longitude: 113.8147,
    latitude: 22.6397,
    pileCount: 24,
    availableCount: 14,
    chargingCount: 8,
    faultCount: 2,
    status: 'online',
    operatorName: '南方电网',
    servicePhone: '95598',
    openTime: '00:00-24:00',
    parkingFee: 15,
    electricityPrice: 1.6,
    serviceFee: 0.7,
    images: ['https://picsum.photos/400/300?random=6'],
    rating: 4.7,
    monthlyOrders: 5678,
    monthlyRevenue: 234560,
    createAt: '2023-06-01T10:00:00.000Z',
    updateAt: '2023-12-03T10:00:00.000Z'
  }
]

// 充电桩设备数据 - 使用生成函数创建 300 条数据（演示虚拟滚动）
export const mockChargingPiles = (() => {
  // 基础配置数据
  const stations = [
    { id: 1, name: '科技园A区充电站' },
    { id: 2, name: '华强北商圈充电站' },
    { id: 3, name: '万科城花园充电站' },
    { id: 4, name: '腾讯大厦专用站' },
    { id: 5, name: '深汕高速服务区站' },
    { id: 6, name: '宝安机场T3充电站' },
    { id: 7, name: '福田CBD充电站' },
    { id: 8, name: '南山软件园充电站' },
    { id: 9, name: '龙岗大运中心站' },
    { id: 10, name: '罗湖火车站充电站' }
  ]

  const pileTypes = [
    {
      type: 'DC',
      typeName: '直流快充',
      power: 120,
      voltage: 750,
      current: 200
    },
    { type: 'AC', typeName: '交流慢充', power: 7, voltage: 220, current: 32 },
    {
      type: 'DC',
      typeName: '超级快充',
      power: 360,
      voltage: 1000,
      current: 500
    },
    {
      type: 'DC',
      typeName: '液冷超充',
      power: 600,
      voltage: 1000,
      current: 600
    },
    {
      type: 'DC',
      typeName: '一体式快充',
      power: 180,
      voltage: 750,
      current: 250
    },
    { type: 'AC', typeName: '交流快充', power: 22, voltage: 380, current: 63 }
  ]

  const manufacturers = [
    '特来电',
    '星星充电',
    '云快充',
    '华为',
    '国家电网',
    '南方电网',
    '小桔充电',
    '蔚来能源'
  ]
  const statuses = ['available', 'charging', 'fault', 'occupied']
  const networkStatuses = ['online', 'offline']
  const connectorTypes = ['GB/T', 'Type2', 'CCS2', 'CHAdeMO']

  // 生成 300 条数据
  const piles = []
  for (let i = 1; i <= 300; i++) {
    const station = stations[Math.floor(Math.random() * stations.length)]
    const pileType = pileTypes[Math.floor(Math.random() * pileTypes.length)]
    const manufacturer =
      manufacturers[Math.floor(Math.random() * manufacturers.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const networkStatus =
      status === 'fault'
        ? 'offline'
        : networkStatuses[Math.floor(Math.random() * 10) < 9 ? 0 : 1]
    const connectorType =
      connectorTypes[Math.floor(Math.random() * connectorTypes.length)]

    // 根据状态生成今日数据
    const isFault = status === 'fault'
    const todayOrders = isFault ? 0 : Math.floor(Math.random() * 80) + 5
    const todayRevenue = isFault ? 0 : Math.floor(Math.random() * 8000) + 500
    const todayElectricity = isFault ? 0 : Math.random() * 1500 + 50
    const todayDuration = isFault ? 0 : Math.floor(Math.random() * 600) + 60

    // 累计数据
    const totalOrders = Math.floor(Math.random() * 40000) + 1000
    const totalRevenue = Math.floor(Math.random() * 2000000) + 50000

    // 日期
    const installMonth = Math.floor(Math.random() * 12) + 1
    const maintMonth = Math.floor(Math.random() * 3) + 10
    const installDate = `2023-${String(installMonth).padStart(2, '0')}-${String(
      Math.floor(Math.random() * 28) + 1
    ).padStart(2, '0')}`
    const lastMaintenance = `2023-${String(maintMonth).padStart(
      2,
      '0'
    )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`

    piles.push({
      id: i,
      code: `CP-2023-${String(i).padStart(4, '0')}`,
      name: `${pileType.typeName}桩-${String(i).padStart(2, '0')}`,
      stationId: station.id,
      stationName: station.name,
      type: pileType.type,
      typeName: pileType.typeName,
      power: pileType.power,
      voltage: pileType.voltage,
      current: pileType.current,
      connectorType,
      connectorCount:
        pileType.type === 'DC' ? Math.floor(Math.random() * 3) + 1 : 1,
      manufacturer,
      model: `${manufacturer.substring(0, 2).toUpperCase()}-${pileType.type}${pileType.power
        }`,
      serialNumber: `SN2023${String(i).padStart(4, '0')}`,
      status,
      networkStatus,
      lastHeartbeat:
        networkStatus === 'online'
          ? '2023-12-03T10:30:00.000Z'
          : '2023-12-02T18:30:00.000Z',
      todayOrders,
      todayRevenue,
      todayDuration,
      todayElectricity: Math.round(todayElectricity * 10) / 10,
      totalOrders,
      totalRevenue,
      installDate,
      lastMaintenance,
      createAt: `${installDate}T10:00:00.000Z`,
      updateAt: '2023-12-03T10:30:00.000Z'
    })
  }

  return piles
})()

// 充电统计数据
export const mockChargingStats = {
  // 今日统计
  today: {
    totalOrders: 1234,
    totalRevenue: 56789,
    totalElectricity: 12345.6,
    totalDuration: 4567,
    avgDuration: 37,
    avgElectricity: 10.0,
    peakHour: '18:00-19:00',
    utilizationRate: 68.5
  },
  // 本月统计
  month: {
    totalOrders: 34567,
    totalRevenue: 1567890,
    totalElectricity: 345678.9,
    orderGrowth: 12.5,
    revenueGrowth: 15.8,
    electricityGrowth: 11.2
  },
  // 设备状态统计（与 mockChargingPiles 300条数据对应）
  deviceStatus: {
    total: 300,
    available: 125,
    charging: 100,
    fault: 40,
    offline: 35,
    availableRate: 41.7,
    faultRate: 13.3
  },
  // 类型分布
  typeDistribution: [
    { name: '直流快充', value: 89, percentage: 57.1 },
    { name: '交流慢充', value: 42, percentage: 26.9 },
    { name: '超级快充', value: 15, percentage: 9.6 },
    { name: '液冷超充', value: 10, percentage: 6.4 }
  ],
  // 24小时订单趋势
  hourlyTrend: [
    { hour: '00:00', orders: 12, revenue: 456 },
    { hour: '02:00', orders: 8, revenue: 234 },
    { hour: '04:00', orders: 5, revenue: 145 },
    { hour: '06:00', orders: 23, revenue: 890 },
    { hour: '08:00', orders: 67, revenue: 3456 },
    { hour: '10:00', orders: 89, revenue: 4567 },
    { hour: '12:00', orders: 78, revenue: 3890 },
    { hour: '14:00', orders: 92, revenue: 5234 },
    { hour: '16:00', orders: 112, revenue: 6789 },
    { hour: '18:00', orders: 156, revenue: 8901 },
    { hour: '20:00', orders: 134, revenue: 7234 },
    { hour: '22:00', orders: 67, revenue: 3456 }
  ]
}
