<template>
  <div class="project-management">
    <!-- 页面头部 -->
    <div class="page-header fade-in">
      <div class="header-content">
        <div class="header-left">
          <h1>🚀 项目管理中心</h1>
          <p class="subtitle">Project Management Dashboard - 高阶组件演示</p>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="handleCreateProject">
            <el-icon><Plus /></el-icon>
            新建项目
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>
      
      <!-- 快速统计 -->
      <div class="quick-stats">
        <div 
          v-for="(stat, index) in quickStats" 
          :key="stat.label"
          class="stat-item"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div class="stat-icon" :style="{ background: stat.color }">
            <component :is="stat.icon" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索筛选区 -->
    <div class="search-section fade-in" style="--delay: 0.2s">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="项目名称">
          <el-input 
            v-model="searchForm.name" 
            placeholder="请输入项目名称"
            clearable
            prefix-icon="Search"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="进行中" value="active" />
            <el-option label="待启动" value="pending" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="searchForm.priority" placeholder="全部优先级" clearable style="width: 140px">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
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

    <!-- 视图切换 -->
    <div class="view-toggle fade-in" style="--delay: 0.3s">
      <el-radio-group v-model="viewMode" size="small">
        <el-radio-button label="table">
          <el-icon><Grid /></el-icon>
          表格视图
        </el-radio-button>
        <el-radio-button label="card">
          <el-icon><Menu /></el-icon>
          卡片视图
        </el-radio-button>
        <el-radio-button label="timeline">
          <el-icon><Clock /></el-icon>
          时间线
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 表格视图 -->
    <div v-if="viewMode === 'table'" class="table-section fade-in" style="--delay: 0.4s">
      <el-table 
        :data="filteredProjects" 
        border 
        stripe
        style="width: 100%"
        row-key="id"
        v-loading="tableLoading"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column type="index" label="序号" width="70" />
        <el-table-column prop="name" label="项目名称" min-width="200">
          <template #default="{ row }">
            <div class="project-name">
              <span class="name-text">{{ row.name }}</span>
              <el-tag 
                v-for="tag in row.tags.slice(0, 2)" 
                :key="tag"
                size="small"
                type="info"
                class="tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="leader" label="负责人" width="120" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" effect="dark">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)" effect="light">
              {{ getPriorityText(row.priority) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="180">
          <template #default="{ row }">
            <div class="progress-cell">
              <el-progress 
                :percentage="row.progress" 
                :color="getProgressColor(row.progress)"
                :stroke-width="10"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="budget" label="预算/支出" width="150">
          <template #default="{ row }">
            <div class="budget-cell">
              <div class="budget-text">¥{{ formatMoney(row.spent) }} / {{ formatMoney(row.budget) }}</div>
              <el-progress 
                :percentage="Math.round(row.spent / row.budget * 100)" 
                :show-text="false"
                :stroke-width="4"
                :color="row.spent / row.budget > 0.9 ? '#f56c6c' : '#67c23a'"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="teamSize" label="团队" width="80" align="center">
          <template #default="{ row }">
            <el-tooltip content="点击查看团队成员" placement="top">
              <el-button text type="primary" size="small">
                <el-icon><User /></el-icon>
                {{ row.teamSize }}人
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button text type="warning" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-popconfirm 
              title="确定删除该项目吗？"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button text type="danger" size="small">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="filteredProjects.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <!-- 卡片视图 -->
    <div v-else-if="viewMode === 'card'" class="card-section">
      <div class="project-cards">
        <div 
          v-for="(project, index) in filteredProjects" 
          :key="project.id"
          class="project-card fade-in"
          :style="{ '--delay': index * 0.1 + 's' }"
          @click="handleView(project)"
        >
          <div class="card-header">
            <div class="card-title">
              <h3>{{ project.name }}</h3>
              <el-tag :type="getStatusType(project.status)" size="small">
                {{ getStatusText(project.status) }}
              </el-tag>
            </div>
            <el-dropdown trigger="click" @click.stop>
              <el-button text circle>
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleEdit(project)">
                    <el-icon><Edit /></el-icon>
                    编辑
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDelete(project)">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          
          <p class="card-desc">{{ project.description }}</p>
          
          <div class="card-tags">
            <el-tag 
              v-for="tag in project.tags" 
              :key="tag"
              size="small"
              type="info"
              effect="plain"
            >
              {{ tag }}
            </el-tag>
          </div>
          
          <div class="card-progress">
            <div class="progress-header">
              <span>项目进度</span>
              <span class="progress-value">{{ project.progress }}%</span>
            </div>
            <el-progress 
              :percentage="project.progress" 
              :color="getProgressColor(project.progress)"
              :show-text="false"
              :stroke-width="8"
            />
          </div>
          
          <div class="card-footer">
            <div class="footer-item">
              <el-icon><User /></el-icon>
              <span>{{ project.leader }}</span>
            </div>
            <div class="footer-item">
              <el-icon><Calendar /></el-icon>
              <span>{{ project.endDate }}</span>
            </div>
            <div class="footer-item team">
              <div class="avatar-group">
                <el-avatar 
                  v-for="i in Math.min(project.teamSize, 3)" 
                  :key="i"
                  :size="24"
                  :style="{ backgroundColor: getAvatarColor(i) }"
                >
                  {{ String.fromCharCode(64 + i) }}
                </el-avatar>
                <el-avatar 
                  v-if="project.teamSize > 3" 
                  :size="24"
                  class="avatar-more"
                >
                  +{{ project.teamSize - 3 }}
                </el-avatar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 时间线视图 -->
    <div v-else-if="viewMode === 'timeline'" class="timeline-section fade-in" style="--delay: 0.4s">
      <el-timeline>
        <el-timeline-item 
          v-for="item in timelineData"
          :key="item.time"
          :timestamp="item.time"
          :type="item.type as any"
          :hollow="item.type === 'primary'"
          placement="top"
        >
          <el-card class="timeline-card" shadow="hover">
            <template #header>
              <div class="timeline-header">
                <span class="timeline-title">{{ item.title }}</span>
              </div>
            </template>
            <p>{{ item.content }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 项目详情/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'create' ? '新建项目' : dialogType === 'edit' ? '编辑项目' : '项目详情'"
      width="700px"
      destroy-on-close
      class="project-dialog"
    >
      <el-form 
        ref="formRef"
        :model="projectForm" 
        :rules="formRules"
        label-width="100px"
        :disabled="dialogType === 'view'"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="projectForm.name" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="projectForm.leader" placeholder="请输入负责人" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="项目描述" prop="description">
          <el-input 
            v-model="projectForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入项目描述" 
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目状态" prop="status">
              <el-select v-model="projectForm.status" style="width: 100%">
                <el-option label="进行中" value="active" />
                <el-option label="待启动" value="pending" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-select v-model="projectForm.priority" style="width: 100%">
                <el-option label="高" value="high" />
                <el-option label="中" value="medium" />
                <el-option label="低" value="low" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker 
                v-model="projectForm.startDate" 
                type="date" 
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker 
                v-model="projectForm.endDate" 
                type="date" 
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目预算" prop="budget">
              <el-input-number 
                v-model="projectForm.budget" 
                :min="0"
                :step="10000"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="团队人数" prop="teamSize">
              <el-input-number 
                v-model="projectForm.teamSize" 
                :min="1"
                :max="50"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="项目进度" prop="progress" v-if="dialogType !== 'create'">
          <el-slider v-model="projectForm.progress" :marks="progressMarks" />
        </el-form-item>
        
        <el-form-item label="项目标签" prop="tags">
          <el-select 
            v-model="projectForm.tags" 
            multiple
            filterable
            allow-create
            placeholder="选择或输入标签"
            style="width: 100%"
          >
            <el-option label="Vue3" value="Vue3" />
            <el-option label="React" value="React" />
            <el-option label="TypeScript" value="TypeScript" />
            <el-option label="Node.js" value="Node.js" />
            <el-option label="微前端" value="微前端" />
            <el-option label="性能优化" value="性能优化" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button 
            v-if="dialogType !== 'view'"
            type="primary" 
            @click="handleSubmit"
            :loading="submitLoading"
          >
            {{ dialogType === 'create' ? '创建' : '保存' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  Plus, Refresh, Search, RefreshLeft, Grid, Menu, Clock,
  User, View, Edit, Delete, MoreFilled, Calendar,
  Document, Folder, DataAnalysis, TrendCharts
} from '@element-plus/icons-vue'
import { mockProjects, mockTimelineData } from '@/mock'

defineOptions({
  name: 'ProjectManagement'
})

// 快速统计数据
const quickStats = computed(() => [
  { icon: Folder, value: mockProjects.length, label: '总项目数', color: '#667eea' },
  { icon: TrendCharts, value: mockProjects.filter(p => p.status === 'active').length, label: '进行中', color: '#43e97b' },
  { icon: Document, value: mockProjects.filter(p => p.status === 'completed').length, label: '已完成', color: '#4facfe' },
  { icon: DataAnalysis, value: Math.round(mockProjects.reduce((a, b) => a + b.progress, 0) / mockProjects.length) + '%', label: '平均进度', color: '#f5576c' }
])

// 搜索表单
const searchForm = reactive({
  name: '',
  status: '',
  priority: ''
})

// 视图模式
const viewMode = ref<'table' | 'card' | 'timeline'>('table')

// 表格加载状态
const tableLoading = ref(false)

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 弹窗相关
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'edit' | 'view'>('create')
const formRef = ref<FormInstance>()
const submitLoading = ref(false)

// 项目表单
const projectForm = reactive({
  id: null as number | null,
  name: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  leader: '',
  teamSize: 1,
  startDate: '',
  endDate: '',
  budget: 100000,
  spent: 0,
  progress: 0,
  tags: [] as string[]
})

// 表单验证规则
const formRules: FormRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  leader: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  status: [{ required: true, message: '请选择项目状态', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }]
}

// 进度标记
const progressMarks = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%'
}

// 时间线数据
const timelineData = mockTimelineData

// 过滤后的项目列表
const filteredProjects = computed(() => {
  return mockProjects.filter(project => {
    const nameMatch = !searchForm.name || project.name.includes(searchForm.name)
    const statusMatch = !searchForm.status || project.status === searchForm.status
    const priorityMatch = !searchForm.priority || project.priority === searchForm.priority
    return nameMatch && statusMatch && priorityMatch
  })
})

// 状态相关方法
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    active: 'success',
    pending: 'warning',
    completed: 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    active: '进行中',
    pending: '待启动',
    completed: '已完成'
  }
  return texts[status] || status
}

