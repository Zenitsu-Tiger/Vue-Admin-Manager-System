<template>
  <div class="data-visualization">
    <!-- 顶部统计卡片 -->
    <div class="stats-row">
      <div 
        v-for="(stat, index) in statsCards" 
        :key="stat.title"
        class="stat-card"
        :style="{ 
          '--delay': index * 0.1 + 's',
          '--gradient': stat.gradient
        }"
      >
        <div class="stat-icon">
          <component :is="stat.icon" />
        </div>
        <div class="stat-info">
          <div class="stat-value">
            <span class="number">{{ animatedStats[stat.key] || 0 }}</span>
            <span class="unit">{{ stat.unit }}</span>
          </div>
          <div class="stat-title">{{ stat.title }}</div>
          <div class="stat-change" :class="stat.trend">
            <el-icon><Top v-if="stat.trend === 'up'" /><Bottom v-else /></el-icon>
            <span>{{ stat.change }}</span>
          </div>
        </div>
        <div class="stat-wave"></div>
      </div>
    </div>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 销售趋势图 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <div class="chart-card fade-in-up" style="--delay: 0.2s">
          <div class="chart-header">
            <h3>📈 销售趋势分析</h3>
            <el-radio-group v-model="trendType" size="small">
              <el-radio-button label="sales">销售额</el-radio-button>
              <el-radio-button label="orders">订单量</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container" ref="trendChartRef"></div>
        </div>
      </el-col>

      <!-- 饼图 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <div class="chart-card fade-in-up" style="--delay: 0.3s">
          <div class="chart-header">
            <h3>🎯 产品分类占比</h3>
          </div>
          <div class="chart-container" ref="pieChartRef"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <!-- 雷达图 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8">
        <div class="chart-card fade-in-up" style="--delay: 0.4s">
          <div class="chart-header">
            <h3>🎮 技能雷达图</h3>
          </div>
          <div class="chart-container" ref="radarChartRef"></div>
        </div>
      </el-col>

      <!-- 柱状图排名 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8">
        <div class="chart-card fade-in-up" style="--delay: 0.5s">
          <div class="chart-header">
            <h3>🏆 区域销售排名</h3>
          </div>
          <div class="chart-container" ref="barChartRef"></div>
        </div>
      </el-col>

      <!-- 仪表盘 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <div class="chart-card fade-in-up" style="--delay: 0.6s">
          <div class="chart-header">
            <h3>⚡ 系统资源监控</h3>
          </div>
          <div class="gauge-grid">
            <div class="gauge-item" ref="cpuGaugeRef">
              <div class="gauge-label">CPU</div>
            </div>
            <div class="gauge-item" ref="memoryGaugeRef">
              <div class="gauge-label">内存</div>
            </div>
            <div class="gauge-item" ref="diskGaugeRef">
              <div class="gauge-label">磁盘</div>
            </div>
            <div class="gauge-item" ref="networkGaugeRef">
              <div class="gauge-label">网络</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <!-- 热力图 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <div class="chart-card fade-in-up" style="--delay: 0.7s">
          <div class="chart-header">
            <h3>🔥 活跃度热力图</h3>
            <span class="chart-subtitle">最近一周用户活跃时段分布</span>
          </div>
          <div class="chart-container" ref="heatmapChartRef"></div>
        </div>
      </el-col>

      <!-- 实时日志 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <div class="chart-card fade-in-up" style="--delay: 0.8s">
          <div class="chart-header">
            <h3>📋 实时日志</h3>
            <el-badge :value="unreadLogs" class="log-badge">
              <el-button size="small" text type="primary">查看全部</el-button>
            </el-badge>
          </div>
          <div class="log-container">
            <transition-group name="log-slide" tag="div">
              <div 
                v-for="log in displayLogs" 
                :key="log.id" 
                class="log-item"
                :class="log.type"
              >
                <div class="log-icon">
                  <el-icon v-if="log.type === 'info'"><InfoFilled /></el-icon>
                  <el-icon v-else-if="log.type === 'success'"><SuccessFilled /></el-icon>
                  <el-icon v-else-if="log.type === 'warning'"><WarningFilled /></el-icon>
                  <el-icon v-else><CircleCloseFilled /></el-icon>
                </div>
                <div class="log-content">
                  <div class="log-message">{{ log.message }}</div>
                  <div class="log-meta">
                    <span class="log-module">{{ log.module }}</span>
                    <span class="log-time">{{ log.time }}</span>
                  </div>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, reactive } from 'vue'
