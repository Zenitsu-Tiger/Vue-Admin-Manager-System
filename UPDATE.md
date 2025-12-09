# 项目更新日志

> 本文档记录了为面试展示新增的功能模块和修改内容

---

## 📦 新增文件清单

### Mock 数据模块
| 文件路径 | 说明 |
|---------|------|
| `src/mock/index.ts` | Mock 数据统一出口，包含所有模拟数据 |

### 功能展示模块 (story)
| 文件路径 | 说明 |
|---------|------|
| `src/views/main/story/chat/chat.vue` | 数据可视化展示页 - 高级图表展示 |
| `src/views/main/story/list/list.vue` | 项目管理展示页 - 表格/卡片/时间线视图 |
| `src/router/main/story/chat/chat.ts` | 数据可视化路由配置 |
| `src/router/main/story/list/list.ts` | 项目管理路由配置 |

### 商品中心模块 (product)
| 文件路径 | 说明 |
|---------|------|
| `src/views/main/product/category/category.vue` | 商品类别页（充电站分类管理） |
| `src/views/main/product/goods/goods.vue` | 商品信息页（充电桩设备管理） |
| `src/router/main/product/category/category.ts` | 商品类别路由配置 |
| `src/router/main/product/goods/goods.ts` | 商品信息路由配置 |

### 演示模式配置
| 文件路径 | 说明 |
|---------|------|
| `src/global/demo-mode.ts` | 演示模式开关和配置，用于绕过后端权限控制 |

---

## 🔧 修改文件清单

| 文件路径 | 修改说明 |
|---------|---------|
| `src/hooks/usePermissions.ts` | 添加演示模式权限白名单判断 |
| `src/utils/map-menus.ts` | 添加演示菜单合并逻辑，支持子菜单合并 |
| `src/components/main-menu/main-menu.vue` | 添加演示菜单合并逻辑，过滤按钮权限项 |

---

## 📊 Mock 数据说明

### 通用数据
| 数据名称 | 说明 |
|---------|------|
| `mockUsers` | 用户数据（5条） |
| `mockProjects` | 项目数据（5条） |
| `mockTasks` | 任务数据（5条） |
| `mockLogs` | 日志数据（8条） |
| `mockNotifications` | 通知数据（5条） |
| `mockTimelineData` | 时间线数据（5条） |

### 图表数据
| 数据名称 | 说明 |
|---------|------|
| `mockSalesData` | 销售数据（月度趋势、分类占比、区域排名、实时统计） |
| `mockSkillsData` | 技能雷达图数据 |
| `mockHeatmapData` | 热力图数据（24小时x7天） |
| `mockGaugeData` | 仪表盘数据（CPU/内存/磁盘/网络） |
| `mockMapData` | 地图数据（10个省份） |

### 充电桩数据
| 数据名称 | 说明 |
|---------|------|
| `mockChargingStationTypes` | 充电站分类（5种类型） |
| `mockChargingStations` | 充电站数据（6个站点） |
| `mockChargingPiles` | 充电桩设备（8台设备） |
| `mockChargingStats` | 充电统计数据（今日/本月/设备状态/类型分布） |

---

## 🎯 演示模式 - 绕过后端权限控制详解

### 背景问题

本项目采用 **RBAC（基于角色的访问控制）** 权限模型：
1. 用户登录后，后端根据用户角色返回该角色拥有的**菜单权限**和**按钮权限**
2. 前端根据后端返回的菜单动态注册路由、渲染侧边栏
3. 页面内的按钮/操作也会检查用户是否有对应权限

**问题**：新增的演示页面没有在后端配置权限，导致：
- 侧边栏不显示新菜单
- 路由无法注册，页面访问404
- 页面内按钮被权限控制隐藏

### 解决方案架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        demo-mode.ts                             │
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │
│  │ DEMO_MODE   │  │ 权限白名单       │  │ 模拟菜单数据        │  │
│  │ = true      │  │ WHITELIST       │  │ DEMO_MENUS          │  │
│  └──────┬──────┘  └────────┬────────┘  └──────────┬──────────┘  │
└─────────┼──────────────────┼─────────────────────┼──────────────┘
          │                  │                     │
          ▼                  ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│ usePermissions  │  │  map-menus.ts   │  │   main-menu.vue     │
│ 权限检查Hook    │  │  路由映射工具   │  │   侧边栏菜单组件    │
│                 │  │                 │  │                     │
│ 白名单权限直接  │  │ 合并演示菜单到  │  │ 合并演示菜单到      │
│ 返回 true       │  │ 用户菜单，注册  │  │ 用户菜单，渲染      │
│                 │  │ 动态路由        │  │ 侧边栏              │
└─────────────────┘  └─────────────────┘  └─────────────────────┘
```

---

### 核心配置文件：`src/global/demo-mode.ts`

#### 1. 开关控制
```typescript
// 一键开关演示模式
export const DEMO_MODE = true  // 设为 false 即可恢复正常权限控制
```

#### 2. 白名单配置
```typescript
// 路由前缀白名单 - 用于路由级别的权限判断
export const DEMO_ROUTE_PREFIX = ['/main/story', '/main/product']

