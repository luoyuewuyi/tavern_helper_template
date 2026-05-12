<template>
  <div v-if="options.length" class="options-panel">
    <div class="options-head">
      <span class="options-icon">💡</span>
      <span>可选行动</span>
      <span class="options-line"></span>
    </div>
    <div class="options-grid">
      <button v-for="(opt, idx) in options" :key="idx" class="option-btn" @click="fillInput(opt)">
        <span class="option-idx">{{ Number(idx) + 1 }}</span>
        <span class="option-text">{{ opt }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const options = computed(() => {
  return (store.data as any).建议选项 ?? [];
});

function fillInput(text: string) {
  try {
    const $textarea = (window.parent as any).$('#send_textarea');
    if ($textarea.length) {
      $textarea.val(text).trigger('input');
      $textarea.trigger('focus');
    }
  } catch (e) {
    console.warn('[OptionsPanel] 无法填入输入框:', e);
  }
}
</script>

<style lang="scss" scoped>
.options-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-top: 1px solid var(--c-border);
}

.options-head {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--c-gold);
}

.options-icon {
  font-size: 12px;
}

.options-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--c-border-bright), transparent);
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option-btn {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  color: var(--c-text);
  font-family: var(--font-main);
  font-size: 13px;
  line-height: 1.5;
  text-align: left;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--c-wine-bright);
    background: linear-gradient(135deg, rgba(110, 53, 69, 0.2), rgba(110, 53, 69, 0.05));
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
}

.option-idx {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-wine), var(--c-wine-bright));
  color: var(--c-gold-bright);
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

.option-text {
  flex: 1;
}
</style>
