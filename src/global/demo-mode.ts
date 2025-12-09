/**
 * 演示模式配置
 * 用于面试展示，绕过后端权限控制
 */

// 是否开启演示模式（绕过权限检查）
export const DEMO_MODE = true

// 演示模式下的白名单路由前缀
export const DEMO_ROUTE_PREFIX = ['/main/story', '/main/product']

// 演示模式下的权限白名单
export const DEMO_PERMISSION_WHITELIST = [
  'story:chat',
  'story:list',
  'story',
  'product:category',
  'product:goods',
  'product'
]

// 检查路径是否在演示白名单中
export function isDemoRoute(path: string): boolean {
  if (!DEMO_MODE) return false
  return DEMO_ROUTE_PREFIX.some((prefix) => path.startsWith(prefix))
}

// 检查权限是否在演示白名单中
export function isDemoPermission(permissionID: string): boolean {
  if (!DEMO_MODE) return false
  return DEMO_PERMISSION_WHITELIST.some(
    (whitelist) =>
      permissionID.includes(whitelist) || whitelist.includes(permissionID)
  )
}

// 演示模式下的模拟菜单数据（用于侧边栏显示）
export const DEMO_MENUS = [
  {
    id: 900,
    name: '功能展示',
    type: 1,
    url: '/main/story',
    icon: 'el-icon-Monitor',
    sort: 1,
    children: [
      {
        id: 901,
        url: '/main/story/chat',
        name: '数据可视化',
        sort: 1,
        type: 2,
        parentId: 900,
        children: [
          { id: 9011, type: 3, name: '查询', permission: 'story:chat:query' },
          { id: 9012, type: 3, name: '创建', permission: 'story:chat:create' },
          { id: 9013, type: 3, name: '更新', permission: 'story:chat:update' },
          { id: 9014, type: 3, name: '删除', permission: 'story:chat:delete' },
          { id: 9015, type: 3, name: '提交', permission: 'story:chat:submit' }
        ]
      },
      {
        id: 902,
        url: '/main/story/list',
        name: '项目管理',
        sort: 2,
        type: 2,
        parentId: 900,
        children: [
          { id: 9021, type: 3, name: '查询', permission: 'story:list:query' },
          { id: 9022, type: 3, name: '创建', permission: 'story:list:create' },
          { id: 9023, type: 3, name: '更新', permission: 'story:list:update' },
          { id: 9024, type: 3, name: '删除', permission: 'story:list:delete' },
          { id: 9025, type: 3, name: '提交', permission: 'story:list:submit' }
        ]
      }
    ]
  },
  {
    id: 800,
    name: '商品中心',
    type: 1,
    url: '/main/product',
    icon: 'el-icon-Goods',
    sort: 2,
    children: [
      {
        id: 801,
        url: '/main/product/category',
        name: '商品类别',
        sort: 1,
        type: 2,
        parentId: 800,
        children: [
          {
            id: 8011,
            type: 3,
            name: '查询',
            permission: 'product:category:query'
          },
          {
            id: 8012,
            type: 3,
            name: '创建',
            permission: 'product:category:create'
          },
          {
            id: 8013,
            type: 3,
            name: '更新',
            permission: 'product:category:update'
          },
          {
            id: 8014,
            type: 3,
            name: '删除',
            permission: 'product:category:delete'
          },
          {
            id: 8015,
            type: 3,
            name: '提交',
            permission: 'product:category:submit'
          }
        ]
      },
      {
        id: 802,
        url: '/main/product/goods',
        name: '商品信息',
        sort: 2,
        type: 2,
        parentId: 800,
        children: [
          {
            id: 8021,
            type: 3,
            name: '查询',
            permission: 'product:goods:query'
          },
          {
            id: 8022,
            type: 3,
            name: '创建',
            permission: 'product:goods:create'
          },
          {
            id: 8023,
            type: 3,
            name: '更新',
            permission: 'product:goods:update'
          },
          {
            id: 8024,
            type: 3,
            name: '删除',
            permission: 'product:goods:delete'
          },
          {
            id: 8025,
            type: 3,
            name: '提交',
            permission: 'product:goods:submit'
          }
        ]
      }
    ]
  }
]

// 需要在演示模式下单独添加的子路由（用于合并到已存在的菜单中）
export const DEMO_SUB_MENUS: Record<string, any[]> = {
  '/main/product': [
    {
      id: 801,
      url: '/main/product/category',
      name: '商品类别',
      sort: 1,
      type: 2,
      parentId: 800,
      children: [
        {
          id: 8011,
          type: 3,
          name: '查询',
          permission: 'product:category:query'
        },
        {
          id: 8012,
          type: 3,
          name: '创建',
          permission: 'product:category:create'
        },
        {
          id: 8013,
          type: 3,
          name: '更新',
          permission: 'product:category:update'
        },
        {
          id: 8014,
          type: 3,
          name: '删除',
          permission: 'product:category:delete'
        },
        {
          id: 8015,
          type: 3,
          name: '提交',
          permission: 'product:category:submit'
        }
      ]
    },
    {
      id: 802,
      url: '/main/product/goods',
      name: '商品信息',
      sort: 2,
      type: 2,
      parentId: 800,
      children: [
        { id: 8021, type: 3, name: '查询', permission: 'product:goods:query' },
        { id: 8022, type: 3, name: '创建', permission: 'product:goods:create' },
        { id: 8023, type: 3, name: '更新', permission: 'product:goods:update' },
        { id: 8024, type: 3, name: '删除', permission: 'product:goods:delete' },
        { id: 8025, type: 3, name: '提交', permission: 'product:goods:submit' }
      ]
    }
  ]
}
