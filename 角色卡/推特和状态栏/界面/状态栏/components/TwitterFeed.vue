<template>
  <div class="twitter-feed">
    <div v-if="Object.keys(store.data.推特).length === 0" class="empty-state">
      <i class="fa fa-comment-slash"></i>
      <span>暂无推文</span>
    </div>

    <div v-for="(tweet, userId) in store.data.推特" :key="userId" class="tweet-card">
      <!-- 推文头部 -->
      <div class="tweet-header">
        <div class="tweet-avatar" :style="{ background: avatarGradient(tweet.用户名) }">
          {{ tweet.用户名.charAt(0) }}
        </div>
        <div class="tweet-user-info">
          <span class="tweet-username">{{ tweet.用户名 }}</span>
          <span class="tweet-handle">@{{ userId }}</span>
        </div>
        <span class="tweet-time">{{ tweet.时间 }}</span>
      </div>

      <!-- 推文内容 -->
      <div class="tweet-content">{{ tweet.内容 }}</div>

      <!-- 互动数据 -->
      <div class="tweet-actions">
        <span class="action-item comment">
          <i class="fa fa-comment"></i>
          <span>{{ tweet.评论 }}</span>
        </span>
        <span class="action-item retweet">
          <i class="fa fa-retweet"></i>
          <span>{{ tweet.转发 }}</span>
        </span>
        <span class="action-item like">
          <i class="fa fa-heart"></i>
          <span>{{ tweet.点赞 }}</span>
        </span>
      </div>

      <!-- 热门评论 -->
      <div v-if="tweet.热门评论 && tweet.热门评论.length > 0" class="hot-comments">
        <div class="hot-comment-toggle" @click="toggleComments(userId)">
          <i class="fa fa-fire"></i>
          <span>热门评论 ({{ tweet.热门评论.length }})</span>
          <i class="fa" :class="expandedComments.has(userId) ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </div>
        <Transition name="slide">
          <div v-if="expandedComments.has(userId)" class="comments-list">
            <div v-for="(comment, ci) in tweet.热门评论" :key="ci" class="comment-item">
              <i class="fa fa-angle-right"></i>
              <span>{{ comment }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const store = useDataStore();

const expandedComments = ref(new Set<string>());

function toggleComments(index: string) {
  const newSet = new Set(expandedComments.value);
  if (newSet.has(index)) {
    newSet.delete(index);
  } else {
    newSet.add(index);
  }
  expandedComments.value = newSet;
}

// 根据用户名生成渐变色
function avatarGradient(name: string): string {
  const colors = [
    ['#00e5ff', '#b388ff'],
    ['#ff6090', '#ffd740'],
    ['#69f0ae', '#448aff'],
    ['#b388ff', '#ff6090'],
    ['#ffd740', '#69f0ae'],
    ['#448aff', '#00e5ff'],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const pair = colors[Math.abs(hash) % colors.length];
  return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
}
</script>

<style lang="scss" scoped>
.twitter-feed {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  color: var(--c-text-muted);
  font-family: var(--font-mono);
  font-size: 0.8rem;

  i {
    font-size: 1.5rem;
    opacity: 0.4;
  }
}

.tweet-card {
  background: var(--c-bg-surface);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--c-border-glow);
  }
}

.tweet-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px 0;
}

.tweet-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

.tweet-user-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.tweet-username {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tweet-handle {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--c-text-muted);
}

.tweet-time {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--c-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.tweet-content {
  padding: 10px 14px;
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: var(--c-text-primary);
  line-height: 1.6;
  word-break: break-word;
}

.tweet-actions {
  display: flex;
  padding: 6px 14px 10px;
  gap: 24px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--c-text-muted);
  cursor: default;
  transition: color 0.2s ease;

  i {
    font-size: 0.7rem;
  }

  &.comment:hover {
    color: var(--c-blue);
  }

  &.retweet:hover {
    color: var(--c-green);
  }

  &.like:hover {
    color: var(--c-pink);
  }
}

.hot-comments {
  border-top: 1px solid var(--c-border);
}

.hot-comment-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--c-amber);
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: var(--c-bg-hover);
  }

  .fa-fire {
    font-size: 0.7rem;
  }

  .fa-chevron-up,
  .fa-chevron-down {
    margin-left: auto;
    font-size: 0.55rem;
    color: var(--c-text-muted);
  }
}

.comments-list {
  padding: 0 14px 10px;
}

.comment-item {
  display: flex;
  gap: 8px;
  padding: 6px 0;
  font-family: var(--font-sans);
  font-size: 0.72rem;
  color: var(--c-text-secondary);
  line-height: 1.4;
  border-bottom: 1px dashed var(--c-border);

  &:last-child {
    border-bottom: none;
  }

  i {
    color: var(--c-text-muted);
    font-size: 0.6rem;
    margin-top: 3px;
    flex-shrink: 0;
  }
}

/* 展开/收起动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>