// 权限ID白名单 - 用于按钮级别的权限判断
export const DEMO_PERMISSION_WHITELIST = [
  'story:chat', 'story:list', 'story',
  'product:category', 'product:goods', 'product'
]
```

#### 3. 权限判断函数
```typescript
// 检查权限ID是否在白名单中
export function isDemoPermission(permissionID: string): boolean {
  if (!DEMO_MODE) return false
  return DEMO_PERMISSION_WHITELIST.some(
    whitelist => permissionID.includes(whitelist) || whitelist.includes(permissionID)
  )
}
```

#### 4. 模拟菜单数据
```typescript
// 模拟后端返回的菜单结构（包含完整的权限配置）
export const DEMO_MENUS = [
  {
    id: 900,
    name: '功能展示',
    type: 1,                    // type=1 表示一级菜单
    url: '/main/story',
    icon: 'el-icon-Monitor',
    children: [
      {
        id: 901,
        url: '/main/story/chat',
        name: '数据可视化',
        type: 2,                // type=2 表示二级菜单（页面）
        children: [
          // type=3 表示按钮权限
          { id: 9011, type: 3, permission: 'story:chat:query' },
          { id: 9012, type: 3, permission: 'story:chat:create' },
          // ...
        ]
      }
    ]
  }
]
```

#### 5. 子菜单合并配置
```typescript
// 用于合并到已存在的菜单中（解决后端已返回父菜单但缺少子菜单的情况）
export const DEMO_SUB_MENUS: Record<string, any[]> = {
  '/main/product': [
    { id: 801, url: '/main/product/category', name: '商品类别', ... },
    { id: 802, url: '/main/product/goods', name: '商品信息', ... }
  ]
}
```

---

### 绕过机制一：权限检查绕过

**文件**：`src/hooks/usePermissions.ts`

**原理**：在权限检查函数中，优先判断是否为演示模式且权限ID在白名单中

```typescript
export default function usePermissions(permissionID: string) {
  // ⭐ 演示模式下，对白名单内的权限直接放行
  if (DEMO_MODE && isDemoPermission(permissionID)) {
    return true  // 直接返回有权限，不走后端验证
  }

  // 正常模式：从 store 中获取用户权限列表进行匹配
  const loginStore = useLoginStore()
  const { permissions } = loginStore
  return !!permissions.find((item) => item.includes(permissionID))
}
```

**效果**：页面中使用 `usePermissions('product:goods:query')` 检查权限时，演示模式下直接返回 `true`

---

### 绕过机制二：动态路由注册

**文件**：`src/utils/map-menus.ts`

**原理**：在将后端菜单映射为路由时，合并演示菜单

```typescript
function mergeDemoMenus(userMenus: any[]): any[] {
  if (!DEMO_MODE) return userMenus

  // 深拷贝，避免修改原数据
  const mergedMenus = JSON.parse(JSON.stringify(userMenus))

  for (const demoMenu of DEMO_MENUS) {
    // 查找是否已存在相同URL的一级菜单
    const existingMenu = mergedMenus.find(m => m.url === demoMenu.url)

    if (!existingMenu) {
      // ⭐ 情况1：一级菜单不存在，直接添加整个菜单
      mergedMenus.push(demoMenu)
    } else {
      // ⭐ 情况2：一级菜单已存在，合并子菜单
      const demoSubMenus = DEMO_SUB_MENUS[demoMenu.url] || demoMenu.children
      for (const demoSub of demoSubMenus) {
        const existingSub = existingMenu.children.find(s => s.url === demoSub.url)
        if (!existingSub) {
          existingMenu.children.push(demoSub)  // 添加缺失的子菜单
        }
      }
    }
  }

  return mergedMenus
}
```

**调用位置**：`mapMenusToRoutes()` 函数中
```typescript
export function mapMenusToRoutes(userMenus: any[]) {
  const localRoutes = loadLocalRoutes()        // 加载本地路由文件
  const mergedMenus = mergeDemoMenus(userMenus) // ⭐ 合并演示菜单
  
  // 遍历合并后的菜单，匹配本地路由并注册
  for (const menu of mergedMenus) {
    for (const submenu of menu.children) {
      const route = localRoutes.find(r => r.path === submenu.url)
      if (route) {
        routes.push(route)  // 注册路由
      }
    }
  }
}
```

---

### 绕过机制三：侧边栏菜单渲染

**文件**：`src/components/main-menu/main-menu.vue`

**原理**：使用与路由注册相同的合并逻辑，确保侧边栏显示演示菜单

```typescript
const mergedMenus = computed(() => {
  if (!DEMO_MODE) return userMenus

  const result = JSON.parse(JSON.stringify(userMenus))

  for (const demoMenu of DEMO_MENUS) {
    const existingMenu = result.find(m => m.url === demoMenu.url)
    
    if (!existingMenu) {
      result.push(demoMenu)
    } else {
      // 合并子菜单
      const demoSubMenus = DEMO_SUB_MENUS[demoMenu.url] || demoMenu.children
      for (const demoSub of demoSubMenus) {
        if (!existingMenu.children.find(s => s.url === demoSub.url)) {
          existingMenu.children.push(demoSub)
        }
      }
    }
  }

  return result
})
```

**模板渲染**：
```vue
<template v-for="subitem in item.children" :key="subitem.id">
  <!-- ⭐ 只显示 type=2 的菜单项，过滤掉 type=3 的按钮权限 -->
  <el-menu-item v-if="subitem.type === 2" ...>
    {{ subitem.name }}
  </el-menu-item>
