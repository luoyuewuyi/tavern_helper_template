<template>
  <div v-if="data" class="imperial-scroll">
    <!-- 流云背景 -->
    <div class="cloud-bg"></div>

    <!-- 顶部装饰 -->
    <div class="scroll-top-border"></div>

    <!-- 标题区域 -->
    <header class="header-section">
      <div class="era-title">{{ data.当前时间.年号 }}朝</div>
      <div class="time-location-row">
        <span class="time-info">
          {{ data.当前时间.年号 }}{{ data.当前时间.年 }}年 {{ data.当前时间.月 }}{{ data.当前时间.日 }}
          {{ data.当前时间.时辰 }}
        </span>
        <span class="location-info">{{ data.当前地点 }}</span>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 资源区域 -->
      <div class="section-title">国库仓储</div>
      <div class="resource-card fade-in">
        <div class="resource-item">
          <div class="resource-icon">🌾</div>
          <div class="resource-name">粮草</div>
          <div class="resource-main">{{ data.粮草.存粮 }} 万石</div>
          <div class="resource-flow" :class="data.粮草.年净收入 >= 0 ? 'positive' : 'negative'">
            年入 {{ data.粮草.年净收入 >= 0 ? '+' : '' }}{{ data.粮草.年净收入 }} 万石
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-icon">💰</div>
          <div class="resource-name">库银</div>
          <div class="resource-main">{{ data.库银.存银 }} 万两</div>
          <div class="resource-flow" :class="data.库银.年净收入 >= 0 ? 'positive' : 'negative'">
            年入 {{ data.库银.年净收入 >= 0 ? '+' : '' }}{{ data.库银.年净收入 }} 万两
          </div>
        </div>
      </div>

      <!-- 军政变量 -->
      <div class="section-title">军政民情</div>
      <div class="stats-grid fade-in">
        <!-- 兵力 -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-name">⚔️ 兵力</span>
            <span class="stat-value">{{ data.兵力 }}万</span>
          </div>
          <div class="stat-bar">
            <div
              class="stat-bar-fill army"
              :class="getStatClass(data.兵力, [60, 40, 25, 10])"
              :style="{ width: Math.min((data.兵力 / 80) * 100, 100) + '%' }"
            ></div>
          </div>
          <span class="stat-stage" :class="getStageClass(data.兵力, [60, 40, 25, 10])">
            {{ getArmyStage(data.兵力) }}
          </span>
        </div>

        <!-- 军心 -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-name">🛡️ 军心</span>
            <span class="stat-value">{{ data.军心 }}</span>
          </div>
          <div class="stat-bar">
            <div
              class="stat-bar-fill morale"
              :class="getStatClass(data.军心, [81, 61, 41, 21])"
              :style="{ width: data.军心 + '%' }"
            ></div>
          </div>
          <span class="stat-stage" :class="getStageClass(data.军心, [81, 61, 41, 21])">
            {{ getMoraleStage(data.军心) }}
          </span>
        </div>

        <!-- 民心 -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-name">👥 民心</span>
            <span class="stat-value">{{ data.民心 }}</span>
          </div>
          <div class="stat-bar">
            <div
              class="stat-bar-fill people"
              :class="getStatClass(data.民心, [81, 61, 41, 21])"
              :style="{ width: data.民心 + '%' }"
            ></div>
          </div>
          <span class="stat-stage" :class="getStageClass(data.民心, [81, 61, 41, 21])">
            {{ getPeopleStage(data.民心) }}
          </span>
        </div>

        <!-- 威望 -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-name">👑 威望</span>
            <span class="stat-value">{{ data.威望 }}</span>
          </div>
          <div class="stat-bar">
            <div
              class="stat-bar-fill prestige"
              :class="getStatClass(data.威望, [81, 61, 41, 21])"
              :style="{ width: data.威望 + '%' }"
            ></div>
          </div>
          <span class="stat-stage" :class="getStageClass(data.威望, [81, 61, 41, 21])">
            {{ getPrestigeStage(data.威望) }}
          </span>
        </div>
      </div>

      <!-- 治理变量 -->
      <div class="section-title">治理状况</div>
      <div class="stats-grid fade-in">
        <!-- 腐化（反向） -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-name">🏛️ 吏治</span>
            <span class="stat-value">{{ 100 - data.腐化 }}</span>
          </div>
          <div class="stat-bar">
            <div
              class="stat-bar-fill corrupt"
              :class="getStatClassReverse(data.腐化, [20, 40, 60, 80])"
              :style="{ width: 100 - data.腐化 + '%' }"
            ></div>
          </div>
          <span class="stat-stage" :class="getStageClassReverse(data.腐化, [20, 40, 60, 80])">
            {{ getCorruptStage(data.腐化) }}
          </span>
        </div>

        <!-- 科技 -->
        <div class="stat-card">
          <div class="stat-header">
            <span class="stat-name">🔧 科技</span>
            <span class="stat-value">{{ data.科技 }}点</span>
          </div>
          <div class="stat-bar">
            <div
              class="stat-bar-fill tech"
              :class="getStatClass(data.科技, [50, 30, 15, 5])"
              :style="{ width: Math.min((data.科技 / 60) * 100, 100) + '%' }"
            ></div>
          </div>
          <span class="stat-stage" :class="getStageClass(data.科技, [50, 30, 15, 5])">
            {{ getTechStage(data.科技) }}
          </span>
        </div>
      </div>

      <!-- 当前事件 -->
      <div v-if="data.当前事件" class="event-section fade-in">
        <div class="event-label">—— 当前政务 ——</div>
        <div class="event-name">{{ data.当前事件 }}</div>
      </div>

      <!-- 政策列表 -->
      <div v-if="data.当前政策 && data.当前政策.length > 0" class="policy-section fade-in">
        <div class="section-title">推行中政策</div>
        <div v-for="(policy, idx) in data.当前政策" :key="idx" class="policy-item">
          <div class="policy-header">
            <span class="policy-name">{{ policy.名称 }}</span>
            <span class="policy-time">剩余 {{ policy.剩余月数 }} 月</span>
          </div>
          <div class="policy-bar">
            <div class="policy-bar-fill" :style="{ width: policy.进度 + '%' }"></div>
          </div>
        </div>
      </div>
    </main>

    <!-- 印章装饰 -->
    <div class="seal-decoration">御</div>

    <!-- 底部装饰 -->
    <div class="scroll-bottom-border"></div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from './store';

