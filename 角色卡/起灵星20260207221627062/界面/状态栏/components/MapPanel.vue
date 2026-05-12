<template>
  <div class="map-panel">
    <!-- 大陆选择 -->
    <div class="continent-tabs">
      <button
        v-for="c in continents"
        :key="c.id"
        class="continent-btn"
        :class="{ active: activeContinent === c.id }"
        @click="activeContinent = c.id"
      >
        {{ c.icon }} {{ c.name }}
      </button>
    </div>

    <!-- 地图区域 -->
    <div class="map-container">
      <svg viewBox="0 0 600 400" class="map-svg">
        <!-- 背景网格 -->
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(180,140,255,0.06)" stroke-width="0.5" />
          </pattern>
        </defs>
        <rect width="600" height="400" fill="var(--c-bg-deep)" />
        <rect width="600" height="400" fill="url(#grid)" />

        <!-- 大陆轮廓 -->
        <path
          v-for="c in continents"
          :key="'outline-' + c.id"
          :d="c.outline"
          :fill="activeContinent === c.id ? 'rgba(180,140,255,0.08)' : 'rgba(180,140,255,0.03)'"
          :stroke="activeContinent === c.id ? 'rgba(180,140,255,0.4)' : 'rgba(180,140,255,0.12)'"
          stroke-width="1.5"
          class="continent-shape"
          @click="activeContinent = c.id"
        />

        <!-- 大陆名称标签 -->
        <text
          v-for="c in continents"
          :key="'label-' + c.id"
          :x="c.labelX"
          :y="c.labelY"
          class="continent-label"
          :fill="activeContinent === c.id ? 'rgba(180,140,255,0.7)' : 'rgba(180,140,255,0.25)'"
          text-anchor="middle"
          font-size="11"
        >
          {{ c.name }}
        </text>

        <!-- 城市标记点（当前选中大陆的） -->
        <g v-for="loc in currentLocations" :key="loc.name">
          <circle
            :cx="loc.x"
            :cy="loc.y"
            :r="loc.name === store.data.世界.当前地点 ? 6 : loc.isCapital ? 5 : 3.5"
            :fill="getCityColor(loc)"
            :stroke="
              loc.name === store.data.世界.当前地点
                ? 'var(--c-accent)'
                : selectedCity === loc.name
                  ? 'var(--c-primary)'
                  : 'none'
            "
            :stroke-width="loc.name === store.data.世界.当前地点 ? 2 : 1.5"
            class="city-dot"
            @click.stop="selectCity(loc)"
          />
          <!-- 当前位置脉冲 -->
          <circle
            v-if="loc.name === store.data.世界.当前地点"
            :cx="loc.x"
            :cy="loc.y"
            r="10"
            fill="none"
            stroke="var(--c-accent)"
            stroke-width="1"
            opacity="0.6"
            class="pulse-ring"
          />
          <!-- 城市名 -->
          <text
            :x="loc.x"
            :y="loc.y - (loc.isCapital ? 10 : 7)"
            class="city-label"
            text-anchor="middle"
            :font-size="loc.isCapital ? 10 : 8"
            :fill="
              loc.name === store.data.世界.当前地点
                ? 'var(--c-accent)'
                : selectedCity === loc.name
                  ? 'var(--c-primary)'
                  : 'var(--c-text-dim)'
            "
            :font-weight="loc.isCapital ? '700' : '400'"
          >
            {{ loc.name }}
          </text>
        </g>
      </svg>
    </div>

    <!-- 选中城市信息 + 移动按钮 -->
    <div v-if="selectedCity && selectedCity !== store.data.世界.当前地点" class="move-panel">
      <div class="move-info">
        <span class="move-target">📍 前往：{{ selectedCity }}</span>
        <span v-if="selectedCityData" class="move-desc">{{ selectedCityData.desc }}</span>
      </div>
      <button class="move-btn" :disabled="isMoving" @click="moveTo">
        {{ isMoving ? '⏳ 移动中...' : '⚡ 前往此处' }}
      </button>
    </div>
    <div v-else-if="selectedCity === store.data.世界.当前地点" class="current-hint">
      ✅ 你当前就在 {{ selectedCity }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();
const activeContinent = ref('神州');
const selectedCity = ref<string | null>(null);
const isMoving = ref(false);

// ===== 地图数据 =====

interface Location {
  name: string;
  x: number;
  y: number;
  isCapital: boolean;
  desc: string;
  continent: string;
  region?: string;
}

const continents = [
  {
    id: '神州',
    name: '神州大陆',
    icon: '🐉',
    labelX: 430,
    labelY: 130,
    outline: 'M 340,40 L 520,40 570,100 580,200 560,300 500,340 380,350 340,280 320,200 330,100 Z',
  },
  {
    id: '维斯特洛',
    name: '维斯特洛大陆',
    icon: '🏰',
    labelX: 130,
    labelY: 130,
    outline: 'M 30,30 L 200,25 240,80 250,180 230,280 180,330 80,340 40,270 20,170 25,80 Z',
  },
  {
    id: '非利加',
    name: '非利加大陆',
    icon: '🌿',
    labelX: 140,
    labelY: 350,
    outline: 'M 60,240 L 200,235 230,280 240,340 220,380 160,395 80,390 50,350 45,280 Z',
  },
  {
    id: '亚特兰蒂斯',
    name: '亚特兰蒂斯大陆',
    icon: '🦴',
    labelX: 440,
    labelY: 350,
    outline: 'M 360,260 L 500,255 530,300 540,350 520,385 460,395 380,390 355,340 350,290 Z',
  },
];

const locations: Location[] = [
  // === 神州大陆 ===
  { name: '龙都', x: 440, y: 175, isCapital: true, desc: '胤华帝国首都，皇宫所在，灵江穿城而过', continent: '神州' },
  {
    name: '汗庭',
    x: 460,
    y: 60,
    isCapital: false,
    desc: '草原东北部，水草丰茂的汗王庭',
    continent: '神州',
    region: '北境草原',
  },
  {
    name: '天马城',
    x: 480,
    y: 80,
    isCapital: false,
    desc: '草原东南部，马市交易重镇',
    continent: '神州',
    region: '北境草原',
  },
  {
    name: '永冻荒原',
    x: 380,
    y: 55,
    isCapital: false,
    desc: '草原西北部极寒之地',
    continent: '神州',
    region: '北境草原',
  },
  { name: '落日沙丘', x: 390, y: 80, isCapital: false, desc: '草原西南部沙漠', continent: '神州', region: '北境草原' },
  {
    name: '幽州城',
    x: 460,
    y: 110,
    isCapital: true,
    desc: '北恒行省省城，行省中心',
    continent: '神州',
    region: '北恒行省',
  },
  { name: '渤海城', x: 510, y: 110, isCapital: false, desc: '东部海湾港口', continent: '神州', region: '北恒行省' },
  {
    name: '武安城',
    x: 455,
    y: 85,
    isCapital: false,
    desc: '北部隘口，草原入关唯一官道',
    continent: '神州',
    region: '北恒行省',
  },
  { name: '靠山堡', x: 415, y: 115, isCapital: false, desc: '西部丘陵山堡', continent: '神州', region: '北恒行省' },
  { name: '梁原城', x: 460, y: 135, isCapital: false, desc: '南部平原交通要道', continent: '神州', region: '北恒行省' },
  {
    name: '岚塔城',
    x: 370,
    y: 130,
    isCapital: true,
    desc: '西岚行省省城，泰坦山脉脚下',
    continent: '神州',
    region: '西岚行省',
  },
  { name: '铁嶂城', x: 380, y: 110, isCapital: false, desc: '北部边界要塞', continent: '神州', region: '西岚行省' },
  { name: '云栈城', x: 400, y: 135, isCapital: false, desc: '东部山地褶皱区', continent: '神州', region: '西岚行省' },
  { name: '赤燧城', x: 365, y: 155, isCapital: false, desc: '南部边界', continent: '神州', region: '西岚行省' },
  { name: '西庚城', x: 360, y: 185, isCapital: true, desc: '西陇行省省城', continent: '神州', region: '西陇行省' },
  { name: '磐关城', x: 345, y: 190, isCapital: false, desc: '泰坦山脉东麓谷口', continent: '神州', region: '西陇行省' },
  { name: '丰禾城', x: 380, y: 185, isCapital: false, desc: '东部农业核心区', continent: '神州', region: '西陇行省' },
  {
    name: '圳海城',
    x: 530,
    y: 195,
    isCapital: true,
    desc: '东溟行省省城，灵水浓度冠绝帝国',
    continent: '神州',
    region: '东溟行省',
  },
  {
    name: '镇海城',
    x: 545,
    y: 180,
    isCapital: false,
    desc: '东北海岸，扼守灵江入海口',
    continent: '神州',
    region: '东溟行省',
  },
  {
    name: '通洋城',
    x: 540,
    y: 210,
    isCapital: false,
    desc: '南部沿海，面向东海主航道',
    continent: '神州',
    region: '东溟行省',
  },
  { name: '雷池城', x: 500, y: 135, isCapital: true, desc: '北玄行省省城', continent: '神州', region: '北玄行省' },
  { name: '雷枢城', x: 530, y: 120, isCapital: false, desc: '东北雷脉主峰', continent: '神州', region: '北玄行省' },
  { name: '南宁', x: 380, y: 240, isCapital: true, desc: '南岭行省省城', continent: '神州', region: '南岭行省' },
  {
    name: '镇南城',
    x: 360,
    y: 260,
    isCapital: false,
    desc: '西南端泰坦山脉隘口',
    continent: '神州',
    region: '南岭行省',
  },
  { name: '浔江城', x: 400, y: 245, isCapital: false, desc: '东部河流交汇处', continent: '神州', region: '南岭行省' },
  {
    name: '岳垒郡',
    x: 490,
    y: 240,
    isCapital: true,
    desc: '南岳行省省城，土系灵脉浓郁',
    continent: '神州',
    region: '南岳行省',
  },
  {
    name: '上阳',
    x: 440,
    y: 290,
    isCapital: true,
    desc: '南明行省省城，南部沿海，火山灵脉',
    continent: '神州',
    region: '南明行省',
  },
  { name: '星陨城', x: 425, y: 300, isCapital: false, desc: '火山群灵脉交汇点', continent: '神州', region: '南明行省' },
  // === 维斯特洛大陆 ===
  { name: '君临城', x: 140, y: 170, isCapital: true, desc: '王领中枢，黑水河流域', continent: '维斯特洛' },
  { name: '罗斯比城', x: 140, y: 150, isCapital: false, desc: '君临正北，国王大道咽喉', continent: '维斯特洛' },
  { name: '暮谷城', x: 165, y: 155, isCapital: false, desc: '君临东北，黑水湾沿岸', continent: '维斯特洛' },
  { name: '临冬城', x: 120, y: 70, isCapital: true, desc: '北境首府，严寒之地', continent: '维斯特洛' },
  { name: '白港', x: 145, y: 90, isCapital: false, desc: '北境唯一通海门户', continent: '维斯特洛' },
  { name: '派克城', x: 55, y: 140, isCapital: true, desc: '铁群岛首府，贫瘠多岩', continent: '维斯特洛' },
  { name: '奔流城', x: 110, y: 130, isCapital: true, desc: '河间地首府，三叉戟河流域', continent: '维斯特洛' },
  { name: '鹰巢城', x: 190, y: 140, isCapital: true, desc: '谷地首府，明月山脉之巅', continent: '维斯特洛' },
  { name: '凯岩城', x: 80, y: 180, isCapital: true, desc: '西境首府，金矿丰富', continent: '维斯特洛' },
  { name: '兰尼斯港', x: 75, y: 195, isCapital: false, desc: '西海岸最大港口', continent: '维斯特洛' },
  { name: '风息堡', x: 175, y: 210, isCapital: true, desc: '风暴地首府', continent: '维斯特洛' },
  { name: '高庭', x: 100, y: 250, isCapital: true, desc: '河湾地首府，沃野千里', continent: '维斯特洛' },
  { name: '旧镇', x: 80, y: 275, isCapital: false, desc: '学术中心与贸易大港', continent: '维斯特洛' },
  { name: '阳戟城', x: 160, y: 290, isCapital: true, desc: '多恩首府，沙漠绿洲', continent: '维斯特洛' },
  { name: '星坠城', x: 140, y: 305, isCapital: false, desc: '临海悬崖坚固城堡', continent: '维斯特洛' },
  // === 非利加大陆 ===
  { name: '生命之林', x: 130, y: 280, isCapital: true, desc: '木精灵聚居地，生命议会所在', continent: '非利加' },
  { name: '圣光平原', x: 175, y: 310, isCapital: true, desc: '高等精灵圣都', continent: '非利加' },
  { name: '暮森高原', x: 100, y: 340, isCapital: true, desc: '暗夜精灵夜都', continent: '非利加' },
  { name: '马卡罗山脉', x: 140, y: 360, isCapital: false, desc: '矮人首席官联盟，超级魔法矿藏', continent: '非利加' },
  // === 亚特兰蒂斯大陆 ===
  { name: '祖灵祭坛', x: 440, y: 320, isCapital: true, desc: '蛮荒部落核心，泰坦血祭圣地', continent: '亚特兰蒂斯' },
  {
    name: '血洋航道遗迹',
    x: 480,
    y: 300,
    isCapital: false,
    desc: '三万年前泰坦远征留下的血色海路',
    continent: '亚特兰蒂斯',
  },
  { name: '泰坦巢穴', x: 460, y: 355, isCapital: false, desc: '古代泰坦栖息地遗迹', continent: '亚特兰蒂斯' },
];

const currentLocations = computed(() => {
  return locations.filter(l => l.continent === activeContinent.value);
});

const selectedCityData = computed(() => {
  if (!selectedCity.value) return null;
  return locations.find(l => l.name === selectedCity.value) || null;
});

function getCityColor(loc: Location) {
  if (loc.name === store.data.世界.当前地点) return 'var(--c-accent)';
  if (loc.isCapital) return 'var(--c-primary)';
  return 'var(--c-text-muted)';
}

function selectCity(loc: Location) {
  selectedCity.value = loc.name;
}

async function moveTo() {
  if (!selectedCityData.value || isMoving.value) return;
  const loc = selectedCityData.value;
  const fromCity = store.data.世界.当前地点;
  const toCity = loc.name;

  isMoving.value = true;

  try {
    // 发送用户消息并触发 AI 回复，AI 会在正文中描写旅途并通过变量更新来更新位置和时间
    const travelPrompt = `我从${fromCity}出发，前往${toCity}。（请描写这段旅途的过程，包括花费的时间、沿途的风景、使用的交通方式，以及抵达时的情景。记得更新变量中的当前时间和当前地点。）`;
    await triggerSlash(`/send ${travelPrompt} | /trigger`);

    toastr.success(`正在前往 ${toCity}...`);
  } catch (e) {
    console.error('移动失败:', e);
    toastr.error('移动失败，请重试');
  } finally {
    isMoving.value = false;
    selectedCity.value = null;
  }
}
</script>

<style lang="scss" scoped>
.map-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.continent-tabs {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.continent-btn {
  flex: 1;
  min-width: 0;
  padding: 6px 4px;
  background: var(--c-bg-panel);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  color: var(--c-text-muted);
  font-size: 11px;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(180, 140, 255, 0.08);
    color: var(--c-text);
  }

  &.active {
    background: rgba(180, 140, 255, 0.15);
    border-color: var(--c-primary);
    color: var(--c-primary);
    font-weight: 600;
  }
}

.map-container {
  border: 1px solid var(--c-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--c-bg-deep);
}

.map-svg {
  width: 100%;
  display: block;
}

.continent-shape {
  cursor: pointer;
  transition:
    fill 0.3s ease,
    stroke 0.3s ease;
}

.continent-label {
  pointer-events: none;
  font-family: var(--font-main);
  letter-spacing: 2px;
}

.city-dot {
  cursor: pointer;
  transition:
    r 0.2s ease,
    fill 0.2s ease;

  &:hover {
    filter: brightness(1.3);
  }
}

.city-label {
  pointer-events: none;
  font-family: var(--font-main);
}

.pulse-ring {
  animation: pulse 2s infinite ease-out;
}

@keyframes pulse {
  0% {
    r: 6;
    opacity: 0.8;
  }
  100% {
    r: 16;
    opacity: 0;
  }
}

.move-panel {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--c-bg-panel);
  border: 1px solid var(--c-border);
  border-radius: 8px;
}

.move-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.move-target {
  font-size: 12px;
  font-weight: 600;
  color: var(--c-primary);
}

.move-desc {
  font-size: 11px;
  color: var(--c-text-muted);
}

.move-btn {
  flex-shrink: 0;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--c-primary), #9060e8);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(180, 140, 255, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(180, 140, 255, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.current-hint {
  text-align: center;
  font-size: 12px;
  color: var(--c-success);
  padding: 8px;
  background: rgba(102, 255, 178, 0.06);
  border: 1px solid rgba(102, 255, 178, 0.15);
  border-radius: 6px;
}
</style>