import * as echarts from 'echarts'
import { 
  Top, Bottom, InfoFilled, SuccessFilled, 
  WarningFilled, CircleCloseFilled,
  TrendCharts, ShoppingCart, User, Coin
} from '@element-plus/icons-vue'
import { 
  mockSalesData, 
  mockSkillsData, 
  mockLogs, 
  mockHeatmapData,
  mockGaugeData 
} from '@/mock'

// 定义 name
defineOptions({
  name: 'DataVisualization'
})

// 统计卡片配置
const statsCards = [
  { 
    key: 'totalSales', 
    title: '总销售额', 
    unit: '万', 
    icon: Coin,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    change: '+12.5%',
    trend: 'up'
  },
  { 
    key: 'totalOrders', 
    title: '订单总数', 
    unit: '单', 
    icon: ShoppingCart,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    change: '+8.2%',
    trend: 'up'
  },
  { 
    key: 'newCustomers', 
    title: '新增用户', 
    unit: '人', 
    icon: User,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    change: '+23.1%',
    trend: 'up'
  },
  { 
    key: 'conversionRate', 
    title: '转化率', 
    unit: '%', 
    icon: TrendCharts,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    change: '-2.3%',
    trend: 'down'
  }
]

// 动画数字
const animatedStats = reactive<Record<string, number>>({
  totalSales: 0,
  totalOrders: 0,
  newCustomers: 0,
  conversionRate: 0
})

// 图表引用
const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
const radarChartRef = ref<HTMLElement>()
const barChartRef = ref<HTMLElement>()
const heatmapChartRef = ref<HTMLElement>()
const cpuGaugeRef = ref<HTMLElement>()
const memoryGaugeRef = ref<HTMLElement>()
const diskGaugeRef = ref<HTMLElement>()
const networkGaugeRef = ref<HTMLElement>()

// 图表实例
let charts: echarts.ECharts[] = []

// 趋势类型
const trendType = ref('sales')

// 日志相关
const displayLogs = ref(mockLogs.slice(0, 5))
const unreadLogs = ref(3)

// 数字动画函数
const animateNumber = (key: string, target: number, duration: number = 1500) => {
  const start = animatedStats[key]
  const range = target - start
  const startTime = Date.now()
  
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    // 使用 easeOutQuart 缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 4)
    animatedStats[key] = Math.round(start + range * easeProgress)
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }
  
  requestAnimationFrame(animate)
}

// 初始化趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  const chart = echarts.init(trendChartRef.value)
  charts.push(chart)
  
  const updateChart = () => {
    const dataIndex = trendType.value === 'sales' ? 0 : 1
    const data = mockSalesData.monthlyTrend.series[dataIndex]
    
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: mockSalesData.monthlyTrend.categories,
        axisLine: { lineStyle: { color: '#e0e0e0' } },
        axisLabel: { color: '#666' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
        axisLabel: { color: '#666' }
      },
      series: [{
        name: data.name,
        type: 'line',
        smooth: true,
        symbolSize: 8,
        itemStyle: {
          color: trendType.value === 'sales' ? '#667eea' : '#f5576c'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: trendType.value === 'sales' ? 'rgba(102, 126, 234, 0.4)' : 'rgba(245, 87, 108, 0.4)' },
            { offset: 1, color: trendType.value === 'sales' ? 'rgba(102, 126, 234, 0.05)' : 'rgba(245, 87, 108, 0.05)' }
          ])
        },
        data: data.data
      }]
    })
  }
  
  updateChart()
  watch(trendType, updateChart)
}

// 初始化饼图
const initPieChart = () => {
  if (!pieChartRef.value) return
  
  const chart = echarts.init(pieChartRef.value)
  charts.push(chart)
  
  chart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: { color: '#fff' },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#666', fontSize: 12 }
    },
    series: [{
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' }
      },
      labelLine: { show: false },
      data: mockSalesData.categoryDistribution.map(item => ({
        value: item.value,
        name: item.name,
        itemStyle: { color: item.color }
      }))
    }]
  })
}

