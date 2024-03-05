<template>
  <view class="index">
    <button @tap="handleFileSelect">选择文件</button>
    <button @tap="handleUpload">上传文件</button>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro';
import { ref } from 'vue'
import './index.scss'
const file = ref<Taro.chooseMessageFile.ChooseFile>()
function handleFileSelect () {
  Taro.chooseMessageFile({
    count: 1,
    type: 'file',
    success(res) {
      file.value = res.tempFiles[0]
    }
  });
};
handleUpload()
function handleUpload() {
  if (!file.value) {
    Taro.showToast({
      title: '请先选择文件',
      icon: 'none'
    });
    return;
  }

  Taro.uploadFile({
    url: 'http://127.0.0.1:7001/api/WECHAT/xlsx/import', // 上传接口 URL
    filePath: file.value.path,
    name: 'file',
    success(res) {
      console.log('res', JSON.parse(res.data)?.data || [])
      Taro.showToast({
        title: '上传成功',
        icon: 'success'
      });
    },
    fail(err) {
      console.error('上传失败', err);
      Taro.showToast({
        title: '上传失败',
        icon: 'none'
      });
    }
  });
};

</script>
