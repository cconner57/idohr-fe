<template>
  <section class="mission">
    <div class="content-wrapper">
      <div v-scroll-reveal class="mission-text">
        <h2 class="text-on-teal">Our Mission</h2>
        <p class="text-on-teal">
          We rescue, rehabilitate, and rehome animals in need—one tail, one paw, one heart at a
          time. Every animal receives medical care, a safe foster home, love-based socialization,
          and a path to a forever family.
        </p>
        <ul class="ticks text-on-teal">
          <li>Vaccinations, microchipping, and spay/neuter</li>
          <li>Medical treatment and behavioral support</li>
          <li>Adopter education and lifetime support</li>
        </ul>
      </div>
      <div class="image-wrapper reveal-delay-200" v-scroll-reveal>
        <img
          src="/images/mission.png"
          alt="Happy adopted dog and cat"
          class="mission-image"
          width="600"
          height="900"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.mission {
  background-color: var(--color-primary);
  color: var(--text-inverse);
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

  .mission-text {
    flex: 1;
  }

  .image-wrapper {
    display: flex;
    justify-content: flex-end;
    flex: 1;
    max-width: 450px;
  }

  h2 {
    font-size: 2.5rem;
    color: var(--text-inverse);
  }

  p {
    font-size: 1.15rem;
    max-width: 600px;
    margin-top: 12px;
    font-weight: 400;
    color: var(--text-inverse);
  }

  img {
    width: 225px;
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 6px rgb(0 0 0 / 25%);
  }

  .ticks {
    list-style: none;
    padding: 0;
    margin: 12px 0 0;
    font-weight: 400;
    color: var(--text-inverse);

    li {
      position: relative;
      padding-left: 24px;
      margin: 6px 0;

      &::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--color-primary-border);
        font-weight: 700;
      }
    }
  }

  @media (width <= 1024px) {
    .content-wrapper {
      flex-direction: column;
      gap: 40px;
      text-align: center;
    }

    .mission-text {
      max-width: 100%;

      p,
      .ticks {
        margin-left: auto;
        margin-right: auto;
        text-align: left;
      }

      .ticks {
        display: inline-block;
      }
    }

    .image-wrapper {
      justify-content: center;
      margin: 0 auto;
    }
  }
}
</style>
