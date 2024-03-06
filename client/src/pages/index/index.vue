<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>

    <button @click="handleFileSelect">选择文件</button>
    <button @click="handleUpload">上传文件</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const title = ref('Hello')
const file = ref<UniApp.ChooseFile>()

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
    url: 'http://127.0.0.1:7001/api/WECHAT/xlsx/import', // 上传接口 URL
    filePath: file.value.path,
    name: 'file',
    success(res) {
      console.log('res', JSON.parse(res.data)?.data || [])
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
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