// 优先级相关方法
const getPriorityType = (priority: string) => {
  const types: Record<string, string> = {
    high: 'danger',
    medium: 'warning',
    low: 'success'
  }
  return types[priority] || 'info'
}

const getPriorityText = (priority: string) => {
  const texts: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return texts[priority] || priority
}

// 进度颜色
const getProgressColor = (progress: number) => {
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
}

// 格式化金额
const formatMoney = (value: number) => {
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + '万'
  }
  return value.toString()
}

// 头像颜色
const getAvatarColor = (index: number) => {
  const colors = ['#667eea', '#f5576c', '#43e97b', '#4facfe', '#ffa726']
  return colors[index % colors.length]
}

// 搜索
const handleSearch = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('搜索完成')
  }, 500)
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.status = ''
  searchForm.priority = ''
}

// 刷新
const handleRefresh = () => {
  tableLoading.value = true
  setTimeout(() => {
    tableLoading.value = false
    ElMessage.success('数据已刷新')
  }, 800)
}

// 新建项目
const handleCreateProject = () => {
  dialogType.value = 'create'
  resetForm()
  dialogVisible.value = true
}

// 查看项目
const handleView = (row: any) => {
  dialogType.value = 'view'
  Object.assign(projectForm, row)
  dialogVisible.value = true
}

