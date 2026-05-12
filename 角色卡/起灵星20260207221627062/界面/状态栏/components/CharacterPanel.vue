<template>
  <div class="character-panel">
    <!-- 角色列表 -->
    <div v-for="(charData, charName) in store.data.角色库" :key="charName" class="char-section">
      <div class="char-header" @click="toggleChar(charName)">
        <span class="char-name">👤 {{ charName }}</span>
        <span class="char-realm">{{ charData.修为境界 }}</span>
        <span class="toggle-icon">{{ expandedChars[charName] ? '▼' : '▶' }}</span>
      </div>

      <div v-if="expandedChars[charName]" class="char-body">
        <div class="stat-row">
          <div class="stat-bar-group">
            <span class="stat-label">❤️ 好感</span>
            <div class="bar-track">
              <div class="bar-fill favor" :style="{ width: charData.好感度 + '%' }"></div>
            </div>
            <span class="stat-num">{{ charData.好感度 }}</span>
          </div>
          <div class="stat-bar-group">
            <span class="stat-label">🤝 信赖</span>
            <div class="bar-track">
              <div class="bar-fill trust" :style="{ width: charData.信赖度 + '%' }"></div>
            </div>
            <span class="stat-num">{{ charData.信赖度 }}</span>
          </div>
        </div>

        <div class="info-item">
          <span class="info-label">📋 身份</span>
          <span class="info-value">{{ charData.身份 }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">📝 行动</span>
          <span class="info-value">{{ charData.当前行动 }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">💭 内心</span>
          <span class="info-value inner">{{ charData.当前内心 }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">👗 着装</span>
          <span class="info-value">{{ charData.着装 }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">💫 状态</span>
          <span class="info-value">{{ charData.状态 }}</span>
        </div>

        <!-- 删除按钮 -->
        <button class="delete-btn" @click.stop="deleteChar(charName)">🗑️ 移除此角色</button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="_.isEmpty(store.data.角色库)" class="empty-hint">暂无已知角色</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();

const expandedChars = useLocalStorage<Record<string, boolean>>('qilingxing_status:expanded_chars', {});

function toggleChar(key: string) {
  expandedChars.value[key] = !expandedChars.value[key];
}

async function deleteChar(charName: string) {
  if (!confirm(`确定要从角色库中移除「${charName}」吗？`)) return;

  const variables = Mvu.getMvuData({ type: 'message', message_id: getCurrentMessageId() });
  _.unset(variables, `stat_data.角色库.${charName}`);
  await Mvu.replaceMvuData(variables, { type: 'message', message_id: getCurrentMessageId() });

  // 清除展开状态
  delete expandedChars.value[charName];

  toastr.info(`已移除角色「${charName}」`);
}
</script>

<style lang="scss" scoped>
.character-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.char-section {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--c-bg-deep);
}

.char-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  background: var(--c-bg-panel);
  transition: background 0.2s ease;
  gap: 8px;

  &:hover {
    background: rgba(180, 140, 255, 0.1);
  }
}

.char-name {
  font-weight: 700;
  color: var(--c-primary);
  font-size: 14px;
  flex: 1;
}

.char-realm {
  font-size: 11px;
  color: var(--c-accent);
  background: rgba(255, 216, 102, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 216, 102, 0.2);
}

.toggle-icon {
  font-size: 10px;
  color: var(--c-text-muted);
}

.char-body {
  padding: 10px 12px;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--c-border);
}

.stat-bar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 11px;
  color: var(--c-text-dim);
  width: 60px;
  flex-shrink: 0;
}

.bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;

  &.favor {
    background: linear-gradient(90deg, #ff6b8a, #ff4d6d);
  }

  &.trust {
    background: linear-gradient(90deg, #66ccff, #3399ff);
  }
}

.stat-num {
  font-size: 11px;
  color: var(--c-text);
  width: 28px;
  text-align: right;
  font-family: var(--font-mono);
}

.info-item {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 12px;
  line-height: 1.5;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  color: var(--c-text-muted);
  flex-shrink: 0;
  width: 56px;
}

.info-value {
  color: var(--c-text-dim);
  word-break: break-all;

  &.inner {
    color: var(--c-primary-dim);
    font-style: italic;
  }
}

.delete-btn {
  margin-top: 10px;
  width: 100%;
  padding: 6px 0;
  background: rgba(255, 102, 136, 0.08);
  border: 1px solid rgba(255, 102, 136, 0.2);
  border-radius: 6px;
  color: var(--c-danger);
  font-size: 11px;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 102, 136, 0.15);
    border-color: rgba(255, 102, 136, 0.4);
  }
}

.empty-hint {
  text-align: center;
  color: var(--c-text-muted);
  font-size: 12px;
  padding: 16px 0;
}
</style>
