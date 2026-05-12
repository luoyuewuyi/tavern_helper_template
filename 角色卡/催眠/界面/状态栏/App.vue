<template>
  <div class="panel-shell">
    <div class="ambient-grid"></div>
    <div class="panel-frame">
      <StatusHeader :route="status.route" :controller="status.controller" :stage="status.stage" :ending="status.ending" />

      <section class="hero-grid">
        <ProgressCluster
          title="催眠进程"
          :value="status.progress"
          accent="progress"
          :summary="progressSummary"
        />
        <ProgressCluster
          title="理智校准"
          :value="status.sanity"
          accent="sanity"
          :summary="sanitySummary"
        />
        <ProgressCluster
          title="警觉阈值"
          :value="status.alert"
          accent="alert"
          :summary="alertSummary"
        />
        <ProgressCluster
          title="线索暴露"
          :value="status.clues"
          accent="clue"
          :summary="clueSummary"
        />
      </section>

      <section class="body-section">
        <div class="section-head">
          <div>
            <div class="section-title">部位状态</div>
            <div class="section-subtitle">用直白、客观的部位反馈显示当前进展与防御姿态</div>
          </div>
          <div class="stage-chip">{{ status.stage }}</div>
        </div>

        <div class="body-grid">
          <BodyStateCard v-for="entry in status.bodyStates" :key="entry.label" :label="entry.label" :value="entry.value" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import BodyStateCard from './components/BodyStateCard.vue';
import ProgressCluster from './components/ProgressCluster.vue';
import StatusHeader from './components/StatusHeader.vue';

const props = defineProps<{
  status: {
    route: string;
    controller: string;
    sanity: number;
    alert: number;
    progress: number;
    stage: string;
    clues: number;
    ending: string;
    bodyStates: Array<{
      label: string;
      value: string;
    }>;
  };
}>();

function summarizeProgress(value: number): string {
  if (value >= 80) return '接近终局，任何失误都会把局势推向结算。';
  if (value >= 55) return '已进入深水区，节奏稳定比强压更重要。';
  if (value >= 30) return '刚跨过试探期，仍需反复确认反馈。';
  return '仍处于铺垫阶段，任何冒进都可能回退。';
}

function summarizeSanity(value: number): string {
  if (value >= 80) return '刘亚楠仍能高强度自检，逻辑漏洞极难蒙混。';
  if (value >= 55) return '理智略有波动，但仍保持较强的现实校准能力。';
  if (value >= 30) return '判断开始摇摆，更容易被环境与暗示牵引。';
  return '理智承压明显，需警惕终局倾向快速偏移。';
}

function summarizeAlert(value: number): string {
  if (value >= 80) return '高度戒备，轻微异常都会触发反制。';
  if (value >= 55) return '防备持续在线，不适合激进测试。';
  if (value >= 30) return '存在怀疑，但仍有可操作缝隙。';
  return '警觉较低，适合做低烈度验证。';
}

function summarizeClues(value: number): string {
  if (value >= 80) return '证据链接近闭合，随时可能摊牌。';
  if (value >= 55) return '局部破绽已可追踪，需要及时修补或利用。';
  if (value >= 30) return '已有零散异常积累，但尚未形成结论。';
  return '线索尚浅，更多是直觉与碎片化怀疑。';
}

const progressSummary = computed(() => summarizeProgress(props.status.progress));
const sanitySummary = computed(() => summarizeSanity(props.status.sanity));
const alertSummary = computed(() => summarizeAlert(props.status.alert));
const clueSummary = computed(() => summarizeClues(props.status.clues));
</script>

<style scoped>
.panel-shell {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid var(--hyp-line);
  background:
    radial-gradient(circle at top left, rgba(231, 198, 145, 0.22), transparent 28%),
    radial-gradient(circle at bottom right, rgba(116, 29, 43, 0.32), transparent 30%),
    linear-gradient(160deg, rgba(13, 16, 22, 0.98), rgba(31, 16, 23, 0.97));
  box-shadow: var(--hyp-shadow);
}

.ambient-grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.04), transparent 35%),
    repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 21px,
      rgba(231, 198, 145, 0.03) 21px,
      rgba(231, 198, 145, 0.03) 22px
    );
  pointer-events: none;
}

.panel-frame {
  position: relative;
  z-index: 1;
  padding: 22px;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.body-section {
  margin-top: 18px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(231, 198, 145, 0.16);
  background: rgba(255, 255, 255, 0.03);
}

.section-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  letter-spacing: 0.18em;
  color: var(--hyp-gold);
}

.section-subtitle {
  margin-top: 6px;
  color: var(--hyp-faint);
  font-size: 12px;
}

.stage-chip {
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(231, 198, 145, 0.18);
  background: rgba(231, 198, 145, 0.08);
  color: var(--hyp-gold);
  white-space: nowrap;
}

.body-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 980px) {
  .hero-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .body-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .panel-frame {
    padding: 16px;
  }

  .hero-grid,
  .body-grid {
    grid-template-columns: 1fr;
  }

  .section-head {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