// 编辑项目
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  Object.assign(projectForm, row)
  dialogVisible.value = true
}

// 删除项目
const handleDelete = (row: any) => {
  ElMessage.success(`项目 "${row.name}" 已删除`)
}

// 重置表单
const resetForm = () => {
  Object.assign(projectForm, {
    id: null,
    name: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    leader: '',
    teamSize: 1,
    startDate: '',
    endDate: '',
    budget: 100000,
    spent: 0,
    progress: 0,
    tags: []
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
        dialogVisible.value = false
        ElMessage.success(dialogType.value === 'create' ? '项目创建成功' : '项目更新成功')
      }, 800)
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

.project-management {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100%;
}

// 页面头部
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  color: #fff;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    
    h1 {
      font-size: 24px;
      margin: 0 0 8px 0;
    }
    
    .subtitle {
      opacity: 0.8;
      font-size: 14px;
      margin: 0;
    }
    
    .header-right {
      display: flex;
      gap: 12px;
    }
  }
  
  .quick-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    
    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 500px) {
      grid-template-columns: 1fr;
    }
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      animation: fadeIn 0.5s ease-out both;
      animation-delay: var(--delay, 0s);
      
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #fff;
      }
      
      .stat-info {
        display: flex;
        flex-direction: column;
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
        }
        
        .stat-label {
          font-size: 13px;
          opacity: 0.8;
        }
      }
    }
  }
}

