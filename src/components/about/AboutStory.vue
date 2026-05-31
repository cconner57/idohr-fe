<template>
  <section class="story">
    <div class="content-wrapper">
      <div v-scroll-reveal class="reveal-left image-container">
        <img
          src="/images/watercolor.jpeg"
          alt="IDOHR watercolor inspiration"
          width="600"
          height="466"
        />
      </div>
      <div class="story-text reveal-right" v-scroll-reveal>
        <h2>Our Story</h2>
        <p>
          IDOHR began in 2016 with a simple dream: to give every abandoned, neglected, and unwanted
          animal a safe place to call home. What started as a small circle of fosters has grown into
          a community of adopters, volunteers, and supporters who believe compassion changes
          lives—both animal and human.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.story {
  background-color: var(--text-inverse);
  display: flex;
  justify-content: center;
  padding: 80px var(--layout-padding-side);

  .content-wrapper {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4rem;
  }

  .image-container {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  img {
    width: 100%;
    max-width: 450px;
    height: auto;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 6px rgb(0 0 0 / 25%);
  }

  .story-text {
    flex: 1;
    max-width: 600px;

    p {
      font-size: 1.15rem;
      margin-top: 12px;
      line-height: 1.5;
    }

    h2 {
      font-size: 2.5rem;
    }
  }

  @media (width <= 1024px) {
    .content-wrapper {
      flex-direction: column;
      gap: 40px;
      text-align: center;
    }

    .story-text {
      max-width: 100%;
      align-items: center;

      p {
        margin-left: auto;
        margin-right: auto;
        text-align: left;
      }
    }
  }
}
</style>