// 初始化雷达图
const initRadarChart = () => {
  if (!radarChartRef.value) return
  
  const chart = echarts.init(radarChartRef.value)
  charts.push(chart)
  
  chart.setOption({
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: { color: '#fff' }
    },
    legend: {
      bottom: 0,
      textStyle: { color: '#666', fontSize: 12 },
      itemWidth: 12,
      itemHeight: 12
    },
    radar: {
      indicator: mockSkillsData.indicators,
      splitNumber: 4,
      axisName: {
        color: '#666',
        fontSize: 11
      },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
      splitArea: { areaStyle: { color: ['rgba(102, 126, 234, 0.02)', 'rgba(102, 126, 234, 0.05)'] } },
      axisLine: { lineStyle: { color: '#e0e0e0' } }
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: mockSkillsData.series[0].value,
          name: mockSkillsData.series[0].name,
          areaStyle: { color: 'rgba(102, 126, 234, 0.3)' },
          lineStyle: { color: '#667eea', width: 2 },
          itemStyle: { color: '#667eea' }
        },
        {
          value: mockSkillsData.series[1].value,
          name: mockSkillsData.series[1].name,
          areaStyle: { color: 'rgba(245, 87, 108, 0.3)' },
          lineStyle: { color: '#f5576c', width: 2 },
          itemStyle: { color: '#f5576c' }
        }
      ]
    }]
  })
}

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return
  
  const chart = echarts.init(barChartRef.value)
  charts.push(chart)
  
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: { color: '#fff' },
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '15%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
      axisLabel: { color: '#666' }
    },
    yAxis: {
      type: 'category',
      data: mockSalesData.regionRanking.map(item => item.name).reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#666' }
    },
    series: [{
      type: 'bar',
      data: mockSalesData.regionRanking.map((item, index) => ({
        value: item.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: ['#667eea', '#f5576c', '#4facfe', '#43e97b', '#ffecd2'][index] },
            { offset: 1, color: ['#764ba2', '#f093fb', '#00f2fe', '#38f9d7', '#fcb69f'][index] }
          ]),
          borderRadius: [0, 4, 4, 0]
        }
      })).reverse(),
      barWidth: 20,
      label: {
        show: true,
        position: 'right',
        formatter: (params: any) => {
          const item = mockSalesData.regionRanking[4 - params.dataIndex]
          return `${item.percentage}%`
        },
        color: '#666',
        fontSize: 11
      }
    }]
  })
}

// 初始化热力图
const initHeatmapChart = () => {
  if (!heatmapChartRef.value) return
  
  const chart = echarts.init(heatmapChartRef.value)
  charts.push(chart)
  
  chart.setOption({
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: { color: '#fff' },
      formatter: (params: any) => {
        return `${mockHeatmapData.days[params.value[1]]} ${mockHeatmapData.hours[params.value[0]]}<br/>活跃度: ${params.value[2]}`
      }
    },
    grid: {
      left: '8%',
      right: '8%',
      bottom: '15%',
      top: '3%'
    },
    xAxis: {
      type: 'category',
      data: mockHeatmapData.hours,
      splitArea: { show: true },
      axisLabel: { color: '#666', fontSize: 10, interval: 1 }
    },
    yAxis: {
      type: 'category',
      data: mockHeatmapData.days,
      splitArea: { show: true },
      axisLabel: { color: '#666', fontSize: 11 }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0',
      itemWidth: 12,
      itemHeight: 80,
      textStyle: { color: '#666', fontSize: 10 },
      inRange: {
        color: ['#f0f7ff', '#4facfe', '#667eea', '#764ba2']
      }
    },
    series: [{
      type: 'heatmap',
      data: mockHeatmapData.data,
      label: { show: false },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' }
      }
    }]
  })
}

// 初始化仪表盘
const initGaugeCharts = () => {
  const gaugeRefs = [
    { ref: cpuGaugeRef.value, value: mockGaugeData.cpu, color: '#667eea' },
    { ref: memoryGaugeRef.value, value: mockGaugeData.memory, color: '#f5576c' },
    { ref: diskGaugeRef.value, value: mockGaugeData.disk, color: '#43e97b' },
    { ref: networkGaugeRef.value, value: mockGaugeData.network, color: '#4facfe' }
  ]
  
  gaugeRefs.forEach(({ ref, value, color }) => {
    if (!ref) return
    
    const chart = echarts.init(ref)
    charts.push(chart)
    
    chart.setOption({
      series: [{
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 5,
        radius: '90%',
        center: ['50%', '60%'],
        itemStyle: { color },
        progress: {
          show: true,
          width: 8,
          roundCap: true
        },
        pointer: { show: false },
        axisLine: {
          lineStyle: { width: 8, color: [[1, '#f0f0f0']] }
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 18,
          fontWeight: 'bold',
          offsetCenter: [0, '10%'],
          formatter: '{value}%',
          color
        },
        data: [{ value }]
      }]
    })
  })
}

