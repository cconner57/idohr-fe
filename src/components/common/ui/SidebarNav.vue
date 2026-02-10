<script setup lang="ts">
import Icon from './Icon.vue'

export interface NavItem {
  id?: string | number
  label: string
  icon?: string
  viewBox?: string
  to?: string
  exact?: boolean
}

const props = withDefaults(
  defineProps<{
    items: NavItem[]
    modelValue?: string | number
    variant?: 'default' | 'dashboard' | 'editor'
  }>(),
  {
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:modelValue': [id: string | number]
  click: [item: NavItem]
}>()

function handleClick(item: NavItem) {
  if (item.id !== undefined) {
    emit('update:modelValue', item.id)
  }

  // Delay closing the menu slightly to ensure visual feedback
  setTimeout(() => {
    emit('click', item)
  }, 150)
}
</script>

<template>
  <nav class="sidebar-nav" :class="[`variant-${props.variant}`]">
    <template v-for="item in items" :key="item.label">

      <router-link
        v-if="item.to"
        :to="item.to"
        class="nav-item"
        :active-class="item.exact ? undefined : 'active'"
        :exact-active-class="'active'"
        @click="handleClick(item)"
      >
        <span class="icon" v-if="item.icon">
          <Icon :name="item.icon" :size="20" :viewBox="item.viewBox" />
        </span>
        <span class="label">{{ item.label }}</span>
      </router-link>

      <button
        v-else
        class="nav-item"
        type="button"
        :class="{ active: modelValue === item.id }"
        @click="handleClick(item)"
      >
        <span class="icon" v-if="item.icon">
          <Icon :name="item.icon" :size="20" :viewBox="item.viewBox" />
        </span>
        <span class="label">{{ item.label }}</span>
      </button>
    </template>
  </nav>
</template>

<style scoped>
.sidebar-nav {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.sidebar-nav.variant-dashboard {
  flex: 1;
  gap: 8px;
}

.sidebar-nav.variant-editor {
  flex: none;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  border-radius: 0;
  border-left: 3px solid transparent;
  cursor: pointer;
  text-decoration: none;
  background: none;
  border-top: none;
  border-right: none;
  border-bottom: none;
  width: 100%;
  text-align: left;
  color: var(--color-neutral-text-soft);
  font-weight: 500;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.sidebar-nav.variant-editor .nav-item {
  padding: 12px 16px;
}

.nav-item:hover {
  background-color: var(--color-neutral-weak);
  color: var(--text-primary);
}

.nav-item.active {
  background-color: var(--color-neutral-weak);
  color: var(--text-primary);
  border-left-color: var(--color-primary);
  font-weight: 700;
}

.nav-item.active .icon {
  color: var(--color-primary); /* Use primary brand color for icon */
  opacity: 1;
}

.nav-item .icon {
  font-size: 1.25rem;
  width: 24px;
  display: flex;
  justify-content: center;
}

@media (width <= 600px) {
  .sidebar-nav.variant-editor {
    flex-direction: row;
    overflow-x: auto;
    width: 100%;

    /* border-bottom handled by parent container */
    background: #fff;

    /* Hide scrollbar for cleaner look */
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .sidebar-nav.variant-editor::-webkit-scrollbar {
    display: none;
  }

  .sidebar-nav.variant-editor .nav-item {
    flex: 0 0 auto;
    width: auto;
    border-left: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    padding: 12px 16px;
    justify-content: center;
  }

  .sidebar-nav.variant-editor .nav-item.active {
    background: transparent;
    border-left: none;
    border-bottom-color: var(--color-primary);
    color: var(--color-primary);
  }

  .sidebar-nav.variant-editor .nav-item:hover {
    background: transparent;
  }
}
</style>
