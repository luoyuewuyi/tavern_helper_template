<template>
  <div class="attr-panel">
    <div class="section-title">六大属性</div>

    <!-- 属性详情卡片 -->
    <div class="attr-grid">
      <div v-for="(attr, name) in attributes" :key="name" class="attr-card" :style="{ '--attr-color': attr.color }">
        <div class="attr-header">
          <span class="attr-icon">{{ attr.icon }}</span>
          <span class="attr-name">{{ name }}</span>
          <span class="attr-tier-badge">{{ attr.tier }}</span>
        </div>

        <div class="attr-progress">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: (attr.value / 400) * 100 + '%' }"></div>
            <div class="progress-markers">
              <span v-for="i in 7" :key="i" class="marker" :style="{ left: ((i * 50) / 400) * 100 + '%' }"></span>
            </div>
          </div>
          <div class="progress-info">
            <span class="value-current">{{ attr.value }}</span>
            <span class="value-max">/400</span>
          </div>
        </div>

        <div class="attr-desc">{{ attr.desc }}</div>

        <!-- 可操作：属性微调按钮 -->
        <div class="attr-controls">
          <button class="ctrl-btn minus" :disabled="attr.value <= 0" @click="adjustAttribute(name, -1)" title="属性-1">
            <i class="fa fa-minus"></i>
          </button>
          <button class="ctrl-btn plus" :disabled="attr.value >= 400" @click="adjustAttribute(name, 1)" title="属性+1">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 声望系统 -->
    <div class="divider"></div>
    <div class="section-title">声望</div>
    <div class="reputation-grid">
      <div v-for="(val, name) in store.data.主角.声望" :key="name" class="rep-item">
        <span class="rep-name">{{ name }}</span>
        <div class="rep-bar">
          <div class="rep-fill" :style="{ width: Math.min(val, 100) + '%' }"></div>
        </div>
        <span class="rep-value">{{ val }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

// 属性梯度描述映射
const tierDescs: Record<string, Record<number, string>> = {
  韬略: {
    1: '识微：懂基础算计',
    2: '审势：能观察局势',
    3: '谋断：可任县尉',
    4: '筹策：能改进战术',
    5: '通变：可制定策略',
    6: '定计：可分化敌人',
    7: '经纶：可任节度使',
    8: '经纬：运筹帷幄',
  },
  勇武: {
    1: '矫捷：身体强健',
    2: '悍勇：可任乡勇',
    3: '骁锐：战斗精锐',
    4: '刚猛：可任校尉',
    5: '雄烈：凭军功入仕',
    6: '无畏：可任郎将',
    7: '盖世：可任将军',
    8: '无双：天下无敌',
  },
  智力: {
    1: '识字：识字断句',
    2: '明理：可入县学',
    3: '思辨：可参加科举',
    4: '博识：可改进技术',
    5: '通达：可入国子监',
    6: '睿智：可研发新技术',
    7: '哲思：学术领袖',
    8: '圣明：文坛领袖',
  },
  政才: {
    1: '明事：懂基础事务',
    2: '尽责：可任税吏',
    3: '勤政：可任县丞',
    4: '惠民：可任县令',
    5: '安邦：可任刺史',
    6: '贤能：可入六部',
    7: '济世：可任尚书',
    8: '圣治：可任宰辅',
  },
  人望: {
    1: '亲和：邻里认可',
    2: '知名：乡里有名',
    3: '可敬：县城知名',
    4: '有声：可被举荐入仕',
    5: '威望：州郡有名',
    6: '德望：一方名士',
    7: '归心：天下知名',
    8: '万民仰：可封国公',
  },
  艺趣: {
    1: '识趣：懂基础技艺',
    2: '知雅：略通风雅',
    3: '擅艺：可入教坊司',
    4: '精绝：可作诗填词',
    5: '妙境：艺名远播',
    6: '逸韵：成为名家',
    7: '宗师：开创流派',
    8: '绝响：可封艺卿',
  },
};

const attributes = computed(() => {
  const attrs = store.data.主角.属性;
  return {
    韬略: {
      value: attrs.韬略.值,
      tier: attrs.韬略.$称,
      tierNum: attrs.韬略.$阶,
      icon: '🎯',
      color: '#6b5b95',
      desc: tierDescs.韬略[attrs.韬略.$阶] || '',
    },
    勇武: {
      value: attrs.勇武.值,
      tier: attrs.勇武.$称,
      tierNum: attrs.勇武.$阶,
      icon: '⚔️',
      color: '#e34234',
      desc: tierDescs.勇武[attrs.勇武.$阶] || '',
    },
    智力: {
      value: attrs.智力.值,
      tier: attrs.智力.$称,
      tierNum: attrs.智力.$阶,
      icon: '📚',
      color: '#2c82c9',
      desc: tierDescs.智力[attrs.智力.$阶] || '',
    },
    政才: {
      value: attrs.政才.值,
      tier: attrs.政才.$称,
      tierNum: attrs.政才.$阶,
      icon: '🏛️',
      color: '#8b6914',
      desc: tierDescs.政才[attrs.政才.$阶] || '',
    },
    人望: {
      value: attrs.人望.值,
      tier: attrs.人望.$称,
      tierNum: attrs.人望.$阶,
      icon: '👥',
      color: '#00a86b',
      desc: tierDescs.人望[attrs.人望.$阶] || '',
    },
    艺趣: {
      value: attrs.艺趣.值,
      tier: attrs.艺趣.$称,
      tierNum: attrs.艺趣.$阶,
      icon: '🎭',
      color: '#d4af37',
      desc: tierDescs.艺趣[attrs.艺趣.$阶] || '',
    },
  };
});

function adjustAttribute(name: string, delta: number) {
  const attr = store.data.主角.属性[name as keyof typeof store.data.主角.属性];
  if (attr) {
    attr.值 = Math.max(0, Math.min(400, attr.值 + delta));
  }
}
</script>

<style lang="scss" scoped>
.attr-panel {
  display: flex;
  flex-direction: column;
}

.attr-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.attr-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--c-mist);
  border-radius: 4px;
  padding: 10px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--attr-color);
  }
}

