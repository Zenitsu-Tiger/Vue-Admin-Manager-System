<template>
  <div class="charging-piles">
    <!-- 顶部统计面板 -->
    <div class="stats-panel fade-in">
      <div class="stats-header">
        <div class="title-section">
          <h2>🔌 充电桩设备管理</h2>
          <p>实时监控和管理所有充电桩设备状态（VTable 高性能表格演示）</p>
        </div>
        <div class="action-section">
          <el-button type="primary" @click="handleAddPile">
            <el-icon><Plus /></el-icon>
            添加设备
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </div>
      </div>

      <div class="stats-grid">
        <div
          v-for="(stat, index) in deviceStats"
          :key="stat.label"
          class="stat-item"
          :class="stat.type"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div class="stat-icon">
            <el-icon :size="24"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
          <div class="stat-trend" v-if="stat.trend">
            <el-icon :class="stat.trend > 0 ? 'up' : 'down'">
              <component :is="stat.trend > 0 ? 'Top' : 'Bottom'" />
            </el-icon>
            <span>{{ Math.abs(stat.trend) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索筛选区 -->
    <div class="filter-section fade-in" style="--delay: 0.2s">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="设备编码">
          <el-input
            v-model="filterForm.code"
            placeholder="请输入设备编码"
            clearable
            style="width: 160px"
          />
        </el-form-item>
        <el-form-item label="所属站点">
          <el-select
            v-model="filterForm.stationId"
            placeholder="全部站点"
            clearable
            style="width: 180px"
          >
            <el-option
              v-for="station in stationOptions"
              :key="station.id"
              :label="station.name"
              :value="station.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select
            v-model="filterForm.type"
            placeholder="全部类型"
            clearable
            style="width: 140px"
          >
            <el-option label="直流快充" value="DC" />
            <el-option label="交流慢充" value="AC" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select
            v-model="filterForm.status"
            placeholder="全部状态"
            clearable
            style="width: 130px"
          >
            <el-option label="空闲" value="available" />
            <el-option label="充电中" value="charging" />
            <el-option label="故障" value="fault" />
            <el-option label="占用" value="occupied" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- ==================== VTable 表格区域 ==================== -->
    <div class="pile-list fade-in" style="--delay: 0.3s">
      <div class="vtable-tips">
        <el-tag type="success" effect="plain">VTable 虚拟滚动</el-tag>
        <span class="tip-text">
          共
          {{ filteredPiles.length }}
          条数据，一次性加载全部数据，通过虚拟滚动只渲染可视区域
        </span>
      </div>

      <!-- VTable 核心：虚拟滚动表格，无需分页 -->
      <div ref="vtableContainer" class="vtable-container"></div>
    </div>

    <!-- 设备详情弹窗 -->
    <el-drawer
      v-model="detailDrawerVisible"
      :title="currentPile?.name || '设备详情'"
      size="500px"
      direction="rtl"
    >
      <div class="pile-detail" v-if="currentPile">
        <!-- 状态卡片 -->
        <div class="detail-status" :class="currentPile.status">
          <div class="status-icon">
            <el-icon :size="48">
              <component :is="getStatusIcon(currentPile.status)" />
            </el-icon>
          </div>
          <div class="status-info">
            <div class="status-text">
              {{ getStatusText(currentPile.status) }}
            </div>
            <div class="status-time">
              最后心跳: {{ formatTime(currentPile.lastHeartbeat) }}
            </div>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="detail-section">
          <h4>基本信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="设备编码">{{
              currentPile.code
            }}</el-descriptions-item>
            <el-descriptions-item label="设备名称">{{
              currentPile.name
            }}</el-descriptions-item>
            <el-descriptions-item label="所属站点">{{
              currentPile.stationName
            }}</el-descriptions-item>
            <el-descriptions-item label="设备类型">
              <el-tag
                :type="currentPile.type === 'DC' ? 'warning' : 'success'"
                size="small"
              >
                {{ currentPile.typeName }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="制造商">{{
              currentPile.manufacturer
            }}</el-descriptions-item>
            <el-descriptions-item label="型号">{{
              currentPile.model
            }}</el-descriptions-item>
            <el-descriptions-item label="序列号">{{
              currentPile.serialNumber
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 技术参数 -->
        <div class="detail-section">
          <h4>技术参数</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="额定功率"
              >{{ currentPile.power }}kW</el-descriptions-item
            >
            <el-descriptions-item label="额定电压"
              >{{ currentPile.voltage }}V</el-descriptions-item
            >
            <el-descriptions-item label="额定电流"
              >{{ currentPile.current }}A</el-descriptions-item
            >
            <el-descriptions-item label="接口类型">{{
              currentPile.connectorType
            }}</el-descriptions-item>
            <el-descriptions-item label="接口数量"
              >{{ currentPile.connectorCount }}个</el-descriptions-item
            >
          </el-descriptions>
        </div>

        <!-- 运营数据 -->
        <div class="detail-section">
          <h4>运营数据</h4>
          <div class="data-cards">
            <div class="data-card">
              <div class="data-value">{{ currentPile.todayOrders }}</div>
              <div class="data-label">今日订单</div>
            </div>
            <div class="data-card">
              <div class="data-value">¥{{ currentPile.todayRevenue }}</div>
              <div class="data-label">今日收入</div>
            </div>
            <div class="data-card">
              <div class="data-value">
                {{ currentPile.todayElectricity.toFixed(1) }}
              </div>
              <div class="data-label">今日电量(度)</div>
            </div>
            <div class="data-card highlight">
              <div class="data-value">
                {{ formatNumber(currentPile.totalOrders) }}
              </div>
              <div class="data-label">累计订单</div>
            </div>
          </div>
        </div>

        <!-- 维护信息 -->
        <div class="detail-section">
          <h4>维护信息</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="安装日期">{{
              currentPile.installDate
            }}</el-descriptions-item>
            <el-descriptions-item label="最近维护">{{
              currentPile.lastMaintenance
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Download, Search, RefreshLeft } from '@element-plus/icons-vue'
import {
  mockChargingPiles,
  mockChargingStations,
  mockChargingStats
} from '@/mock'

// ==================== VTable 导入 ====================
// 核心：从 @visactor/vtable 导入 ListTable 类
import { ListTable } from '@visactor/vtable'
import type { ListTableConstructorOptions, TYPES } from '@visactor/vtable'

defineOptions({
  name: 'ChargingPileGoods'
})

// ==================== VTable 实例引用 ====================
const vtableContainer = ref<HTMLElement | null>(null)
let tableInstance: ListTable | null = null

// 充电桩列表
const pileList = ref([...mockChargingPiles])

// 站点选项
const stationOptions = mockChargingStations

// 筛选表单
const filterForm = reactive({
  code: '',
  stationId: null as number | null,
  type: '',
  status: ''
})

// 设备统计
const deviceStats = computed(() => [
  {
    icon: 'Coin',
    value: mockChargingStats.deviceStatus.total,
    label: '设备总数',
    type: 'total'
  },
  {
    icon: 'SuccessFilled',
    value: mockChargingStats.deviceStatus.available,
    label: '空闲设备',
    type: 'available',
    trend: 5.2
  },
  {
    icon: 'Loading',
    value: mockChargingStats.deviceStatus.charging,
    label: '充电中',
    type: 'charging'
  },
  {
    icon: 'Warning',
    value: mockChargingStats.deviceStatus.fault,
    label: '故障设备',
    type: 'fault',
    trend: -2.1
  }
])

// 过滤后的充电桩 - 全部数据传给 VTable，由 VTable 虚拟滚动处理
const filteredPiles = computed(() => {
  return pileList.value.filter((pile) => {
    const codeMatch = !filterForm.code || pile.code.includes(filterForm.code)
    const stationMatch =
      !filterForm.stationId || pile.stationId === filterForm.stationId
    const typeMatch = !filterForm.type || pile.type === filterForm.type
    const statusMatch = !filterForm.status || pile.status === filterForm.status
    return codeMatch && stationMatch && typeMatch && statusMatch
  })
})

// 详情抽屉
const detailDrawerVisible = ref(false)
const currentPile = ref<any>(null)

// ==================== VTable 配置 ====================
/**
 * 【教程重点】VTable 列配置
 * 每列通过 field 绑定数据字段，title 设置表头
 * 可以通过 style 自定义样式，通过 fieldFormat 格式化显示
 */
const getVTableColumns = (): TYPES.ColumnsDefine => [
  {
    field: 'code',
    title: '设备编码',
    width: 140,
    // 【教程重点】静态样式配置
    style: {
      color: '#409eff',
      fontWeight: 'bold',
      textAlign: 'left',
      padding: [0, 12]
    }
  },
  {
    field: 'name',
    title: '设备名称',
    width: 150,
    style: {
      padding: [0, 12]
    }
  },
  {
    field: 'stationName',
    title: '所属站点',
    width: 180,
    style: {
      padding: [0, 12]
    }
  },
  {
    field: 'typeName',
    title: '设备类型',
    width: 110,
    // 【教程重点】动态样式函数 - 根据数据返回不同样式
    style: (args) => {
      const { row, table, col } = args
      // 表头行返回默认样式
      if (row === 0) {
        return { textAlign: 'center' }
      }
      const record = table.getCellOriginRecord(col, row) as any
      return {
        textAlign: 'center',
        color: '#fff',
        bgColor: record?.type === 'DC' ? '#e6a23c' : '#67c23a',
        borderRadius: 4
      }
    }
  },
  {
    field: 'power',
    title: '功率',
    width: 90,
    style: {
      textAlign: 'center',
      color: '#e6a23c',
      fontWeight: 'bold'
    },
    // 【教程重点】fieldFormat - 格式化显示内容
    fieldFormat: (record) => `${record.power}kW`
  },
  {
    field: 'status',
    title: '设备状态',
    width: 100,
    // 【教程重点】动态样式 - 根据状态显示不同颜色
    style: (args) => {
      const { row, table, col } = args
      if (row === 0) {
        return { textAlign: 'center' }
      }
      const record = table.getCellOriginRecord(col, row) as any
      const statusColors: Record<string, string> = {
        available: '#67c23a',
        charging: '#409eff',
        fault: '#f56c6c',
        occupied: '#e6a23c'
      }
      return {
        textAlign: 'center',
        color: statusColors[record?.status] || '#606266',
        fontWeight: 'bold'
      }
    },
    // 状态文字转换
    fieldFormat: (record) => {
      const statusTexts: Record<string, string> = {
        available: '● 空闲',
        charging: '● 充电中',
        fault: '● 故障',
        occupied: '● 占用'
      }
      return statusTexts[record.status] || record.status
    }
  },
  {
    field: 'networkStatus',
    title: '网络状态',
    width: 90,
    style: (args) => {
      const { row, table, col } = args
      if (row === 0) {
        return { textAlign: 'center' }
      }
      const record = table.getCellOriginRecord(col, row) as any
      return {
        textAlign: 'center',
        color: record?.networkStatus === 'online' ? '#67c23a' : '#f56c6c',
        fontWeight: 'bold'
      }
    },
    fieldFormat: (record) =>
      record.networkStatus === 'online' ? '在线' : '离线'
  },
  {
    field: 'todayOrders',
    title: '今日订单',
    width: 90,
    style: {
      textAlign: 'center'
    },
    fieldFormat: (record) => `${record.todayOrders}单`
  },
  {
    field: 'todayElectricity',
    title: '今日电量',
    width: 100,
    style: {
      textAlign: 'center'
    },
    fieldFormat: (record) => `${record.todayElectricity.toFixed(1)}度`
  },
  {
    field: 'totalOrders',
    title: '累计订单',
    width: 100,
    style: {
      textAlign: 'center',
      color: '#409eff',
      fontWeight: 'bold'
    },
    fieldFormat: (record) => formatNumber(record.totalOrders) + '单'
  },
  {
    field: 'totalRevenue',
    title: '累计收入',
    width: 110,
    style: {
      textAlign: 'right',
      color: '#f56c6c',
      fontWeight: 'bold',
      padding: [0, 12]
    },
    fieldFormat: (record) => `¥${formatNumber(record.totalRevenue)}`
  },
  {
    field: 'manufacturer',
    title: '制造商',
    width: 100,
    style: {
      padding: [0, 12]
    }
  },
  {
    field: 'lastMaintenance',
    title: '最近维护',
    width: 110,
    style: {
      textAlign: 'center'
    }
  }
]

/**
 * 【教程重点】初始化 VTable
 * 核心步骤：
 * 1. 定义 option 配置对象
 * 2. 使用 new ListTable(container, option) 创建实例
 * 3. 绑定事件监听（如点击事件）
 *
 * 【虚拟滚动原理】
 * VTable 的核心优势是虚拟滚动：
 * - 一次性传入全部数据（哪怕百万条）
 * - VTable 只渲染可视区域内的行（比如 10-15 行）
 * - 滚动时动态销毁/创建行，保持 DOM 节点数量恒定
 * - 所以不需要分页，直接滚动浏览全部数据
 */
const initVTable = () => {
  if (!vtableContainer.value) return

  // 【教程重点】VTable 配置项
  const option: ListTableConstructorOptions = {
    // 【核心】数据源 - 传入全部数据，VTable 内部虚拟滚动处理
    records: filteredPiles.value,
    // 列定义
    columns: getVTableColumns(),

    // 宽度模式
    widthMode: 'autoWidth',
    autoFillWidth: true,

    // 行高配置
    defaultRowHeight: 48,
    defaultHeaderRowHeight: 50,

    // 【教程重点】主题配置 - 自定义表格外观
    theme: {
      headerStyle: {
        bgColor: '#f5f7fa',
        color: '#606266',
        fontWeight: 'bold',
        fontSize: 14,
        borderColor: '#ebeef5',
        borderLineWidth: 1
      },
      bodyStyle: {
        bgColor: '#fff',
        color: '#606266',
        fontSize: 13,
        borderColor: '#ebeef5',
        borderLineWidth: 1,
        hover: {
          cellBgColor: '#ecf5ff'
        }
      },
      frameStyle: {
        borderColor: '#ebeef5',
        borderLineWidth: 1
      }
    },

    // 行高亮模式
    hover: {
      highlightMode: 'row'
    },

    // 选中样式
    select: {
      highlightMode: 'row'
    },

    // 冻结首列（设备编码）
    frozenColCount: 1
  }

  // 创建 VTable 实例
  tableInstance = new ListTable(vtableContainer.value, option)

  // 【教程重点】绑定单元格点击事件
  tableInstance.on('click_cell', (args) => {
    const { col, row, field } = args
    // 点击设备编码列时打开详情
    if (field === 'code' && row > 0) {
      const record = tableInstance?.getCellOriginRecord(col, row)
      if (record) {
        handleViewDetail(record)
      }
    }
  })
}

/**
 * 【教程重点】更新 VTable 数据
 * 使用 setRecords 方法高效更新数据，无需重建实例
 */
/**
 * 【教程重点】更新 VTable 数据
 * 使用 setRecords 方法高效更新全部数据
 * VTable 内部会自动处理虚拟滚动
 */
const updateVTableData = () => {
  if (tableInstance) {
    tableInstance.setRecords(filteredPiles.value)
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  initVTable()
})

onUnmounted(() => {
  // 【教程重点】销毁实例，释放内存
  if (tableInstance) {
    tableInstance.release()
    tableInstance = null
  }
})

// 监听筛选数据变化，更新表格
watch(
  () => filteredPiles.value,
  () => {
    updateVTableData()
  },
  { deep: true }
)

// ==================== 状态相关函数 ====================
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    available: '空闲',
    charging: '充电中',
    fault: '故障',
    occupied: '占用'
  }
  return texts[status] || status
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    available: 'SuccessFilled',
    charging: 'Loading',
    fault: 'Warning',
    occupied: 'Clock'
  }
  return icons[status] || 'QuestionFilled'
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

// 格式化时间
const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`
}

// ==================== 事件处理 ====================
const handleSearch = () => {
  // 筛选后数据通过 watch filteredPiles 自动更新
  ElMessage.success(`搜索完成，共 ${filteredPiles.value.length} 条数据`)
}

const handleReset = () => {
  filterForm.code = ''
  filterForm.stationId = null
  filterForm.type = ''
  filterForm.status = ''
  // 重置后数据通过 watch filteredPiles 自动更新
}

const handleAddPile = () => {
  ElMessage.info('打开添加设备弹窗')
}

const handleExport = () => {
  ElMessage.success('数据导出成功')
}

const handleViewDetail = (row: any) => {
  currentPile.value = row
  detailDrawerVisible.value = true
}
</script>

<style lang="less" scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out both;
  animation-delay: var(--delay, 0s);
}

.charging-piles {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  min-height: 100%;
}

.stats-panel {
  background: linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(91, 134, 229, 0.3);

  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .title-section {
      h2 {
        margin: 0 0 8px 0;
        font-size: 22px;
      }

      p {
        margin: 0;
        opacity: 0.85;
        font-size: 14px;
      }
    }

    .action-section {
      display: flex;
      gap: 12px;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    @media (max-width: 1000px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      backdrop-filter: blur(10px);

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .stat-info {
        flex: 1;

        .stat-value {
          font-size: 28px;
          font-weight: 700;
        }

        .stat-label {
          font-size: 13px;
          opacity: 0.85;
        }
      }

      .stat-trend {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.2);

        .up {
          color: #b8ffc8;
        }

        .down {
          color: #ffb8b8;
        }
      }
    }
  }
}

.filter-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  .filter-form {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }
}

.pile-list {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  .vtable-tips {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px dashed #ebeef5;

    .tip-text {
      color: #909399;
      font-size: 13px;
    }
  }

  /* VTable 容器样式 - 必须设置固定高度 */
  .vtable-container {
    width: 100%;
    height: 530px; /* 固定高度：10行数据 + 表头 */
    border: 1px solid #ebeef5;
    border-radius: 8px;
    overflow: hidden;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

// 详情抽屉样式
.pile-detail {
  .detail-status {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 20px;

    &.available {
      background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
      color: #67c23a;
    }
    &.charging {
      background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
      color: #409eff;
    }
    &.fault {
      background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
      color: #f56c6c;
    }
    &.occupied {
      background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
      color: #e6a23c;
    }

    .status-text {
      font-size: 20px;
      font-weight: 600;
    }

    .status-time {
      font-size: 12px;
      opacity: 0.7;
      margin-top: 4px;
    }
  }

  .detail-section {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 12px 0;
      font-size: 15px;
      color: #303133;
      padding-left: 10px;
      border-left: 3px solid #409eff;
    }
  }

  .data-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .data-card {
      padding: 16px;
      background: #f5f7fa;
      border-radius: 8px;
      text-align: center;

      &.highlight {
        background: linear-gradient(135deg, #ecf5ff 0%, #d9ecff 100%);
      }

      .data-value {
        font-size: 24px;
        font-weight: 700;
        color: #303133;
      }

      .data-label {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }
}

@media (max-width: 768px) {
  .charging-piles {
    padding: 12px;
  }

  .stats-panel {
    padding: 16px;

    .stats-header {
      flex-direction: column;
      gap: 16px;

      .action-section {
        width: 100%;

        .el-button {
          flex: 1;
        }
      }
    }
  }
}
</style>
