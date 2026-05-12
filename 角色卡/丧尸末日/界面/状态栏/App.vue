<template>
  <div class="phone-container">
    <div class="phone-shell">
      <!-- 手机顶部状态栏 -->
      <div class="phone-statusbar">
        <span class="time-display">{{ store.data.时间.当前时间 }}</span>
        <span class="notch"></span>
        <div class="status-icons">
          <span class="signal">📶</span>
          <span class="battery">🔋</span>
        </div>
      </div>

      <!-- 手机内容区 -->
      <div class="phone-screen">
        <!-- 返回按钮 -->
        <div v-if="currentPage !== 'home'" class="nav-back" @click="goBack">
          <span class="back-arrow">‹</span>
          <span>{{ pageTitle }}</span>
        </div>

        <!-- 主屏幕 -->
        <HomeScreen v-if="currentPage === 'home'" @navigate="navigateTo" :data="store.data" />

        <!-- 安全屋地图 -->
        <SafehouseMap v-else-if="currentPage === 'safehouse'" :data="store.data" />

        <!-- 人物信息 -->
        <CharacterInfo v-else-if="currentPage === 'character'" :data="store.data" />

        <!-- 物资仓库 -->
        <Warehouse v-else-if="currentPage === 'warehouse'" :data="store.data" />

        <!-- 通讯录 -->
        <Contacts v-else-if="currentPage === 'contacts'" :data="store.data" @view-contact="viewContact" />

        <!-- NPC详情 -->
        <ContactDetail
          v-else-if="currentPage === 'contact-detail'"
          :npc-name="selectedNpc"
          :npc="store.data.NPC状态[selectedNpc]"
        />

        <!-- 群聊 -->
        <GroupChat v-else-if="currentPage === 'groupchat'" :data="store.data" />
      </div>

      <!-- 底部导航栏 -->
      <div class="phone-navbar">
        <button
          v-for="nav in navItems"
          :key="nav.id"
          class="nav-item"
          :class="{ active: currentPage === nav.id || (nav.id === 'home' && currentPage === 'contact-detail') }"
          @click="navigateTo(nav.id)"
        >
          <span class="nav-icon">{{ nav.icon }}</span>
          <span class="nav-label">{{ nav.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterInfo from './components/CharacterInfo.vue';
import ContactDetail from './components/ContactDetail.vue';
import Contacts from './components/Contacts.vue';
import GroupChat from './components/GroupChat.vue';
import HomeScreen from './components/HomeScreen.vue';
import SafehouseMap from './components/SafehouseMap.vue';
import Warehouse from './components/Warehouse.vue';
import { useDataStore } from './store';

const store = useDataStore();

const currentPage = ref('home');
const selectedNpc = ref('');
const pageHistory = ref<string[]>([]);

const navItems = [
  { id: 'home', icon: '🏠', label: '主页' },
  { id: 'safehouse', icon: '🏰', label: '安全屋' },
  { id: 'contacts', icon: '📱', label: '通讯录' },
  { id: 'groupchat', icon: '💬', label: '群聊' },
];

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    safehouse: '安全屋地图',
    character: '人物信息',
    warehouse: '物资仓库',
    contacts: '通讯录',
    'contact-detail': selectedNpc.value,
    groupchat: '群聊',
  };
  return titles[currentPage.value] || '';
});

function navigateTo(page: string) {
  if (page !== currentPage.value) {
    pageHistory.value.push(currentPage.value);
    currentPage.value = page;
  }
}

function goBack() {
  const prev = pageHistory.value.pop();
  currentPage.value = prev || 'home';
}

function viewContact(name: string) {
  selectedNpc.value = name;
  navigateTo('contact-detail');
}
</script>

<style lang="scss" scoped>
.phone-container {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
}

.phone-shell {
  background: var(--phone-bg);
  border: 2px solid var(--phone-border);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 0 30px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(0, 212, 170, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

// 顶部状态栏
.phone-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--phone-bg);
  font-size: 11px;
  color: var(--phone-text-dim);
  border-bottom: 1px solid var(--phone-border);
}

.time-display {
  font-weight: 600;
  color: var(--phone-text);
  font-family: var(--font-mono);
}

.notch {
  width: 80px;
  height: 18px;
  background: #000;
  border-radius: 0 0 12px 12px;
  border: 1px solid var(--phone-border);
  border-top: none;
}

.status-icons {
  display: flex;
  gap: 4px;
  font-size: 10px;
}

// 内容区
.phone-screen {
  flex: 1;
  min-height: 380px;
  max-height: 520px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  background: var(--phone-surface);
}

// 返回导航
.nav-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--phone-bg);
  border-bottom: 1px solid var(--phone-border);
  cursor: pointer;
  color: var(--phone-accent);
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: var(--phone-card);
  }
}

.back-arrow {
  font-size: 20px;
  line-height: 1;
}

// 底部导航
.phone-navbar {
  display: flex;
  background: var(--phone-bg);
  border-top: 1px solid var(--phone-border);
  padding: 6px 0 8px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border: none;
  background: transparent;
  color: var(--phone-text-muted);
  cursor: pointer;
  padding: 4px 0;
  transition: all 0.2s;
  font-size: 10px;

  &:hover {
    color: var(--phone-text-dim);
  }

  &.active {
    color: var(--phone-accent);
    .nav-icon {
      transform: scale(1.15);
    }
  }
}

.nav-icon {
  font-size: 18px;
  transition: transform 0.2s;
}

.nav-label {
  font-weight: 500;
}
</style>
