<template>
  <view class="content">
    <button @click="handleFileSelect">选择文件</button>
    <button @click="handleUpload">上传文件</button>

    <view class="data-wrap">
      <view class="section">
        <view class="section__title">月份：</view>
        <picker mode="multiSelector" :range="[years, months]"  :value="date" @change="bindDateChange">
          <view class="picker" v-if="date[0] !== null && date[1] !== null">
            {{ years[date[0]] }}{{ months[date[1]] }}
          </view>
          <view class="picker" v-else>
            请选择月份
          </view>
        </picker>
      </view>
      <EpTable :scrollWidth="scrollWidth" :loading="loading" :data="tableData" :columns="dealColumns" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const file = ref<UniApp.ChooseFile>()
import EpTable from '@/components/Table/index.vue'
import type { Columns } from '@/components/Table/index.vue';
import { delayQuerySelector } from '@/utils/selector';
import request from '@/http/index';
import { onLoad } from '@dcloudio/uni-app';

const years = ref(Array.from({ length: 50 }, (v, i) => `${2000 + i}年`)) // const years
const months = ref(Array.from({ length: 12 }, (v, i) => `${i + 1}月`)) //

const loading = ref(false)
const tableData = ref<any>([])
const columns = ref<Columns>([
  {
    title: '编号',
    key: 'code',
    width: 100,
    fixed: 'left',
    originWidth: 100
  },
  {
    title: '所属月份',
    key: 'month',
    width: 150,
    fixed: 'left',
    originWidth: 150
  },
  {
    title: '科室',
    key: 'department',
    width: 200,
    originWidth: 200
  },
  {
    title: '护理组',
    key: 'nursing_group',
    width: 200,
    originWidth: 200
  },
  {
    title: '检验试剂',
    key: 'laboratory_reagents',
    width: 200,
    originWidth: 200
  },
  {
    title: '介入材料',
    key: 'interventional_materials',
    width: 200,
    originWidth: 200
  },
  {
    title: '麻醉材料',
    key: 'anesthesia_materials',
    width: 200,
    originWidth: 200
  },
  {
    title: '手术器材',
    key: 'surgical_equipment',
    width: 200,
    originWidth: 200
  },
  {
    title: '项目收费',
    key: 'item_charges',
    width: 200,
    originWidth: 200
  },
  {
    title: '血透材料',
    key: 'hemodialysis_materials',
    width: 200,
    originWidth: 200
  },
  {
    title: '一般医用材料',
    key: 'general_medical_supplies',
    width: 200,
    originWidth: 200
  },
  {
    title: '医用耗材',
    key: 'medical_consumables',
    width: 200,
    originWidth: 200
  },
  {
    title: '植入型材料',
    key: 'implant_materials',
    width: 160,
    originWidth: 160
  },
  {
    title: '合计',
    key: 'total',
    width: 200,
    fixed: 'right',
    originWidth: 200
  },
])
const dealColumns = computed(() => {
  return columns.value.map((v) => {
    return { ...v, width: deviceOrientation.value === 'landscape' ? v.originWidth * 0.5 : v.originWidth }
  })
})

function handleFileSelect() {
  uni.chooseMessageFile({
    count: 1,
    type: 'file',
    success(res) {
      file.value = res.tempFiles[0]
    }
  });
};

function handleUpload() {
  if (!file.value) {
    uni.showToast({
      title: '请先选择文件',
      icon: 'none'
    });
    return;
  }

  uni.uploadFile({
    url: 'http://192.168.31.13:7001/api/WECHAT/xlsx/import', // 上传接口 URL
    filePath: file.value.path,
    name: 'file',
    success(res) {
      uni.showToast({
        title: '上传成功',
        icon: 'success'
      });
    },
    fail(err) {
      console.error('上传失败', err);
      uni.showToast({
        title: '上传失败',
        icon: 'none'
      });
    }
  });
};
const deviceOrientation = ref<'portrait' | 'landscape'>('portrait')
const scrollWidth = ref('')

const date = ref<[number | null, number | null]>([24, 2])
const bindDateChange = (e: any) => {
  date.value = e.target.value
  fetchList()
}
async function fetchList() {
  loading.value = true
  let dateStr = ''
  if (date.value[0] !== null && date.value[1] !== null) {
    let month = `${parseInt(months.value[date.value[1]])}`
    month = month.length === 1 ? `0${month}` : month
    dateStr = `${parseInt(years.value[date.value[0]])}_${month}`
  }
  const res = await request.request<{
    rows: {
      id: number;
      code?: any;
      month: string;
      department: string;
      nursing_group: string;
      laboratory_reagents: string;
      interventional_materials: string;
      anesthesia_materials: string;
      surgical_equipment: string;
      item_charges: string;
      hemodialysis_materials: string;
      general_medical_supplies: string;
      medical_consumables: string;
      implant_materials: string;
      total: string;
      createdAt: string;
    }[];
    count: number;
  }>({
    url: "http://192.168.31.13:7001/api/WECHAT/xlsx/list",
    params: {
      month: dateStr
    }
  })

  loading.value = false
  tableData.value = (res.data.rows || []).map(v => {
    return {
      ...v,
      code: v.code || '-'
    }
  })
}

onLoad(async () => {
  try {
    const sysInfo = uni.getSystemInfoSync()
    deviceOrientation.value = sysInfo.deviceOrientation
    if (deviceOrientation.value === 'landscape') {
      const res = await delayQuerySelector(null, '.data-wrap')
      if (res[0] && res[0].width) {
        scrollWidth.value = ((sysInfo.safeArea?.width || 0) - res[0].width - 35) + 'PX'
      }
    }
  } catch (error) {
    console.error('获取系统信息失败！', error)
  }

  fetchList()
})
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 100rpx;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
