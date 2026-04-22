<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

import { useNewsStore } from '@/stores/news'
import { formatDate } from '@/utils/date'

const newsStore = useNewsStore()
const { sortedItems, isLoading, error } = storeToRefs(newsStore)

onMounted(() => {
  newsStore.fetchNews()
})
</script>

<template>
  <main class="news-page">
    <section class="hero">
      <div class="content-wrapper">
        <h1>IDOHR News</h1>
        <p>Updates from rescue operations, events, and community milestones.</p>
      </div>
    </section>

    <section class="news-list">
      <div class="content-wrapper">
        <p v-if="isLoading" class="status">Loading updates...</p>
        <p v-else-if="error" class="status error">{{ error }}</p>

        <article v-for="item in sortedItems" :key="item.id" class="news-card">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" loading="lazy" />
          <div class="news-card__content">
            <p class="meta">{{ item.category }} • {{ formatDate(item.publishedAt) }}</p>
            <h2>{{ item.title }}</h2>
            <p class="excerpt">{{ item.excerpt }}</p>
            <p>{{ item.body }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped lang="css">
.news-page {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--color-primary) 0%, hsl(184deg 80% 40%) 100%);

  .content-wrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--layout-padding-side);
    box-sizing: border-box;
  }

  .hero {
    padding: 150px 0 40px;
    color: var(--text-inverse);

    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 1.1rem;
      max-width: 680px;
    }
  }

  .news-list {
    padding: 20px 0 60px;
  }

  .status {
    color: var(--text-inverse);
    font-size: 1rem;
    margin-bottom: 1rem;

    &.error {
      color: hsl(0deg 90% 95%);
    }
  }

  .news-card {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1rem;
    background: var(--text-inverse);
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 1rem;
    box-shadow: 0 10px 30px rgb(0 0 0 / 18%);

    img {
      width: 100%;
      height: 100%;
      min-height: 220px;
      object-fit: cover;
    }

    .news-card__content {
      padding: 1rem 1.25rem 1.25rem;
      color: var(--text-primary);

      .meta {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--color-secondary);
        font-weight: 700;
      }

      h2 {
        margin: 0.35rem 0 0.5rem;
        font-size: 1.45rem;
      }

      .excerpt {
        font-weight: 700;
      }

      p {
        line-height: 1.45;
      }
    }
  }

  @media (width <= 768px) {
    .hero {
      padding: 130px 0 24px;

      h1 {
        font-size: 2.1rem;
      }
    }

    .news-card {
      grid-template-columns: 1fr;

      img {
        min-height: 180px;
      }
    }
  }
}
</style>
