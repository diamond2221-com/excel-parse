<template>
    <view
        class="table-wrap"
        :style="[
            {
                borderWidth: loading ? '0' : '0',
            },
            loading? { minHeight: '70vmin', width: '100vmin' } : {}
        ]"
    >
        <view v-if="loading">
            数据加载中……
        </view>
        <template v-else>
            <scroll-view
                :style="scrollWidth ? { width: scrollWidth } : {}"
                scrollX
                :scrollY="false"
                :bounces="false"
                enhanced
                class="scroll-container"
            >
                <view class="table" :style="{ width: '100vw' || (allWidth + 'rpx') }">
                    <view class="theader">
                        <view
                            v-for="v in  columns "
                            :class="`th ${v.fixed === 'left' ? 'lfix' : v.fixed === 'right' ? 'rfix' : ''}`"
                            :style="[
                                {
                                    width: v.width + 'rpx',
                                    textAlign: v.align || 'center',
                                },
                                v.minWidth ? { minWidth: v.minWidth + 'rpx' } : {}
                            ]"
                            :key="`${v.title + v.key}`"
                        >
                        {{ v.title }}
                        </view>
                    </view>
                    <view class="tbody">
                        <view  v-if="!data.length" style="text-align: center; line-height: 5;">
                            暂无数据…
                        </view>
                        <view class="tr" :key="`${v.name + i}`" v-for="(v, i) in data">
                            <view
                                class="td"
                                :class="column.fixed === 'left' ? 'lfix' : column.fixed === 'right' ? 'rfix' : ''"
                                :style="[
                                    {
                                        width: column.width + 'rpx',
                                        textAlign: column.align || 'center'
                                    },
                                    column.minWidth ? { minWidth: column.minWidth + 'rpx' } : {}
                                ]"
                                :key="`${column.key}`"
                                v-for="column in columns"
                            >
                                <text>{{ v[column.key] }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
            <view class="fix-table-left table">
                <view
                    class="fix-theader-left theader"
                    :style="{ width: leftAllWidth + 1 + 'rpx' }"
                >
                    <view
                        class="th"
                        :style="[
                            {
                                width: v.width + 'rpx',
                                textAlign: v.align || 'center',
                            },
                            v.minWidth ? { minWidth: v.minWidth + 'rpx' } : {}
                        ]"
                        :key="`${v.title + v.key}`"
                        v-for="v in leftFixColumns"
                    >
                        {{ v.title }}
                    </view>
                </view>
                <view class="fix-tbody-left tbody">
                    <view class="tr" :key="`${v.name + i}`" v-for="(v, i) in data">
                        <view
                            class="td"
                            :style="[
                                {
                                    width: column.width + 'rpx',
                                    textAlign: column.align || 'center'
                                },
                                column.minWidth ? { minWidth: column.minWidth + 'rpx' } : {}
                            ]"
                            :key="column.key"
                            v-for="column in leftFixColumns"
                        >
                        <text>{{ v[column.key]}}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="fix-table-right table">
                <view class="fix-theader-right theader" :style="{ width: rightAllWidth + 1 + 'rpx' }" >
                    <view
                        class="th"
                        :style="[
                            {
                                width: v.width + 'rpx',
                                textAlign: v.align || 'center',
                            },
                            v.minWidth ? { minWidth: v.minWidth + 'rpx' } : {}
                        ]"
                        :key="`${v.title + v.key}`"
                        v-for="v in rightFixColumns"
                    >
                        {{ v.title }}
                    </view>
                </view>
                <view class="fix-tbody-right tbody">
                    <view class="tr" :key="`${v.name + i}`" v-for="(v, i) in data">
                        <view
                            class="td"
                            :style="[
                                {
                                    width: column.width + 'rpx',
                                    textAlign: column.align || 'center'
                                },
                                column.minWidth ? { minWidth: column.minWidth + 'rpx' } : {}
                            ]"
                            :key="column.key"
                            v-for="column in rightFixColumns"
                        >
                            <text>{{ v[column.key] }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </template>
    </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

export interface Column {
    title: string
    key: string
    width: number
    minWidth?: number
    align?: 'left' | 'center' | 'right'
    class?: string
    fixed?: 'left' | 'right'
    originWidth: number
}

export type Columns = Column[]

type Props = {
    data: any[]
    columns: Columns
    loading?: boolean
    scrollWidth?: string
}


const props = defineProps<Props>()

const allWidth = computed(() => props.columns.reduce((p, v) => p + v.width, 0))
const rightFixColumns = computed(() => props.columns.filter(v => v.fixed === 'right'))
const leftFixColumns = computed(() => props.columns.filter(v => v.fixed === 'left'))
const leftAllWidth = computed(() => leftFixColumns.value.reduce((p, v) => p + v.width, 1))
const rightAllWidth = computed(() => rightFixColumns.value.reduce((p, v) => p + v.width, 1))
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
