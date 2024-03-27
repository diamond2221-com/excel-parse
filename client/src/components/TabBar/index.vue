<template>
	<view class="tab">
		<view v-for="(item, index) in list" :key="index" class="tab-item" @click="switchTab(item, index)">
			<image
                class="tab_img"
                :src="currentIndex == index ? item.selectedIconPath : item.iconPath"
            />
			<view
                class="tab_text"
                :style="{ color: currentIndex == index ? selectedColor : color }"
            >
                {{ item.text }}
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { onShow } from '@dcloudio/uni-app';

const props = withDefaults(defineProps<{ selectedIndex: number }>(), {
    selectedIndex: 0
})

const color = ref("#666666")
const selectedColor = ref("#00BAB2")
const list = ref<any[]>([])
const currentIndex = ref(0)

onShow(() => {
    currentIndex.value = props.selectedIndex;
})
onMounted(() => {
    currentIndex.value = props.selectedIndex;
    /**
     * 第一种：
     * 根据身份判断 动态显示tarbar内容
     * 登录从后端获取值设置值
     */
    if (uni.getStorageSync('identify') == 'tom') {
        //角色1
        list.value = [
            {
                "pagePath": "/pages/supplier/reserve/index",
                "iconPath": "/static/tabbarIcon/reserve.png",
                "selectedIconPath": "/static/tabbarIcon/reserveSelected.png",
                "text": "预约"
            }, {
                "pagePath": "/pages/supplier/order/index",
                "iconPath": "/static/tabbarIcon/order.png",
                "selectedIconPath": "/static/tabbarIcon/orderSelected.png",
                "text": "订单"
            },
            {
                "pagePath": "/pages/supplier/personalCenter/index",
                "iconPath": "/static/tabbarIcon/personalCenter.png",
                "selectedIconPath": "/static/tabbarIcon/personalCenterSelected.png",
                "text": "个人中心"
            }
        ]
    } else {
        //角色2 item.selectedIconPath : item.iconPath"
        list.value = [
            {
                "pagePath": "/pages/warehouse/reserveInfo/index",
                "iconPath": "/static/tabbarIcon/reserve.png",
                "selectedIconPath": "/static/tabbarIcon/reserveSelected.png",
                "text": "仓库预约"
            }, {
                "pagePath": "/pages/warehouse/reserveOrder/index",
                "iconPath": "/static/tabbarIcon/order.png",
                "selectedIconPath": "/static/tabbarIcon/orderSelected.png",
                "text": "仓库订单"
            },
            {
                "pagePath": "/pages/warehouse/warehouseCenter/index",
                "iconPath": "/static/tabbarIcon/personalCenter.png",
                "selectedIconPath": "/static/tabbarIcon/personalCenterSelected.png",
                "text": "仓库个人中心"
            }
        ]
    }
})

function switchTab(item: any, index: number) {
    currentIndex.value = index;
    let url = item.pagePath;
    uni.switchTab({
        url: url,
        success: () => {
            nextTick(() => {
                console.log('success');
                currentIndex.value = index;
            })
        }
    });
}
</script>

<style lang="scss">
.tab {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: env(safe-area-inset-bottom); // 适配iphoneX的底部
    z-index: 999;

    .tab-item {
        flex: 1;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-right: 1px solid #f0f0f0;

        .tab_img {
            width: 20px;
            height: 20px;
        }

        .tab_text {
            font-size: 10px;
            margin-top: 5px;
            margin-bottom: 2px;
        }
    }
}
</style>
