<template>
  <div ref="divRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useEcharts from '@/hooks/useEcharts'
import type { pieData } from '@/types/powerScreen/pieData'
import type { Ref } from 'vue'
interface IProps {
  pieDatas: any[]
  width?: string
  height?: string
}

const props = defineProps<IProps>()

// 获取div的DOM对象
const divRef = ref() as Ref<HTMLDivElement>

let myChart: {
  echartInstance: any
  setOption?: (option: any) => void
  resizeFn?: () => void
} | null = null
onMounted(() => {
  setupEchart(props.pieDatas)
  if (myChart && myChart.resizeFn) {
    window.addEventListener('resize', myChart.resizeFn)
  }
})
// 监听echartDatas的变化
watch(
  () => props.pieDatas,
  (newVal) => {
    setupEchart(newVal)
  }
)
function setupEchart(pieDatas: pieData) {
  // 防止重复创建节点(在网络请求刷新数据的时候)
  if (!myChart) {
    myChart = useEcharts(divRef)
  }
  let computedOption = setOption(pieDatas)
  myChart.echartInstance.setOption(computedOption)
}
function setOption(pieDatas: pieData) {
  let data = pieDatas.map((item) => {
    return {
      value: item.value,
      name: item.station_name
    }
  })
  let total = pieDatas.reduce((a, b) => {
    return a + b.value * 1
  }, 0)

  // Base options suitable for larger screens
  const baseOption = {
    color: pieDatas.map((item) => item.color),
    title: {
      text: `{nameSty| 充电桩总数}\n{number|${total}}`,
      top: '50%',
      left: '30%',
      textStyle: {
        rich: {
          nameSty: {
            fontSize: 12,
            color: 'white',
            padding: [5, 0]
          },
          number: {
            fontSize: 14,
            color: 'white',
            padding: [4, 0, 0, 10]
          }
        }
      }
    },
    legend: {
      orient: 'vertical',
      right: '4%',
      top: '16%',
      itemGap: 16,
      itemWidth: 10,
      itemHeight: 10,
      icon: 'rect',
      formatter: function (name: string) {
        let currentItem = pieDatas.find((item) => item.station_name === name)
        return (
          '{nameSty|' +
          currentItem?.station_name +
          '}\n' +
          '{numberSty|' +
          currentItem?.value +
          '个 }' +
          '{preSty|' +
          currentItem?.percentage +
          '}'
        )
      },
      textStyle: {
        rich: {
          nameSty: {
            fontSize: 12,
            color: '#FFFFFF',
            padding: [10, 14]
          },
          numberSty: {
            fontSize: 12,
            color: '#40E6ff',
            padding: [0, 0, 0, 14]
          },
          preSty: {
            fontSize: 12,
            color: '#40E6ff'
          }
        }
      }
    },
    series: [
      {
        type: 'pie',
        center: ['40%', '57%'],
        radius: ['30%', '75%'],
        label: {
          show: false
        },
        data: data,
        roseType: 'area'
      }
    ]
  }

  // Responsive options
  const mediaOption = [
    {
      // Apply these options when container width is <= 768px
      query: { maxWidth: 768 },
      option: {
        title: {
          top: '10%',
          left: 'center',
          textStyle: {
            rich: {
              nameSty: { fontSize: 11 },
              number: { fontSize: 13, padding: [4, 0, 0, 0] }
            }
          }
        },
        legend: {
          orient: 'horizontal',
          bottom: '5%',
          left: 'center',
          top: 'auto',
          right: 'auto',
          itemGap: 10,
          textStyle: {
            rich: {
              nameSty: { fontSize: 11, padding: [0, 5, 0, 0] },
              numberSty: { fontSize: 11, padding: [0, 5, 0, 0] },
              preSty: { fontSize: 11 }
            }
          }
        },
        series: [
          {
            center: ['50%', '55%'],
            radius: ['25%', '60%']
          }
        ]
      }
    }
  ]

  // Combine base and media options
  return {
    baseOption: baseOption,
    media: mediaOption
  }
}
</script>
<style lang="less" scoped></style>
