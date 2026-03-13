<script setup lang="ts">
import Skeleton from '@/common/ui/Skeleton.vue';
</script>

<template>
  <div class="viewer">
    <Skeleton width="52px" height="22px" radius="0 19px 0 6px" class="position" />
    <Skeleton width="20px" height="20px" radius="19px 0 6px 0" class="viewed" />

    <header class="header">
      <div class="title-row">
        <Skeleton height="22px" width="65%" />
      </div>

      <div class="info-row">
        <div class="left">
          <Skeleton height="14px" width="140px" />

          <Skeleton height="12px" width="90px" />
        </div>

        <div class="right">
          <Skeleton height="12px" width="90px" />

          <Skeleton height="12px" width="110px" />
        </div>
      </div>
    </header>

    <Skeleton width="110px" height="14px" />

    <div class="description">
      <Skeleton height="12px" color="glow" />
      <Skeleton height="12px" color="glow" />
      <Skeleton height="12px" color="glow" />
      <Skeleton height="12px" color="glow" />
      <Skeleton height="12px" color="glow" />
      <Skeleton height="12px" width="80%" color="glow" />
    </div>

    <div class="nav">
      <Skeleton height="36px" width="40px" radius="10px" />
      <Skeleton height="36px" width="40px" radius="10px" />
      <Skeleton height="36px" width="40px" radius="10px" />
    </div>
  </div>
</template>

<style scoped>
.viewer {
  position: relative;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;

  padding: clamp(16px, 3vw, 24px);

  display: flex;
  flex-direction: column;

  height: 80vh;

  gap: 16px;
}

/* HEADER */

.header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

/* BADGES */

.viewed {
  position: absolute;
  top: 0;
  left: 0;
}

.position {
  position: absolute;
  top: 0;
  right: 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.right {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
}

/* META */

.meta-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.meta-grid-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* SKILLS */

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* DESCRIPTION */

.description {
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 8px;

  background: var(--bg-soft);

  padding: 16px;

  border-radius: 10px;
}

/* NAV */

.nav {
  display: flex;
  justify-content: center;
  gap: 48px;
}

/* MOBILE */

@media (max-width: 640px) {
  .viewer {
    padding: 24px 8px 8px;
  }

  .info-row {
    flex-direction: column;
    gap: 6px;
  }

  .right {
    text-align: left;
  }
}
</style>
