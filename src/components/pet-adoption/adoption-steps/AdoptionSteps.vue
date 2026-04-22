<script setup lang="ts">
const props = defineProps<{
  currentStep: number
  steps: string[]
}>()
</script>

<template>
  <div class="steps-container" :style="{ '--steps-count': String(props.steps.length) }">
    <div class="line"></div>
    <div
      v-for="(stepLabel, idx) in props.steps"
      :key="stepLabel"
      class="step"
      :class="{ active: props.currentStep >= idx, completed: props.currentStep > idx }"
    >
      <div class="step-number">
        <svg
          v-if="props.currentStep > idx"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="16"
          height="16"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
        <span v-else>{{ idx + 1 }}</span>
      </div>
      <div class="step-label">{{ stepLabel }}</div>
    </div>
  </div>
</template>

<style scoped lang="css">
.steps-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 20px;
  align-items: center;
  position: relative;
  gap: 8px;

  & .line {
    position: absolute;
    top: 14px;
    left: calc(100% / (var(--steps-count) * 2));
    right: calc(100% / (var(--steps-count) * 2));
    height: 2px;
    background-color: var(--color-primary);
    z-index: 1;
    width: auto !important;
    max-width: none;
    min-width: 0;
  }

  @media (width <= 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding-left: 16px;

    & .line {
      display: none;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 31px; /* 16px padding-left + 15px (half of 30px width) */
      width: 2px;
      background-color: var(--color-primary);
      z-index: 1;
    }
  }

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    flex: 1;
    min-width: 0;

    @media (width <= 600px) {
      flex-direction: row;
      gap: 12px;
      width: 100%;
    }

    .step-number {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: var(--text-inverse);
      border: 1px solid var(--color-primary);
      color: var(--text-primary);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 8px;
      z-index: 5;

      @media (width <= 600px) {
        margin-bottom: 0;
      }
    }

    .step-label {
      font-size: 0.875rem;
      text-align: center;
      line-height: 1.3;

      @media (width <= 600px) {
        font-size: 1rem;
        font-weight: 500;
        text-align: left;
      }
    }

    &.active {
      .step-number {
        background-color: var(--color-primary);
        color: var(--text-inverse);
      }
    }
  }
}
</style>
