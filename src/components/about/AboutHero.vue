<template>
  <section class="hero" v-scroll-reveal>
    <div class="content-wrapper">
      <h1>About IDOHR</h1>
      <p class="lead">
        I Dream of Home Rescue (IDOHR) is a volunteer-powered nonprofit helping homeless cats and
        dogs heal, thrive, and find loving homes across Southern California.
      </p>
    </div>
  </section>
</template>

<style scoped lang="css">
.hero {
  padding: 150px var(--layout-padding-side) 50px;
  color: var(--text-inverse);
  background-color: var(--color-primary);
  display: flex;
  justify-content: center;

  .content-wrapper {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
  }

  h1 {
    font-size: 2.5rem;
    color: var(--text-inverse);
  }

  p {
    font-size: 1.25rem;
    max-width: 600px;
    margin-top: 12px;
    font-weight: 400;
    color: var(--text-inverse);
  }

  @media (width >= 321px) and (width <= 430px) {
    padding: 100px var(--layout-padding-side) 50px;
    h1 { font-size: 2rem; }
    p { font-size: 1.15rem; }
  }
}
</style>
