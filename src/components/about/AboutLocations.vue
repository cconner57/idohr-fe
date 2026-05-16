<template>
  <section class="locations">
    <div class="content-wrapper" v-scroll-reveal>
      <h2>Where To Find Us</h2>
      <p>We host many volunteer and adoption activities through our PetSmart partner location.</p>
      <address>
        PetSmart Pasadena<br />
        3347 E Foothill Blvd, Pasadena, CA 91107
      </address>
      <div class="location-hours">
        <p class="hours-heading">Visiting Hours & Adoption Events</p>
        <div class="schedule-list">
          <article class="schedule-item">
            <p class="schedule-title">Cat Center Volunteer Hours</p>
            <p class="schedule-days">Monday through Friday</p>
            <p class="schedule-time">10:00 AM to 12:00 PM and 6:00 PM to 8:00 PM</p>
          </article>
          <article class="schedule-item">
            <p class="schedule-title">Adoption Events</p>
            <p class="schedule-days">Saturday and Sunday</p>
            <p class="schedule-time">12:00 PM to 4:00 PM</p>
          </article>
        </div>
        <p class="visit-note">
          Volunteers are on-site during Cat Center hours to feed, clean, and socialize with the
          cats. Potential adopters and potential volunteers are welcome to stop by if they are
          interested in adopting or volunteering.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="css">
.locations {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  display: flex;
  justify-content: center;
  padding: 80px var(--layout-padding-side);

  .content-wrapper {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    text-align: center;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
  }

  h2 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-inverse);
  }

  p {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text-inverse);
  }

  address {
    font-style: normal;
    font-weight: 800;
    line-height: 1.5;
    color: var(--text-inverse);
  }

  .location-hours {
    margin-top: 0.75rem;
    max-width: 720px;

    .hours-heading {
      font-size: 1.2rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
    }

    .schedule-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.75rem;
    }

    .schedule-item {
      background-color: rgb(255 255 255 / 20%);
      border: 1px solid rgb(255 255 255 / 34%);
      border-radius: 0.75rem;
      padding: 0.9rem;
      text-align: left;
      box-shadow: 0 8px 20px rgb(0 0 0 / 18%);
    }

    .schedule-title {
      font-size: 1rem;
      font-weight: 800;
    }

    .schedule-days,
    .schedule-time,
    .visit-note {
      font-size: 0.98rem;
      line-height: 1.45;
    }

    .schedule-days {
      margin-top: 0.25rem;
      font-weight: 700;
    }

    .schedule-time {
      margin-top: 0.25rem;
    }

    .visit-note {
      margin-top: 0.75rem;
    }

    @media (width <= 430px) {
      .schedule-list {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
