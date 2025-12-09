<template>
  <div class="charging-station-types">
    <!-- 页面头部 -->
    <div class="page-header fade-in">
      <div class="header-info">
        <h2>⚡ 充电站分类管理</h2>
        <p class="desc">
          管理各类充电站的分类信息，包括公共充电站、专用充电站、住宅充电站等
        </p>
      </div>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新建分类
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div
        v-for="(item, index) in statsData"
        :key="item.label"
        class="stat-card fade-in"
        :style="{ '--delay': index * 0.1 + 's', '--color': item.color }"
      >
        <div class="stat-icon">
          <el-icon :size="28"><component :is="item.icon" /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ item.value }}</div>
          <div class="stat-label">{{ item.label }}</div>
        </div>
      </div>
    </div>

    <!-- 分类卡片列表 -->
    <div class="category-grid">
      <div
        v-for="(category, index) in categoryList"
        :key="category.id"
        class="category-card fade-in"
        :style="{ '--delay': (index + 4) * 0.08 + 's' }"
      >
        <div class="card-header" :style="{ background: category.color }">
          <div class="card-icon">
            <el-icon :size="32"><component :is="category.icon" /></el-icon>
          </div>
          <el-dropdown class="card-more" trigger="click" @click.stop>
            <el-button text circle class="more-btn">
              <el-icon><MoreFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleEdit(category)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-dropdown-item>
                <el-dropdown-item @click="handleViewStations(category)">
                  <el-icon><View /></el-icon>
                  查看充电站
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleDelete(category)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div class="card-body">
          <h3 class="card-title">{{ category.name }}</h3>
          <p class="card-code">编码：{{ category.code }}</p>
          <p class="card-desc">{{ category.description }}</p>

          <div class="card-stats">
            <div class="stat-item">
              <el-icon><Location /></el-icon>
              <span class="stat-num">{{ category.stationCount }}</span>
              <span class="stat-text">充电站</span>
            </div>
            <div class="stat-item">
              <el-icon><Coin /></el-icon>
              <span class="stat-num">{{ category.pileCount }}</span>
              <span class="stat-text">充电桩</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <el-tag
            :type="category.enable === 1 ? 'success' : 'danger'"
            size="small"
          >
            {{ category.enable === 1 ? '启用中' : '已禁用' }}
          </el-tag>
          <span class="update-time"
            >更新于 {{ formatDate(category.updateAt) }}</span
          >
        </div>
      </div>
    </div>

    <!-- 充电站列表弹窗 -->
    <el-dialog
      v-model="stationDialogVisible"
      :title="`${currentCategory?.name || ''} - 充电站列表`"
      width="900px"
      destroy-on-close
    >
      <div class="station-list">
        <el-table :data="filteredStations" border stripe>
          <el-table-column prop="code" label="站点编码" width="130" />
          <el-table-column prop="name" label="站点名称" min-width="180" />
          <el-table-column
            prop="address"
            label="地址"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="pileCount"
            label="充电桩"
            width="90"
            align="center"
          >
            <template #default="{ row }">
              <el-tag type="info">{{ row.pileCount }}台</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="row.status === 'online' ? 'success' : 'danger'">
                {{ row.status === 'online' ? '在线' : '离线' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="rating"
            label="评分"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <div class="rating">
                <el-icon class="star"><StarFilled /></el-icon>
                <span>{{ row.rating }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 新建/编辑弹窗 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="dialogType === 'create' ? '新建充电站分类' : '编辑充电站分类'"
      width="550px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入分类编码" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select
            v-model="formData.icon"
            placeholder="请选择图标"
            style="width: 100%"
          >
            <el-option label="📍 Location (位置)" value="Location" />
            <el-option
              label="🏢 OfficeBuilding (办公楼)"
              value="OfficeBuilding"
            />
            <el-option label="🏠 House (住宅)" value="House" />
            <el-option label="🏪 Shop (商店)" value="Shop" />
            <el-option label="🚐 Van (服务区)" value="Van" />
            <el-option label="⚡ Lightning (闪电)" value="Lightning" />
          </el-select>
        </el-form-item>
        <el-form-item label="主题颜色" prop="color">
          <el-color-picker v-model="formData.color" />
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="1" :max="99" />
        </el-form-item>
        <el-form-item label="状态" prop="enable">
          <el-switch
            v-model="formData.enable"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="submitLoading"
        >
          {{ dialogType === 'create' ? '创建' : '保存' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  Plus,
  MoreFilled,
  Edit,
  View,
  Delete,
  Location,
  Coin,
  StarFilled,
  OfficeBuilding,
  House,
  Shop,
  Van,
  Lightning
} from '@element-plus/icons-vue'
import { mockChargingStationTypes, mockChargingStations } from '@/mock'

defineOptions({
  name: 'ChargingStationCategory'
})

// 分类列表
const categoryList = ref([...mockChargingStationTypes])

// 统计数据
const statsData = computed(() => [
  {
    icon: 'Folder',
    value: categoryList.value.length,
    label: '分类总数',
    color: '#409eff'
  },
  {
    icon: 'Location',
    value: categoryList.value.reduce((a, b) => a + b.stationCount, 0),
    label: '充电站总数',
    color: '#67c23a'
  },
  {
    icon: 'Coin',
    value: categoryList.value.reduce((a, b) => a + b.pileCount, 0),
    label: '充电桩总数',
    color: '#e6a23c'
  },
  {
    icon: 'CircleCheck',
    value: categoryList.value.filter((i) => i.enable === 1).length,
    label: '启用分类',
    color: '#909399'
  }
])

// 充电站列表弹窗
const stationDialogVisible = ref(false)
const currentCategory = ref<any>(null)

// 过滤后的充电站
const filteredStations = computed(() => {
  if (!currentCategory.value) return []
  return mockChargingStations.filter(
    (s) => s.typeId === currentCategory.value.id
  )
})

// 表单弹窗
const formDialogVisible = ref(false)
const dialogType = ref<'create' | 'edit'>('create')
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive({
  id: null as number | null,
  name: '',
  code: '',
  icon: 'Location',
  color: '#409eff',
  description: '',
  sort: 1,
  enable: 1
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入分类编码', trigger: 'blur' }]
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 新建
const handleCreate = () => {
  dialogType.value = 'create'
  resetForm()
  formDialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(formData, row)
  formDialogVisible.value = true
}

// 查看充电站
const handleViewStations = (row: any) => {
  currentCategory.value = row
  stationDialogVisible.value = true
}

// 删除
const handleDelete = (row: any) => {
  ElMessage.success(`分类 "${row.name}" 已删除`)
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: null,
    name: '',
    code: '',
    icon: 'Location',
    color: '#409eff',
    description: '',
    sort: categoryList.value.length + 1,
    enable: 1
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        submitLoading.value = false
        formDialogVisible.value = false
        ElMessage.success(
          dialogType.value === 'create' ? '创建成功' : '保存成功'
        )
      }, 500)
    }
  })
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

.charging-station-types {
  padding: 20px;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f4ff 100%);
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(24, 144, 255, 0.3);

  .header-info {
    h2 {
      margin: 0 0 8px 0;
      font-size: 22px;
    }

    .desc {
      margin: 0;
      opacity: 0.85;
      font-size: 14px;
    }
  }
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color);
      color: #fff;
    }

    .stat-content {
      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #303133;
      }

      .stat-label {
        font-size: 13px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.category-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  }

  .card-header {
    position: relative;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .card-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .more-btn {
      color: #fff;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .card-body {
    padding: 20px 24px;

    .card-title {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }

    .card-code {
      margin: 0 0 8px 0;
      font-size: 12px;
      color: #909399;
    }

    .card-desc {
      margin: 0 0 16px 0;
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-stats {
      display: flex;
      gap: 24px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #606266;
        font-size: 13px;

        .el-icon {
          color: #409eff;
        }

        .stat-num {
          font-weight: 600;
          color: #303133;
        }
      }
    }
  }

  .card-footer {
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;

    .update-time {
      font-size: 12px;
      color: #909399;
    }
  }
}

.station-list {
  .rating {
    display: flex;
    align-items: center;
    gap: 4px;
    justify-content: center;

    .star {
      color: #f7ba2a;
    }
  }
}

@media (max-width: 768px) {
  .charging-station-types {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;

    .header-info h2 {
      font-size: 18px;
    }
  }
}
</style>
