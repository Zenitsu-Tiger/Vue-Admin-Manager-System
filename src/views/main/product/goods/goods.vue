<template>
  <div class="charging-piles">
    <!-- 顶部统计面板 -->
    <div class="stats-panel fade-in">
      <div class="stats-header">
        <div class="title-section">
          <h2>🔌 充电桩设备管理</h2>
          <p>实时监控和管理所有充电桩设备状态</p>
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

    <!-- 设备列表 -->
    <div class="pile-list fade-in" style="--delay: 0.3s">
      <el-table
        :data="filteredPiles"
        border
        stripe
        style="width: 100%"
        v-loading="tableLoading"
        row-key="id"
      >
        <el-table-column type="selection" width="50" fixed="left" />
        <el-table-column prop="code" label="设备编码" width="140" fixed="left">
          <template #default="{ row }">
            <el-button text type="primary" @click="handleViewDetail(row)">
              {{ row.code }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="设备名称" min-width="150" />
        <el-table-column
          prop="stationName"
          label="所属站点"
          min-width="160"
          show-overflow-tooltip
        />
        <el-table-column
          prop="typeName"
          label="设备类型"
          width="110"
          align="center"
        >
          <template #default="{ row }">
            <el-tag
              :type="row.type === 'DC' ? 'warning' : 'success'"
              effect="dark"
            >
              {{ row.typeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="power" label="功率" width="90" align="center">
          <template #default="{ row }">
            <span class="power-value">{{ row.power }}kW</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="设备状态"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="plain">
              <span class="status-dot" :class="row.status"></span>
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="networkStatus"
          label="网络状态"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag
              :type="row.networkStatus === 'online' ? 'success' : 'danger'"
              size="small"
            >
              {{ row.networkStatus === 'online' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="今日数据" width="160">
          <template #default="{ row }">
            <div class="today-stats">
              <div class="stat-row">
                <span class="label">订单:</span>
                <span class="value">{{ row.todayOrders }}单</span>
              </div>
              <div class="stat-row">
                <span class="label">电量:</span>
                <span class="value"
                  >{{ row.todayElectricity.toFixed(1) }}度</span
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="累计数据" width="160">
          <template #default="{ row }">
            <div class="total-stats">
              <div class="stat-row">
                <span class="label">订单:</span>
                <span class="value highlight"
                  >{{ formatNumber(row.totalOrders) }}单</span
                >
              </div>
              <div class="stat-row">
                <span class="label">收入:</span>
                <span class="value highlight"
                  >¥{{ formatNumber(row.totalRevenue) }}</span
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="manufacturer" label="制造商" width="100" />
        <el-table-column prop="lastMaintenance" label="最近维护" width="110" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              text
              type="primary"
              size="small"
              @click="handleViewDetail(row)"
            >
              <el-icon><View /></el-icon>
              详情
            </el-button>
            <el-button
              text
              type="warning"
              size="small"
              @click="handleEdit(row)"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-dropdown trigger="click">
              <el-button text type="info" size="small">
                更多
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleMaintenance(row)">
                    <el-icon><Setting /></el-icon>
                    维护记录
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleRestart(row)">
                    <el-icon><RefreshRight /></el-icon>
                    重启设备
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleDisable(row)">
                    <el-icon><CircleClose /></el-icon>
                    禁用设备
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredPiles.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
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
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Plus,
  Download,
  Search,
  RefreshLeft,
  View,
  Edit,
  ArrowDown,
  Setting,
  RefreshRight,
  CircleClose,
  Top,
  Bottom,
  Coin,
  Lightning,
  Warning,
  SuccessFilled,
  Loading,
  Clock
} from '@element-plus/icons-vue'
import {
  mockChargingPiles,
  mockChargingStations,
  mockChargingStats
} from '@/mock'

defineOptions({
  name: 'ChargingPileGoods'
})

// 充电桩列表
const pileList = ref([...mockChargingPiles])
const tableLoading = ref(false)

// 站点选项
const stationOptions = mockChargingStations

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

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

// 过滤后的充电桩
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

// 状态相关
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    available: 'success',
    charging: 'primary',
    fault: 'danger',
    occupied: 'warning'
  }
  return types[status] || 'info'
}

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

// 搜索
const handleSearch = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
  }, 500)
}

// 重置
const handleReset = () => {
  filterForm.code = ''
  filterForm.stationId = null
  filterForm.type = ''
  filterForm.status = ''
}

// 添加设备
const handleAddPile = () => {
  ElMessage.info('打开添加设备弹窗')
}

// 导出数据
const handleExport = () => {
  ElMessage.success('数据导出成功')
}

// 查看详情
const handleViewDetail = (row: any) => {
  currentPile.value = row
  detailDrawerVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  ElMessage.info(`编辑设备: ${row.name}`)
}

// 维护记录
const handleMaintenance = (row: any) => {
  ElMessage.info(`查看维护记录: ${row.name}`)
}

// 重启设备
const handleRestart = (row: any) => {
  ElMessage.success(`设备 ${row.code} 重启指令已发送`)
}

// 禁用设备
const handleDisable = (row: any) => {
  ElMessage.warning(`设备 ${row.code} 已禁用`)
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

  .power-value {
    font-weight: 600;
    color: #e6a23c;
  }

  .status-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 4px;

    &.available {
      background: #67c23a;
    }
    &.charging {
      background: #409eff;
      animation: pulse 1.5s infinite;
    }
    &.fault {
      background: #f56c6c;
    }
    &.occupied {
      background: #e6a23c;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .today-stats,
  .total-stats {
    .stat-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      line-height: 1.8;

      .label {
        color: #909399;
      }

      .value {
        color: #606266;

        &.highlight {
          color: #409eff;
          font-weight: 600;
        }
      }
    }
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
