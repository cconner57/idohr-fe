<script setup lang="ts">
const faqGroups = [
  {
    title: 'Shared Questions',
    items: [
      {
        question: 'Can I adopt if I rent my home?',
        answer:
          'Yes. Renters can adopt with landlord or HOA approval that confirms pets are allowed.',
      },
      {
        question: 'Do you offer post-adoption support?',
        answer:
          'Yes. Our team provides guidance after adoption, including transition tips and behavioral support resources.',
      },
      {
        question: 'Can I return the pet if the match is not successful?',
        answer:
          'Yes. Contact IDOHR directly so we can coordinate a safe return plan and next placement steps.',
      },
    ],
  },
  {
    title: 'Cat-Specific Questions',
    items: [
      {
        question: 'Do adult cats need another cat at home?',
        answer:
          'It depends on the cat. Some do best with a companion, while others thrive as solo pets. We list this in each cat profile.',
      },
      {
        question: 'Can kittens be adopted in pairs?',
        answer:
          'Often yes. Paired kitten adoptions are encouraged when possible because they benefit from social development together.',
      },
      {
        question: 'What litter setup should I have before pickup?',
        answer:
          'Have at least one litter box per cat plus one extra, unscented litter, food and water stations, and a quiet decompression space.',
      },
    ],
  },
  {
    title: 'Dog-Specific Questions',
    items: [
      {
        question: 'Is a fenced yard required to adopt a dog?',
        answer:
          'Not always. Apartment and condo adopters can qualify with a realistic daily exercise and potty plan.',
      },
      {
        question: 'How soon should I begin training with a new dog?',
        answer:
          'Start immediately with calm routines and positive reinforcement. Consistency in the first few weeks is key.',
      },
      {
        question: 'Can I schedule a meet-and-greet with my current dog?',
        answer:
          "Yes. If a profile allows meet-and-greets, we can coordinate a safe introduction based on the dog's temperament and status.",
      },
    ],
  },
]
</script>

<template>
  <section class="about-faq" aria-labelledby="about-faq-title">
    <h2 id="about-faq-title">Adoption FAQs</h2>
    <div class="groups">
      <section
        v-for="group in faqGroups"
        :key="group.title"
        class="group"
        :aria-label="group.title"
      >
        <h3>{{ group.title }}</h3>
        <div class="faq-list">
          <details
            v-for="faqItem in group.items"
            :key="`${group.title}-${faqItem.question}`"
            class="faq-details"
          >
            <summary class="faq-question">
              <svg
                class="arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ faqItem.question }}
            </summary>
            <p class="faq-answer">{{ faqItem.answer }}</p>
          </details>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped lang="css">
.about-faq {
  padding: 80px var(--layout-padding-side);
  background-color: var(--color-primary);
  color: var(--text-inverse);

  h2 {
    text-align: center;
    font-size: 2.25rem;
    margin-bottom: 2rem;
    color: var(--text-inverse);
  }

  .groups {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    max-width: 1600px;
    margin: 0 auto;
  }

  .group {
    background: rgb(255 255 255 / 12%);
    border: 1px solid rgb(255 255 255 / 20%);
    border-radius: var(--radius-lg);
    padding: 1rem;

    h3 {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
      color: var(--text-inverse);
    }
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .faq-details {
    border-top: 1px solid rgb(255 255 255 / 18%);
    padding-top: 0.75rem;

    &[open] .arrow {
      transform: rotate(90deg);
    }
  }

  .faq-question {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    cursor: pointer;

    &::-webkit-details-marker {
      display: none;
    }
  }

  .faq-answer {
    margin: 0.6rem 0 0 1.7rem;
    line-height: 1.45;
    color: hsl(from var(--text-inverse) h s 94%);
  }

  .arrow {
    transition: transform 0.2s;
    flex-shrink: 0;
  }

  @media (width <= 1024px) {
    .groups {
      grid-template-columns: 1fr;
    }
  }
}
</style>
