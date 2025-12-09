<template>
  <div class="main-menu">
    <!-- logo -->
    <div class="logo">
      <img class="img" src="@/assets/images/logo.svg" alt="" />
      <h2 v-show="!isFold" class="title">Lyoko管理系统</h2>
    </div>
    <div class="menu">
      <!-- menu -->
      <el-menu
        :collapse-transition="false"
        :default-active="defaultActive"
        :collapse="isFold"
        text-color="#b7bdc3"
        active-text-color="#fff"
        background-color="#001529"
      >
        <!-- 通过遍历后端传输数据的方式遍历整个路由映射表 -->
        <template v-for="item in mergedMenus" :key="item.id">
          <!-- 通过index标识来使得展开收缩只使对应模块起效果 -->
          <el-sub-menu :index="item.id + ''">
            <template #title>
              <el-icon>
                <!-- 动态组件component 可通过is选取生成对应的组件 -->
                <!-- < Monitor /> 通过动态组件来进行转化 -->
                <component :is="getIconName(item.icon)"></component>
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <template v-for="subitem in item.children" :key="subitem.id">
              <!-- 只显示 type 为 2 的子菜单（过滤掉 type 为 3 的按钮权限） -->
              <el-menu-item
                v-if="subitem.type === 2"
                :index="subitem.id + ''"
                @click="handleItemClick(subitem)"
              >
                {{ subitem.name }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import useLoginStore from '@/store/login'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { mapPathToMenu } from '@/utils/map-menus'
import { DEMO_MODE, DEMO_MENUS, DEMO_SUB_MENUS } from '@/global/demo-mode'

// 0 接收props
defineProps({
  isFold: {
    type: Boolean,
    default: false
  }
})

// 1.获取动态的路由映射表
const loginStore = useLoginStore()
// userMenus是从后端获取的路由映射表
const userMenus = loginStore.userMenus

// 演示模式下合并菜单（与 map-menus.ts 中的逻辑保持一致）
const mergedMenus = computed(() => {
  if (!DEMO_MODE) return userMenus

  // 深拷贝用户菜单，避免修改原数据
  const result = JSON.parse(JSON.stringify(userMenus))

  // 遍历演示菜单
  for (const demoMenu of DEMO_MENUS) {
    // 查找是否已存在相同URL的一级菜单
    const existingMenu = result.find((m: any) => m.url === demoMenu.url)

    if (!existingMenu) {
      // 不存在，直接添加整个一级菜单
      result.push(demoMenu)
    } else {
      // 已存在，合并子菜单
      const demoSubMenus = DEMO_SUB_MENUS[demoMenu.url] || demoMenu.children
      if (demoSubMenus && existingMenu.children) {
        for (const demoSub of demoSubMenus) {
          // 检查子菜单是否已存在
          const existingSub = existingMenu.children.find(
            (s: any) => s.url === demoSub.url
          )
          if (!existingSub) {
            // 不存在的子菜单，添加进去
            existingMenu.children.push(demoSub)
          }
        }
      }
    }
  }

  return result
})

// 获取图标名称的辅助函数
function getIconName(icon: string) {
  if (!icon) return 'Document'
  // 处理 el-icon-xxx 格式
  if (icon.includes('-icon-')) {
    return icon.split('-icon-')[1]
  }
  // 直接返回图标名
  return icon
}

// 获取当前router实例，实现点击跳转
const router = useRouter()
// 2.监听item的点击
function handleItemClick(item: any) {
  // 从后端获取的路由url必须和前端定义的url一一对应
  console.log('url', item)

  const url = item.url
  router.push(url)
}

// 3.ElMenu的默认菜单

// 获取当前路由
const route = useRoute()
// 匹配当前路由获取对应的id
const defaultActive = computed(() => {
  // 触发computed的关键在于pathMenu的值会根据route.path的变化而变化
  const pathMenu = mapPathToMenu(route.path, userMenus)
  return pathMenu ? pathMenu.id + '' : ''
})
</script>

<style lang="less" scoped>
.main-menu {
  height: 100%;
  background-color: #001529;
}

.logo {
  display: flex;
  height: 28px;
  padding: 12px 10px 8px 10px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;

  .img {
    height: 100%;
    margin: 0 10px;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    color: white;
    white-space: nowrap;
  }
}

.el-menu {
  border-right: none;
  user-select: none;
}

.el-sub-menu {
  .el-menu-item {
    padding-left: 50px !important;
    background-color: #0c2135;
  }

  .el-menu-item:hover {
    color: #fff;
  }

  .el-menu-item.is-active {
    background-color: #0a60bd;
  }
}
</style>