</template>
```

---

### 完整工作流程图

```
用户登录
    │
    ▼
后端返回用户菜单权限 (userMenus)
    │
    ▼
┌─────────────────────────────────────────────────────┐
│              DEMO_MODE = true ?                     │
└─────────────────────────────────────────────────────┘
    │ Yes                              │ No
    ▼                                  ▼
┌─────────────────────┐        ┌─────────────────────┐
│ mergeDemoMenus()    │        │ 使用原始 userMenus  │
│ 合并演示菜单        │        │                     │
└─────────────────────┘        └─────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ 1. mapMenusToRoutes() - 注册动态路由                │
│ 2. main-menu.vue - 渲染侧边栏菜单                   │
│ 3. usePermissions() - 按钮权限检查时白名单放行      │
└─────────────────────────────────────────────────────┘
    │
    ▼
用户可以访问演示页面，所有按钮权限正常显示
```

---

### 演示菜单结构
```
功能展示 (/main/story)
├── 数据可视化 (/main/story/chat)
└── 项目管理 (/main/story/list)

商品中心 (/main/product)
├── 商品类别 (/main/product/category)
└── 商品信息 (/main/product/goods)
```

---

### 恢复正常模式

只需修改一行代码：
```typescript
// src/global/demo-mode.ts
export const DEMO_MODE = false  // 关闭演示模式
```

关闭后：
- 权限检查走正常流程，从 store 中匹配用户权限
- 路由注册只使用后端返回的菜单
- 侧边栏只显示后端返回的菜单

---

## 📄 页面功能说明

### 1. 数据可视化页 (`/main/story/chat`)

**展示内容：**
- 📊 动态统计卡片（带数字滚动动画）
- 📈 销售趋势折线图（支持切换销售额/订单量）
- 🥧 产品分类饼图
- 🎯 技能雷达图
- 🏆 区域销售排名柱状图
- ⚡ 系统资源仪表盘（CPU/内存/磁盘/网络）
- 🔥 活跃度热力图
- 📋 实时日志面板

**技术亮点：**
- ECharts 多种图表类型
- 数字滚动动画
- 响应式布局
- 渐变色主题

---

### 2. 项目管理页 (`/main/story/list`)

**展示内容：**
- 🚀 渐变色页面头部 + 快速统计
- 🔍 高级搜索筛选
- 📊 三种视图模式切换：
  - 表格视图（带进度条、预算、操作按钮）
  - 卡片视图（悬浮效果、标签展示）
  - 时间线视图（项目里程碑）
- 💼 项目管理弹窗（新建/编辑/查看）

**技术亮点：**
- 多视图模式切换
- Element Plus 高级组件
- 表单验证
- 响应式卡片布局

---

### 3. 商品类别页 (`/main/product/category`)

**展示内容：**
- 🎯 统计卡片（分类总数、充电站总数、充电桩总数）
- 🗂️ 分类卡片网格（图标、描述、设备数量）
- 👁️ 查看该分类下的充电站列表
- ➕ 新建/编辑分类弹窗

**数据主题：** 充电站分类管理
- 公共充电站、专用充电站、住宅充电站、商业充电站、高速服务区

---

### 4. 商品信息页 (`/main/product/goods`)

**展示内容：**
- 📊 设备状态统计面板（总数、空闲、充电中、故障）
- 🔍 多维度筛选（编码、站点、类型、状态）
- 📋 设备列表表格（今日/累计数据对比）
- 📱 设备详情抽屉
  - 状态卡片
  - 基本信息
  - 技术参数
  - 运营数据
  - 维护信息

**数据主题：** 充电桩设备管理
- 直流快充、交流慢充、超级快充、液冷超充

**技术亮点：**
- 状态实时指示灯效果
- 抽屉式详情面板
- 数据格式化显示

---

## 🚀 快速启动

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

登录后即可在侧边栏看到新增的菜单：
- **功能展示** → 数据可视化 / 项目管理
- **商品中心** → 商品类别 / 商品信息

---

## ⚠️ 注意事项

1. **演示模式开关**：如需恢复正常权限控制，将 `DEMO_MODE` 设为 `false`
2. **Mock 数据**：所有数据为模拟数据，无需后端接口支持
3. **路由匹配**：演示模式会自动合并缺失的子路由到已存在的菜单中