.attr-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;

  .attr-icon {
    font-size: 1rem;
  }

  .attr-name {
    font-family: var(--font-kai);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--c-ink);
  }

  .attr-tier-badge {
    margin-left: auto;
    font-family: var(--font-kai);
    font-size: 0.7rem;
    color: white;
    background: var(--attr-color);
    padding: 2px 6px;
    border-radius: 2px;
  }
}

.attr-progress {
  margin-bottom: 6px;
}

.progress-track {
  height: 8px;
  background: var(--c-parchment);
  border: 1px solid var(--c-mist);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--attr-color) 0%, var(--attr-color) 100%);
  transition: width 0.3s ease;
}

.progress-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .marker {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(0, 0, 0, 0.15);
  }
}

.progress-info {
  display: flex;
  justify-content: flex-end;
  margin-top: 2px;
  font-size: 0.65rem;

  .value-current {
    color: var(--c-ink);
    font-weight: 600;
  }

  .value-max {
    color: var(--c-cloud);
  }
}

.attr-desc {
  font-size: 0.7rem;
  color: var(--c-cloud);
  margin-bottom: 6px;
  line-height: 1.3;
}

.attr-controls {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.ctrl-btn {
  width: 22px;
  height: 22px;
  border: 1px solid var(--c-mist);
  border-radius: 2px;
  background: var(--c-paper);
  color: var(--c-cloud);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--attr-color);
    color: white;
    border-color: var(--attr-color);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &.plus:hover:not(:disabled) {
    background: var(--c-jade);
    border-color: var(--c-jade);
  }

  &.minus:hover:not(:disabled) {
    background: var(--c-vermilion);
    border-color: var(--c-vermilion);
  }
}

.reputation-grid {
  display: grid;
  gap: 8px;
}

.rep-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rep-name {
  font-size: 0.75rem;
  color: var(--c-ink);
  min-width: 5em;
}

.rep-bar {
  flex: 1;
  height: 6px;
  background: var(--c-parchment);
  border: 1px solid var(--c-mist);
  border-radius: 3px;
  overflow: hidden;
}

.rep-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-jade) 0%, var(--c-gold) 100%);
  transition: width 0.3s ease;
}

.rep-value {
  font-size: 0.7rem;
  color: var(--c-bronze);
  font-weight: 600;
  min-width: 2em;
  text-align: right;
}

@media (max-width: 500px) {
  .attr-grid {
    grid-template-columns: 1fr;
  }
}
</style>