// 搜索区
.search-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  .search-form {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }
}

// 视图切换
.view-toggle {
  margin-bottom: 20px;
  
  :deep(.el-radio-button__inner) {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

// 表格区
.table-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  .project-name {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    
    .name-text {
      font-weight: 500;
      color: #303133;
    }
    
    .tag {
      font-size: 10px;
    }
  }
  
  .progress-cell {
    padding-right: 10px;
  }
  
  .budget-cell {
    .budget-text {
      font-size: 12px;
      color: #606266;
      margin-bottom: 4px;
    }
  }
  
  .pagination-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

// 卡片区
.card-section {
  .project-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }
  
  .project-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      
      .card-title {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        
        h3 {
          margin: 0;
          font-size: 16px;
          color: #303133;
        }
      }
    }
    
    .card-desc {
      color: #909399;
      font-size: 13px;
      margin: 0 0 12px 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .card-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }
    
    .card-progress {
      margin-bottom: 16px;
      
      .progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 13px;
        color: #606266;
        
        .progress-value {
          font-weight: 600;
          color: #303133;
        }
      }
    }
    
    .card-footer {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
      
      .footer-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #909399;
        
        &.team {
          margin-left: auto;
          
          .avatar-group {
            display: flex;
            
            .el-avatar {
              border: 2px solid #fff;
              margin-left: -8px;
              
              &:first-child {
                margin-left: 0;
              }
            }
            
            .avatar-more {
              background: #909399;
              font-size: 10px;
            }
          }
        }
      }
    }
  }
}

// 时间线区
.timeline-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  .timeline-card {
    .timeline-header {
      .timeline-title {
        font-weight: 600;
        color: #303133;
      }
    }
    
    p {
      margin: 0;
      color: #606266;
      font-size: 14px;
    }
  }
}

// 弹窗样式
.project-dialog {
  :deep(.el-dialog__body) {
    padding-top: 10px;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

// 响应式
@media (max-width: 768px) {
  .project-management {
    padding: 12px;
  }
  
  .page-header {
    padding: 16px;
    
    .header-content {
      flex-direction: column;
      gap: 16px;
      
      .header-right {
        width: 100%;
        
        .el-button {
          flex: 1;
        }
      }
    }
  }
}
</style>