// 窗口大小改变处理
const handleResize = () => {
  charts.forEach(chart => chart.resize())
}

onMounted(() => {
  // 启动数字动画
  setTimeout(() => {
    animateNumber('totalSales', Math.round(mockSalesData.realtimeStats.totalSales / 10000))
    animateNumber('totalOrders', mockSalesData.realtimeStats.totalOrders)
    animateNumber('newCustomers', mockSalesData.realtimeStats.newCustomers)
    animateNumber('conversionRate', mockSalesData.realtimeStats.conversionRate * 10)
  }, 300)
  
  // 初始化图表
  setTimeout(() => {
    initTrendChart()
    initPieChart()
    initRadarChart()
    initBarChart()
    initHeatmapChart()
    initGaugeCharts()
  }, 100)
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  charts.forEach(chart => chart.dispose())
  charts = []
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="less" scoped>
.data-visualization {
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  min-height: 100%;
}

// 动画定义
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes waveMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out both;
  animation-delay: var(--delay, 0s);
}

// 统计卡片
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  position: relative;
  background: var(--gradient);
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out both;
  animation-delay: var(--delay, 0s);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
  
  .stat-icon {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 48px;
    opacity: 0.3;
  }
  
  .stat-info {
    position: relative;
    z-index: 1;
  }
  
  .stat-value {
    .number {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -1px;
    }
    .unit {
      font-size: 14px;
      margin-left: 4px;
      opacity: 0.8;
    }
  }
  
  .stat-title {
    font-size: 14px;
    margin-top: 8px;
    opacity: 0.9;
  }
  
  .stat-change {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 12px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    background: rgba(255, 255, 255, 0.2);
    
    &.up { color: #b8ffc8; }
    &.down { color: #ffc8c8; }
  }
  
  .stat-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255,255,255,0.1), 
      transparent
    );
    animation: waveMove 3s ease-in-out infinite;
  }
}

// 图表卡片
.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  height: 100%;
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
    
    .chart-subtitle {
      font-size: 12px;
      color: #999;
    }
  }
  
  .chart-container {
    height: 280px;
  }
}

// 仪表盘网格
.gauge-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  
  .gauge-item {
    height: 130px;
    position: relative;
    
    .gauge-label {
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: #666;
    }
  }
}

// 日志容器
.log-container {
  max-height: 320px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f0f2f5;
    transform: translateX(4px);
  }
  
  .log-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 14px;
  }
  
  &.info .log-icon {
    background: rgba(64, 158, 255, 0.1);
    color: #409eff;
  }
  
  &.success .log-icon {
    background: rgba(103, 194, 58, 0.1);
    color: #67c23a;
  }
  
  &.warning .log-icon {
    background: rgba(230, 162, 60, 0.1);
    color: #e6a23c;
  }
  
  &.error .log-icon {
    background: rgba(245, 108, 108, 0.1);
    color: #f56c6c;
  }
  
  .log-content {
    flex: 1;
    min-width: 0;
    
    .log-message {
      font-size: 13px;
      color: #333;
      line-height: 1.4;
      word-break: break-word;
    }
    
    .log-meta {
      display: flex;
      gap: 12px;
      margin-top: 6px;
      font-size: 11px;
      color: #999;
      
      .log-module {
        padding: 2px 6px;
        background: #f0f0f0;
        border-radius: 4px;
      }
    }
  }
}

// 日志滑入动画
.log-slide-enter-active,
.log-slide-leave-active {
  transition: all 0.3s ease;
}

.log-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.log-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

// 响应式调整
@media (max-width: 768px) {
  .data-visualization {
    padding: 12px;
  }
  
  .stat-card {
    padding: 16px;
    
    .stat-value .number {
      font-size: 28px;
    }
  }
  
  .chart-card {
    padding: 16px;
    margin-bottom: 16px;
    
    .chart-container {
      height: 220px;
    }
  }
}
</style>