const store = useDataStore();
const data = computed(() => store.data?.stat_data);

// 阶段判断函数
function getArmyStage(val: number): string {
  if (val >= 60) return '雄师劲旅';
  if (val >= 40) return '武备充足';
  if (val >= 25) return '堪用之师';
  if (val >= 10) return '捉襟见肘';
  return '名存实亡';
}

function getMoraleStage(val: number): string {
  if (val >= 81) return '誓死效忠';
  if (val >= 61) return '士气高昂';
  if (val >= 41) return '基本服从';
  if (val >= 21) return '怨声载道';
  return '随时哗变';
}

function getPeopleStage(val: number): string {
  if (val >= 81) return '万民拥戴';
  if (val >= 61) return '安居乐业';
  if (val >= 41) return '怨言暗生';
  if (val >= 21) return '民怨沸腾';
  return '揭竿而起';
}

function getPrestigeStage(val: number): string {
  if (val >= 81) return '天威浩荡';
  if (val >= 61) return '权威树立';
  if (val >= 41) return '威福自用';
  if (val >= 21) return '令出不行';
  return '名存实亡';
}

function getCorruptStage(val: number): string {
  if (val <= 20) return '吏治清明';
  if (val <= 40) return '贪弊渐生';
  if (val <= 60) return '系统腐败';
  if (val <= 80) return '无可救药';
  return '王朝癌变';
}

function getTechStage(val: number): string {
  if (val >= 50) return '开创新局';
  if (val >= 30) return '稳步积累';
  if (val >= 15) return '基础夯实';
  if (val >= 5) return '停滞不前';
  return '文明倒退';
}

// 样式类判断
function getStatClass(val: number, thresholds: number[]): string {
  if (val >= thresholds[0]) return 'excellent';
  if (val < thresholds[3]) return 'danger';
  return '';
}

function getStageClass(val: number, thresholds: number[]): string {
  if (val >= thresholds[0]) return 'excellent';
  if (val >= thresholds[1]) return 'good';
  if (val >= thresholds[2]) return 'normal';
  if (val >= thresholds[3]) return 'warning';
  return 'danger';
}

function getStatClassReverse(val: number, thresholds: number[]): string {
  if (val <= thresholds[0]) return 'excellent';
  if (val >= thresholds[3]) return 'danger';
  return '';
}

function getStageClassReverse(val: number, thresholds: number[]): string {
  if (val <= thresholds[0]) return 'excellent';
  if (val <= thresholds[1]) return 'good';
  if (val <= thresholds[2]) return 'normal';
  if (val <= thresholds[3]) return 'warning';
  return 'danger';
}
</script>

<style scoped>
/* 组件级样式已在 global.css 中定义 */
</style>
